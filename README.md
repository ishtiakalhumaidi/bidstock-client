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

```