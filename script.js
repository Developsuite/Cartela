// ===== HEADER SCROLL EFFECT =====
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ===== SCROLL ANIMATIONS (Intersection Observer) =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});

// ===== SMOOTH PARALLAX ON HERO =====
const hero = document.querySelector('.hero-image');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  if (scrolled < window.innerHeight) {
    hero.style.transform = `translateY(${scrolled * 0.15}px) scale(1)`;
  }
});

// ===== NEWSLETTER FORM =====
const newsletterForm = document.getElementById('newsletterForm');
const footerNewsletterForm = document.getElementById('footerNewsletterForm');

function handleNewsletterSubmit(e) {
  e.preventDefault();
  const emailInput = e.target.querySelector('input[type="email"]');
  const btn = e.target.querySelector('button');
  const originalText = btn.textContent;

  btn.textContent = 'Subscribed ✓';
  btn.style.background = '#2d5a3d';
  btn.style.color = 'white';
  emailInput.value = '';

  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
    btn.style.color = '';
  }, 3000);
}

newsletterForm.addEventListener('submit', handleNewsletterSubmit);
footerNewsletterForm.addEventListener('submit', handleNewsletterSubmit);

// ===== PRODUCT CARD STAGGER ANIMATION =====
const productCards = document.querySelectorAll('.product-card, .sale-card, .collection-card');

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, index * 100);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

productCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  cardObserver.observe(card);
});

// ===== MOBILE MENU TOGGLE =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
  navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
  if (navLinks.style.display === 'flex') {
    navLinks.style.position = 'fixed';
    navLinks.style.top = '70px';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.flexDirection = 'column';
    navLinks.style.background = 'white';
    navLinks.style.padding = '30px';
    navLinks.style.gap = '20px';
    navLinks.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
    navLinks.style.animation = 'slideDown 0.3s ease';
    navLinks.style.zIndex = '999';
  }
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      navLinks.style.display = 'none';
    }
  });
});

// ===== CURSOR CUSTOM HOVER EFFECT FOR PRODUCT IMAGES =====
document.querySelectorAll('.product-image-wrap, .collection-card, .sale-image-wrap').forEach(el => {
  el.addEventListener('mouseenter', () => {
    el.style.cursor = 'pointer';
  });
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId && targetId !== '#') {
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

console.log('Cartela — Fashion Portfolio loaded');
