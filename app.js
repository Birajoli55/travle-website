/* ===========================
   HIMALAYA QUEST — app.js
   =========================== */

// ── Departures Data ──
const departures = [
  { trek: "Everest Base Camp Trek", img: "everest.png", region: "Everest", depart: "2026-03-15", ret: "2026-03-28", days: 14, diff: "Challenging", diffCls: "diff-hard", group: { cur: 8, max: 12 }, status: "open", price: 1200 },
  { trek: "Annapurna Circuit Trek", img: "annapurna.png", region: "Annapurna", depart: "2026-03-22", ret: "2026-04-08", days: 18, diff: "Moderate", diffCls: "diff-mod", group: { cur: 10, max: 12 }, status: "limited", price: 900 },
  { trek: "Langtang Valley Trek", img: "langtang.png", region: "Langtang", depart: "2026-04-05", ret: "2026-04-14", days: 10, diff: "Easy", diffCls: "diff-easy", group: { cur: 6, max: 12 }, status: "open", price: 650 },
  { trek: "Manaslu Circuit Trek", img: "manaslu.png", region: "Manaslu", depart: "2026-04-10", ret: "2026-04-25", days: 16, diff: "Challenging", diffCls: "diff-hard", group: { cur: 12, max: 12 }, status: "full", price: 1100 },
  { trek: "Everest Base Camp Trek", img: "everest.png", region: "Everest", depart: "2026-05-01", ret: "2026-05-14", days: 14, diff: "Challenging", diffCls: "diff-hard", group: { cur: 4, max: 12 }, status: "open", price: 1200 },
  { trek: "Annapurna Circuit Trek", img: "annapurna.png", region: "Annapurna", depart: "2026-05-10", ret: "2026-05-27", days: 18, diff: "Moderate", diffCls: "diff-mod", group: { cur: 9, max: 12 }, status: "limited", price: 900 },
  { trek: "Langtang Valley Trek", img: "langtang.png", region: "Langtang", depart: "2026-10-04", ret: "2026-10-13", days: 10, diff: "Easy", diffCls: "diff-easy", group: { cur: 3, max: 12 }, status: "open", price: 650 },
  { trek: "Manaslu Circuit Trek", img: "manaslu.png", region: "Manaslu", depart: "2026-10-12", ret: "2026-10-27", days: 16, diff: "Challenging", diffCls: "diff-hard", group: { cur: 7, max: 12 }, status: "open", price: 1100 },
  { trek: "Everest Base Camp Trek", img: "everest.png", region: "Everest", depart: "2026-11-01", ret: "2026-11-14", days: 14, diff: "Challenging", diffCls: "diff-hard", group: { cur: 11, max: 12 }, status: "limited", price: 1200 },
  { trek: "Annapurna Circuit Trek", img: "annapurna.png", region: "Annapurna", depart: "2026-11-08", ret: "2026-11-25", days: 18, diff: "Moderate", diffCls: "diff-mod", group: { cur: 5, max: 12 }, status: "open", price: 900 },
];

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Generate optimized image URL through a lightweight proxy/transform API
function getImageUrl(src, width = 1200) {
  if (!src) return src;
  if (/^(https?:|\/\/|data:)/i.test(src)) return src;
  const clean = src.replace(/^\.\//, '').replace(/^\//, '');
  const encoded = encodeURIComponent(clean);
  return `https://images.weserv.nl/?url=besttreksnepal.com/${encoded}&w=${width}&fit=inside&output=webp&q=80`;
}

function fmtDate(iso) {
  const d = new Date(iso);
  return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
}
function getMonth(iso) { return monthNames[new Date(iso).getMonth()]; }
function statusHtml(s) {
  const map = { open: ['status-open', 'Open'], limited: ['status-limited', 'Limited'], full: ['status-full', 'Sold Out'] };
  const [cls, label] = map[s];
  return `<span class="dep-status ${cls}"><span class="status-dot"></span>${label}</span>`;
}
function diffHtml(label, cls) {
  const map = { 'diff-easy': 'badge-easy', 'diff-mod': 'badge-moderate', 'diff-hard': 'badge-challenging' };
  return `<span class="dep-diff ${map[cls]}">${label}</span>`;
}

function renderDepartures(filter = 'all') {
  const body = document.getElementById('depBody');
  const cards = document.getElementById('depCards');
  if (!body || !cards) return;

  const filtered = filter === 'all' ? departures : departures.filter(d => getMonth(d.depart) === filter);

  // ── Desktop Table Rows ──
  if (filtered.length === 0) {
    body.innerHTML = `<tr class="dep-no-results"><td colspan="9"><i class="fas fa-calendar-times" style="margin-right:8px;color:var(--orange)"></i>No departures found for this month. <a href="#plan">Contact us</a> for a custom date.</td></tr>`;
  } else {
    body.innerHTML = filtered.map(d => {
      const spots = d.group.max - d.group.cur;
      const isDisabled = d.status === 'full' ? 'disabled' : '';
      const btnLabel = d.status === 'full' ? 'Sold Out' : 'Book Now';
      return `
      <tr>
        <td>
          <div class="dep-trek-name">
            <img src="${getImageUrl(d.img, 400)}" alt="${d.trek}" class="dep-trek-img" loading="lazy" decoding="async" />
            <div class="dep-trek-label">
              <span>${d.trek}</span>
              <small>${d.region} Region</small>
            </div>
          </div>
        </td>
        <td>${fmtDate(d.depart)}</td>
        <td>${fmtDate(d.ret)}</td>
        <td>${d.days} Days</td>
        <td>${diffHtml(d.diff, d.diffCls)}</td>
        <td class="dep-group"><strong>${d.group.cur}</strong>/${d.group.max} joined${spots > 0 ? ` &bull; <span style="color:var(--green)">${spots} spots left</span>` : ''}</td>
        <td>${statusHtml(d.status)}</td>
        <td class="dep-price">$${d.price.toLocaleString()}</td>
        <td><a href="${d.status === 'full' ? '#' : 'contact.html'}" class="dep-book-btn ${isDisabled}">${btnLabel}</a></td>
      </tr>`;
    }).join('');
  }

  // ── Mobile Cards ──
  if (filtered.length === 0) {
    cards.innerHTML = `<p style="text-align:center;color:var(--text-muted);padding:32px 0">No departures for this month.</p>`;
  } else {
    cards.innerHTML = filtered.map(d => {
      const isDisabled = d.status === 'full' ? 'disabled' : '';
      const btnLabel = d.status === 'full' ? 'Sold Out' : 'Book Now';
      return `
      <div class="dep-card">
        <div class="dep-card-header">
          <img src="${getImageUrl(d.img, 500)}" alt="${d.trek}" class="dep-card-img" loading="lazy" decoding="async" />
          <div class="dep-card-title">${d.trek}<small>${d.region} Region</small></div>
        </div>
        <div class="dep-card-body">
          <div class="dep-card-row"><span>Departure</span><span>${fmtDate(d.depart)}</span></div>
          <div class="dep-card-row"><span>Return</span><span>${fmtDate(d.ret)}</span></div>
          <div class="dep-card-row"><span>Duration</span><span>${d.days} Days</span></div>
          <div class="dep-card-row"><span>Difficulty</span><span>${diffHtml(d.diff, d.diffCls)}</span></div>
          <div class="dep-card-row"><span>Group</span><span>${d.group.cur}/${d.group.max} joined</span></div>
          <div class="dep-card-row"><span>Status</span><span>${statusHtml(d.status)}</span></div>
        </div>
        <div class="dep-card-footer">
          <span class="dep-card-price">$${d.price.toLocaleString()}</span>
          <a href="${d.status === 'full' ? '#' : 'contact.html'}" class="dep-book-btn ${isDisabled}">${btnLabel}</a>
        </div>
      </div>`;
    }).join('');
  }
}

// Init departures on load & wire up tabs
window.addEventListener('DOMContentLoaded', () => {
  renderDepartures('all');
  document.querySelectorAll('.dep-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.dep-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderDepartures(tab.dataset.month);
    });
  });
});

// ── Trek Data ──
const treks = [
  { name: "Everest Base Camp Trek", region: "everest", days: 14, diff: "challenging", price: 1200, img: "everest.png", badge: "badge-challenging", diffClass: "diff-hard", diffLabel: "Challenging", url: "everest-base-camp.html" },
  { name: "Annapurna Circuit Trek", region: "annapurna", days: 18, diff: "moderate", price: 900, img: "annapurna.png", badge: "badge-moderate", diffClass: "diff-mod", diffLabel: "Moderate", url: "annapurna-circuit.html" },
  { name: "Annapurna Base Camp Trek", region: "annapurna", days: 11, diff: "moderate", price: 850, img: "annapurna.png", badge: "badge-moderate", diffClass: "diff-mod", diffLabel: "Moderate", url: "abc-trek.html" },
  { name: "Langtang Valley Trek", region: "langtang", days: 10, diff: "easy", price: 650, img: "langtang.png", badge: "badge-easy", diffClass: "diff-easy", diffLabel: "Easy", url: "langtang-valley.html" },
  { name: "Manaslu Circuit Trek", region: "manaslu", days: 16, diff: "challenging", price: 1100, img: "manaslu.png", badge: "badge-challenging", diffClass: "diff-hard", diffLabel: "Challenging", url: "manaslu-circuit.html" },
  { name: "Upper Mustang Trek", region: "mustang", days: 14, diff: "moderate", price: 1650, img: "cta.png", badge: "badge-moderate", diffClass: "diff-mod", diffLabel: "Moderate", url: "upper-mustang-trek.html" },
];

function buildCard(trek) {
  return `
    <div class="trek-card fade-in">
      <div class="trek-img-wrap">
        <img src="${getImageUrl(trek.img, 900)}" alt="${trek.name}" class="trek-img" loading="lazy" decoding="async" />
        <div class="trek-badge ${trek.badge}">${trek.diffLabel}</div>
        <div class="trek-overlay"><a href="${trek.url}" class="btn-view">View Details <i class="fas fa-arrow-right"></i></a></div>
      </div>
      <div class="trek-body">
        <h3 class="trek-name">${trek.name}</h3>
        <div class="trek-meta">
          <span><i class="fas fa-clock"></i> ${trek.days} Days</span>
          <span><i class="fas fa-map-marker-alt"></i> ${trek.region.charAt(0).toUpperCase() + trek.region.slice(1)} Region</span>
        </div>
        <div class="trek-diff ${trek.diffClass}"><i class="fas fa-signal"></i> ${trek.diffLabel}</div>
        <div class="trek-footer">
          <div class="trek-price">From <strong>$${trek.price.toLocaleString()}</strong></div>
          <a href="${trek.url}" class="btn-sm">View Details</a>
        </div>
      </div>
    </div>`;
}

// ── Sticky Navbar ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── Hamburger + Mobile Menu ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile menu on any link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
  });
});

// Close mobile menu on outside click / escape
document.addEventListener('click', e => {
  if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
  }
});

// ── Animate Statistic Counters (About Page) ──
const stats = document.querySelectorAll('.stat-number');
if (stats.length > 0) {
  const statObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const finalContent = el.getAttribute('data-target');

        // Only run if not already animated
        if (!el.classList.contains('counted')) {
          el.classList.add('counted');
          // If it's a pure number, animate it
          if (!isNaN(finalContent)) {
            const target = parseInt(finalContent);
            let count = 0;
            const duration = 2000;
            const increment = target / (duration / 16);
            const counter = setInterval(() => {
              count += increment;
              if (count >= target) {
                el.innerText = target;
                clearInterval(counter);
              } else {
                el.innerText = Math.floor(count);
              }
            }, 16);
          }
        }
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(s => statObserver.observe(s));
}

// ── Filter Logic ──
const applyBtn = document.getElementById('applyFilter');
const resultsEl = document.getElementById('filterResults');

function applyFilters() {
  const region = document.getElementById('fRegion').value;
  const days = document.getElementById('fDays').value;
  const diff = document.getElementById('fDiff').value;
  const price = document.getElementById('fPrice').value;

  const results = treks.filter(t => {
    if (region !== 'all' && t.region !== region) return false;
    if (diff !== 'all' && t.diff !== diff) return false;
    if (price !== 'all' && t.price >= parseInt(price)) return false;
    if (days === 'short' && t.days >= 12) return false;
    if (days === 'medium' && (t.days < 12 || t.days > 15)) return false;
    if (days === 'long' && t.days < 16) return false;
    return true;
  });

  if (results.length === 0) {
    resultsEl.innerHTML = '<p class="no-results"><i class="fas fa-search"></i> No treks match your criteria. Try adjusting the filters.</p>';
  } else {
    resultsEl.innerHTML = results.map(buildCard).join('');
    observeFadeIns();
  }
}

if (applyBtn) {
  applyBtn.addEventListener('click', applyFilters);
  // Populate on load
  window.addEventListener('DOMContentLoaded', applyFilters);
}

// ── Hero Search ──
const sBtn = document.querySelector('.search-btn');
const sInput = document.getElementById('heroSearch');
if (sBtn && sInput) {
  sBtn.addEventListener('click', () => {
    const val = sInput.value.trim().toLowerCase();
    if (!val) return;
    const section = document.getElementById('treks');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  });
  sInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') sBtn.click();
  });
}

// ── Intersection Observer for Fade-in ──
function observeFadeIns() {
  const els = document.querySelectorAll('.fade-in:not(.visible)');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

window.addEventListener('DOMContentLoaded', () => {
  // Add fade-in to cards and sections
  document.querySelectorAll(
    '.trek-card, .dest-card, .why-card, .review-card, .blog-card, .section-header'
  ).forEach(el => el.classList.add('fade-in'));
  observeFadeIns();
});

// ── Accordions (Itinerary & Simple FAQ) ──
function initAccordions() {
  // Itinerary Accordion
  document.querySelectorAll('.iti-header').forEach(header => {
    // Remove existing listener to prevent double-toggle if script is re-run
    const newHeader = header.cloneNode(true);
    header.parentNode.replaceChild(newHeader, header);

    newHeader.addEventListener('click', () => {
      const item = newHeader.parentElement;
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.iti-item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // Basic FAQ Toggle (for simpler FAQ sections)
  document.querySelectorAll('.faq-question').forEach(question => {
    // If it's part of the complex FAQ logic handled below, skip it
    if (question.closest('.faq-item')) return;

    const newQuestion = question.cloneNode(true);
    question.parentNode.replaceChild(newQuestion, question);

    newQuestion.addEventListener('click', () => {
      const item = newQuestion.parentElement;
      item.classList.toggle('active');
    });
  });
}

// Run on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccordions);
} else {
  initAccordions();
}

// ── Counter Animation for Hero Stats ──
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target + suffix; clearInterval(timer); return; }
    el.textContent = start + suffix;
  }, 20);
}

const statsObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = document.querySelectorAll('.stat-num');
      animateCounter(nums[0], 500, '+');
      animateCounter(nums[1], 98, '%');
      animateCounter(nums[2], 15, '+');
      statsObs.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObs.observe(heroStats);

// ── FAQ Accordion Logic ──
document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      // Support both 'active' and 'open' classes for compatibility
      const isActive = item.classList.contains('active') || item.classList.contains('open');

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active', 'open');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.classList.remove('active', 'open');
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active', 'open');
        const answer = item.querySelector('.faq-answer');
        if (answer) answer.classList.remove('active', 'open');
      } else {
        item.classList.add('active'); // Use active as default
        const answer = item.querySelector('.faq-answer');
        if (answer) answer.classList.add('active');
      }
    });
  });
});

// ── Webhook Form Submission ──
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.querySelector('.contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // Set loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjcwNTZmMDYzMzA0MzQ1MjZjNTUzMzUxMzUi_pc', {
        method: 'POST',
        body: JSON.stringify(data)
      });

      if (response.ok) {
        // Show success message
        contactForm.innerHTML = `
          <div class="form-success" style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 3rem; color: var(--green); margin-bottom: 20px;">
              <i class="fas fa-check-circle"></i>
            </div>
            <h3>Message Sent Successfully!</h3>
            <p>Thank you for reaching out. Our trekking experts will get back to you within 24 hours.</p>
            <button onclick="window.location.reload()" class="btn-primary" style="margin-top: 20px; border:none; cursor:pointer;">Send Another Message</button>
          </div>
        `;
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
      alert('Sorry, there was an error sending your message. Please try again or contact us directly at info@besttreksnepal.com');
    }
  });
});

