# BidStock Frontend 📦🚀

BidStock is a modern **Supply Chain Marketplace** that bridges the gap between inventory storage and real-time auctions. It connects **Sellers**, **Buyers**, and **Warehouse Owners** in a unified ecosystem to optimize logistics, sales, and storage.

This repository contains the **Frontend** application built with React and Vite.

---

## 🌟 Core Features

### 1. 🔄 Integrated Warehouse Rent Cycle
The platform enforces a logical supply chain workflow for sellers to ensure physical logistics align with digital sales:
1.  **Rent Warehouse**: Sellers must first browse and rent available storage space from Warehouse Owners.
2.  **Add Inventory**: Once storage is secured, sellers can add their products to the system.
3.  **Start Auction**: Only stored inventory can be listed for auction, ensuring all items sold are physically accounted for.

### 2. 🔨 Auction Initiation
Sellers can launch new auctions by creating bid entries for their inventory. The system allows them to specify critical details like the product, start time, and end time to schedule the event.

### 3. 💰 Competitive Bidding System
Buyers can actively participate in auctions by placing offers. The system captures the specific buyer's ID and their offered price, linking it to the relevant auction to track competitive interest and determine the highest bidder.

### 4. 📝 Automated Transaction Recording
The system automatically generates a formal record for every financial interaction. This captures essential details such as the transaction type (payment, rent), amount, payment method, and the roles of both parties (e.g., from a buyer to a seller).

### 5. 📜 Personalized Transaction History
Users can access a filtered view of their financial history. The `getMyTransactions` feature ensures users only see records where they are directly involved, either as the payer or the receiver, maintaining data privacy and relevance.

### 6. ⏱️ Auction Lifecycle Management
Sellers maintain control over their listings even after creation. The system provides the functionality to update an auction's status or modify its schedule (start and end times), allowing sellers to adapt to changing circumstances or correct listing errors.

---

## 🛠️ Tech Stack

* **Core**: [React](https://react.dev/), [Vite](https://vitejs.dev/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Animations**: [Framer Motion](https://www.framer.com/motion/)
* **State Management & Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
* **Forms**: [React Hook Form](https://react-hook-form.com/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **HTTP Client**: [Axios](https://axios-http.com/)
* **Routing**: React Router

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v16 or higher)
* npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/bidstock-frontend.git](https://github.com/yourusername/bidstock-frontend.git)
    cd bidstock-frontend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    VITE_API_URL=http://localhost:5000/api/v1
    ```

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    The app should now be running at `http://localhost:5173`.

---

## 📂 Project Structure

```text
src/
├── api/                # API service calls and Axios configuration
├── components/         # Reusable UI components
│   ├── common/         # Buttons, Inputs, Logo
│   └── ui/             # Generic UI elements (Modals, Cards)
├── context/            # Global state providers (AuthContext, etc.)
├── hooks/              # Custom React hooks
├── layouts/            # Layout wrappers (DashboardLayout, AuthLayout)
└── pages/              # Application Pages
    ├── landing/        # Public Landing Page
    └── dashboard/      # Protected Dashboard Views
        ├── seller/     # Seller-specific pages (My Auctions, Add Product)
        ├── buyer/      # Buyer-specific pages (Marketplace, Payment Requests)
        └── warehouse_owner/ # Warehouse management pages
        
