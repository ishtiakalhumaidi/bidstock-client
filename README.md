# BidStock – Smart Procurement, Bidding & Warehouse Rental System

BidStock is a Smart Inventory, Supplier Bidding and Warehouse Rental Management System with integrated payment processing. It automates procurement, reduces purchase costs, optimizes warehouse usage, and manages secure transactions with real-time tracking.

---

## Project Overview
BidStock automates procurement through reverse bidding, manages inventory levels, enables warehouse monetization, and ensures secure purchase and rental transactions.

---

## System Features
- Automated procurement with reverse bidding
- Real-time transactions for purchases and rentals
- Secure payment flow with status validation
- Supplier performance analytics
- Warehouse space monetization
- Integrated financial reports and tracking

---

## Technology Stack

Frontend: React, Tailwind CSS, DaisyUI  
Backend: Node.js, Express.js  
Database: MySQL  
State Management: TanStack Query  
Forms: React Hook Form  
HTTP Client: Axios  

---

## User Roles and Responsibilities

### Business / Buyer
- Manages inventory and warehouse listings
- Receives automated purchase requests
- Evaluates supplier bids and selects winners
- Processes purchase payments
- Approves rental requests
- Manages rental transactions

### Supplier
- Submits competitive bids
- Provides delivery, pricing, and warranty details
- Accepts purchase orders and receives payments
- Rents warehouse space and handles rental payments
- Builds performance profile

### Warehouse Provider
- Lists warehouse spaces with pricing
- Approves and rejects rental requests
- Receives rental payments
- Manages rental contracts

### Admin
- Verifies businesses and suppliers
- Manages disputes and platform-wide issues
- Oversees payment disputes and refunds

---

# System Flow

## Login and Role-Based Dashboard
Each user role gets access to a specific dashboard:
- Business: Purchase requests, bids, payments
- Supplier: Bidding, purchase orders, payments
- Warehouse Provider: Listings, rental approvals, payments
- Admin: Disputes, verifications, analytics

---

## Inventory Monitoring and Automatic Purchase Request
- System checks stock levels
- When below threshold, a purchase request is generated
- Request is published to the bidding marketplace
- Includes quantity, priority, and delivery deadline

---

## Reverse-Bidding Marketplace
Suppliers can submit:
- Unit price
- Delivery time
- Warranty terms

Bids may be updated until deadline.

---

## Weighted Scoring and Supplier Selection
Final score calculation:

- Price: 40 percent  
- Delivery speed: 30 percent  
- Supplier rating: 20 percent  
- Sustainability: 10 percent

System recommends supplier with highest score; business selects final winner.

---

## Purchase Order and Transaction Flow

Business selects winning bid  
→ System creates Purchase Order (PO)  
→ Transaction created with status pending  
→ Supplier accepts PO  
→ Business completes payment within 24 hours  
→ Transaction becomes completed  
→ Supplier ships order  
→ Delivery confirmed  
→ Inventory updated  
→ Supplier performance updated

```yaml
Payment must be completed within 24 hours or the transaction is cancelled.
```
---

## Warehouse Rental and Payment Flow

Supplier selects warehouse
→ Submits rental request
→ Warehouse provider approves or rejects request
→ Transaction created with status pending
→ Supplier completes payment within 24 hours
→ Transaction becomes completed
→ Rental period begins
→ Expiry reminders sent automatically

---

## Transaction Management System
- Supports purchase and rental transactions
- Status includes pending, completed, failed, refunded
- Automatic expiration for unpaid transactions
- Disputes managed by admin
- Maintains full audit trail

---

## Supplier Performance Tracking
The system tracks:
- Delivery accuracy
- On-time rate
- Price competitiveness
- Payment reliability
- Dispute history

This data influences future bid scoring.

---

## Dispute and Refund System
Covers:
- Late or damaged deliveries
- Warehouse rental issues
- Payment or refund disputes

Admin resolves disputes and updates ratings where needed.

---

# Notifications and Alerts
Includes:
- Low stock alerts
- New bids
- Bid deadline reminders
- Payment due notifications
- Transaction success and failure alerts
- Rental expiry alerts
- Delivery delay alerts

---

# Analytics and Dashboards
Tracks:
- Cost savings
- Best suppliers
- Delayed delivery rate
- Purchase frequency
- Transaction success rate
- Warehouse rental revenue
- Payment performance
- Monthly financial reports

---

# Database Schema Overview

## Core Entities
- Users
- Products and Inventory
- Purchase Requests
- Bids
- Purchase Orders
- Warehouses and Rentals
- Transactions
- Reviews and Disputes

## Key Relationships
- Users link to products, inventory, and warehouses
- Purchase requests link to bids and purchase orders
- Bids link to transactions
- Warehouse rentals link to transactions
- All entities include audit timestamps

---

# Transaction Security
Features include:
- Payment intent tracking
- Status-based payment validation
- Optional wallet balance checks
- Automatic expiration of unpaid transactions
- Refund and dispute handling

---

# Business Benefits

## Reduced Purchase Cost
Reverse bidding lowers pricing and ensures budget-friendly procurement.

## Smart Decision Making
Weighted scoring and analytics improve supplier selection.

## Optimized Storage
Warehouse rental converts unused space into revenue.

## Improved Supplier Quality
Performance tracking ensures reliability.

## Automated Payments
Integrated payment workflow reduces manual work.

## Business Friendly
Real-time visibility into transactions and procurement.

---

# Implementation Priority

## Phase 1: Core Platform
- Authentication and roles
- Products and inventory
- Auto purchase requests
- Bidding marketplace
- Basic transaction schema

## Phase 2: Transaction System
- Purchase order workflow
- Rental approval system
- Payment tracking
- Transaction history
- Notifications

## Phase 3: Advanced Features
- Supplier analytics
- Advanced reporting
- Dispute system
- Stripe or Razorpay integration
- Real-time dashboards

```ts
<iframe frameborder="0" style="width:100%;height:1678px;" src="https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=#R%3Cmxfile%3E%3Cdiagram%20id%3D%222OTAFB3bey5HmdGubvDk%22%20name%3D%22Page-1%22%3E7Z1db%2BM2FoZ%2FTYDdixSmvixdNpm2ezEFis7Fdq8MjsXYwsiiKtFJ3F%2B%2FlC3Ktg6T2I547DgHGGAiWbIlPocS%2Bb6H5I1%2Fv3j%2BreLl%2FHeZivzGG6XPN%2F6XG89jAYv0f82eVbtn5PmbPbMqS9t92x3fsn%2BEObDdu8xSUe8dqKTMVVbu75zKohBTtbePV5V82j%2FsQeb7v1rymQA7vk15Dvf%2BN0vVfLM3Dkfb%2Ff8R2WxufpmN2k8W3Bzc7qjnPJVPO7v8X278%2B0pKtflr8Xwv8qb0TLlszvv1hU%2B7C6tEoQ45wduc8MjzZXtvy1pUdXtxamXuuH7KFjkv9NbdgyzUt%2FaTkd6ezrM8%2FcpXctn8Yq349IfZupvLKvtHH89z%2FRHTO%2FTHlWqB%2BqO9I741Z7bfWYlaH%2FOHuQ3W2%2FU7f9478Cuvlbkamee8rLPv6%2BtrTlzwapYVd1IpuWgPeppnSnwr%2BbQ55kkHaXMhamEuEhZiW66PolLieWdXW6i%2FCbkQqlrpQ9pPo6gF3IZ4MG63n7bxwoJ233wnVnwTKryN0Vn33d3P%2FaljmhczfYfd74Xj3u8F8Pci68%2Ft%2FxrPlagKrsSdXBZpvRs7%2Bo%2BdO93uWkeUPbp8EF36E2%2F0r%2FLHv0GE6YJV6wCp5A9xL3NZ6f2F3IRclue9XTzPZoXezMVDc1pDJtMV9Od29yJL0%2Bab72pNOStmX9eHfQm2e%2F5sC6HZJfXpD%2Fm6Hs71iUJ%2Fw10ps0KtSyW80%2F90Od2PfgpvQn2t93qbbbf1v%2BbwSt3LQl8%2Bz9ZRI3RMPokmLu8qqbji37sac3T4eQeH32of69vR9nKw7XF%2FBXICIBd8IYivS74RIt8A8BULnuUE2CXgBBGwaVXtEC7nDSQi7JAw8xARh5Awr%2BsnWaUE2SnkEBFyBCBXMqda7BZwjPmgjscAse5QqSXsrxHkASF3b0gMyBDxtBK6Q5ZOuCLMTjFb%2BszOMMcA87JMCTMG5sOlmAEe2VBgKyuZLqeKNLb3amyBefeadzELDwT7GtmPprExEtmGeZCwo58kmCobgzLMVIfQTFarSUa9OLegMeU2BvvqpKc6J4yqt8GOeirqaZWVKpMFgXYKGlV2Y7AztywyNSmrbEo12jFoTOmNwe6c0recTxrcBNotaEwJruul9EHXnKRWx6BRZTgGbW3S4bBAYwpxpj1AStwZQGNKcZ1SuJ%2FrRr1n9zIJJmUf0BTpTBgxVZfMXM5kwfNftnt3b1g8Z%2Bqvtmyav%2F%2FX%2FK3LdrP15Xnnoy%2BrdsNSSO1FyGU1ba%2BivS7Fq5lQ%2BxHZXOCrBVmJnKvsUex9%2BbtKCapJWfGoL1%2B230O69Om6dPdKMQ3UQ%2BWj7r13Dbq0JeeEdOlT4q%2BrqxepS1uyTlqDi16srjljytKWvIS%2Fl7xQmYIvDKI8JGVMadqSlpDrm5%2FoV62S0x%2BCarRb1qjqtA87RCRxYIHGVKd9mCJAEgcWaEx12ofduid99XO5rAU1x1yjRtWn%2FRDQdK5z6LKpVn%2BZL2g2ds5qNrenrbeO0keYTSBpOxf4AokPuzVdTQIFTwLJcQKJz%2FYFi%2FDgDus1Je75sEdFAskp8dfV1YsUSHwaH3sGwpjSiG%2FpNMspp2Qu55QxpZEA9pY3mR9T3hQ1yWCOWaNKIwFM8%2BGPPMubWybgSMAxJRLzvbs5uZr3atLcwaTSbT6i7ZY2pk4SWMbM1JOuhhNqp6hRdZLAMm6GRG4k0Jh5fAHMNyCRGws0Zh5fAKU5yuPDUU0wKY8BzY%2Btb1vk7eBs8nZgyW7fjCbNBA1Mf6%2B%2B3Z%2F88eAEwK7Lcw36dgi7VKRvnxJ%2FXWW9SH07hFIJ6dvOCWPq2yFUPmm8MhZoTIk7pL7y2TjjTgd5hsb1QY1k02bYbSWbmU%2FwW8khNPa26VTNffCcGsvvbSyzfjLIwepgdE2NZdgho8byKfHX1dmLbCxHsE9ECZpopDEbzRHsFhnfeP3qoKEUjmFjNpwjSw%2BpdY8JtGvQqC3nCDrH64baJKUUAeegUSdTtyx7UaSEGQEzZiZIBF3jTVbf%2Bg4ItEvQqHkgEU2dfx7ImDkgEUwNIAETCzRmDsgYvp3rZVnmGeWBYAgmmFXaslACZftgUMbUxcYeoPnBs33a5saukWHkJ3wjY3xtg4UtyVTmQTFc6a5P%2Fbmq%2BGrngLZSb7%2F5j2bH1l6IgJ0R7pJ68%2Fik3X7p%2BE7XOvH4ONy7Hv3H5g5PNS7G0fWH1nhwB%2FK00PKPDK3e8Ul%2FLeh%2BqIzfd3zsDRxasMum341FzadN3gk5r%2FZYPtx5vWW9Z8PhSmryyjv%2Fo1mvY9jCJOv1lADs6utFWq9j6LDzhY4f0gXcMsY0XY1yvPvGWJUk2LsljOm0xtBWJxkXgTGqyRp7AHLJV4tmJLb%2Brrkk6ccxbEyjNYaOuoGty2L9H%2FF2zBvTcY2hdL%2FTqyOD3T1uVN81hgb7VC7KXJAph4EadUnrV%2BZMbNPl6VnunDimDRtDha5cVtM518BlSi4dhoKCiRsqZQ%2BVXEzIkEVBjamWxVAtU5JA44DGlMwSS1%2FbPMIr8fdSlwI5Le91Wvoe78GK2TXNd5xYJl1LyWc5Pvy6KnuRPksC%2B%2Fe0IBQSZ9QXB%2BzY04JQKJQx%2FZYE9umbVkFWiXSSijx75NWKNDv3zFH9l4TGSpwHMqbvksDO%2FHddjLqQJ5sRjSqjWZxcA8c0XhLYpTfAm5GNhNs5blTjhY0szgsNhkIijem7MKMBk8d2FtaYjgsbWdZyJFUWRUNBxfwJhlV0sTzwuAowUMFPwp9YkiQhY2MWm8FQpg026iezb66x%2FY4ts6OHa5jgOHS4Ru945o%2BGHU%2Bh79TWAiR5%2F73y%2Fi0Q%2BA%2FurV%2BTwN%2FN5EcK%2FzvfTtuaepESP2MeAN03DalB4hw5ptrPmKXdWWRqUmbNK55IOyWNqfgzZknQXU%2BJRMOlMFijKv2MQZFobeuIta2zIsXfNW1MyZ8x6OaRsYOCGVPo171cgJmUXyzUuCI%2Fgy4eSb%2BIsFF1ftMyoCUOz4EaVeZnUKqjCe4QxRTUau0Bnh9b609sYr%2FRjPBnP2PGfLiaAraWbzJ0%2Bdptitv%2B4oasvw7LQP5JONr%2Fobf8k%2F7xzG8b3S%2BdcAsMl2NP8PyBHRrPkjy9O6COvBp75TjCqwnCfYjJwT3wq%2FJqPCj8kFdzUgR2dfYyvRoPaj7fs5Qakc4po9oz%2FkvrGJBoj8Ea1aDxLH1DUnERKONaM55lXsq6XgoaboOBGtWXMV%2Byu9jQc6nbkmaUlaBRVjjYUX0aHzbN%2BFQt9VuboCNCx3VsfA9AJ3MODTWqX%2BNTrv65OKOaNT6tRnRWNQWV9RjwdO4lWIrpBngCXfb1nitg1J8zuC5%2BjF9S6K6LjzSE5Zb1ZGQG5OihbJfeohBv2i79RSSMwP2ii%2BL1HaTjzxjcePGTzxCsbtaxgbzCfqwGjmJ1fGSs9itR8MYSN5ZYPfoMs8bsYLFqCvPyXkHGVNqNOjNHqPOgC3rLHUXxYUF3EgKGjwD7cRFfyIJq71z1KnjD1DejLE8%2BfvDq7X2C2HKTrHJsbPlHLtbXPz5IhmYPFYM0q8ulEpT5YQ%2B0IzI%2Fxl7vzXy4n3NVqR8BlCso9eOkEOyq62WmfoRQaqYJ%2BdGRo%2BaBhJbVdGhGflTeqLkgAcz70cVQi3TyfUXTteMAx00LCeHgPt3ikvnjhjlPF1lB0N1DR00QCSyZAjNdELWiSo7EGzUzJLBVcl7LgjC7xYybCxLAFD%2FK5ETBjJoHEjKAmQZpI8JGTQYJobrStc%2BItXt9BZX1tc3SaXXwOlHhDEkk4Wfw5U0n3rlF6vUV8PBAjxTbtGNvuXC3AUg7OfoMLxzYvTFK31UHa%2BjGzz86wrwjI6wf%2BiYcXo6X%2BN1nmNWPh4uwT5B30IkdHz7CRm%2FES%2Fj%2BM3w2dIR5VxZhpgWx%2FxDzLiLEbsEcF%2BHrMQZOYGzoFITo2iZLsQVAfL606Aj2D9fGXCUeM%2FFEaR52oEekeYC2ZHioVO%2F101Q%2FdJpHRDN8DCRDdFX2MtM8ImgWkOePyxs1xyOCrgGZgCiYUVM7IpoC8oyocZM6TAtiL41H6VImzI4xo6ZxjKERuGn2T9ZYibVb1qgpHGOYiUmmLx5s3EQOs6bc1YgmdiMwGtyoOryEr81qtSnf0WUMuQt7Q1jfHFbbH%2FIaDe2sjc8w6wI%2B%2FcsYFBcdOe9y%2F3gdxUPTH2gmCXYx9McQ%2F%2FCD8w9%2Ftr7S0yx1y0BWC15YVnkjafo4aTrq%2B8Ojg3XCqxqAGMPeLinTJ0VgV3MvU5mOScI6I2pUUTqBdZpEaRTMqKJ0DBWszTzj9tUpCPWgqHFF6dgDrLcKlqwIOAJwVHk6hpIlf5xNyIlAQY2qTscvLfJcl4KWi3DNGlecjmEiUK7vf%2FMIpxnGMXijDjeM4WBxWiYUDTXqYMPYsvwvTSaPJqWgdrDPmZfdbTi2QIafF%2FDw8g0%2BQfkareAc5Xt1FrmlgJPBTZyTLLygP89x9Pq4ov7xyRvjkDz%2Ffcez0dCTpiawzVNIlT3oF5bK9DsDxB55V8d5V2YoY4f8c1pXCcy1J%2BvqpADsauxlWlcJbFmrTOXUVXYMGde0gv7kQtQ1nxFmx5gxTSvP9NN26%2FKqJMaOGaO6Vd7Illufr6UQfROZWk2IOQJzTMPKG3lvMaf0A%2BfEMX0rbwQtyqyeVIITZ8ecUT0rb2RZUpFmxsTAjGlVeSNoTZJ%2FgYYa06ryRlA5oQRBJN0ElfMnmLGxC2bnPorerKRUu4KlDpL57zIVzRH%2FBw%3D%3D%3C%2Fdiagram%3E%3C%2Fmxfile%3E"></iframe>
```