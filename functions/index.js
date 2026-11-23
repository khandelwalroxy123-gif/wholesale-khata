/* Wholesale Khata – server alerts. NOT deployed yet: needs the Firebase Blaze plan.
   When you upgrade, see ONLINE_SETUP.md → "Push to a closed phone". It sends a push to the shop owner's phones
   when a customer asks to order or places an order, even if the app is closed. */
const {onDocumentCreated, onDocumentUpdated} = require('firebase-functions/v2/firestore');
const {initializeApp} = require('firebase-admin/app');
const {getFirestore} = require('firebase-admin/firestore');
const {getMessaging} = require('firebase-admin/messaging');
initializeApp();
const REGION = 'asia-south1';

async function pushToOwner(shopId, title, body) {
  const shop = (await getFirestore().doc(`shops/${shopId}`).get()).data();
  if (!shop || !shop.ownerUid) return;
  const user = (await getFirestore().doc(`users/${shop.ownerUid}`).get()).data() || {};
  const tokens = (user.fcm || []).filter(Boolean);
  if (!tokens.length) return;
  const res = await getMessaging().sendEachForMulticast({
    tokens, notification: {title, body},
    android: {priority: 'high', notification: {channelId: 'orders'}}, data: {go: 'online'}
  });
  const dead = tokens.filter((t, i) => !res.responses[i].success);
  if (dead.length) await getFirestore().doc(`users/${shop.ownerUid}`).update({fcm: tokens.filter(t => !dead.includes(t))});
}

exports.newRequest = onDocumentCreated({document: 'shops/{s}/sessions/{u}', region: REGION}, async e => {
  const d = e.data && e.data.data(); if (!d || d.status !== 'pending') return;
  await pushToOwner(e.params.s, 'Customer waiting', `${d.name || 'A customer'} is asking to order`);
});
exports.againRequest = onDocumentUpdated({document: 'shops/{s}/sessions/{u}', region: REGION}, async e => {
  const b = e.data.before.data(), a = e.data.after.data();
  if (a.status === 'pending' && (b.status !== 'pending' || b.visit !== a.visit)) await pushToOwner(e.params.s, 'Customer waiting', `${a.name || 'A customer'} is asking to order`);
});
exports.newOrder = onDocumentCreated({document: 'shops/{s}/orders/{o}', region: REGION}, async e => {
  const d = e.data && e.data.data(); if (!d) return;
  await pushToOwner(e.params.s, 'New online order', `${d.name || 'Customer'} · ₹${Math.round(d.total || 0).toLocaleString('en-IN')}`);
});
