/**
 * localStorage helpers for restaurant app
 */

const STORAGE_KEYS = {
  MENU_ITEMS: 'menuItems',
  CURRENT_CART: 'currentCart',
  SALES_HISTORY: 'salesHistory',
  PAYMENT_CONFIG: 'paymentConfig'  // { qrImageBase64 }
};

function getStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Storage read error:', e);
    return defaultValue;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error('Storage write error:', e);
    return false;
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/** Data URI placeholder (works without server/network) */
function getPlaceholderImage(text, w, h) {
  var t = encodeURIComponent((text || '').substring(0, 12));
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='" + (w||180) + "' height='" + (h||120) + "'%3E%3Crect fill='%23e8e4df' width='100%25' height='100%25'/%3E%3Ctext fill='%23888' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='12' font-family='sans-serif'%3E" + t + "%3C/text%3E%3C/svg%3E";
}
