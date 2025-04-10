// Shared NFT collection data for the application
export interface NFTCollection {
  id: string;
  name: string;
  description: string;
  image: string;
  artist: string;
  price: string;
  ticketPrice: string;
  supply: string;
  status: "active" | "ended" | "upcoming";
  ticketsSold: number;
  endTime: number;
  contractAddress: string;
  steps: {
    id: number;
    name: string;
    status: "active" | "completed" | "pending";
  }[];
}

export const collectionsData: { [key: string]: NFTCollection } = {
  "stardust-cards": {
    id: "stardust-cards",
    name: "Stardust Cards",
    description:
      "The legendary Stardust Cards are ancient artifacts infused with cosmic energy. Each card contains a unique champion, spell, or realm that can be summoned in the on-chain battle arena 'Celestial Confrontation'. As the first fully on-chain trading card game, card ownership, battle history, and tournament victories are all recorded immutably on the blockchain. Collectors can build powerful decks, develop unique strategies, and compete in the Grand Celestial Tournament for valuable rewards.",
    image: "/stardust-cards.png",
    artist: "Arcane Illustrator",
    price: "0.25 IMX",
    ticketPrice: "0.025",
    supply: "2,500",
    status: "active",
    ticketsSold: 475,
    endTime: new Date("2025-05-30T00:00:00Z").getTime(),
    contractAddress: "0xd4f8e3c75c94571c6ceeb37b5a50b9e06eb3b426",
    steps: [
      { id: 1, name: "Ticket Purchase", status: "active" },
      { id: 2, name: "Winner Announcement", status: "pending" },
      { id: 3, name: "Distribution", status: "pending" },
    ],
  },
  "ravenquest-land": {
    id: "ravenquest-land",
    name: "RavenQuest Land",
    description:
      "Own a piece of the enchanted realm in RavenQuest, the first fully on-chain fantasy MMORPG. Each land NFT grants you ownership of a strategic territory within the game world, from mystical castles and fortified strongholds to resource-rich forests and magical springs. Land owners earn passive income from player activities, can construct buildings, host quests, and participate in the game's governance. The most coveted lands lie at crucial crossroads of the realm, offering both strategic advantage and economic opportunity to their holders.",
    image: "/ravenquest-land.png",
    artist: "Fantasy Architect",
    price: "0.5 IMX",
    ticketPrice: "0.05",
    supply: "1,000",
    status: "active",
    ticketsSold: 0,
    endTime: new Date("2025-07-01T00:00:00Z").getTime(),
    contractAddress: "0x8e3f5b721207c2f7a3720dd3118b2731eccb3d92",
    steps: [
      { id: 1, name: "Ticket Purchase", status: "pending" },
      { id: 2, name: "Winner Announcement", status: "pending" },
      { id: 3, name: "Distribution", status: "pending" },
    ],
  },
  "guild-of-guardian-heroes": {
    id: "guild-of-guardian-heroes",
    name: "Guild of Guardian Heroes",
    description:
      "Summon powerful heroes from the Guild of Guardians universe to aid you in your quest. Each hero NFT is a fully playable character in the mobile RPG, complete with unique abilities, equipment slots, and progression paths. Heroes range from common recruits to legendary champions, each with distinct fighting styles and elemental affinities. As your heroes gain experience in-game, their NFT metadata evolves, creating a permanent record of your adventures. Trade, lend, or form alliances with other players to tackle the game's most challenging dungeons.",
    image: "/gog-hero.png",
    artist: "Guardian Illustrators",
    price: "0.3 IMX",
    ticketPrice: "0.03",
    supply: "1,800",
    status: "active",
    ticketsSold: 522,
    endTime: new Date("2025-06-15T00:00:00Z").getTime(),
    contractAddress: "0xe7c1a3b1c45a82c0e141b1be3ae1d7c12571650a",
    steps: [
      { id: 1, name: "Ticket Purchase", status: "active" },
      { id: 2, name: "Winner Announcement", status: "pending" },
      { id: 3, name: "Distribution", status: "pending" },
    ],
  },
  "gods-unchained-cards": {
    id: "gods-unchained-cards",
    name: "Gods Unchained Cards",
    description:
      "Harness the power of the gods in Gods Unchained, the competitive trading card game that gives players true ownership of their digital items. Each card is a tradable NFT with real-world value, featuring stunning artwork and strategic gameplay elements. Build your deck from six distinct god-domains, each with unique playstyles and abilities. Rare and legendary cards possess game-changing powers that can turn the tide of battle in an instant. As an esport-ready TCG built on the blockchain, your collection grows in both utility and value as you master the arena.",
    image: "/gu-cover-photo.jpg",
    artist: "Mythic Artists Collective",
    price: "0.18 IMX",
    ticketPrice: "0.018",
    supply: "3,000",
    status: "ended",
    ticketsSold: 2750,
    endTime: new Date("2025-02-28T00:00:00Z").getTime(),
    contractAddress: "0x9fd320330ecea1f87b29c5551f209b484565e66c",
    steps: [
      { id: 1, name: "Ticket Purchase", status: "completed" },
      { id: 2, name: "Winner Announcement", status: "completed" },
      { id: 3, name: "Distribution", status: "active" },
    ],
  },
  "hunters-on-chain": {
    id: "hunters-on-chain",
    name: "Hunters On-Chain",
    description:
      "Join the hunt in this voxel-based blockchain survival game where your character's appearance, equipment, and abilities are all NFTs. Each Hunter is procedurally generated with unique attributes, weapon affinities, and special abilities that determine their effectiveness against the various creatures that roam the world. Hunters can combine resources to craft new equipment, build shelters, and upgrade their skills, with all progression stored on-chain. Form hunting parties with other players, claim territory, and compete in seasonal tournaments for exclusive rewards that can't be acquired elsewhere.",
    image: "/hunters-on-chain.gif",
    artist: "Voxel Visionaries",
    price: "0.22 IMX",
    ticketPrice: "0.022",
    supply: "2,200",
    status: "upcoming",
    ticketsSold: 0,
    endTime: new Date("2025-08-15T00:00:00Z").getTime(),
    contractAddress: "0x1a2c3f4d5e6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c",
    steps: [
      { id: 1, name: "Ticket Purchase", status: "pending" },
      { id: 2, name: "Winner Announcement", status: "pending" },
      { id: 3, name: "Distribution", status: "pending" },
    ],
  },
  "cosmic-dreamers": {
    id: "cosmic-dreamers",
    name: "Cosmic Dreamers",
    description:
      "A journey through the digital cosmos, where dreams and reality merge. This exclusive collection features 10 unique NFTs, each representing a different celestial dream state.",
    image: "/placeholder.svg?height=400&width=400",
    artist: "Digital Nomad",
    price: "0.1 IMX",
    ticketPrice: "0.01",
    supply: "1,500",
    status: "active",
    ticketsSold: 342,
    endTime: new Date("2025-04-15T00:00:00Z").getTime(),
    contractAddress: "0xe8cfccb4aa726dbbbcd46bdc38eb4788519c8d70",
    steps: [
      { id: 1, name: "Ticket Purchase", status: "active" },
      { id: 2, name: "Winner Announcement", status: "pending" },
      { id: 3, name: "Distribution", status: "pending" },
    ],
  },
  "neon-horizon": {
    id: "neon-horizon",
    name: "Neon Horizon",
    description:
      "The edge where digital and physical worlds collide in a burst of neon light. This collection explores the boundaries between reality and the digital realm.",
    image: "/placeholder.svg?height=400&width=400",
    artist: "Pixel Prophet",
    price: "0.1 IMX",
    ticketPrice: "0.01",
    supply: "1,500",
    status: "upcoming",
    ticketsSold: 0,
    endTime: new Date("2025-05-01T00:00:00Z").getTime(),
    contractAddress: "0x0000000000000000000000000000000000000000",
    steps: [
      { id: 1, name: "Ticket Purchase", status: "pending" },
      { id: 2, name: "Winner Announcement", status: "pending" },
      { id: 3, name: "Distribution", status: "pending" },
    ],
  },
  "quantum-fragments": {
    id: "quantum-fragments",
    name: "Quantum Fragments",
    description:
      "Fragments of consciousness captured in the quantum realm. Each NFT represents a different quantum state, frozen in time.",
    image: "/placeholder.svg?height=400&width=400",
    artist: "Byte Artist",
    price: "0.1 IMX",
    ticketPrice: "0.01",
    supply: "1,500",
    status: "ended",
    ticketsSold: 1253,
    endTime: new Date("2025-03-15T00:00:00Z").getTime(),
    contractAddress: "0x9876543210987654321098765432109876543210",
    steps: [
      { id: 1, name: "Ticket Purchase", status: "completed" },
      { id: 2, name: "Winner Announcement", status: "completed" },
      { id: 3, name: "Distribution", status: "active" },
    ],
  },
  "ethereal-gardens": {
    id: "ethereal-gardens",
    name: "Ethereal Gardens",
    description:
      "Digital ecosystems blooming with algorithmic flora and fauna. Each NFT contains a unique generative garden that evolves based on blockchain activity.",
    image: "/placeholder.svg?height=400&width=400",
    artist: "Crypto Botanist",
    price: "0.15 IMX",
    ticketPrice: "0.015",
    supply: "1,000",
    status: "active",
    ticketsSold: 213,
    endTime: new Date("2025-06-01T00:00:00Z").getTime(),
    contractAddress: "0x1234567890123456789012345678901234567890",
    steps: [
      { id: 1, name: "Ticket Purchase", status: "active" },
      { id: 2, name: "Winner Announcement", status: "pending" },
      { id: 3, name: "Distribution", status: "pending" },
    ],
  },

};

// Convert the collection data object to an array for components that need it as an array
export const collectionsArray = Object.values(collectionsData); 