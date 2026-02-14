# Restaurant Menu & Billing Website

A single-page restaurant ordering and billing system built with HTML, CSS, and JavaScript.

## Features

- **Menu** - Browse items (Idly, Pongal, Poori, Paniyaram, Dosai, Vada, Cotton seed milk) and add to cart
- **Cart & Bill** - View items, quantities, total; Print Bill, Pay Now (QR), Clear Cart
- **Manage Menu** - Add, edit, delete menu items; upload images
- **Monthly Sales Report** - View sales aggregated by month
- **Pay Now** - Static QR code for UPI/payment link (configurable in Manage Menu)

## Setup

1. **No server needed**: Double-click `index.html` or open it in a browser. Works on mobile too.
2. Upload your payment QR code in **Manage Menu** under "Payment QR Code" (from gallery).

## Deploy to Vercel

1. Push the project to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Deploy (no build needed - static site)

## Data

All data is stored in `localStorage` (menu items, cart, sales history). Clearing browser data will reset everything.

## Tech Stack

- HTML5, CSS3, Vanilla JavaScript
- QRCode.js (CDN) for payment QR
- No backend required
