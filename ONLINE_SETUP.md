# Switching on Online orders (Firebase, free plan)

Online orders let customers open a **Retail** or **Wholesale** link / QR, ask the shop for permission, order from the price list, pay cash or by UPI, and track the order live. When the shop accepts, the bill is made in the shop's book automatically.

The orders need a small online database. It runs on Google Firebase's free **Spark** plan – no card needed. About 15 minutes, once.

## 1. Create the project
1. Open <https://console.firebase.google.com> with the Google account that will own the app.
2. **Create a project** → name it `wholesale-khata` → Google Analytics: **off** → Create.

## 2. Turn on anonymous sign-in
**Build → Authentication → Get started → Sign-in method → Anonymous → Enable → Save.**
(Customers and the shop get a random ID; nobody types an e-mail or password.)

## 3. Create the database
**Build → Firestore Database → Create database** → location **asia-south1 (Mumbai)** → start in **production mode** → Create.

## 4. Paste the security rules
**Firestore Database → Rules** → delete what is there → paste the whole of [`firestore.rules`](firestore.rules) from this repo → **Publish**.
These rules make sure a customer sees prices only after the shop allows that visit, sees only the price list the shop chose (retail or wholesale), and sees only their own orders. Only the shop's phone can accept orders or change the price list.

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
- New order → **Accept & make bill** (bill goes to the Daily book, or to the GST book as a draft – choose in Online orders → Settings).
- Tap **Packed → Out for delivery → Delivered**; the customer sees each step at once.
- UPI: after acceptance the customer pays to your UPI ID and taps "I have paid" (with UTR). Check your bank/UPI app, then tap **UPI payment received** – it goes into the khata. Cash: tap **Cash received**.
- **Price list**: set your own retail and wholesale rates, or hide items. Changes go live with **Update price list now**.

## Good to know
- The shop's phone needs internet and the app open to see requests and orders as they come (there are no push notifications yet). Customers waiting can tap **Remind on WhatsApp**.
- The online shop belongs to the phone that started it. On a new phone, use **Make a new shop link** and share the new link/QR.
- Free plan limits (50,000 reads and 20,000 writes a day) are far above what one shop uses.
- To remove everything online: **Online orders → Delete online shop**.
