/* ============================================
   AESTHETICS CLINIC — SHARED JS
============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Sticky header shadow ----
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---- Mobile nav toggle ----
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      const spans = toggle.querySelectorAll('span');
      if (open) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
    // Close on nav link click
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      toggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }));
  }

  // ---- Accordion ----
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.accordion-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // ---- Lazy load images ----
  const lazyImgs = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const img = e.target;
          img.src = img.dataset.src;
          if (img.dataset.srcset) img.srcset = img.dataset.srcset;
          img.removeAttribute('data-src');
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });
    lazyImgs.forEach(img => io.observe(img));
  } else {
    lazyImgs.forEach(img => { img.src = img.dataset.src; });
  }

  // ---- Mark active nav ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 68;
        window.scrollTo({ top: target.offsetTop - offset - 16, behavior: 'smooth' });
      }
    });
  });
  window.addEventListener('load', () => {
  if (window.location.hash) {
    const el = document.querySelector(window.location.hash);
    if (el) {
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--header-h')) || 0;

      const y = el.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
});

  // ---- Simple entrance animations ----
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.animate').forEach(el => el.classList.add('visible'));
  }
});

/* ---- Animation styles injected ---- */
const animStyle = document.createElement('style');
animStyle.textContent = `
  .animate { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease, transform 0.5s ease; }
  .animate.visible { opacity: 1; transform: none; }
  .animate:nth-child(2) { transition-delay: 0.08s; }
  .animate:nth-child(3) { transition-delay: 0.16s; }
  .animate:nth-child(4) { transition-delay: 0.24s; }
  .animate:nth-child(5) { transition-delay: 0.32s; }
  .animate:nth-child(6) { transition-delay: 0.40s; }
`;
document.head.appendChild(animStyle);


/* ---- Shared header/footer inject utility ---- */
function buildHeader(activePage) {
  const wa = 'https://wa.me/911234567890?text=Hi%2C%20I%27d%20like%20to%20book%20a%20consultation';
  return `
  <header class="site-header" role="banner">
    <div class="container header-inner">
      <a href="index.html" class="logo" aria-label="Clinic home">
        <div class="logo-icon" aria-hidden="true">✦</div>
        <span>AS Luxe</span>
      </a>
      <nav class="nav-links" aria-label="Main navigation">
        <a href="index.html" ${activePage==='home'?'class="active"':''}>Home</a>
        <a href="services.html" ${activePage==='services'?'class="active"':''}>Treatments</a>
        <a href="booking.html" ${activePage==='booking'?'class="active"':''}>Consultation</a>
        <a href="/index.html#doctors">Doctors</a>
        <a href="#contact">Contact</a>
      </nav>
      <div class="header-actions">
        <a href="${wa}" class="btn btn-secondary btn-sm" target="_blank" rel="noopener" aria-label="WhatsApp us">
          💬 WhatsApp
        </a>
        <a href="booking.html" class="btn btn-primary btn-sm">Consultation</a>
      </div>
      <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
  <nav class="mobile-nav" aria-label="Mobile navigation">
    <a href="index.html">🏠 Home</a>
    <a href="services.html">💆 Treatments</a>
    <a href="booking.html">📅 Consultation</a>
    <a href="index.html#doctors">👩‍⚕️ Our Doctors</a>
    <a href="index.html#contact">📍 Contact</a>
    <a href="${wa}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-full mt-4">💬 WhatsApp Us</a>
  </nav>`;
}

function buildFooter() {
  return `
  <footer class="site-footer" id="contact" role="contentinfo">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="logo">
            <div class="logo-icon" aria-hidden="true">✦</div>
            <span>AS luxe</span>
          </div>
          <p>Your trusted destination for advanced aesthetics and skin wellness. Backed by science, delivered with care.</p>
          <div class="social-links mt-6">
            <a href="#" class="social-link" aria-label="Instagram">📷</a>
            <a href="#" class="social-link" aria-label="Facebook">📘</a>
            <a href="#" class="social-link" aria-label="YouTube">▶️</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Treatments</h4>
          <ul>
            <li><a href="services.html">Acne & Skin</a></li>
            <li><a href="services.html">Hair & Scalp</a></li>
            <li><a href="services.html">Anti-Ageing</a></li>
            <li><a href="services.html">Body Contouring</a></li>
            <li><a href="services.html">View All →</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="booking.html">Book Appointment</a></li>
            <li><a href="index.html#about">About Us</a></li>
            <li><a href="index.html#doctors">Our Doctors</a></li>
            <li><a href="index.html#testimonials">Reviews</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <div class="footer-contact-item">
            <span class="fi">📍</span>
            <span>12, Wellness Avenue, Koregaon Park, Pune – 411001</span>
          </div>
          <div class="footer-contact-item">
            <span class="fi">📞</span>
            <a href="tel:+911234567890">+91 12345 67890</a>
          </div>
          <div class="footer-contact-item">
            <span class="fi">✉️</span>
            <a href="mailto:hello@glowcare.in">hello@glowcare.in</a>
          </div>
          <div class="footer-contact-item">
            <span class="fi">🕐</span>
            <span>Mon–Sat: 9 AM – 8 PM</span>
          </div>
        </div>
      </div>
      <div class="map-embed" style="margin-bottom:40px;">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3703.0543940533817!2d84.0061661!3d21.8554375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDUxJzE5LjYiTiA4NMKwMDAnMjIuMiJF!5e0!3m2!1sen!2sin!4v1234567890"
          allowfullscreen="" loading="lazy" title="Clinic location map"
          referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
      <div class="footer-bottom">
        <span>© 2025 AS luxe. All rights reserved.</span>
        <span>Designed with ♥ for your skin</span>
      </div>
    </div>
  </footer>`;
}