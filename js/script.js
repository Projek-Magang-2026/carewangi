/**
 * CareWangi — Multi-Page Frontend Interactions
 * Clean • Minimal • Accessible
 */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  const backdrop = document.getElementById('navBackdrop');
  const navLinks = document.querySelectorAll('.nav-link');
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  /* ------------------------------------------------------------------------
     1. STICKY NAVBAR
     ------------------------------------------------------------------------ */
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 15) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------------
     2. MULTI-PAGE ACTIVE NAV STATE
     ------------------------------------------------------------------------ */
  const currentPath = window.location.pathname.toLowerCase();
  const currentPage = document.body.getAttribute('data-page') || '';

  navLinks.forEach((link) => {
    const href = link.getAttribute('href').toLowerCase();
    
    // Check match against data-page or filename
    const isHome = (currentPage === 'beranda') && (href === 'index.html' || href === '/' || href === './');
    const isCurrent = isHome || (href.includes(currentPage) && currentPage !== '');

    if (isCurrent) {
      link.classList.add('active');
    } else {
      // If server or explicit class mismatch, harmonize
      if (!href.includes(currentPage) && !isHome) {
        link.classList.remove('active');
      }
    }
  });

  /* ------------------------------------------------------------------------
     3. MOBILE DRAWER NAVIGATION
     ------------------------------------------------------------------------ */
  const setMobileMenu = (open) => {
    if (!menu || !burger) return;
    const isOpen = typeof open === 'boolean' ? open : !menu.classList.contains('open');

    menu.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    burger.setAttribute('aria-label', isOpen ? 'Tutup navigasi menu' : 'Buka navigasi menu');

    if (backdrop) {
      backdrop.classList.toggle('open', isOpen);
      backdrop.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    }

    if (window.innerWidth <= 820) {
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }
  };

  if (burger) {
    burger.addEventListener('click', () => setMobileMenu());
  }

  if (backdrop) {
    backdrop.addEventListener('click', () => setMobileMenu(false));
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (menu && menu.classList.contains('open')) {
        setMobileMenu(false);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu && menu.classList.contains('open')) {
      setMobileMenu(false);
      burger.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) {
      document.body.style.overflow = '';
      if (menu && menu.classList.contains('open')) {
        setMobileMenu(false);
      }
    }
  });

  /* ------------------------------------------------------------------------
     4. FRONTEND CONTACT FORM INTERACTION
     ------------------------------------------------------------------------ */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('fullName');
      const phone = document.getElementById('phone');
      const district = document.getElementById('district');
      const service = document.getElementById('serviceType');
      const message = document.getElementById('message');

      let isValid = true;

      [name, phone, district, service, message].forEach((field) => {
        if (!field || !field.value.trim()) {
          isValid = false;
          field.style.borderColor = '#DC2626';
        } else {
          field.style.borderColor = '';
        }
      });

      if (!isValid) {
        alert('Mohon lengkapi seluruh kolom formulir informasi sebelum mengirimkan pesan.');
        return;
      }

      if (formSuccess) {
        formSuccess.classList.add('is-visible');
        contactForm.reset();
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }
});