/**
 * Main app - initialization and event handlers
 */

(function () {
  const menuGrid = document.getElementById('menu-grid');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const cartEmpty = document.getElementById('cart-empty');
  const cartContainer = document.querySelector('.cart-container');
  const menuForm = document.getElementById('menu-form');
  const menuTableBody = document.getElementById('menu-table-body');
  const salesReport = document.getElementById('sales-report');
  const payModal = document.getElementById('pay-modal');
  const qrContainer = document.getElementById('qr-container');
  const payAmountDisplay = document.getElementById('pay-amount-display');
  const printBillEl = document.getElementById('print-bill');

  // Payment config - QR image from gallery
  function getPaymentConfig() {
    return getStorage(STORAGE_KEYS.PAYMENT_CONFIG, { qrImageBase64: '' });
  }

  function savePaymentConfig(config) {
    setStorage(STORAGE_KEYS.PAYMENT_CONFIG, config);
  }

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');

      if (btn.dataset.tab === 'menu') renderMenu();
      if (btn.dataset.tab === 'cart') renderCart();
      if (btn.dataset.tab === 'manage') renderManageMenu();
      if (btn.dataset.tab === 'sales') renderSalesReport();
    });
  });

  // Render menu grid
  function renderMenu() {
    const items = getMenuItems();
    menuGrid.innerHTML = items.map(item => `
      <div class="menu-card" data-id="${item.id}">
        <img class="menu-card-image" src="${item.imageBase64 || getPlaceholderImage(item.name)}" alt="${item.name}">
        <div class="menu-card-body">
          <div class="menu-card-name">${escapeHtml(item.name)}</div>
          <div class="menu-card-price">₹${item.price}</div>
          <button type="button" class="menu-card-btn">Add to cart</button>
        </div>
      </div>
    `).join('');

  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Render cart
  function renderCart() {
    const cart = getCart();
    if (cart.length === 0) {
      cartContainer.classList.remove('visible');
      cartEmpty.classList.add('visible');
      return;
    }
    cartEmpty.classList.remove('visible');
    cartContainer.classList.add('visible');

    cartItems.innerHTML = cart.map(c => `
      <div class="cart-item">
        <span class="cart-item-name">${escapeHtml(c.name)}</span>
        <span class="cart-item-qty">×${c.qty}</span>
        <span class="cart-item-total">₹${(c.price * c.qty).toFixed(2)}</span>
      </div>
    `).join('');

    const total = getCartTotal(cart);
    cartTotal.textContent = '₹' + total.toFixed(2);
  }

  // Clear cart
  document.getElementById('btn-clear-cart').addEventListener('click', () => {
    clearCart();
    renderCart();
  });

  // Print bill
  document.getElementById('btn-print-bill').addEventListener('click', () => {
    const cart = getCart();
    if (cart.length === 0) return;
    const total = getCartTotal(cart);

    printBillEl.innerHTML = `
      <div class="print-bill-content">
        <h2>South Indian Restaurant</h2>
        ${cart.map(c => `
          <div class="bill-line">
            <span>${escapeHtml(c.name)} × ${c.qty}</span>
            <span>₹${(c.price * c.qty).toFixed(2)}</span>
          </div>
        `).join('')}
        <div class="bill-line bill-total">
          <span>Total</span>
          <span>₹${total.toFixed(2)}</span>
        </div>
        <div class="bill-date">${new Date().toLocaleString()}</div>
      </div>
    `;
    printBillEl.classList.add('print-visible');
    window.print();
    printBillEl.classList.remove('print-visible');
  });

  // Pay Now modal - show uploaded QR image from gallery
  function openPayModal() {
    const cart = getCart();
    if (cart.length === 0) return;
    const total = getCartTotal(cart);
    payAmountDisplay.textContent = '₹' + total.toFixed(2);

    const qrImg = document.getElementById('qr-image');
    const qrFallback = document.getElementById('qr-fallback');
    const config = getPaymentConfig();

    qrImg.style.display = 'none';
    qrFallback.style.display = 'none';

    if (config.qrImageBase64) {
      qrImg.src = config.qrImageBase64;
      qrImg.style.display = 'block';
      qrImg.alt = 'Payment QR - Long press to save';
    } else {
      qrFallback.textContent = 'Upload QR code in Manage Menu (Payment QR Code).';
      qrFallback.style.display = 'block';
    }

    payModal.classList.add('visible');
  }

  document.getElementById('btn-pay-now').addEventListener('click', openPayModal);

  document.querySelector('.modal-close').addEventListener('click', () => {
    payModal.classList.remove('visible');
  });

  window.addEventListener('click', (e) => {
    if (e.target === payModal) payModal.classList.remove('visible');
  });

  document.getElementById('btn-confirm-pay').addEventListener('click', () => {
    const cart = getCart();
    const total = getCartTotal(cart);
    recordSale(cart, total);
    clearCart();
    renderCart();
    payModal.classList.remove('visible');
  });

  // Manage Menu - form
  let editingId = null;

  menuForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('item-name').value.trim();
    const price = parseFloat(document.getElementById('item-price').value);
    const category = document.getElementById('item-category').value;
    const imageBase64 = document.getElementById('item-image').dataset.currentBase64 || null;

    if (!name) {
      alert('Please enter item name.');
      return;
    }
    if (isNaN(price) || price < 0) {
      alert('Please enter a valid price.');
      return;
    }

    if (editingId) {
      updateMenuItem(editingId, { name, price, category, imageBase64 });
      editingId = null;
      document.getElementById('form-title').textContent = 'Add Menu Item';
    } else {
      addMenuItem({ name, price, category, imageBase64 });
    }

    menuForm.reset();
    document.getElementById('item-image').dataset.currentBase64 = '';
    document.getElementById('image-preview').innerHTML = '';
    renderManageMenu();
    renderMenu();
  });

  document.getElementById('btn-cancel-edit').addEventListener('click', () => {
    editingId = null;
    menuForm.reset();
    document.getElementById('form-title').textContent = 'Add Menu Item';
    document.getElementById('image-preview').innerHTML = '';
    document.getElementById('item-image').dataset.currentBase64 = '';
  });

  // Image upload
  document.getElementById('item-image').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      let data = reader.result;
      if (data.length > 100000) {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const max = 400;
          let w = img.width, h = img.height;
          if (w > max || h > max) {
            if (w > h) { h = (h / w) * max; w = max; }
            else { w = (w / h) * max; h = max; }
          }
          canvas.width = w;
          canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          data = canvas.toDataURL('image/jpeg', 0.7);
          document.getElementById('item-image').dataset.currentBase64 = data;
          document.getElementById('image-preview').innerHTML = `<img src="${data}" alt="Preview">`;
        };
        img.src = reader.result;
      } else {
        document.getElementById('item-image').dataset.currentBase64 = data;
        document.getElementById('image-preview').innerHTML = `<img src="${data}" alt="Preview">`;
      }
    };
    reader.readAsDataURL(file);
  });

  // Render manage menu table
  function renderManageMenu() {
    const items = getMenuItems();
    menuTableBody.innerHTML = items.map(item => `
      <tr>
        <td><img src="${item.imageBase64 || getPlaceholderImage(item.name, 48, 48)}" alt=""></td>
        <td>${escapeHtml(item.name)}</td>
        <td>₹${item.price}</td>
        <td>${item.category}</td>
        <td class="actions">
          <button type="button" class="btn btn-sm btn-primary edit-btn" data-id="${item.id}">Edit</button>
          <button type="button" class="btn btn-sm btn-danger delete-btn" data-id="${item.id}">Delete</button>
        </td>
      </tr>
    `).join('');

    menuTableBody.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const item = getMenuItemById(btn.dataset.id);
        editingId = item.id;
        document.getElementById('form-title').textContent = 'Edit Menu Item';
        document.getElementById('item-id').value = item.id;
        document.getElementById('item-name').value = item.name;
        document.getElementById('item-price').value = item.price;
        document.getElementById('item-category').value = item.category;
        if (item.imageBase64) {
          document.getElementById('item-image').dataset.currentBase64 = item.imageBase64;
          document.getElementById('image-preview').innerHTML = `<img src="${item.imageBase64}" alt="Preview">`;
        } else {
          document.getElementById('item-image').dataset.currentBase64 = '';
          document.getElementById('image-preview').innerHTML = '';
        }
      });
    });

    menuTableBody.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Delete this item?')) {
          deleteMenuItem(btn.dataset.id);
          renderManageMenu();
          renderMenu();
        }
      });
    });
  }

  // QR image upload from gallery
  const qrUpload = document.getElementById('qr-upload');
  const qrPreview = document.getElementById('qr-preview');
  var savedQr = getPaymentConfig().qrImageBase64 || '';
  if (savedQr) {
    qrPreview.innerHTML = '<img src="' + savedQr + '" alt="QR preview" class="qr-preview-img">';
  }
  qrUpload.addEventListener('change', function (e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      var data = reader.result;
      if (data.length > 150000) {
        var img = new Image();
        img.onload = function () {
          var canvas = document.createElement('canvas');
          var max = 400;
          var w = img.width, h = img.height;
          if (w > max || h > max) {
            if (w > h) { h = (h / w) * max; w = max; } else { w = (w / h) * max; h = max; }
          }
          canvas.width = w;
          canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          data = canvas.toDataURL('image/jpeg', 0.8);
          saveQrImage(data);
        };
        img.src = reader.result;
      } else {
        saveQrImage(data);
      }
    };
    reader.readAsDataURL(file);
    qrUpload.value = '';
  });
  function saveQrImage(data) {
    savedQr = data;
    savePaymentConfig({ qrImageBase64: data });
    qrPreview.innerHTML = '<img src="' + data + '" alt="QR preview" class="qr-preview-img">';
  }

  // Sales report
  function renderSalesReport() {
    const monthly = getMonthlySales();
    if (monthly.length === 0) {
      salesReport.innerHTML = '<p>No sales data yet.</p>';
      return;
    }

    const totalOrders = monthly.reduce((s, m) => s + m.orders, 0);
    const totalRevenue = monthly.reduce((s, m) => s + m.revenue, 0);

    salesReport.innerHTML = `
      <table class="sales-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Orders</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          ${monthly.map(m => `
            <tr>
              <td>${m.month}</td>
              <td>${m.orders}</td>
              <td>₹${m.revenue.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="sales-summary">
        Total: ${totalOrders} orders | ₹${totalRevenue.toFixed(2)} revenue
      </div>
    `;
  }

  // Add to cart on card or button click
  menuGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.menu-card');
    if (!card) return;
    const item = getMenuItemById(card.dataset.id);
    if (item) {
      addToCart(item);
      renderCart();
    }
  });

  // Initial render
  renderMenu();
  renderCart();
  renderManageMenu();
  renderSalesReport();
})();
