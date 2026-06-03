// ===== CHECKOUT PAGE LOGIC =====

// ===== POPULATE ORDER SUMMARY =====
function populateSummary() {
  const cart = getCart();
  const summaryItems = document.getElementById('summaryItems');
  const subtotalEl = document.getElementById('summarySubtotal');
  const taxEl = document.getElementById('summaryTax');
  const totalEl = document.getElementById('summaryTotal');

  if (!summaryItems) return;

  if (cart.length === 0) {
    summaryItems.innerHTML = `
      <div class="summary-empty">
        <p>No items in cart</p>
        <a href="shop.html">Go to Shop →</a>
      </div>
    `;
    return;
  }

  summaryItems.innerHTML = cart.map(item => `
    <div class="summary-item">
      <div class="summary-item-img-wrap">
        <img src="${item.image}" alt="${item.name}" />
        <span class="summary-item-qty">${item.qty}</span>
      </div>
      <div class="summary-item-info">
        <p class="summary-item-name">${item.name}</p>
      </div>
      <span class="summary-item-price">$${(item.price * item.qty).toFixed(2)}</span>
    </div>
  `).join('');

  updateTotals();
}

function updateTotals() {
  const subtotal = getCartTotal();
  const shipping = getShippingCost();
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const subtotalEl = document.getElementById('summarySubtotal');
  const shippingEl = document.getElementById('summaryShipping');
  const taxEl = document.getElementById('summaryTax');
  const totalEl = document.getElementById('summaryTotal');

  if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
  if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Free' : '$' + shipping.toFixed(2);
  if (taxEl) taxEl.textContent = '$' + tax.toFixed(2);
  if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
}

function getShippingCost() {
  const selected = document.querySelector('input[name="shipping"]:checked');
  if (!selected) return 0;
  if (selected.value === 'express') return 12;
  if (selected.value === 'overnight') return 25;
  return 0;
}

function updateShipping() {
  // Highlight selected option
  document.querySelectorAll('.shipping-option').forEach(opt => {
    opt.classList.toggle('selected', opt.querySelector('input').checked);
  });
  updateTotals();
}

// ===== MULTI-STEP FORM NAVIGATION =====
function goToStep(step) {
  // Validate current step before advancing
  if (step === 2) {
    const email = document.getElementById('email');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const address = document.getElementById('address');
    const city = document.getElementById('city');
    const zip = document.getElementById('zip');

    if (!email.value || !firstName.value || !lastName.value || !address.value || !city.value || !zip.value) {
      // Highlight empty fields
      [email, firstName, lastName, address, city, zip].forEach(f => {
        if (!f.value) {
          f.classList.add('input-error');
          f.addEventListener('input', () => f.classList.remove('input-error'), { once: true });
        }
      });
      return;
    }
  }

  // Hide all steps
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.checkout-steps .step').forEach(s => s.classList.remove('active', 'completed'));

  // Show target step
  document.getElementById('formStep' + step).classList.add('active');

  // Update step indicators
  for (let i = 1; i <= 3; i++) {
    const indicator = document.getElementById('step' + i + 'Indicator');
    if (i < step) indicator.classList.add('completed');
    if (i === step) indicator.classList.add('active');
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== CARD NUMBER FORMATTING =====
function formatCardNumber(input) {
  let value = input.value.replace(/\D/g, '');
  value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
  input.value = value.substring(0, 19);
}

function formatExpiry(input) {
  let value = input.value.replace(/\D/g, '');
  if (value.length >= 2) {
    value = value.substring(0, 2) + ' / ' + value.substring(2, 4);
  }
  input.value = value;
}

// ===== PAYMENT METHOD SELECT =====
document.querySelectorAll('.payment-method input').forEach(radio => {
  radio.addEventListener('change', () => {
    document.querySelectorAll('.payment-method').forEach(m => {
      m.classList.toggle('selected', m.querySelector('input').checked);
    });
  });
});

// ===== PROMO CODE =====
function applyPromo() {
  const input = document.getElementById('promoInput');
  const msg = document.getElementById('promoMessage');
  const code = input.value.trim().toUpperCase();

  if (code === 'CARTELA10') {
    msg.textContent = '✓ 10% discount applied!';
    msg.className = 'promo-message promo-success';
    // Apply discount visually
    const totalEl = document.getElementById('summaryTotal');
    const subtotal = getCartTotal();
    const shipping = getShippingCost();
    const discount = subtotal * 0.1;
    const tax = (subtotal - discount) * 0.08;
    const total = subtotal - discount + shipping + tax;
    totalEl.textContent = '$' + total.toFixed(2);
  } else if (code === '') {
    msg.textContent = '';
  } else {
    msg.textContent = '✗ Invalid promo code';
    msg.className = 'promo-message promo-error';
  }
}

// ===== PLACE ORDER =====
function placeOrder() {
  const cardName = document.getElementById('cardName');
  const cardNumber = document.getElementById('cardNumber');
  const cardExpiry = document.getElementById('cardExpiry');
  const cardCvc = document.getElementById('cardCvc');

  if (!cardName.value || !cardNumber.value || !cardExpiry.value || !cardCvc.value) {
    [cardName, cardNumber, cardExpiry, cardCvc].forEach(f => {
      if (!f.value) {
        f.classList.add('input-error');
        f.addEventListener('input', () => f.classList.remove('input-error'), { once: true });
      }
    });
    return;
  }

  // Show loading spinner
  document.getElementById('placeOrderText').style.display = 'none';
  document.getElementById('placeOrderSpinner').style.display = 'block';

  // Store order details for confirmation page
  const order = {
    items: getCart(),
    email: document.getElementById('email')?.value || '',
    shipping: document.querySelector('input[name="shipping"]:checked')?.value || 'standard',
    total: parseFloat(document.getElementById('summaryTotal')?.textContent.replace('$', '') || 0),
    address: `${document.getElementById('firstName')?.value || ''} ${document.getElementById('lastName')?.value || ''}<br>
              ${document.getElementById('address')?.value || ''}<br>
              ${document.getElementById('city')?.value || ''}, ${document.getElementById('state')?.value || ''} ${document.getElementById('zip')?.value || ''}`,
    cardLast4: cardNumber.value.replace(/\s/g, '').slice(-4),
  };
  localStorage.setItem('cartela_order', JSON.stringify(order));

  // Simulate processing delay
  setTimeout(() => {
    window.location.href = 'order-confirmation.html';
  }, 2000);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', populateSummary);
