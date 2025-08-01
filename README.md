# Personal Finance Tracker

A comprehensive personal finance dashboard that connects directly to your bank account via TrueLayer's Open Banking API, providing real-time insights into your financial health and spending patterns.

## Live URL

**Device Compatibility**: Optimized for laptop and desktop screens. While functional on mobile devices, the UI is designed primarily for larger screen experiences

[https://finance-app-steel-seven.vercel.app](https://finance-app-steel-seven.vercel.app)

Its best to use this on a laptop or larger screen device. It does work on mobile however I did not configure UI for mobile devices as the intention was use on bugger screens

---

## Why This Project?

This project was born from genuine curiosity about modern web development and financial technology. Instead of following tutorials, I wanted to solve a real-world problem that would push me to learn **React** through hands-on experience with complex APIs and real-time data.

I chose banking services because the technical challenges fascinated me - OAuth flows, real-time data synchronization, and building secure user experiences around sensitive financial information. My goal was to create a meaningful portfolio piece and a deep learning experience in **API integration** and **full-stack development**.

---

## Core Functionality

- **Real-time Bank Integration** - Connect your account using TrueLayer's Open Banking API.
- **Account Overview** - View current balances and see financial progression over time.
- **Transaction Management** - Browse and filter all transactions with detailed views.
- **Recurring Payments** - Automatically track standing orders and direct debits.
- **Savings Goals** - Create, monitor, and track custom savings targets.
- 📊**Spending Analysis** - Visual breakdowns by category with month-over-month comparisons.

---

## Technologies Used

### Frontend

- **React (TypeScript)** - Type-safe, component-driven UI
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Interactive data visualizations

### Backend & Infrastructure

- **Supabase** - Auth and database (savings goals, bank connections)
- **Vercel** - Deployment and serverless function hosting
- **TrueLayer API** - Open banking integration for secure financial data

---

## Architecture Overview

- **Authentication Layer** - Supabase handles user sessions and sign-ins.
- **Data Layer** - A custom React Context (`DataContext`) manages all state and API calls.
- **API Layer** - Vercel serverless functions securely interface with the TrueLayer API.
- **UI Layer** - Built with TypeScript components and styled using Tailwind CSS.

---

## Security & Privacy

- **Open Banking Compliance** - Uses TrueLayer’s regulated infrastructure.
- **Token Security** - Access tokens stored securely via HTTP-only cookies.
- **No Data Storage** - Financial data is fetched in real time and not permanently stored.
- **Session Management** - Secure authentication with automatic session refresh handling.

---

## Current Limitations

- **Single Device Sessions** - Bank connections are limited to one device at a time due to session token restrictions.
- **Historical Data** - Limited by what the bank APIs return (often 90 days).
- **Transaction Categories** - Bank-provided categories are often vague (e.g. "PURCHASE", "ATM").
- **No Caching Yet** - Some views may load slowly due to live API calls.
- **Geographic Scope** - Only supports UK/European banks via TrueLayer.

---

## Note

This project was built purely for learning purposes. Since it hasn’t gone through TrueLayer’s full regulatory approval process, users may see a warning message when attempting to connect a bank account.
