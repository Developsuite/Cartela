// ===== SHARED CART MODULE =====
// Manages cart state in localStorage across all pages

const CART_KEY = 'cartela_cart';

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartUI();
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  showCartNotification(product.name);
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
}

function updateCartQty(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(productId);
      return;
    }
  }
  saveCart(cart);
}

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

// ===== CART UI =====
function updateCartUI() {
  // Update badge count
  const badge = document.getElementById('cartCount');
  if (badge) {
    const count = getCartCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }

  // Update cart sidebar items
  const cartItemsEl = document.getElementById('cartItems');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartFooter = document.getElementById('cartFooter');
  const cart = getCart();

  if (cartItemsEl) {
    if (cart.length === 0) {
      if (cartEmpty) cartEmpty.style.display = 'flex';
      if (cartFooter) cartFooter.style.display = 'none';
      // Remove all item elements
      cartItemsEl.querySelectorAll('.cart-item').forEach(el => el.remove());
    } else {
      if (cartEmpty) cartEmpty.style.display = 'none';
      if (cartFooter) cartFooter.style.display = 'block';

      // Rebuild items
      const existingItems = cartItemsEl.querySelectorAll('.cart-item');
      existingItems.forEach(el => el.remove());

      cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
          <div class="cart-item-info">
            <p class="cart-item-name">${item.name}</p>
            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            <div class="cart-item-qty">
              <button onclick="updateCartQty('${item.id}', -1)" aria-label="Decrease">−</button>
              <span>${item.qty}</span>
              <button onclick="updateCartQty('${item.id}', 1)" aria-label="Increase">+</button>
            </div>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" aria-label="Remove">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        `;
        cartItemsEl.appendChild(div);
      });
    }
  }

  // Update subtotal
  const subtotalEl = document.getElementById('cartSubtotal');
  if (subtotalEl) {
    subtotalEl.textContent = '$' + getCartTotal().toFixed(2);
  }
}

// ===== CART SIDEBAR TOGGLE =====
function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  if (!sidebar) return;

  const isOpen = sidebar.classList.contains('open');
  if (isOpen) {
    sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  } else {
    sidebar.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

// ===== NOTIFICATION TOAST =====
function showCartNotification(name) {
  // Remove existing
  const existing = document.querySelector('.cart-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'cart-toast';
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d5a3d" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    <span>${name} added to cart</span>
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', updateCartUI);
