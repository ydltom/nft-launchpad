import { ReactNode, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { checkout, config, passport } from '@imtbl/sdk';
import Image from 'next/image';
import Link from 'next/link';

// Get environment variables
const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const environmentId = process.env.NEXT_PUBLIC_IMMUTABLE_ENVIRONMENT_ID || '';
const passportClientId = process.env.NEXT_PUBLIC_PASSPORT_CLIENT_ID || '';
const isTestnet = process.env.NEXT_PUBLIC_IMMUTABLE_ENVIRONMENT === 'sandbox';

// Log environment setup for debugging
console.log('Environment setup:', {
  baseURL,
  environmentId,
  passportClientId,
  isTestnet
});

export function ImmutableSale() {
  const [saleWidget, setSaleWidget] = useState<checkout.Widget<typeof checkout.WidgetType.SALE> | null>(null);
  const [products, setProducts] = useState<{
    product_id: string;
    name: string;
    quantity: number;
    description: string;
    image: string;
    pricing: { amount: number; currency: string }[];
    collection: { collection_address: string; collection_type: string };
  }[]>([]);
  const [saleOpen, setSaleOpen] = useState(false);
  const [alert, setAlert] = useState<{
    severity: 'success' | 'info' | 'warning' | 'error';
    message: ReactNode | string;
  } | null>(null);
  const { toast } = useToast();

  // Check for login param in URL
  const getLoginParam = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('login');
    }
    return null;
  };
  
  const login = getLoginParam();
  
  const environment = isTestnet
    ? config.Environment.SANDBOX
    : config.Environment.PRODUCTION;

  const baseConfig = useMemo(() => new config.ImmutableConfiguration({
    environment,
  }), []);

  const passportConfig = useMemo(() => ({
    baseConfig,
    clientId: passportClientId,
    redirectUri: `${baseURL}/?login=true&environmentId=${environmentId}`,
    logoutRedirectUri: `${baseURL}/?logout=true&environmentId=${environmentId}`,
    audience: 'platform_api',
    scope: 'openid offline_access email transact',
  }), [baseConfig]);

  const passportInstance = useMemo(
    () => new passport.Passport(passportConfig),
    [passportConfig],
  );

  const checkoutInstance = useMemo(() => {
    return new checkout.Checkout({
      baseConfig,
      passport: passportInstance,
    });
  }, [baseConfig, passportInstance]);

  // Fetch products from Immutable API
  useEffect(() => {
    (async () => {
      const apiUrl = `https://api${isTestnet ? '.sandbox' : ''}.immutable.com/v1/primary-sales/${environmentId}/products`;
      console.log('Fetching products from:', apiUrl);
      
      try {
        const productsRequest = await fetch(apiUrl);
        
        console.log('Products API response status:', productsRequest.status);
        
        if (!productsRequest.ok) {
          const errorText = await productsRequest.text();
          console.error('Products API error response:', errorText);
          throw new Error(`Failed to fetch products: ${productsRequest.statusText}`);
        }
        
        const productsData = await productsRequest.json();
        console.log('Products data:', productsData);
        
        if (Array.isArray(productsData) && productsData.length === 0) {
          console.warn('No products found in this environment');
          toast({
            title: "No NFTs found",
            description: "No NFTs are available in this environment",
            variant: "default",
          });
        }
        
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Failed to load products",
          description: "Please check your connection and try again",
          variant: "destructive",
        });
      }
    })();
  }, [toast]);

  // Initialize checkout widget
  useEffect(() => {
    (async () => {
      try {
        const widgets = await checkoutInstance.widgets({
          config: { theme: checkout.WidgetTheme.DARK },
        });

        setSaleWidget(widgets.create(checkout.WidgetType.SALE, {
          config: { theme: checkout.WidgetTheme.DARK, hideExcludedPaymentTypes: true },
        }));
      } catch (error) {
        console.error('Error initializing widgets:', error);
      }
    })();
  }, [checkoutInstance]);

  // Set up event listeners for the sale widget
  useEffect(() => {
    if (!saleWidget) {
      return;
    }

    saleWidget.addListener(
      checkout.SaleEventType.SUCCESS,
      (data: checkout.SaleSuccess) => {
        console.log('success', data);

        if (data.transactionId) {
          const hash = data.transactions.pop()?.hash;

          setAlert({
            severity: 'success',
            message: (
              <>
                Transaction successful. View it in the {' '}
                <Link href={`https://explorer${isTestnet ? '.testnet' : ''}.immutable.com/tx/${hash}`}>
                  block explorer
                </Link>
              </>
            ),
          });
        }
      },
    );
    
    saleWidget.addListener(
      checkout.SaleEventType.FAILURE,
      (data: checkout.SaleFailed) => {
        console.log('failure', data);

        setAlert({
          severity: 'error',
          message: (data.error?.data as any)?.error?.reason || 'An error occurred',
        });
      },
    );
    
    saleWidget.addListener(
      checkout.SaleEventType.TRANSACTION_SUCCESS,
      (data: checkout.SaleTransactionSuccess) => {
        console.log('tx success', data);
      },
    );

    saleWidget.addListener(checkout.SaleEventType.CLOSE_WIDGET, () => {
      setSaleOpen(false);
      saleWidget.unmount();
    });
  }, [saleWidget]);

  // Handle passport login callback
  useEffect(() => {
    if (passportInstance && login) {
      passportInstance.loginCallback();
    }
  }, [login, passportInstance]);

  // Handle sale click
  const handleSaleClick = (items: checkout.SaleItem[]) => {
    if (!saleWidget) {
      toast({
        title: "Sale widget not ready",
        description: "Please try again in a moment",
        variant: "destructive",
      });
      return;
    }

    const isFreeMint = items.every((item) => {
      const product = products.find((product) => product.product_id === item.productId);
      return product?.pricing.every((pricing) => pricing.amount === 0);
    });

    setSaleOpen(true);

    setTimeout(() => {
      saleWidget.mount('sale-widget', {
        environmentId,
        collectionName: "NFT Whitelist Raffle",
        items,
        excludePaymentTypes: isFreeMint ? [
          checkout.SalePaymentTypes.DEBIT,
          checkout.SalePaymentTypes.CREDIT,
        ] : [],
      });
    }, 500);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Available NFT Collections</h2>
      
      {alert && (
        <Alert variant={alert.severity === 'error' ? 'destructive' : 'default'}>
          <AlertTitle>{alert.severity === 'success' ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.product_id} className="overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">{product.name}</h3>
                    {product.pricing[0]?.amount === 0 && (
                      <Badge variant="secondary">Free mint!</Badge>
                    )}
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{product.description}</p>
                <div className="mb-4 flex items-center justify-between">
                  {product.pricing[0]?.amount > 0 ? (
                    <p className="font-medium">
                      {product.pricing[0].amount} {product.pricing[0].currency}
                    </p>
                  ) : (
                    <p className="font-medium text-green-600 dark:text-green-400">Free</p>
                  )}
                  <span className="text-xs text-gray-500">Supply: {product.quantity}</span>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    handleSaleClick([{
                      productId: product.product_id,
                      qty: 1,
                      name: product.name,
                      description: product.description,
                      image: product.image,
                    }]);
                  }}
                >
                  {product.pricing[0]?.amount > 0 ? 'Buy now' : 'Mint for free'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      )}

      {saleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div id="sale-widget" className="h-[80vh] w-[80vw] max-w-xl rounded-lg bg-white" />
          <Button 
            variant="outline" 
            className="absolute right-4 top-4"
            onClick={() => {
              setSaleOpen(false);
              if (saleWidget) {
                saleWidget.unmount();
              }
            }}
          >
            Close
          </Button>
        </div>
      )}
    </div>
  );
} 