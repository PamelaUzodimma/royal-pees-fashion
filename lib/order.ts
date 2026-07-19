import { Cart, CartItem } from '@/types';
import { fmt, WA_PHONE } from './format';

export function totalItems(cart: Cart): number {
  return Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
}

export function totalPrice(cart: Cart): number {
  return Object.values(cart).reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
}

/** Deterministic short order ID derived from cart contents + date, same
 *  scheme as the original prototype (djb2-style hash → base36). */
export function generateOrderId(cart: Cart): string {
  const items = Object.values(cart).slice().sort((a, b) =>
    a.productId.localeCompare(b.productId)
  );

  let raw = '';
  for (const item of items) {
    raw += `${item.productId}:${item.size ?? ''}:${item.qty}:${item.price};`;
  }
  raw += `TOTAL:${totalPrice(cart)}`;

  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  const code = Math.abs(hash).toString(36).toUpperCase().slice(0, 6).padStart(6, '0');
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  return `FSH-${datePart}-${code}`;
}

export function buildOrderMessage(cart: Cart, orderId: string): string {
  const grouped: Record<string, CartItem[]> = {};
  for (const item of Object.values(cart)) {
    const key = `${item.category}|||${item.subCategoryName}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  }

  let msg = `👑 *NEW APPAREL REQUEST - ROYAL PEES FASHION*\n`;
  msg += `🔖 Booking ID: *${orderId}*\n`;
  msg += `──────────────────────\n\n`;

  for (const [key, items] of Object.entries(grouped)) {
    const [catName, subName] = key.split('|||');
    msg += `👔 *[${catName} — ${subName}]*\n`;
    for (const item of items) {
      const sizeTag = item.size ? ` (Size: ${item.size})` : '';
      msg += `  • ${item.title}${sizeTag} (Qty: x${item.qty}) = ${fmt(
        item.price * item.qty
      )}\n`;
    }
    msg += `\n`;
  }

  msg += `──────────────────────\n`;
  msg += `💰 *Total Invoice Due: ${fmt(totalPrice(cart))}*\n\n`;
  msg += `Please fulfill deposit to:\nOPAY\n6141019569\nRoyal Pees Fashion House\n\n. Thank you.`;
  return msg;
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(message)}`;
}
