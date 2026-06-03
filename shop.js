// ===== SHOP PAGE PRODUCT DATA =====
const allProducts = [
  { id: 'p1', name: 'Camel Wool Overcoat', price: 285, image: 'images/product-coat.png', category: 'fall-collection', tag: 'new' },
  { id: 'p2', name: 'Signature Leather Gloves', price: 95, image: 'images/product-gloves.png', category: 'accessories', tag: 'new' },
  { id: 'p3', name: 'Merino Turtleneck', price: 145, image: 'images/product-turtleneck.png', category: 'the-essentials', tag: 'new' },
  { id: 'p4', name: 'Harmon Wide-Leg Trousers', price: 165, image: 'images/product-trousers.png', category: 'fall-collection', tag: '' },
  { id: 'p5', name: 'Selka Canvas Tote Bag', price: 120, image: 'images/product-crossbody.png', category: 'accessories', tag: '' },
  { id: 'p6', name: 'Linen Draping Trousers', price: 135, image: 'images/sale-outfit.png', category: 'the-essentials', tag: '' },
  { id: 'p7', name: 'Cotton Relaxed Crew Hoodie', price: 110, image: 'images/product-hoodie.png', category: 'knitwear', tag: 'new' },
  { id: 'p8', name: 'Vela Satin Slip Dress', price: 195, image: 'images/collection-dress.png', category: 'fall-collection', tag: '' },
  { id: 'p9', name: 'Satin Ensemble', price: 245, image: 'images/collection-knitwear.png', category: 'knitwear', tag: '' },
  { id: 'p10', name: 'Vernazza Leather Slides', price: 115, image: 'images/collection-sandals.png', category: 'accessories', tag: 'sale', originalPrice: 145 },
  { id: 'p11', name: 'Trace String Jogger', price: 85, image: 'images/sale-casual.png', category: 'the-essentials', tag: 'sale', originalPrice: 120 },
  { id: 'p12', name: 'Canvas Tote', price: 95, image: 'images/sale-bag.png', category: 'accessories', tag: 'sale', originalPrice: 145 },
  { id: 'p13', name: 'Slim Leather Belt', price: 65, image: 'images/product-belt.png', category: 'accessories', tag: '' },
];

let filteredProducts = [...allProducts];
let currentSort = 'default';

// ===== RENDER PRODUCTS =====
function renderProducts(products) {
  const grid = document.getElementById('shopGrid');
  grid.innerHTML = '';

  if (products.length === 0) {
    grid.innerHTML = `
      <div class="shop-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <p>No products found</p>
        <span>Try adjusting your filters</span>
      </div>
    `;
    return;
  }

  products.forEach((product, index) => {
    const card = document.createElement('div');
    card.className = 'product-card shop-product-card';
    card.style.animationDelay = `${index * 0.05}s`;

    let priceHTML = `<span class="product-price">$${product.price.toFixed(2)}</span>`;
    if (product.originalPrice) {
      priceHTML = `<span class="product-price"><span class="original-price">$${product.originalPrice.toFixed(2)}</span> $${product.price.toFixed(2)}</span>`;
    }

    let badgeHTML = '';
    if (product.tag === 'new') {
      badgeHTML = '<span class="shop-badge shop-badge-new">New</span>';
    } else if (product.tag === 'sale') {
      badgeHTML = '<span class="shop-badge shop-badge-sale">Sale</span>';
    }

    card.innerHTML = `
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        ${badgeHTML}
        <div class="product-quick-view" onclick="addToCart({id:'${product.id}',name:'${product.name}',price:${product.price},image:'${product.image}'})">Add to Cart</div>
      </div>
      <div class="product-info">
        <p class="product-name">${product.name}</p>
        ${priceHTML}
      </div>
    `;

    grid.appendChild(card);
  });

  // Stagger animation
  const cards = grid.querySelectorAll('.shop-product-card');
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 60);
  });
}

// ===== FILTER PRODUCTS =====
function filterProducts() {
  const checkboxes = document.querySelectorAll('.filter-checkbox input:checked');
  const selectedCategories = [];
  const selectedTags = [];
  let showAll = false;

  checkboxes.forEach(cb => {
    if (cb.value === 'all') showAll = true;
    else if (cb.value === 'new' || cb.value === 'sale') selectedTags.push(cb.value);
    else selectedCategories.push(cb.value);
  });

  if (showAll || (selectedCategories.length === 0 && selectedTags.length === 0)) {
    filteredProducts = [...allProducts];
  } else {
    filteredProducts = allProducts.filter(p => {
      const catMatch = selectedCategories.length === 0 || selectedCategories.includes(p.category);
      const tagMatch = selectedTags.length === 0 || selectedTags.includes(p.tag);
      return catMatch && tagMatch;
    });
  }

  // Apply current sort
  sortProducts(currentSort, false);
}

// ===== SORT PRODUCTS =====
function sortProducts(value, render = true) {
  currentSort = value;
  if (value === 'low-high') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (value === 'high-low') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else {
    // Default order — reset to original index order
    const idOrder = allProducts.map(p => p.id);
    filteredProducts.sort((a, b) => idOrder.indexOf(a.id) - idOrder.indexOf(b.id));
  }
  if (render !== false) renderProducts(filteredProducts);
  else renderProducts(filteredProducts);
}

// ===== SEARCH =====
const shopSearch = document.getElementById('shopSearch');
if (shopSearch) {
  shopSearch.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (q === '') {
      filterProducts();
      return;
    }
    const results = allProducts.filter(p =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
    renderProducts(results);
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderProducts(allProducts);
});
