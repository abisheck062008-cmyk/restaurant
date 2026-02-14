# Restaurant Menu & Billing Website

A single-page restaurant ordering and billing system built with HTML, CSS, and JavaScript.

## Features

- **Menu** - Browse items (Idly, Pongal, Poori, Paniyaram, Dosai, Vada, Cotton seed milk) and add to cart
- **Cart & Bill** - View items, quantities, total; Print Bill, Pay Now (QR), Clear Cart
- **Manage Menu** - Add, edit, delete menu items; upload images
- **Monthly Sales Report** - View sales aggregated by month
- **Pay Now** - Static QR code for UPI/payment link (configurable in Manage Menu)

## Setup

1. **No server needed**: Double-click `index.html` or open it in a browser. Works on mobile too (open the file or host on any web server).
2. Set your UPI ID in **Manage Menu** under "Payment (QR Code)" so the Pay Now QR works.
3. **QR code**: Renders as an image - customers can long-press to save and scan from another phone. Requires internet once to load the QR library.

## Data

All data is stored in `localStorage` (menu items, cart, sales history). Clearing browser data will reset everything.

## Tech Stack

- HTML5, CSS3, Vanilla JavaScript
- QRCode.js (CDN) for payment QR
- No backend required
