/**
 * Sales tracking and monthly report
 */

function getSalesHistory() {
  return getStorage(STORAGE_KEYS.SALES_HISTORY, []);
}

function recordSale(items, total) {
  const history = getSalesHistory();
  history.push({
    id: generateId(),
    items: [...items],
    total,
    timestamp: new Date().toISOString()
  });
  setStorage(STORAGE_KEYS.SALES_HISTORY, history);
}

function getMonthlySales() {
  const history = getSalesHistory();
  const byMonth = {};

  history.forEach(sale => {
    const d = new Date(sale.timestamp);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!byMonth[key]) {
      byMonth[key] = { orders: 0, revenue: 0 };
    }
    byMonth[key].orders += 1;
    byMonth[key].revenue += sale.total;
  });

  return Object.entries(byMonth)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([month, data]) => ({ month, ...data }));
}
