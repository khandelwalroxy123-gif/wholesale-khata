# iPhone app (iOS)

The iPhone app is the same app as Android, built with Capacitor 8 on a Mac in GitHub Actions (workflow **Build iPhone app**, `.github/workflows/ios.yml`; if GitHub has no free Mac at that moment, re-run it from the Actions tab). Every push to `main`:

1. Builds the iOS app for the **iPhone Simulator** – proves it compiles. Download `WholesaleKhata-iOS-Simulator.zip` from the release (opens on a Mac in Xcode's Simulator).
2. If the Apple secrets below are set, also **signs it and uploads it to App Store Connect → TestFlight**, ready to install on real iPhones and to send for review.

Apple does not allow installing an app on a real iPhone without signing, so step 2 needs an Apple Developer account.

## Until then: use it on iPhone from the website
Open <https://khandelwalroxy123-gif.github.io/wholesale-khata/> in **Safari** → Share → **Add to Home Screen**. It opens full-screen like an app, with the same login, trial, books on the phone, online orders and admin. (Plans can't be bought there; give a plan from Admin if someone pays you directly.)

## 1. Apple Developer account (₹ ~8,700 / US$99 a year)
<https://developer.apple.com/programs/enroll/> → enroll as **Individual** (your name shows as the seller) or **Organisation** (needs a D-U-N-S number). Approval usually takes 1–2 days.

## 2. App record in App Store Connect
<https://appstoreconnect.apple.com> → Apps → **+** → New App
- Platform iOS · Name **Wholesale Khata** · Primary language English (India) or Hindi
- Bundle ID **com.wholesalekhata.app** (register it under Certificates, IDs & Profiles → Identifiers if it is not listed) · SKU `wholesale-khata`

## 3. In-app purchases (must use Apple's payment on iPhone)
App → Monetization:
- **Subscriptions** → group "Wholesale Khata Plans" → product ID **`wk_monthly`**, 1 month, price ₹499 (choose the ₹499 tier).
- **In-App Purchases** → **Non-Consumable**, product ID **`wk_5year`**, price ₹20,000 tier. Description: "Full access for 5 years from the date of purchase. Does not renew."
  (The app counts the 5 years itself; Apple has no fixed-term one-time type.)
- Also sign the **Paid Apps agreement** (Business → Agreements) and add bank and tax details, or purchases will not work.

## 4. Secrets for automatic upload
App Store Connect → Users and Access → **Integrations → App Store Connect API** → Team Keys → **+** → role **App Manager** (or Admin) → download the `.p8` file (only once).
In GitHub → repository → Settings → Secrets and variables → Actions → New secret:

| Secret | Value |
|---|---|
| `APPLE_TEAM_ID` | 10-character Team ID (developer.apple.com → Membership) |
| `ASC_KEY_ID` | Key ID shown next to the key |
| `ASC_ISSUER_ID` | Issuer ID shown above the keys list |
| `ASC_KEY_P8_BASE64` | the `.p8` file in base64 (`base64 -i AuthKey_XXXX.p8` on Mac, or `certutil -encode` on Windows and remove the header/footer lines) |

Push any change (or run the workflow by hand). The build appears in **TestFlight** in ~15 minutes. Add testers (up to 100 internal) – they install with Apple's TestFlight app.

## 5. App Store listing and review
- **Privacy policy URL:** `https://khandelwalroxy123-gif.github.io/wholesale-khata/privacy.html`
- **Terms of Use (EULA) – put this link in the App Store description too:** `https://khandelwalroxy123-gif.github.io/wholesale-khata/terms.html`
- **Support URL:** the website above (contact email is on the Terms page).
- **Screenshots:** 6.9" iPhone (1320×2868) – take them from TestFlight on an iPhone 15/16 Pro Max, or from the Simulator. Do not mention Android or Google Play in the listing.
- **App Privacy (nutrition label):** Data linked to the user, used for App Functionality, not used for tracking: Contact Info (Name, Email, Phone, Physical Address – address only for online orders), Identifiers (User ID), Purchases (Purchase History), Usage Data (Other – last opened, app version). No tracking. The same list is in the app's `PrivacyInfo.xcprivacy`.
- **Age rating:** 4+; no user-generated content shared publicly.
- **Sign-in for review (App Review Information):** create a test account in the app, give it a 5-Year Plan from Admin, and enter its email + password. Notes for review:

> Wholesale Khata is a billing, stock and khata (credit ledger) app for wholesale shops in India. Sign in with the demo account above. The shop's books are stored only on the device; the account keeps the 30-day trial and plan. Sample data is preloaded so every screen can be tried: Home → + for a sale bill, Khata, More → Stock, Reports, Staff, Settings. More → Online orders makes a retail/wholesale order link and QR for customers; a customer page opens in Safari and the request appears in the app with a notification. Voice entry (More → Speak an entry) uses the microphone and Apple speech recognition only after tapping Speak. Plans (Settings → Account & plan → Plans): auto-renewing monthly subscription and a 5-year non-consumable, both through In-App Purchase, with Restore. Account deletion: Settings → Account & plan → Delete account.

## Differences from Android
- Purchases go through the App Store; the plan screens say "App Store" on iPhone.
- Fingerprint unlock uses **Face ID / Touch ID**.
- Phone notifications for customer requests work while the app is open or recently used (same as Android until the Firebase Blaze plan adds push).
- Refunds for iPhone purchases are made by Apple (reportaproblem.apple.com) – stated in the Refund policy.
