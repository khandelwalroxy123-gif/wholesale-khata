# Firebase setup: accounts, plans and online orders (free plan)

Online orders let customers open a **Retail** or **Wholesale** link / QR, ask the shop for permission, order from the price list, pay cash or by UPI, and track the order live. When the shop accepts, the bill is made in the shop's book automatically.

The orders need a small online database. It runs on Google Firebase's free **Spark** plan – no card needed. About 15 minutes, once.

## 1. Create the project
1. Open <https://console.firebase.google.com> with the Google account that will own the app.
2. **Create a project** → name it `wholesale-khata` → Google Analytics: **off** → Create.

## 2. Turn on sign-in
**Build → Authentication → Get started → Sign-in method:**
- **Email/Password → Enable → Save.** Shop owners log in with email and password (needed for the trial, plans and admin).
- **Anonymous → Enable → Save.** Customers on order links get a random ID; they never type a password.

## 3. Create the database
**Build → Firestore Database → Create database** → location **asia-south1 (Mumbai)** → start in **production mode** → Create.

## 4. Paste the security rules
**Firestore Database → Rules** → delete what is there → paste the whole of [`firestore.rules`](firestore.rules) from this repo → **Publish**.
These rules make sure a customer sees prices only after the shop allows that visit (or after the shop has switched that link to "Allow automatically"), sees only the price list the shop chose (retail or wholesale), and sees only their own orders. Only the shop's phone can accept orders or change the price list.

## 5. Allow the website address
**Authentication → Settings → Authorized domains → Add domain** → `khandelwalroxy123-gif.github.io`

## 6. Get the web config
**Project settings (gear) → General → Your apps → Web `</>`** → nickname `Wholesale Khata` → Register (no Hosting).
Copy the `firebaseConfig` block. It looks like:

```js
{
  apiKey: "AIza...",
  authDomain: "wholesale-khata-xxxx.firebaseapp.com",
  projectId: "wholesale-khata-xxxx",
  storageBucket: "wholesale-khata-xxxx.firebasestorage.app",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcd..."
}
```

These values are **not secret** (they only name the project); the rules from step 4 protect the data.

## 7. Put it in the app
Open `www/firebase-config.js` and replace `null` with the block:

```js
window.WK_FIREBASE = { apiKey: "AIza...", authDomain: "...", projectId: "...", storageBucket: "...", messagingSenderId: "...", appId: "..." };
```

Commit to `main`. GitHub Actions builds the new APK and website.

## 8. Use it
In the app: **More → Online orders · link & QR** → enter your UPI ID → **Start online shop**.
- Share the **Retail** link/QR with shop customers and the **Wholesale** link/QR with retailers.
- When someone opens a link, the app beeps and shows **"customer waiting"**. Tap **Allow · Retail** or **Allow · Wholesale** (allowed for that visit, 6 hours) or **Decline**.
- Don't want to approve every visit? In **Online orders → Who can order**, set the Retail link and/or the Wholesale link to **Allow automatically**. Anyone with that link then sees its prices and can order at once (you still accept each order). Keep the Wholesale link on **Ask me each time** if you don't want just anyone to see wholesale rates.
- New order → **Accept & make bill** (bill goes to the Daily book, or to the GST book as a draft – choose in Online orders → Settings).
- Tap **Packed → Out for delivery → Delivered**; the customer sees each step at once.
- UPI: after acceptance the customer pays to your UPI ID and taps "I have paid" (with UTR). Check your bank/UPI app, then tap **UPI payment received** – it goes into the khata. Cash: tap **Cash received**.
- **Price list**: set your own retail and wholesale rates, or hide items. Changes go live with **Update price list now**.

## Good to know
- The shop's phone needs internet and the app open to see requests and orders as they come (there are no push notifications yet). Customers waiting can tap **Remind on WhatsApp**.
- The online shop belongs to the phone that started it. On a new phone, use **Make a new shop link** and share the new link/QR.
- Free plan limits (50,000 reads and 20,000 writes a day) are far above what one shop uses.
- To remove everything online: **Online orders → Delete online shop**.

## Accounts, trial and plans
- Every shop owner signs in with email + password when the app first opens. The trial (30 days) starts from the server's clock when the account is made, so it cannot be faked by changing the phone date.
- **Admin:** the account `rahulg.aice@gmail.com` (set in `firestore.rules` → `isAdmin()` and in the app → `ADMIN_EMAILS`). Create that account first, then open the verification email. In the app: **Settings → Account & plan → Admin** shows all accounts and plans, lets you add trial days, give a month or a 5-Year Plan (for cash/bank payments) and put an account on hold. It never shows a shop's books.
- **Full admin page:** <https://khandelwalroxy123-gif.github.io/wholesale-khata/admin.html> – sign in with the admin email and password (same as the app). Tabs: Overview (counts, sign-ups, use, money), Accounts (search, CSV download, trial days, month, 5-Year Plan, hold, notes), Free access, Purchases, Online shops (with their orders). Also opens from the app: Settings → Admin → Full admin page.
- **Free (complimentary) access:** Admin → Give free access → email + 1 month / 1 year / 5 years / no end date. An existing account gets it at once; someone new gets it after signing up with that email and verifying it. Remove it any time.
- **Google Play products** to create in Play Console → Monetize (after the first upload):
  - Subscription `wk_monthly`, base plan `monthly-199`, auto-renewing monthly, ₹199.
  - Subscription `wk_yearly`, base plan `yearly-1499`, auto-renewing yearly, ₹1,499. Optional launch offer: an introductory price of ₹999 for the first year (Play Console → the base plan → Add offer).
  - One-time product `wk_5year`, ₹4,999 (valid 5 years – the app counts it from the purchase date).
- Purchases are confirmed by Google Play on the phone and listed under **Admin → new purchases** to match with Play Console → Order management.

## What waits for the Blaze (pay-as-you-go) plan
Everything above runs on the free Spark plan. These need Blaze, and are ready to switch on later:
- **Phone OTP login** (Firebase SMS sign-in requires Blaze; first 10 SMS a day are free).
- **Push to a closed phone:** `functions/index.js` sends a push when a customer asks or orders even if the app is closed. To switch on: upgrade to Blaze → add an Android app `com.wholesalekhata.app` in Firebase and put its `google-services.json` in the build → add `@capacitor/push-notifications` and save each phone's token in `users/{uid}.fcm` (and allow `fcm` in the users rule) → `firebase deploy --only functions`. Until then, the app shows phone notifications while it is open or recently used.
- **Server check of Google Play purchases** (optional extra safety on top of the phone's check).
