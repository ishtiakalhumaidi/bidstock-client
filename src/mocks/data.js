export const mockInventory = [
  {
    id: 1,
    product: "Steel Bolts M8",
    stock: 15,
    threshold: 50,
    warehouse: "Warehouse A",
  },
  {
    id: 2,
    product: 'PVC Pipes 2"',
    stock: 8,
    threshold: 20,
    warehouse: "Warehouse B",
  },
  {
    id: 3,
    product: "LED Bulbs 9W",
    stock: 120,
    threshold: 100,
    warehouse: "Warehouse A",
  },
  {
    id: 4,
    product: "Cement Bags 50kg",
    stock: 45,
    threshold: 30,
    warehouse: "Warehouse B",
  },
  {
    id: 5,
    product: "Safety Helmets",
    stock: 3,
    threshold: 25,
    warehouse: "Warehouse A",
  },
];

export const mockBids = [
  {
    id: 1,
    prId: 101,
    supplier: "Supplier X",
    price: 10.5,
    delivery: "3 days",
    score: 85,
  },
  // Add more
];

export const mockPurchaseRequests = [
  {
    id: 101,
    product: "Steel Bolts M8",
    quantity: 200,
    thresholdTriggered: true,
    status: "Bidding Open",
    createdAt: "2025-11-10T08:00:00Z",
    deadline: "2025-11-13T17:00:00Z", // 3 days
    bidsCount: 4,
    topBid: { price: 9.8, supplier: "FastForge Ltd", delivery: "2 days" },
    priority: "High",
  },
  {
    id: 102,
    product: 'PVC Pipes 2"',
    quantity: 150,
    thresholdTriggered: false,
    status: "Bidding Closed",
    createdAt: "2025-11-08T10:00:00Z",
    deadline: "2025-11-11T17:00:00Z",
    bidsCount: 3,
    topBid: { price: 12.5, supplier: "PipeMasters", delivery: "4 days" },
    priority: "Medium",
  },
  {
    id: 103,
    product: "Safety Helmets",
    quantity: 50,
    thresholdTriggered: true,
    status: "Awarded",
    createdAt: "2025-11-09T14:00:00Z",
    deadline: "2025-11-12T17:00:00Z",
    bidsCount: 2,
    awardedTo: "SecureGear Inc",
    priority: "Urgent",
  },
];
export const fetchMockPurchaseRequests = async () => {
  await delay(700);
  return mockPurchaseRequests;
};

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchMockInventory = async () => {
  await delay(500);
  return mockInventory;
};

export const fetchMockBids = async () => {
  await delay(500);
  return mockBids;
};

// !//////////////////////////////
// src/mocks/data.js (add to existing)

export const mockOpenPRsForBidding = [
  {
    id: 101,
    product: 'Steel Bolts M8',
    quantity: 200,
    business: 'TechBuild Inc',
    deadline: '2025-11-13T17:00:00Z',
    minPrice: 8.5,
    avgBid: 10.2,
    totalBids: 4,
    yourBid: { price: 9.8, delivery: '2 days', warranty: '1 year' }, // mock current bid
  },
  {
    id: 104,
    product: 'Industrial Paint 20L',
    quantity: 80,
    business: 'MegaConstruct Ltd',
    deadline: '2025-11-14T12:00:00Z',
    minPrice: 45.0,
    avgBid: 48.7,
    totalBids: 2,
    yourBid: null,
  },
];

export const fetchMockOpenPRs = async () => {
  await delay(800);
  return mockOpenPRsForBidding;
};

// Mock leaderboard per PR
export const mockBidLeaderboard = (prId) => ({
  101: [
    { rank: 1, supplier: 'FastForge Ltd', price: 9.5, delivery: '1 day', score: 94 },
    { rank: 2, supplier: 'You (SteelPro)', price: 9.8, delivery: '2 days', score: 88 },
    { rank: 3, supplier: 'IronHub', price: 10.1, delivery: '3 days', score: 82 },
  ],
  104: [
    { rank: 1, supplier: 'ChemCoat', price: 46.0, delivery: '3 days', score: 90 },
  ],
});
