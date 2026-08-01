<div align="center">

# 📈 BidStock — Frontend

**B2B Wholesale Auction & Inventory Management Platform with Real-Time Bidding, Warehouse Management, and Transaction Pipeline**

[![React](https://img.shields.io/badge/React_19-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite_6-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router_v7-CA4245?logo=reactrouter)](https://reactrouter.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query_v5-FF4154?logo=reactquery)](https://tanstack.com/query/latest)

</div>

---

## 📋 Overview

BidStock is a full-stack **B2B wholesale auction and inventory management platform** that connects manufacturers, distributors, and retailers through a unified marketplace. The frontend is a **React 19 + Vite** SPA built with **Tailwind CSS v4** and **DaisyUI**, featuring a **custom JWT authentication system** with `localStorage` session persistence, **three-layout route architecture** (public, auth, dashboard), a **real-time auction bidding system**, **warehouse management** with rental tracking, and a **transaction pipeline** for offer negotiation between buyers and sellers.

> 🔗 **Live Demo:** [bidstock](https://bidstock.vercel.app)
> 🔗 **Backend Repo:** [bidstock-server](https://github.com/ishtiakalhumaidi/bidstock-server)


---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **🔐 Custom JWT Authentication System** | Self-hosted auth with `localStorage`-backed session persistence (`user` + `token` keys), supporting login, signup, and logout with automatic state hydration on page refresh |
| **🎭 Role-Based Dashboard Architecture** | Dashboard routes adapt to user roles (`seller`, `buyer`, `warehouse`) with conditional navigation — sellers see product/auction management, buyers see offers/transactions, warehouse owners see rental management |
| **📈 Real-Time Auction Bidding** | Active auctions page with live bid placement, current highest bid display, and auction detail views with bid history — powered by TanStack Query background refetching |
| **🏭 Warehouse Management System** | Full CRUD for warehouse listings (add, my warehouses, all warehouses), rental tracking (`my-rents`), and availability status management |
| **📦 Product Catalog with Inventory Tracking** | Sellers can add products with detailed specifications, manage their catalog (`my-product`), and track inventory levels in real-time |
| **💰 Transaction Pipeline & Offer Negotiation** | Buyers submit offers on products/auctions, sellers review transaction requests, and both parties track deal progress through the transaction dashboard |
| **📊 Dashboard Overview with Analytics** | Centralized overview page showing key metrics: active auctions, inventory levels, pending transactions, and recent activity across all business modules |
| **🌐 Three-Layout Route Architecture** | `MainLayout` for public pages (landing, auctions, pricing), `AuthLayout` for authentication (signin, signup), and `DashboardLayout` for the application shell with sidebar navigation |
| **🎬 AOS Scroll Animations** | Landing page features scroll-triggered entrance animations via AOS (Animate On Scroll) for progressive content discovery |
| **🌗 DaisyUI Theme System** | Dark/light mode toggle with `data-theme` attribute on `document.documentElement` and DaisyUI's built-in theme classes |
| **📝 React Hook Form Integration** | Product creation, warehouse addition, and auction setup use `react-hook-form` for performant, validated form state management |
| **🍞 SweetAlert2 Toast Notifications** | Non-blocking toast feedback for all async CRUD operations across auctions, products, warehouses, and transactions |
| **📱 Responsive Dashboard Sidebar** | Collapsible sidebar navigation in `DashboardLayout` with role-aware links, active state highlighting, and mobile-friendly hamburger menu |
| **🖼️ ImgBB Image Upload Pipeline** | Direct image upload to ImgBB API for product photos, warehouse images, and auction item galleries |

---

## 🛠️ Tech Stack

**Core**
- [React 19](https://react.dev/) — UI library with concurrent features
- [Vite](https://vitejs.dev/) — Build tool & dev server
- [React Router v7](https://reactrouter.com/) — Client-side routing with `createBrowserRouter`

**Styling & UI**
- [Tailwind CSS v4](https://tailwindcss.com/) — Utility-first CSS
- [DaisyUI](https://daisyui.com/) — Component-class plugin for Tailwind

**Authentication**
- Custom JWT — Self-hosted token-based auth with `localStorage` persistence

**State & Data**
- [TanStack React Query v5](https://tanstack.com/query/latest) — Server-state synchronization, caching, background refetching
- [React Hook Form](https://react-hook-form.com/) — Performant form state management

**Animation**
- [AOS](https://michalsnik.github.io/aos/) — Scroll-triggered reveal animations

**Notifications**
- [SweetAlert2](https://sweetalert2.github.io/) — Toast & modal alerts

**Utilities**
- [Axios](https://axios-http.com/) — HTTP client
- [date-fns](https://date-fns.org/) — Date formatting
- [React Icons](https://react-icons.github.io/react-icons/) — Icon library
- [React Tooltip](https://react-tooltip.com/) — Accessible tooltips

---

## 🚀 Getting Started

### Prerequisites
- Node.js `>= 18`
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/ishtiakalhumaidi/bidstock-client.git
cd bidstock-client

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with your backend API URL and ImgBB credentials:

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_imgbb_api_key=your_imgbb_api_key
```

> ⚠️ **Never commit `.env.local` to version control.**

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory, ready for deployment.

---

## 📁 Project Structure

```
bidstock-client/
├── public/                        # Static assets
├── src/
│   ├── api/
│   │   └── auth.api.js            # Auth API service (Axios instance)
│   ├── assets/                    # Images, fonts, static files
│   ├── components/
│   │   ├── About.jsx              # Landing page about section
│   │   ├── common/                # Reusable UI (Navbar, Footer, Loader, etc.)
│   │   ├── error/                 # Error boundary components
│   │   ├── sidebar/               # Dashboard sidebar navigation
│   │   └── ui/                    # UI primitives
│   ├── contexts/
│   │   └── AuthContext.jsx        # JWT auth context provider
│   ├── hooks/
│   │   └── useAuth.jsx            # Auth context consumer hook
│   ├── layouts/
│   │   ├── MainLayout.jsx         # Public layout (Navbar + Footer)
│   │   ├── AuthLayout.jsx         # Auth layout (centered, minimal)
│   │   └── DashboardLayout.jsx    # Dashboard shell (Sidebar + Content)
│   ├── pages/
│   │   ├── landing/
│   │   │   └── Home.jsx           # Landing page with AOS animations
│   │   ├── auth/
│   │   │   ├── SignIn.jsx         # JWT login form
│   │   │   └── SignUp.jsx         # Registration form
│   │   ├── auctions/
│   │   │   ├── ActiveAuctions.jsx # Live auction browsing + bidding
│   │   │   └── BidDetails.jsx     # Individual auction detail view
│   │   ├── pricing/
│   │   │   └── Pricing.jsx        # Subscription/pricing plans
│   │   └── dashboard/
│   │       ├── Overview.jsx       # Dashboard analytics overview
│   │       ├── seller/
│   │       │   ├── AddProduct.jsx # Product creation form
│   │       │   └── MyProducts.jsx # Seller product catalog
│   │       ├── buyer/
│   │       │   └── BuyerOffers.jsx # Buyer's offer management
│   │       ├── warehouse/
│   │       │   ├── AddWarehouse.jsx
│   │       │   └── MyWarehouses.jsx
│   │       ├── inventory/
│   │       │   └── MyInventory.jsx
│   │       ├── transactions/
│   │       │   ├── MyTransactions.jsx
│   │       │   └── TransactionRequests.jsx
│   │       ├── auctions/
│   │       │   └── MyAuctions.jsx # Seller's auction management
│   │       ├── profile/
│   │       │   └── Profile.jsx
│   │       └── common/
│   │           └── AllWarehouses.jsx # Public warehouse directory
│   ├── router/
│   │   └── router.jsx             # Central router with three layout groups
│   ├── App.jsx                    # Root component
│   ├── main.jsx                   # Entry point (React 19 createRoot)
│   └── index.css                  # Tailwind directives + custom styles
├── package.json
└── README.md
```

---

## 🔑 Key Architectural Decisions

### 1. Custom JWT Authentication with LocalStorage Persistence
The application implements a self-hosted JWT auth system independent of Firebase or OAuth providers:

```jsx
// AuthContext.jsx
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored && stored !== "undefined" ? JSON.parse(stored) : null;
  });

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const signup = async (signupData) => {
    const res = await api.post("/auth/signup", signupData);
    const { user: userData, token } = res.data.data;
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
    return { user: userData, token };
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const isAuthenticated = Boolean(user);
  const role = user?.role ?? null;

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated, role }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**Design decisions:**
- **LocalStorage hydration** — User state is restored from `localStorage` on page refresh, eliminating auth waterfalls
- **Defensive parsing** — Handles `"undefined"` string values and JSON parse errors gracefully
- **Role extraction** — `role` is derived from the stored user object, enabling role-based UI conditional rendering
- **Signup returns data** — Components can use the return value for post-signup navigation

### 2. Three-Layout Route Architecture
The router defines three distinct layout groups:

```jsx
// router.jsx
export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "auctions", element: <ActiveAuctions /> },
      { path: "auctions/:id", element: <BidDetails /> },
      { path: "warehouses", element: <AllWarehouses /> },
      { path: "pricing", element: <Pricing /> },
      { path: "about", element: <About /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "signin", element: <SignIn /> },
      { path: "signup", element: <SignUp /> },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Overview /> },
      { path: "add-product", element: <AddProduct /> },
      { path: "my-product", element: <MyProducts /> },
      { path: "add-warehouse", element: <AddWarehouse /> },
      { path: "my-warehouses", element: <MyWarehouses /> },
      { path: "my-rents", element: <MyRents /> },
      { path: "my-inventories", element: <MyInventory /> },
      { path: "my-transactions", element: <MyTransactions /> },
      { path: "transactions-requests", element: <TransactionRequests /> },
      { path: "my-auctions", element: <MyAuctions /> },
      { path: "my-offers", element: <BuyerOffers /> },
      { path: "my-profile", element: <Profile /> },
    ],
  },
]);
```

**Benefits:**
- **Layout isolation** — Public pages have marketing chrome, auth pages are minimal, dashboard pages have sidebar navigation
- **No URL pollution** — `/dashboard` prefix is clean and predictable
- **Error boundaries per layout** — Each layout can have its own `errorElement` for targeted error handling

### 3. Role-Based Dashboard Navigation
The `DashboardLayout` sidebar conditionally renders links based on the user's `role`:

- **Seller** — Add Product, My Products, My Auctions, My Warehouses, My Rents, Transaction Requests
- **Buyer** — My Offers, My Transactions, All Warehouses
- **Warehouse Owner** — Add Warehouse, My Warehouses, My Rents, All Warehouses

This ensures users only see navigation relevant to their business function, reducing cognitive load and preventing accidental access to unauthorized features.

### 4. TanStack Query for Server-State Management
The application uses TanStack Query for all server-state operations:

```jsx
// Example: Fetching active auctions
const { data: auctions, isLoading, error } = useQuery({
  queryKey: ["activeAuctions"],
  queryFn: () => api.get("/auctions/active"),
  refetchInterval: 30000, // Refetch every 30 seconds for live bidding
});
```

**Benefits:**
- **Background refetching** — Auction data stays fresh without manual refresh
- **Caching** — Previously viewed auctions load instantly from cache
- **Error handling** — Query errors are handled uniformly across the app
- **Optimistic updates** — Bid placement can use optimistic UI patterns

### 5. Auction Bidding Flow
The auction system implements a complete bidding lifecycle:

1. **Browse** — `ActiveAuctions` displays all open auctions with current highest bid
2. **Detail** — `BidDetails` shows item specs, bid history, and countdown timer
3. **Place Bid** — Authenticated users submit bids via API call with validation
4. **Track** — `MyAuctions` (seller) and `MyOffers` (buyer) track auction participation

The bidding interface uses real-time data refetching to ensure users always see the latest bid amounts.

### 6. Warehouse Rental Management
The warehouse module supports:

- **Listing** — Warehouse owners add facilities with capacity, location, pricing, and images
- **Discovery** — `AllWarehouses` is a public directory for buyers to find storage
- **Rental** — Buyers rent warehouse space, tracked in `MyRents`
- **Management** — Owners manage their listings and rental agreements via `MyWarehouses`

This creates a secondary marketplace within the platform, generating additional revenue streams for warehouse operators.

---

## 🗺️ Roadmap

- [ ] **Real-Time Bidding with WebSockets** — Socket.io integration for instant bid updates without polling
- [ ] **Payment Integration** — Stripe checkout for auction wins and warehouse rentals
- [ ] **Inventory Alerts** — Low stock notifications and automatic reorder suggestions
- [ ] **Advanced Search & Filters** — Full-text search across products, auctions, and warehouses
- [ ] **Analytics Dashboard** — Charts for sales trends, auction performance, and inventory turnover
- [ ] **Multi-Currency Support** — Currency switching for international B2B transactions
- [ ] **Mobile App** — React Native companion for on-the-go bidding and inventory checks
- [ ] **E2E Testing** — Playwright tests covering critical flows (signup → add product → create auction → place bid)
- [ ] **PWA Support** — Service worker for offline access to catalogs and push notifications for bid alerts
- [ ] **AI-Powered Pricing** — Suggested starting bids based on market data and historical auction results

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**📈 Where wholesale meets the auction floor**

Built with 💚 by [Ishtiak Al Humaidi](https://github.com/ishtiakalhumaidi)

</div>
