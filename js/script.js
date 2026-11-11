/**
 * CareWangi — Interaksi Frontend
 * Navbar, menu mobile, animasi masuk halus, dan antarmuka formulir kontak.
 * Catatan: formulir kontak belum terhubung ke backend/pengiriman apa pun.
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
     1. NAVBAR: garis pemisah saat halaman digulir
     ------------------------------------------------------------------------ */
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------------
     2. STATUS AKTIF NAVIGASI (berdasarkan data-page)
     ------------------------------------------------------------------------ */
  const currentPage = document.body.getAttribute('data-page') || '';
  navLinks.forEach((link) => {
    const href = (link.getAttribute('href') || '').toLowerCase();
    const isHome = currentPage === 'beranda' && href === 'index.html';
    const isCurrent = isHome || (currentPage !== '' && currentPage !== 'beranda' && href.includes(currentPage));
    link.classList.toggle('active', isCurrent);
    if (isCurrent) link.setAttribute('aria-current', 'page');
  });

  /* ------------------------------------------------------------------------
     3. MENU MOBILE
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

  if (burger) burger.addEventListener('click', () => setMobileMenu());
  if (backdrop) backdrop.addEventListener('click', () => setMobileMenu(false));

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (menu && menu.classList.contains('open')) setMobileMenu(false);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu && menu.classList.contains('open')) {
      setMobileMenu(false);
      if (burger) burger.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) {
      document.body.style.overflow = '';
      if (menu && menu.classList.contains('open')) setMobileMenu(false);
    }
  });

  /* ------------------------------------------------------------------------
     4. ANIMASI MASUK SECTION (subtle, via IntersectionObserver)
     ------------------------------------------------------------------------ */
  const revealItems = document.querySelectorAll('.reveal');
  if (revealItems.length) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      revealItems.forEach((el) => observer.observe(el));
    } else {
      revealItems.forEach((el) => el.classList.add('is-in'));
    }
  }

  /* ------------------------------------------------------------------------
     5. FORMULIR KONTAK (antarmuka frontend saja — tidak mengirim data)
     ------------------------------------------------------------------------ */
  if (contactForm) {
    const fields = ['fullName', 'phone', 'district', 'serviceType', 'message']
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const showFeedback = (type, text) => {
      if (!formSuccess) return;
      formSuccess.className = 'form-feedback is-visible ' + type;
      formSuccess.textContent = text;
    };

    fields.forEach((field) => {
      field.addEventListener('input', () => field.classList.remove('is-invalid'));
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let firstInvalid = null;
      fields.forEach((field) => {
        const empty = !field.value.trim();
        field.classList.toggle('is-invalid', empty);
        if (empty && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        showFeedback('error', 'Mohon lengkapi seluruh kolom yang ditandai sebelum melanjutkan.');
        firstInvalid.focus();
        return;
      }

      showFeedback(
        'success',
        'Formulir lengkap, tetapi belum terhubung ke sistem pengiriman sehingga pesan Anda belum terkirim. Silakan hubungi CareWangi melalui kanal kontak resmi setelah tersedia.'
      );
    });
  }

  /* ------------------------------------------------------------------------
     6. TAHUN HAK CIPTA DINAMIS DI FOOTER
     ------------------------------------------------------------------------ */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  /* ------------------------------------------------------------------------
     7. FLOATING WHATSAPP BUTTON (Konfigurasi & Pengelolaan Tautan)
     ------------------------------------------------------------------------ */
  // Konfigurasi WhatsApp Resmi CareWangi:
  // Masukkan nomor WhatsApp resmi CareWangi (format: '628xxxxxxxxxx') di sini saat nomor telah aktif.
  // Jika nomor belum tersedia, jangan mengarang nomor. Tautan default akan mengarahkan ke wa.me dengan pesan siap kirim.
  const CAREWANGI_WA = {
    phoneNumber: '', // Masukkan nomor resmi saat tersedia (contoh: '6281234567890')
    defaultMessage: 'Halo CareWangi, saya ingin mengetahui informasi mengenai layanan kunjungan dokter dan perawat ke rumah.'
  };

  const waButtons = document.querySelectorAll('.floating-wa');
  if (waButtons.length) {
    const encodedText = encodeURIComponent(CAREWANGI_WA.defaultMessage);
    const waHref = CAREWANGI_WA.phoneNumber.trim()
      ? `https://wa.me/${CAREWANGI_WA.phoneNumber.trim()}?text=${encodedText}`
      : `https://wa.me/?text=${encodedText}`;

    waButtons.forEach((btn) => {
      btn.setAttribute('href', waHref);
    });
  }
});
