// Hero video — only fetched on viewports wide enough to actually show it,
// so phones never download an 18MB file they can't see (it's display:none there).
const heroVideo = document.querySelector('.hero-card__video');
if (heroVideo && window.matchMedia('(min-width: 701px)').matches) {
  const src = heroVideo.dataset.src;
  if (src) {
    heroVideo.src = src;
    heroVideo.load();
    heroVideo.play().catch(() => {});
  }
}

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    siteNav.classList.toggle('is-open');
  });
  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => siteNav.classList.remove('is-open'));
  });
}

// GSAP scroll animations
if (window.gsap) {
  gsap.registerPlugin(ScrollTrigger);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion) {
    gsap.utils.toArray('[data-reveal]').forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 24,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    });

    gsap.utils.toArray('[data-reveal-stagger]').forEach((group) => {
      const items = group.children;
      gsap.from(items, {
        opacity: 0,
        y: 20,
        duration: 0.4,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: { trigger: group, start: 'top 85%' },
      });
    });

    // Parallax — hero background
    gsap.utils.toArray('[data-parallax]').forEach((el) => {
      gsap.fromTo(el, { yPercent: -8 }, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      });
    });

    // Parallax — inline photography
    gsap.utils.toArray('[data-parallax-img]').forEach((container) => {
      const img = container.querySelector('img') || container;
      gsap.fromTo(img, { yPercent: -8 }, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: container, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      });
    });

    // Card icon micro-interaction
    gsap.utils.toArray('.card').forEach((card) => {
      const icon = card.querySelector('.card__icon');
      if (!icon) return;
      card.addEventListener('mouseenter', () => {
        gsap.to(icon, { scale: 1.12, rotate: 6, duration: 0.35, ease: 'back.out(2)' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(icon, { scale: 1, rotate: 0, duration: 0.3, ease: 'power2.out' });
      });
    });

    // Magnetic-style hover for primary buttons
    gsap.utils.toArray('.btn--primary, .btn--outline').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.18, y: y * 0.35, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
      });
    });

    // Hero entrance (plays immediately on load, not scroll-gated)
    const heroContent = document.querySelector('.hero-card__content');
    if (heroContent) {
      gsap.from(heroContent.children, {
        opacity: 0,
        y: 28,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        delay: 0.1,
      });
    }

    // Process line draw-in
    gsap.utils.toArray('[data-process-path]').forEach((line) => {
      gsap.fromTo(line, { scaleX: 0 }, {
        scaleX: 1,
        transformOrigin: 'left center',
        duration: 1,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: line.closest('.process-row'), start: 'top 75%' },
      });
    });

    // Stat count-up
    gsap.utils.toArray('[data-count-to]').forEach((el) => {
      const target = parseFloat(el.dataset.countTo);
      const counter = { value: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(counter, {
            value: target,
            duration: 1.2,
            ease: 'power2.out',
            onUpdate: () => { el.textContent = Math.round(counter.value); },
          });
        },
      });
    });
  }
}

// Tab pills (About Us)
document.querySelectorAll('.tab-pills').forEach((group) => {
  const panelsWrap = group.nextElementSibling;
  group.querySelectorAll('.tab-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      group.querySelectorAll('.tab-pill').forEach((b) => {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
      const panels = panelsWrap.querySelectorAll('.tab-panel');
      panels.forEach((panel) => {
        const isTarget = panel.dataset.panel === target;
        if (isTarget && window.gsap) {
          panel.classList.add('is-active');
          gsap.fromTo(panel, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
        } else if (isTarget) {
          panel.classList.add('is-active');
        } else {
          panel.classList.remove('is-active');
        }
      });
    });
  });
});

// Carousel prev/next
document.querySelectorAll('.carousel-wrap').forEach((wrap) => {
  const track = wrap.querySelector('.carousel');
  const prev = wrap.querySelector('[data-carousel-prev]');
  const next = wrap.querySelector('[data-carousel-next]');
  if (!track) return;
  const scrollByCard = (dir) => {
    const card = track.querySelector('.carousel-card');
    const gap = 20;
    const amount = card ? card.getBoundingClientRect().width + gap : 300;
    track.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };
  if (prev) prev.addEventListener('click', () => scrollByCard(-1));
  if (next) next.addEventListener('click', () => scrollByCard(1));
});

// Contact form: validates, then opens a pre-filled email to the business.
// This site has no backend yet, so a real "submitted to our server" message would be
// false. Opening a mailto: with the enquiry pre-filled is the honest version of
// "send this to us" until a proper form handler (e.g. a Cloudflare Pages Function) is wired up.
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    contactForm.querySelectorAll('[required]').forEach((field) => {
      const wrapper = field.closest('.form-field');
      const isEmpty = !field.value.trim();
      wrapper.classList.toggle('has-error', isEmpty);
      if (isEmpty) valid = false;
    });
    if (!valid) return;

    const name = contactForm.querySelector('#name').value.trim();
    const phone = contactForm.querySelector('#phone').value.trim();
    const email = contactForm.querySelector('#email').value.trim();
    const inquiryType = contactForm.querySelector('#inquiry-type');
    const inquiryLabel = inquiryType.options[inquiryType.selectedIndex]?.text || 'General';
    const message = contactForm.querySelector('#message').value.trim();

    const subject = `${inquiryLabel} enquiry — ${name}`;
    const body = [
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      `Enquiry type: ${inquiryLabel}`,
      '',
      message,
    ].join('\n');

    const mailtoUrl = `mailto:info@ppfagri.co.za?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const status = document.querySelector('#form-status');
    if (status) {
      status.textContent = 'Opening your email app with the enquiry filled in — just hit send.';
    }
    window.location.href = mailtoUrl;
  });

  contactForm.querySelectorAll('[required]').forEach((field) => {
    field.addEventListener('input', () => {
      field.closest('.form-field').classList.remove('has-error');
    });
  });
}

/* ---------------------------------------------------------------
   Map embed
   The map sits far down some pages (the homepage is ~9000px tall),
   so waiting until it scrolls near the viewport left it visibly still
   loading by the time a visitor arrived. An iframe loads on its own
   thread and doesn't block the rest of the page, so instead we kick
   it off right away and let it use however long the visitor spends
   scrolling as head start — it fades in over the shimmer placeholder
   whenever it finishes, which in practice is long before they reach it.
--------------------------------------------------------------- */
const mapEmbeds = document.querySelectorAll('[data-map]');

mapEmbeds.forEach((wrap) => {
  const frame = wrap.querySelector('.map-frame');
  if (!frame || frame.src) return;
  frame.addEventListener('load', () => wrap.classList.add('is-loaded'), { once: true });
  frame.src = frame.dataset.mapSrc;
});
