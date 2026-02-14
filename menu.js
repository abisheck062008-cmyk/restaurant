/**
 * Menu data and CRUD operations
 */

const DEFAULT_MENU = [
  { name: 'Idly', price: 40, category: 'Food' },
  { name: 'Pongal', price: 50, category: 'Food' },
  { name: 'Poori', price: 45, category: 'Food' },
  { name: 'Paniyaram', price: 35, category: 'Food' },
  { name: 'Dosai', price: 55, category: 'Food' },
  { name: 'Vada', price: 30, category: 'Food' },
  { name: 'Cotton seed milk', price: 25, category: 'Beverage' }
];

function getMenuItems() {
  let items = getStorage(STORAGE_KEYS.MENU_ITEMS, []);
  if (items.length === 0) {
    items = DEFAULT_MENU.map((m, i) => ({
      id: generateId(),
      ...m,
      imageBase64: null
    }));
    setStorage(STORAGE_KEYS.MENU_ITEMS, items);
  }
  return items;
}

function saveMenuItems(items) {
  return setStorage(STORAGE_KEYS.MENU_ITEMS, items);
}

function addMenuItem(item) {
  const items = getMenuItems();
  const newItem = {
    id: generateId(),
    name: item.name,
    price: parseFloat(item.price),
    category: item.category || 'Food',
    imageBase64: item.imageBase64 || null
  };
  items.push(newItem);
  saveMenuItems(items);
  return newItem;
}

function updateMenuItem(id, updates) {
  const items = getMenuItems();
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...updates };
  saveMenuItems(items);
  return items[idx];
}

function deleteMenuItem(id) {
  const items = getMenuItems().filter(i => i.id !== id);
  return saveMenuItems(items);
}

function getMenuItemById(id) {
  return getMenuItems().find(i => i.id === id);
}
