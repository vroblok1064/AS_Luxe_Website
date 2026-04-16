/* ============================================
   AESTHETICS CLINIC — SHARED JS
============================================ */

document.addEventListener("DOMContentLoaded", () => {
  // ---- Sticky header shadow ----
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () =>
      header.classList.toggle("scrolled", window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ---- Mobile nav toggle ----
  const toggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
      const spans = toggle.querySelectorAll("span");
      if (open) {
        spans[0].style.transform = "translateY(7px) rotate(45deg)";
        spans[1].style.opacity = "0";
        spans[2].style.transform = "translateY(-7px) rotate(-45deg)";
      } else {
        spans.forEach((s) => {
          s.style.transform = "";
          s.style.opacity = "";
        });
      }
    });
    // Close on nav link click
    mobileNav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        mobileNav.classList.remove("open");
        toggle.setAttribute("aria-expanded", false);
        toggle.querySelectorAll("span").forEach((s) => {
          s.style.transform = "";
          s.style.opacity = "";
        });
      })
    );
  }

  // ---- Accordion ----
  document.querySelectorAll(".accordion-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".accordion-item");
      const wasOpen = item.classList.contains("open");
      document
        .querySelectorAll(".accordion-item.open")
        .forEach((i) => i.classList.remove("open"));
      if (!wasOpen) item.classList.add("open");
    });
  });

  // ---- Lazy load images ----
  const lazyImgs = document.querySelectorAll("img[data-src]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const img = e.target;
            img.src = img.dataset.src;
            if (img.dataset.srcset) img.srcset = img.dataset.srcset;
            img.removeAttribute("data-src");
            obs.unobserve(img);
          }
        });
      },
      { rootMargin: "200px" }
    );
    lazyImgs.forEach((img) => io.observe(img));
  } else {
    lazyImgs.forEach((img) => {
      img.src = img.dataset.src;
    });
  }

  // ---- Mark active nav ----
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-nav a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (window.location.pathname.includes("index.html")) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offset =
            parseInt(
              getComputedStyle(document.documentElement).getPropertyValue(
                "--header-h"
              )
            ) || 68;
          window.scrollTo({
            top: target.offsetTop - offset - 16,
            behavior: "smooth",
          });
        }
      }
    });
  });

  window.addEventListener("load", () => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) {
        const offset =
          parseInt(
            getComputedStyle(document.documentElement).getPropertyValue(
              "--header-h"
            )
          ) || 0;
        const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }

    // ---- Simple entrance animations ----
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("visible");
              observer.unobserve(e.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      document.querySelectorAll(".animate").forEach((el) => observer.observe(el));
    } else {
      document
        .querySelectorAll(".animate")
        .forEach((el) => el.classList.add("visible"));
    }
  });
});

/* ---- Animation styles injected ---- */
const animStyle = document.createElement("style");
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
  const wa =
    "https://wa.me/919178085396?text=Hi%2C%20I%27d%20like%20to%20book%20a%20consultation";
  return `
  <header class="site-header" role="banner">
    <div class="container header-inner">
      <a href="index.html" class="logo" aria-label="Clinic home">
        <div class="logo-icon" aria-hidden="true">✦</div>
        <span>AS Luxe</span>
      </a>
      <nav class="nav-links" aria-label="Main navigation">
        <a href="index.html" ${activePage === "home" ? 'class="active"' : ""}>Home</a>
        <a href="services.html" ${activePage === "services" ? 'class="active"' : ""}>Treatments</a>
        <a href="booking.html" ${activePage === "booking" ? 'class="active"' : ""}>Bookings</a>
        <a href="index.html#doctors">Doctors</a>
        <a href="index.html#contact">Contact</a>
      </nav>
      <div class="header-actions">
        <a href="${wa}" class="btn btn-secondary btn-sm" target="_blank" rel="noopener" aria-label="WhatsApp us">
          💬 WhatsApp
        </a>
        <a href="booking.html" class="btn btn-primary btn-sm">Bookings</a>
      </div>
      <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
  <nav class="mobile-nav" aria-label="Mobile navigation">
    <a href="index.html">🏠 Home</a>
    <a href="services.html">💆 Treatments</a>
    <a href="booking.html">📅 Bookings</a>
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
            <a href="https://www.instagram.com/as_lux_clinic" class="social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><img src="https://cdn.simpleicons.org/instagram/ffffff" width="20" height="20" alt="Instagram"></a>
            <a href="https://www.youtube.com/@ShibalikaDash" class="social-link" aria-label="YouTube" target="_blank" rel="noopener noreferrer"><img src="https://cdn.simpleicons.org/youtube/ffffff" width="20" height="20" alt="YouTube"></a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Treatments</h4>
          <ul>
            <li><a href="services.html#face">Acne &amp; Skin</a></li>
            <li><a href="services.html#hair">Hair &amp; Scalp</a></li>
            <li><a href="services.html">Anti-Ageing</a></li>
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
            <span>AS Aesthetics &amp; Wellness Centre, 2nd Floor, MedicaZone Polyclinic, Kali Mandir Road, near HP Petrol Pump, Jharsuguda, Odisha – 768202</span>
          </div>
          <div class="footer-contact-item">
            <span class="fi">📞</span>
            <a href="tel:+919178085396">+91 91780-85396</a>
          </div>
          <div class="footer-contact-item">
            <span class="fi">✉️</span>
            <a href="mailto:shibalikadash16@gmail.com">shibalikadash16@gmail.com</a>
          </div>
          <div class="footer-contact-item">
            <span class="fi">🕐</span>
            <span>Mon–Sat: 10 AM – 8 PM</span>
          </div>
        </div>
      </div>
      <div style="margin: 0 0 32px; height:160px; overflow:hidden; border-radius:12px;">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3703.0543945716076!2d84.00359117535643!3d21.855437480008973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a20e7d455e29115%3A0x35a236a3a41c1463!2sAS%20aesthetic%20and%20wellness%20centre(skin%20hair%20laser)!5e0!3m2!1sen!2sin!4v1776314684617!5m2!1sen!2sin"
          width="100%" height="160" style="border:0; display:block;"
          allowfullscreen="" loading="lazy"
          title="AS Aesthetics &amp; Wellness Centre location"
          referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
      <div class="footer-bottom">
        <span>© 2025 AS luxe. All rights reserved.</span>
        <span class="dev-credit-wrap">
          Designed by
          <button class="dev-pill" id="devPill" aria-expanded="false" aria-haspopup="dialog">
            Jyotiraj Tripathy 🧑‍💻
          </button>
          <div class="dev-card" id="devCard" role="dialog" aria-label="Developer info" hidden>
            <div class="dev-card-name">Jyotiraj Tripathy</div>
            <div class="dev-card-bio">Business student @IIM-B · Web designer · Freelancer</div>
            <div class="dev-card-contacts">
              <div class="dev-contact-row">
                <span>📧</span>
                <a href="mailto:jyotiraj.tripathy25@iimb.ac.in">jyotiraj.tripathy25@iimb.ac.in</a>
                <button class="dev-copy" data-copy="jyotiraj.tripathy25@iimb.ac.in" aria-label="Copy email">copy</button>
              </div>
              <div class="dev-contact-row">
                <span>📱</span>
                <span>+91-96686-60630</span>
                <button class="dev-copy" data-copy="+91-96686-60630" aria-label="Copy phone">copy</button>
              </div>
            </div>
            <div class="dev-card-links">
              <a href="https://www.linkedin.com/in/jyotirajtripathy/" target="_blank" rel="noopener" class="dev-link">LinkedIn</a>
              <a href="https://www.instagram.com/fantaaddict.16/" target="_blank" rel="noopener" class="dev-link">Instagram</a>
              <a href="https://vroblok1064.github.io/JyotirajTripathy_WebDev_Assignment/" target="_blank" rel="noopener" class="dev-link">Portfolio</a>
            </div>
            <a href="mailto:jyotiraj.tripathy25@iimb.ac.in?subject=Hiring%20Inquiry&body=Hi%2C%20I%27d%20like%20to%20discuss%20a%20web%20project%20with%20you." class="dev-hire">✉ Hire Me</a>
          </div>
        </span>
      </div>
    </div>
  </footer>`;
}

/* ---- Dev credit pill styles ---- */
(function () {
  const s = document.createElement("style");
  s.textContent = `
    .dev-credit-wrap {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .dev-pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 12px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.2);
      background: rgba(255,255,255,0.07);
      color: inherit;
      font-size: 0.8rem;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s;
      white-space: nowrap;
    }
    .dev-pill:hover {
      background: rgba(255,255,255,0.14);
      border-color: rgba(255,255,255,0.35);
    }

    .dev-card {
      position: absolute;
      bottom: calc(100% + 10px);
      right: 0;
      width: 270px;
      background: rgba(10, 30, 15, 0.55);
      backdrop-filter: blur(18px) saturate(1.6);
      -webkit-backdrop-filter: blur(18px) saturate(1.6);
      border: 1px solid rgba(255,255,255,0.13);
      border-radius: 16px;
      padding: 18px 18px 14px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.35);
      color: #e8f0e9;
      z-index: 9999;
      transform-origin: bottom right;
      transform: scale(0.92) translateY(8px);
      opacity: 0;
      transition: opacity 0.2s ease, transform 0.2s ease;
      pointer-events: none;
    }
    .dev-card:not([hidden]) {
      opacity: 1;
      transform: scale(1) translateY(0);
      pointer-events: auto;
    }
    .dev-card[hidden] {
      display: block !important;
      opacity: 0;
      pointer-events: none;
    }

    .dev-card-name {
      font-size: 1rem;
      font-weight: 600;
      color: #fff;
      margin-bottom: 2px;
    }
    .dev-card-bio {
      font-size: 0.75rem;
      color: rgba(255,255,255,0.6);
      margin-bottom: 14px;
      line-height: 1.4;
    }
    .dev-card-contacts {
      display: flex;
      flex-direction: column;
      gap: 7px;
      margin-bottom: 14px;
    }
    .dev-contact-row {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 0.78rem;
    }
    .dev-contact-row a {
      color: #a8d5b0;
      text-decoration: none;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .dev-contact-row a:hover { text-decoration: underline; }

    .dev-copy {
      font-size: 0.68rem;
      padding: 2px 7px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.2);
      background: rgba(255,255,255,0.08);
      color: rgba(255,255,255,0.65);
      cursor: pointer;
      transition: background 0.15s;
      white-space: nowrap;
    }
    .dev-copy:hover { background: rgba(255,255,255,0.18); }
    .dev-copy.copied { color: #6fcf8a; border-color: #6fcf8a; }

    .dev-card-links {
      display: flex;
      gap: 8px;
      margin-bottom: 14px;
      flex-wrap: wrap;
    }
    .dev-link {
      font-size: 0.73rem;
      padding: 3px 10px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.18);
      background: rgba(255,255,255,0.07);
      color: #c8e6cb;
      text-decoration: none;
      transition: background 0.15s;
    }
    .dev-link:hover { background: rgba(255,255,255,0.16); }

    .dev-hire {
      display: block;
      text-align: center;
      padding: 8px;
      border-radius: 8px;
      background: #2d8a4e;
      color: #fff;
      font-size: 0.82rem;
      font-weight: 600;
      text-decoration: none;
      transition: background 0.18s;
    }
    .dev-hire:hover { background: #1e6e3a; }
  `;
  document.head.appendChild(s);

  document.addEventListener("DOMContentLoaded", () => {
    const pill = document.getElementById("devPill");
    const card = document.getElementById("devCard");
    if (!pill || !card) return;

    pill.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = card.hasAttribute("hidden");
      if (open) {
        card.removeAttribute("hidden");
        pill.setAttribute("aria-expanded", "true");
        pill.textContent = pill.textContent.replace("▾", "▴");
      } else {
        card.setAttribute("hidden", "");
        pill.setAttribute("aria-expanded", "false");
        pill.textContent = pill.textContent.replace("▴", "▾");
      }
    });

    document.addEventListener("click", (e) => {
      if (!card.hasAttribute("hidden") && !card.contains(e.target) && e.target !== pill) {
        card.setAttribute("hidden", "");
        pill.setAttribute("aria-expanded", "false");
        pill.textContent = pill.textContent.replace("▴", "▾");
      }
    });

    window.addEventListener("scroll", () => {
      if (!card.hasAttribute("hidden")) {
        card.setAttribute("hidden", "");
        pill.setAttribute("aria-expanded", "false");
        pill.textContent = pill.textContent.replace("▴", "▾");
      }
    }, { passive: true });

    card.querySelectorAll(".dev-copy").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(btn.dataset.copy).then(() => {
          btn.textContent = "✓";
          btn.classList.add("copied");
          setTimeout(() => {
            btn.textContent = "copy";
            btn.classList.remove("copied");
          }, 1800);
        });
      });
    });
  });
})();
