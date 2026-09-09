/* ============================================================
   FurnRent — Global JavaScript (main.js)
   ============================================================ */

// ── Theme Toggle ──────────────────────────────────────────────
const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
const savedTheme = localStorage.getItem('furnrent-theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcons(savedTheme);

function updateThemeIcons(theme) {
  themeToggleBtns.forEach(btn => {
    const icon = btn.querySelector('i');
    if (icon) {
      icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  });
}
themeToggleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('furnrent-theme', next);
    updateThemeIcons(next);
  });
});

// ── Sticky Header ────────────────────────────────────────────
const header = document.querySelector('.site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── Mobile Nav ───────────────────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const mobileNavPanel = document.querySelector('.mobile-nav-panel');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobileNav.addEventListener('click', (e) => {
    if (!mobileNavPanel.contains(e.target)) {
      closeMobileNav();
    }
  });
}
function closeMobileNav() {
  mobileNav && mobileNav.classList.remove('open');
  hamburger && hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

// ── User Account Dropdown ────────────────────────────────────
document.addEventListener('click', (e) => {
  const userBtn = e.target.closest('.user-dropdown-wrap .user-btn');
  const allDropdowns = document.querySelectorAll('.user-dropdown-menu');
  const allUserBtns = document.querySelectorAll('.user-dropdown-wrap .user-btn');

  if (userBtn) {
    e.stopPropagation();
    const wrap = userBtn.closest('.user-dropdown-wrap');
    const menu = wrap ? wrap.querySelector('.user-dropdown-menu') : null;
    const isCurrentlyOpen = menu && menu.classList.contains('open');

    // Close any other open dropdowns
    allDropdowns.forEach(d => d.classList.remove('open'));
    allUserBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-expanded', 'false');
    });

    if (menu && !isCurrentlyOpen) {
      menu.classList.add('open');
      userBtn.classList.add('active');
      userBtn.setAttribute('aria-expanded', 'true');
    }
  } else if (!e.target.closest('.user-dropdown-menu')) {
    // Clicked outside dropdown
    allDropdowns.forEach(d => d.classList.remove('open'));
    allUserBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-expanded', 'false');
    });
  }
});

// ── Active Nav Link ──────────────────────────────────────────
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ── Search Overlay ───────────────────────────────────────────
const searchOverlay = document.querySelector('.search-overlay');
const searchBtns = document.querySelectorAll('.search-btn');
const searchClose = document.querySelector('.search-close');

searchBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    searchOverlay && searchOverlay.classList.add('open');
    setTimeout(() => searchOverlay && searchOverlay.querySelector('input').focus(), 100);
  });
});
searchClose && searchClose.addEventListener('click', () => {
  searchOverlay && searchOverlay.classList.remove('open');
});
searchOverlay && searchOverlay.addEventListener('click', (e) => {
  if (!searchOverlay.querySelector('.search-box').contains(e.target)) {
    searchOverlay.classList.remove('open');
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    searchOverlay && searchOverlay.classList.remove('open');
    closeMobileNav();
  }
});

// ── Cart State ───────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('furnrent-cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('furnrent-wishlist') || '[]');

function updateCartBadge() {
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.textContent = cart.length;
    badge.style.display = cart.length ? 'flex' : 'none';
  });
}
updateCartBadge();

function addToCart(item) {
  const existing = cart.find(c => c.id === item.id);
  if (!existing) {
    cart.push(item);
    localStorage.setItem('furnrent-cart', JSON.stringify(cart));
    updateCartBadge();
    renderCartDrawer();
    showToast(`${item.name} added to cart!`, 'success');
  } else {
    showToast(`${item.name} already in cart`, 'warning');
  }
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  localStorage.setItem('furnrent-cart', JSON.stringify(cart));
  updateCartBadge();
  renderCartDrawer();
}

function renderCartDrawer() {
  const body = document.querySelector('.cart-body');
  const totalEl = document.querySelector('.cart-total-amount');
  if (!body) return;
  if (cart.length === 0) {
    body.innerHTML = '<div class="cart-empty"><p style="font-size:1.1rem;font-weight:600;margin-bottom:6px;color:var(--dark)">Your cart is empty</p><p style="font-size:.875rem;color:var(--gray-500)">Browse our furniture collection to add items</p></div>';
  } else {
    body.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img class="cart-item-img" src="${item.img || 'images/sofa_navy.jpg'}" alt="${item.name}">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-sub">${item.duration || '1 Month'} Rental</div>
          <div class="cart-item-price">₹${item.price}/mo</div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart('${item.id}')"><i class="fas fa-times"></i></button>
      </div>
    `).join('');
  }
  const total = cart.reduce((s, i) => s + i.price, 0);
  if (totalEl) totalEl.textContent = `₹${total}`;
}

// ── Cart Drawer ───────────────────────────────────────────────
const cartDrawer = document.querySelector('.cart-drawer');
const cartOverlay = document.querySelector('.cart-overlay');
document.querySelectorAll('.cart-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    closeMobileNav();
    cartDrawer && cartDrawer.classList.add('open');
    cartOverlay && cartOverlay.classList.add('open');
    renderCartDrawer();
  });
});
cartOverlay && cartOverlay.addEventListener('click', () => {
  cartDrawer && cartDrawer.classList.remove('open');
  cartOverlay && cartOverlay.classList.remove('open');
});
document.querySelector('.cart-drawer-close') && document.querySelector('.cart-drawer-close').addEventListener('click', () => {
  cartDrawer && cartDrawer.classList.remove('open');
  cartOverlay && cartOverlay.classList.remove('open');
});

// ── Wishlist ──────────────────────────────────────────────────
function toggleWishlist(id, name, btn) {
  const idx = wishlist.indexOf(id);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    btn && btn.classList.remove('active');
    showToast(`Removed from wishlist`, 'warning');
  } else {
    wishlist.push(id);
    btn && btn.classList.add('active');
    showToast(`${name} added to wishlist!`, 'success');
  }
  localStorage.setItem('furnrent-wishlist', JSON.stringify(wishlist));
}
function initWishlistBtns() {
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    const id = btn.dataset.id;
    if (wishlist.includes(id)) btn.classList.add('active');
    btn.addEventListener('click', () => {
      toggleWishlist(id, btn.dataset.name || 'Item', btn);
    });
  });
}
initWishlistBtns();

// ── Login Simulation ──────────────────────────────────────────
const loginUser = JSON.parse(localStorage.getItem('furnrent-user') || 'null');
function updateLoginUI() {
  const loginBtns = document.querySelectorAll('.login-btn');
  const logoutBtns = document.querySelectorAll('.logout-btn');
  const userGreet = document.querySelectorAll('.user-greet');
  if (loginUser) {
    loginBtns.forEach(b => b.style.display = 'none');
    logoutBtns.forEach(b => b.style.display = 'flex');
    userGreet.forEach(el => el.textContent = `Hi, ${loginUser.name.split(' ')[0]}`);
  } else {
    loginBtns.forEach(b => b.style.display = 'flex');
    logoutBtns.forEach(b => b.style.display = 'none');
  }
}
updateLoginUI();
document.querySelectorAll('.logout-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    localStorage.removeItem('furnrent-user');
    location.reload();
  });
});

// ── Toast ─────────────────────────────────────────────────────
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-circle', info: 'fa-info-circle' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${icons[type] || icons.info} toast-icon"></i><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-out');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// ── FAQ Accordion ─────────────────────────────────────────────
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  question && question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ── Scroll To Top ─────────────────────────────────────────────
const scrollTopBtn = document.querySelector('.scroll-top-btn');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Smooth Scroll for Anchor Links ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeMobileNav();
    }
  });
});

// ── Newsletter ────────────────────────────────────────────────
document.querySelectorAll('.newsletter-form').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('.newsletter-input');
    if (input && input.value.includes('@')) {
      showToast('You have subscribed successfully!', 'success');
      input.value = '';
    } else {
      showToast('Please enter a valid email address', 'error');
    }
  });
});

// ── Animated Counter ──────────────────────────────────────────
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    const suffix = counter.dataset.suffix || '';
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      counter.textContent = Math.floor(current).toLocaleString() + suffix;
    }, 25);
  });
}
const statsSection = document.querySelector('.stats-grid');
if (statsSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { animateCounters(); observer.disconnect(); } });
  }, { threshold: 0.3 });
  observer.observe(statsSection);
}

// ── Rent Now buttons (general) ────────────────────────────────
document.querySelectorAll('.product-rent-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.product-card');
    if (!card) return;
    const id = card.dataset.id || Math.random().toString(36).slice(2);
    const name = card.querySelector('h3')?.textContent || 'Furniture';
    const price = parseInt(card.dataset.price || 0);
    const img = card.querySelector('img')?.src || '';
    addToCart({ id, name, price, img, duration: '1 Month' });
  });
});

// ── Infinity Testimonial Slider ───────────────────────────────
function initInfinitySlider() {
  const slides = document.querySelectorAll('.infinity-slide');
  const dots = document.querySelectorAll('.infinity-dot');
  const prevBtn = document.getElementById('infinityPrev');
  const nextBtn = document.getElementById('infinityNext');
  if (!slides.length) return;

  let currentSlide = 0;
  let autoTimer = null;

  function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoTimer = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 6000);
  }

  function stopAutoPlay() {
    if (autoTimer) clearInterval(autoTimer);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentSlide - 1);
      startAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(currentSlide + 1);
      startAutoPlay();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.slide);
      showSlide(idx);
      startAutoPlay();
    });
  });

  const sliderBox = document.querySelector('.infinity-testimonial-box');
  if (sliderBox) {
    sliderBox.addEventListener('mouseenter', stopAutoPlay);
    sliderBox.addEventListener('mouseleave', startAutoPlay);
  }

  startAutoPlay();
}
initInfinitySlider();

// ── Account Dropdown Menu ─────────────────────────────────────
function initAccountDropdown() {
  const accountBtns = document.querySelectorAll('#accountMenuBtn, .account-btn');
  const accountDropdown = document.getElementById('accountDropdown');
  const accountWrap = document.querySelector('.account-dropdown-wrap');

  if (!accountDropdown) return;

  accountBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isShowing = accountDropdown.classList.toggle('show');
      btn.setAttribute('aria-expanded', isShowing ? 'true' : 'false');
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (accountWrap && !accountWrap.contains(e.target)) {
      accountDropdown.classList.remove('show');
      accountBtns.forEach(b => b.setAttribute('aria-expanded', 'false'));
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      accountDropdown.classList.remove('show');
      accountBtns.forEach(b => b.setAttribute('aria-expanded', 'false'));
    }
  });

  // Check logged in user state
  const currentUser = JSON.parse(localStorage.getItem('furnrent-user') || 'null');
  const userNameEl = accountDropdown.querySelector('.acc-user-name');
  const userEmailEl = accountDropdown.querySelector('.acc-user-email');
  const userAvatarEl = accountDropdown.querySelector('.acc-avatar');

  if (currentUser && userNameEl && userEmailEl) {
    userNameEl.textContent = currentUser.name || 'Aryan Reddy';
    userEmailEl.textContent = currentUser.role === 'admin' ? 'Administrator' : (currentUser.email || 'aryan@furnrent.in');
    if (userAvatarEl) {
      userAvatarEl.textContent = (currentUser.name || 'AR').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }
  }
}

// ── RTL / LTR Direction Toggle ─────────────────────────────────
function initRTLToggle() {
  const rtlBtns = document.querySelectorAll('.rtl-toggle-btn, #rtlToggleBtn');
  const savedDir = localStorage.getItem('furnrent_direction') || 'ltr';

  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem('furnrent_direction', dir);
    rtlBtns.forEach(btn => {
      if (dir === 'rtl') {
        btn.classList.add('active');
        btn.setAttribute('title', 'Switch to LTR Direction');
        btn.setAttribute('aria-label', 'Switch to LTR Direction');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('title', 'Switch to RTL Direction');
        btn.setAttribute('aria-label', 'Switch to RTL Direction');
      }
    });
  }

  if (savedDir === 'rtl') {
    applyDirection('rtl');
  }

  rtlBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      applyDirection(newDir);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initAccountDropdown();
    initRTLToggle();
  });
} else {
  initAccountDropdown();
  initRTLToggle();
}

// Universal Logout Handler
function handleLogout() {
  localStorage.removeItem('furnrent-user');
  if (window.showToast) {
    window.showToast('Logged out successfully', 'info');
  }
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 350);
}
