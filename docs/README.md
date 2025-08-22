# 13F Portfolio Tracker Documentation

Welcome to the documentation for the 13F Portfolio Tracker! This directory contains comprehensive guides for development, deployment, and understanding the application architecture.

## 📚 Documentation Index

### Getting Started
- [**Development Guide**](./development.md) - Local setup, environment variables, and development workflow
- [**API Documentation**](./api.md) - API endpoints, data structures, and usage examples

### Deployment & Operations
- [**Deployment Guide**](./deployment.md) - GitHub Actions, Vercel setup, and production releases
- [**Environment Variables**](./environment.md) - Required and optional configuration

### Architecture & Implementation
- [**Architecture Overview**](./architecture.md) - System design, data flow, and component structure
- [**SEC Integration**](./sec-integration.md) - 13F filing retrieval, parsing, and EDGAR API usage

## 🚀 Quick Start

1. **Local Development**: See [development.md](./development.md)
2. **Deploy Changes**: See [deployment.md](./deployment.md)
3. **Understand Data Flow**: See [architecture.md](./architecture.md)

## 📋 Project Structure

```
13f-portfolio/
├── docs/                 # 📚 Documentation
├── src/
│   ├── app/              # 🔌 Next.js App Router
│   │   ├── api/          # 🛠️ API routes
│   │   └── managers/     # 📊 Manager detail pages
│   ├── components/       # 🎨 UI components
│   ├── lib/              # 🔧 Core utilities
│   └── store/            # 💾 State management
├── .github/
│   └── workflows/        # 🚀 GitHub Actions
└── vercel.json           # ⚡ Vercel config
```

## 🤝 Contributing

This project tracks the top holdings of 10 legendary fund managers using SEC 13F filings. Contributions should focus on:

- **Data accuracy**: Improving SEC filing retrieval and parsing
- **User experience**: Enhancing the portfolio display and navigation
- **Performance**: Optimizing data fetching and caching
- **Documentation**: Keeping these docs up-to-date

## 📞 Support

- **Issues**: Open a GitHub issue for bugs or feature requests
- **Architecture Questions**: See [architecture.md](./architecture.md)
- **Deployment Issues**: See [deployment.md](./deployment.md)