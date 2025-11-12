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


export const mockSupplierPerformance = {
  supplierId: 'SP001',
  name: 'SteelPro Supplies',
  rating: 4.7,
  totalBids: 48,
  wonBids: 21,
  deliveryAccuracy: 92,
  onTimeRate: 88,
  averagePriceCompetitiveness: 94,
  disputes: 1,
  recentAwards: [
    { prId: 101, product: 'Steel Bolts M8', date: '2025-11-11', price: 9.8, status: 'Delivered' },
    { prId: 98, product: 'PVC Pipes', date: '2025-11-05', price: 12.3, status: 'Shipped' },
  ],
  monthlyTrend: [
    { month: 'Aug', bids: 10, wins: 4 },
    { month: 'Sep', bids: 12, wins: 5 },
    { month: 'Oct', bids: 15, wins: 7 },
    { month: 'Nov', bids: 11, wins: 5 },
  ],
};

export const fetchMockSupplierPerformance = async () => {
  await delay(900);
  return mockSupplierPerformance;
};

// src/mocks/data.js (add to existing)

export const mockWarehouseSpaces = [
  {
    id: 'WH001',
    name: 'North Industrial Hub',
    location: 'Chicago, IL',
    capacity: 5000, // sq ft
    available: 3200,
    pricePerSqFt: 1.25,
    provider: 'TechBuild Inc',
    availability: { from: '2025-11-15', to: '2026-05-15' },
    status: 'Available',
    imageSeed: 'warehouse1',
  },
  {
    id: 'WH002',
    name: 'East Coast Storage',
    location: 'Newark, NJ',
    capacity: 8000,
    available: 0,
    pricePerSqFt: 1.10,
    provider: 'MegaConstruct Ltd',
    availability: { from: '2025-12-01', to: '2026-06-01' },
    status: 'Fully Booked',
    imageSeed: 'warehouse2',
  },
  {
    id: 'WH003',
    name: 'West Valley Depot',
    location: 'Phoenix, AZ',
    capacity: 4000,
    available: 1500,
    pricePerSqFt: 0.95,
    provider: 'SteelPro Supplies',
    availability: { from: '2025-11-20', to: '2026-04-20' },
    status: 'Partially Available',
    imageSeed: 'warehouse3',
  },
];

export const mockRentalRequests = [
  {
    id: 'R001',
    warehouseId: 'WH001',
    requester: 'FastForge Ltd',
    sqFt: 1000,
    from: '2025-12-01',
    to: '2026-03-01',
    status: 'Pending',
    totalCost: 3750,
  },
  {
    id: 'R002',
    warehouseId: 'WH003',
    requester: 'SteelPro Supplies',
    sqFt: 800,
    from: '2025-11-25',
    to: '2026-02-25',
    status: 'Approved',
    totalCost: 2280,
  },
];

export const fetchMockWarehouseSpaces = async () => {
  await delay(700);
  return mockWarehouseSpaces;
};

export const fetchMockRentalRequests = async () => {
  await delay(600);
  return mockRentalRequests;
};