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

## Diagram
[BidStock Database Diagram](https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=#R%3Cmxfile%3E%3Cdiagram%20id%3D%222OTAFB3bey5HmdGubvDk%22%20name%3D%22Page-1%22%3E7Z1db%2BM2FoZ%2FTYDdixSmvixdNpm2ezEFis7Fdq8MjsXYwsiiKtFJ3F%2B%2FlC3Ktg6T2I547DgHGGAiWbIlPocS%2Bb6H5I1%2Fv3j%2BreLl%2FHeZivzGG6XPN%2F6XG89jAYv0f82eVbtn5PmbPbMqS9t92x3fsn%2BEObDdu8xSUe8dqKTMVVbu75zKohBTtbePV5V82j%2FsQeb7v1rymQA7vk15Dvf%2BN0vVfLM3Dkfb%2Ff8R2WxufpmN2k8W3Bzc7qjnPJVPO7v8X278%2B0pKtflr8Xwv8qb0TLlszvv1hU%2B7C6tEoQ45wduc8MjzZXtvy1pUdXtxamXuuH7KFjkv9NbdgyzUt%2FaTkd6ezrM8%2FcpXctn8Yq349IfZupvLKvtHH89z%2FRHTO%2FTHlWqB%2BqO9I741Z7bfWYlaH%2FOHuQ3W2%2FU7f9478Cuvlbkamee8rLPv6%2BtrTlzwapYVd1IpuWgPeppnSnwr%2BbQ55kkHaXMhamEuEhZiW66PolLieWdXW6i%2FCbkQqlrpQ9pPo6gF3IZ4MG63n7bxwoJ233wnVnwTKryN0Vn33d3P%2FaljmhczfYfd74Xj3u8F8Pci68%2Ft%2FxrPlagKrsSdXBZpvRs7%2Bo%2BdO93uWkeUPbp8EF36E2%2F0r%2FLHv0GE6YJV6wCp5A9xL3NZ6f2F3IRclue9XTzPZoXezMVDc1pDJtMV9Od29yJL0%2Bab72pNOStmX9eHfQm2e%2F5sC6HZJfXpD%2Fm6Hs71iUJ%2Fw10ps0KtSyW80%2F90Od2PfgpvQn2t93qbbbf1v%2BbwSt3LQl8%2Bz9ZRI3RMPokmLu8qqbji37sac3T4eQeH32of69vR9nKw7XF%2FBXICIBd8IYivS74RIt8A8BULnuUE2CXgBBGwaVXtEC7nDSQi7JAw8xARh5Awr%2BsnWaUE2SnkEBFyBCBXMqda7BZwjPmgjscAse5QqSXsrxHkASF3b0gMyBDxtBK6Q5ZOuCLMTjFb%2BszOMMcA87JMCTMG5sOlmAEe2VBgKyuZLqeKNLb3amyBefeadzELDwT7GtmPprExEtmGeZCwo58kmCobgzLMVIfQTFarSUa9OLegMeU2BvvqpKc6J4yqt8GOeirqaZWVKpMFgXYKGlV2Y7AztywyNSmrbEo12jFoTOmNwe6c0recTxrcBNotaEwJruul9EHXnKRWx6BRZTgGbW3S4bBAYwpxpj1AStwZQGNKcZ1SuJ%2FrRr1n9zIJJmUf0BTpTBgxVZfMXM5kwfNftnt3b1g8Z%2Bqvtmyav%2F%2FX%2FK3LdrP15Xnnoy%2BrdsNSSO1FyGU1ba%2BivS7Fq5lQ%2BxHZXOCrBVmJnKvsUex9%2BbtKCapJWfGoL1%2B230O69Om6dPdKMQ3UQ%2BWj7r13Dbq0JeeEdOlT4q%2BrqxepS1uyTlqDi16srjljytKWvIS%2Fl7xQmYIvDKI8JGVMadqSlpDrm5%2FoV62S0x%2BCarRb1qjqtA87RCRxYIHGVKd9mCJAEgcWaEx12ofduid99XO5rAU1x1yjRtWn%2FRDQdK5z6LKpVn%2BZL2g2ds5qNrenrbeO0keYTSBpOxf4AokPuzVdTQIFTwLJcQKJz%2FYFi%2FDgDus1Je75sEdFAskp8dfV1YsUSHwaH3sGwpjSiG%2FpNMspp2Qu55QxpZEA9pY3mR9T3hQ1yWCOWaNKIwFM8%2BGPPMubWybgSMAxJRLzvbs5uZr3atLcwaTSbT6i7ZY2pk4SWMbM1JOuhhNqp6hRdZLAMm6GRG4k0Jh5fAHMNyCRGws0Zh5fAKU5yuPDUU0wKY8BzY%2Btb1vk7eBs8nZgyW7fjCbNBA1Mf6%2B%2B3Z%2F88eAEwK7Lcw36dgi7VKRvnxJ%2FXWW9SH07hFIJ6dvOCWPq2yy)
