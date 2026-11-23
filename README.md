# Wholesale Khata

Billing, stock, khata, staff and profit app for a wholesaler of daily-use packed products
(detergents, shampoo, soap, toothpaste, biscuits and more). Works in Hindi and English.

## Download the Android app

Open **Releases** on the right side of this page and download `WholesaleKhata.apk`.
On the phone, open the file and allow "Install unknown apps" when asked.

Every change pushed to `main` builds a new APK automatically (see the **Actions** tab).

## Use it in the browser

The same app runs as a website through GitHub Pages:
https://khandelwalroxy123-gif.github.io/wholesale-khata/

## What it does

- Two separate books: Daily book and GST book, each with its own stock, khata and reports
- Product search → size → all sale and purchase rates, last 5 rates of every vendor and party, full history
- Sale and purchase bills with cartons + loose pieces, auto rates, below-cost / stock / credit-limit warnings
- GST bills lock after issue; credit notes and recorded cancellation; GST register export for the CA
- Keep the vendor's GST bill PDF or photo with the purchase entry (automatic reading planned)
- Live stock, low-stock alerts, order on WhatsApp from the best-rate vendor, items not selling
- Khata with ageing (0–30, 30–60, 60–90, 90+ days), payments by cash / UPI / cheque, WhatsApp reminders, cheque tracking
- Delivery status, expenses by head, staff attendance calendar with advances and automatic salary
- Daily / weekly / monthly profit and loss by product, party and vendor, including transport and expenses
- Voice assistant in Hindi, English and Hinglish for entries and questions
- Online orders: Retail and Wholesale link + QR, shop approves every visit, customer cart with cash or UPI payment, live order status, bill made automatically on accept (needs Firebase, see `ONLINE_SETUP.md`)
- PIN / fingerprint lock, data saved on the phone, backup file to Drive/WhatsApp and restore, App guide with voice
- Print or save bills as PDF

## Project layout

- `www/parts/*.html` – the app, split into parts; the build joins them into `www/index.html`
- `www/shop.html` – the customer order page opened from the link/QR; `www/firebase-config.js` – Firebase web config; `firestore.rules` – database security rules; `www/vendor/` – Firebase SDK and QR library
- `www/privacy.html` – privacy policy (also linked in Settings), `www/fonts/` – bundled fonts
- `assets/` – app icon and splash source images, `store/` – Play Store graphics and screenshots
- `PLAY_STORE.md` – how to publish on Google Play (signing key, listing, Data safety answers)
- `capacitor.config.json`, `package.json` – Android wrapper (Capacitor 8, target Android 16 / API 36)
- `.github/workflows/build.yml` – builds the APK, the Play Store AAB (when the signing key is set) and the website

## Build on your own computer (optional)

```
cat www/parts/*.html > www/index.html
npm ci
npx cap add android
npx capacitor-assets generate --android
npx cap sync android
cd android && ./gradlew assembleDebug
```
Needs Node 22 and Java 21.

The app starts with sample shop data. Use **More → Settings → Start fresh** to begin with real data.
