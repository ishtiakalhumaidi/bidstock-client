export const mockInventory = [
  { id: 1, product: "Widget A", stock: 15, threshold: 20, status: "Low" },
  { id: 2, product: "Gadget B", stock: 50, threshold: 30, status: "Normal" },
  // Add more
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
