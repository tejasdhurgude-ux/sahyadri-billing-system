# Sahyadri Wholesale Fataka, Lonand: Billing (lite)

No login, no database, nothing is saved. Everything lives in the browser tab and is gone on refresh.

## Run
```bash
npm install
npm run dev        # http://localhost:5173 (also shown as a Network address for your phone)
npm test
npm run build      # output in dist/
```

## Flow
1. Search products; use Add to cart or the − / + stepper on each card.
2. Cart → Continue to checkout → customer name + WhatsApp number → Review → Create bill.
3. **1. Send greeting on WhatsApp**: opens the customer's chat with a welcome message in English and Marathi (no bill details). Press send in WhatsApp.
4. **2. Share PDF**: on a phone over HTTPS, opens the share sheet (pick WhatsApp, then the customer's chat). Otherwise it downloads the PDF; attach it with the paperclip.

## Notes
- The PDF shows the shop logo, name, date, customer name, items (English + Marathi), totals and a thank-you from Team Sahyadri Wholesale Fataka, Lonand. It has no bill number and no phone number.
- Marathi product names are in `src/data/products.ts` (`nameMr`); correct any spelling you prefer.
- Logo: `src/assets/logo.ts` (SVG, used on screen and in the PDF). Greeting text: `src/services/whatsappService.ts`.
- WhatsApp links cannot attach files, and this app cannot tell whether a message was sent.
- Deploying: host the `dist` folder on Cloudflare Pages or Firebase Hosting, and check the host's current free-tier terms for commercial use (Vercel's free plan is non-commercial). Phone sharing needs HTTPS. With no login, anyone with the link can use the app.
