# Publishing Wholesale Khata on Google Play

Everything Play Console asks for, in the order it asks. Files for the listing are in `store/`.

## 1. What the build already does

| Requirement | Status |
|---|---|
| Target Android 16 (API 36), required for new apps since 31 Aug 2026 | Capacitor 8 → targetSdk 36 |
| Upload format: signed Android App Bundle (`.aab`) | Built by GitHub Actions once the signing key is added (step 2) |
| Version code goes up on every upload | Set from the build number automatically |
| Privacy policy inside the app and on the web | More → Settings → Privacy, and `https://khandelwalroxy123-gif.github.io/wholesale-khata/privacy.html` |
| No data sent off the phone, no ads, no analytics | Fonts are bundled, no network calls; Android cloud auto-backup is off |
| Permissions | Microphone only (voice entry, used only when the user taps Speak) and fingerprint |
| Real features only | Fingerprint is checked by Android; Print uses Android's print/PDF screen; backup is a real file; bill upload no longer fakes data |

## 2. Signing key (one time)

Google Play only accepts bundles signed with your *upload key*. Make it once and keep it safe – if it is lost you must ask Google to reset it.

On any computer with Java installed:

```
keytool -genkeypair -v -keystore upload.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
base64 -w0 upload.jks > upload.jks.base64
```

In GitHub → this repo → **Settings → Secrets and variables → Actions → New repository secret**, add:

| Secret | Value |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | contents of `upload.jks.base64` |
| `ANDROID_KEYSTORE_PASSWORD` | the keystore password you chose |
| `ANDROID_KEY_ALIAS` | `upload` |
| `ANDROID_KEY_PASSWORD` | the key password (often the same) |

Then run **Actions → Build app and website → Run workflow**. The release will contain `WholesaleKhata-PlayStore.aab` (upload this to Play) and a signed `WholesaleKhata.apk`.

In Play Console keep **Play App Signing** on (the default).

## 3. Testing before production (new personal accounts)

Personal developer accounts created after 13 Nov 2023 must run a **closed test with at least 12 testers opted in for 14 days in a row** before they can apply for production. Organisation accounts are exempt. Plan about three weeks for the first launch.

## 4. Store listing

**App name:** Wholesale Khata – Billing & Stock

**Short description (max 80):**
Billing, stock, khata, staff & profit for wholesalers. Hindi & English, offline.

**Full description:**

Wholesale Khata is a simple billing and accounts app for wholesalers of daily-use packed goods – detergents, soap, shampoo, toothpaste, biscuits and more. It works fully offline and in Hindi or English.

• Two separate books: Daily book and GST book, each with its own stock, khata and reports
• Sale and purchase bills in cartons + loose pieces, with automatic rates
• Warnings for selling below cost, low stock and credit limit
• GST bills lock after issue; credit notes and cancellation kept on record; GST register export for your CA
• Product search with every rate: stock, sale and purchase rates, last rates of each party and vendor
• Live stock, low-stock list, items not selling, order on WhatsApp
• Khata with ageing (0–30, 30–60, 60–90, 90+ days) and WhatsApp reminders
• Payments by cash, UPI or cheque, with cheque tracking
• Delivery status and expenses by head
• Staff attendance calendar, advances, overtime and automatic salary
• Daily, weekly and monthly profit and loss by product, party and vendor
• Voice entry in Hindi, English or Hinglish
• Print or save bills as PDF, share on WhatsApp
• PIN and fingerprint lock; save a backup file to Drive or WhatsApp and restore on any phone
• Your data stays on your phone – no account, no ads

The app starts with a sample shop so you can try it. Go to More → Settings → Start fresh to begin with your own data.

**Hindi (add as a translation, hi-IN):**
होलसेल खाता – रोज़मर्रा का पैक्ड सामान बेचने वाले होलसेलर के लिए बिलिंग, स्टॉक, खाता, स्टाफ़ और मुनाफ़ा का आसान ऐप। बिना इंटरनेट और हिंदी में चलता है। दैनिक बही और GST बही अलग, कार्टन + खुले पीस में बिल, हर पार्टी के पुराने रेट, बकाया कितने दिन से, चेक, डिलीवरी, खर्चे, स्टाफ़ हाज़िरी और वेतन, मुनाफ़ा-नुकसान रिपोर्ट, आवाज़ से एंट्री, PIN/फ़िंगरप्रिंट लॉक। आपका डेटा सिर्फ़ आपके फ़ोन में रहता है।

**Graphics (in `store/`):** `icon-512.png`, `feature-graphic-1024x500.png`, phone screenshots `screenshot-1…8.png` (1080×1920).

**Category:** Business · **Tags:** Billing, Accounting, Inventory · **Contact e-mail:** your developer e-mail (it is also the privacy contact).

## 5. App content (Policy → App content)

| Section | Answer |
|---|---|
| Privacy policy | `https://khandelwalroxy123-gif.github.io/wholesale-khata/privacy.html` |
| App access | "All functionality is available without special access"? **No** – the app opens with a PIN. Add instructions: *PIN: 1234 (sample data). Fingerprint is optional.* |
| Ads | No ads |
| Content rating | Questionnaire category **Utility, Productivity, Communication or Other**; answer No to all content questions → rated 3+/Everyone |
| Target audience | 18 and over (not designed for children) |
| News app | No |
| COVID-19 / Health | No |
| Government app | No |
| Financial features | Bookkeeping only → "My app doesn't provide any financial features" |
| Data safety | See below |
| Permissions declarations | None needed (no restricted permissions) |

### Data safety form

- **Does your app collect or share any of the required user data types?** → **No.**
  All data is stored only on the device; nothing is sent to the developer or third parties. User-initiated sharing (WhatsApp messages, backup file through the share menu, printing) is exempt.
- **Is all user data encrypted in transit?** → Not applicable (no data is transmitted).
- **Do you provide a way for users to request that their data be deleted?** → Data never leaves the device; users delete it with Settings → Start fresh or by uninstalling.
- Voice entry uses the phone's own speech recognition service (handled by Android/Google, not by the app); the app receives only the text and keeps no audio. This is described in the privacy policy.

## 6. Before each release

1. Push to `main` → GitHub Actions builds the APK, AAB and website.
2. Install the APK on a real phone and try: PIN, fingerprint, a sale bill, Print/PDF, Share on WhatsApp, voice entry (allow microphone), Save backup file and Restore.
3. Upload the AAB to the testing track, then production.
