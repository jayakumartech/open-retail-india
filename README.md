# Open Retail India

A mobile-first, Tamil + English open-source retail billing and inventory starter for small businesses.

## Version 1.0 starter features
- Mobile-first dashboard
- Tamil / English interface toggle
- Light / dark theme
- Add products with price, stock and SKU
- Demo sales flow with stock deduction
- Today's sales summary and recent bills
- JSON backup export
- PWA manifest and service worker

## Run locally on Android
1. Download or clone this repository.
2. Open `index.html` in a modern browser, or serve the folder with a local development server.
3. For installable PWA/offline caching, host it over HTTPS (for example GitHub Pages).

## Important limitations
This is an early prototype, not production accounting software. It does not yet implement GST calculations, legally compliant invoice numbering, PDF invoices, returns, customer/supplier ledgers, authentication, cloud sync, or encrypted backup. Data currently stays in this browser's local storage. Export backups regularly and do not use it as the only record of real business transactions.

## Roadmap
- v1.1: GST settings, invoice preview and PDF export
- v1.2: Customer and supplier records
- v1.3: Purchase entry, returns and stock adjustments
- v1.4: IndexedDB migration, import/restore and tests
- v2.0: Optional cloud sync and multi-user roles

## Contributing
Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. Report bugs through GitHub Issues.

## License
MIT. See [LICENSE](LICENSE).
