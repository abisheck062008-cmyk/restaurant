/**
 * Cart and billing logic
 */

function getCart() {
  return getStorage(STORAGE_KEYS.CURRENT_CART, []);
}

function saveCart(cart) {
  return setStorage(STORAGE_KEYS.CURRENT_CART, cart);
}

function addToCart(item) {
  const cart = getCart();
  const existing = cart.find(c => c.itemId === item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      itemId: item.id,
      name: item.name,
      price: item.price,
      qty: 1
    });
  }
  saveCart(cart);
  return cart;
}

function clearCart() {
  saveCart([]);
}

function getCartTotal(cart) {
  return (cart || getCart()).reduce((sum, c) => sum + c.price * c.qty, 0);
}
