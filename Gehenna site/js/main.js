/* ==========================================================================
   JHON DEE — Main JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     0. INTRO SPLASH SCREEN
     -------------------------------------------------------------------------- */
  const introSplash = document.querySelector('.intro-splash');
  const introBtn = document.querySelector('.intro-btn');
  const siteShell = document.querySelector('.site-shell');

  if (introBtn && introSplash) {
    introBtn.addEventListener('click', () => {
      // Fade out intro
      introSplash.classList.add('is-leaving');

      // After a short delay, reveal the main site
      setTimeout(() => {
        document.body.classList.remove('intro-scroll-locked');
        // Site-shell opacity transitions from 0 to 1 via CSS
        siteShell.style.opacity = '1';
      }, 400);

      // Remove intro from DOM after full transition
      setTimeout(() => {
        introSplash.remove();
        initReveal();
      }, 900);
    });
  }

  /* --------------------------------------------------------------------------
     1. TAB NAVIGATION
     -------------------------------------------------------------------------- */
  const navLinks = document.querySelectorAll('.main-nav a[data-tab]');
  const tabSections = document.querySelectorAll('.tab-section');

  function switchTab(tabId) {
    // Deactivate all nav links
    navLinks.forEach(l => l.classList.remove('is-active'));

    // Activate nav link
    navLinks.forEach(l => {
      if (l.dataset.tab === tabId) l.classList.add('is-active');
    });

    // Fade out current, then fade in target
    const current = document.querySelector('.tab-section.is-active');
    const target = document.getElementById(tabId);

    if (current && current.id !== tabId) {
      current.classList.remove('is-active');
      // After fade-out transition, show target
      setTimeout(() => {
        if (target) {
          target.classList.add('is-active');
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
        // Close all drawers when switching tabs
        drawerItems.forEach(d => d.classList.remove('is-open'));
        initReveal();
      }, 350);
    } else if (target && !current) {
      target.classList.add('is-active');
      initReveal();
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = link.dataset.tab;
      if (tabId) switchTab(tabId);
    });
  });

  // Initialize first tab
  if (navLinks.length > 0) {
    const firstTab = navLinks[0].dataset.tab;
    switchTab(firstTab);
  }

  /* --------------------------------------------------------------------------
     2. STORY OVERLAYS (Jhon Dee + Fra'Sisto)
     -------------------------------------------------------------------------- */
  const storyOverlays = document.querySelectorAll('.story-overlay');

  function openOverlay(overlay) {
    if (overlay) {
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeOverlay(overlay) {
    if (overlay) {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  function closeAllOverlays() {
    storyOverlays.forEach(o => {
      o.classList.remove('is-open');
    });
    document.body.style.overflow = '';
  }

  // Jhon Dee "Me conheça"
  const storyBtnDee = document.querySelector('[data-open-story]');
  const storyOverlayDee = document.querySelector('.story-overlay:not(#story-sisto)');
  if (storyBtnDee) {
    storyBtnDee.addEventListener('click', (e) => {
      e.preventDefault();
      openOverlay(storyOverlayDee);
    });
  }

  // Fra'Sisto "Me conheça"
  const storyBtnSisto = document.querySelector('[data-open-story-sisto]');
  const storyOverlaySisto = document.getElementById('story-sisto');
  if (storyBtnSisto) {
    storyBtnSisto.addEventListener('click', (e) => {
      e.preventDefault();
      openOverlay(storyOverlaySisto);
    });
  }

  // Close buttons inside overlays
  storyOverlays.forEach(overlay => {
    const closeBtn = overlay.querySelector('.story-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeOverlay(overlay));
    }
    // Click outside panel to close
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeOverlay(overlay);
    });
  });

  /* --------------------------------------------------------------------------
     3. DRAWER / ACCORDION (Anotações)
     -------------------------------------------------------------------------- */
  const drawerItems = document.querySelectorAll('.drawer-item');

  drawerItems.forEach(item => {
    const header = item.querySelector('.drawer-header');
    if (header) {
      header.addEventListener('click', () => {
        const wasOpen = item.classList.contains('is-open');

        // Close all drawers
        drawerItems.forEach(d => d.classList.remove('is-open'));

        // Toggle current
        if (!wasOpen) {
          item.classList.add('is-open');
        }
      });
    }
  });

  /* --------------------------------------------------------------------------
     4. IMAGE LIGHTBOX
     -------------------------------------------------------------------------- */
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('img') : null;

  function openLightbox(src, alt) {
    if (lightbox && lightboxImg) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || '';
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  // Clicking any image with data-lightbox opens it
  document.addEventListener('click', (e) => {
    const img = e.target.closest('[data-lightbox]');
    if (img) {
      e.preventDefault();
      const src = img.dataset.lightbox || img.src;
      const alt = img.alt || '';
      openLightbox(src, alt);
    }
  });

  // Close lightbox: click backdrop
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  /* --------------------------------------------------------------------------
     5. ESCAPE KEY — closes any overlay
     -------------------------------------------------------------------------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeAllOverlays();
    }
  });

  /* --------------------------------------------------------------------------
     6. HEADER SCROLL EFFECT
     -------------------------------------------------------------------------- */
  const header = document.querySelector('.header');

  function updateHeaderScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 50);
  }

  window.addEventListener('scroll', updateHeaderScroll, { passive: true });
  updateHeaderScroll();

  /* --------------------------------------------------------------------------
     7. SCROLL REVEAL
     -------------------------------------------------------------------------- */
  function initReveal() {
    const els = document.querySelectorAll('[data-reveal]:not(.is-visible)');
    if (!els.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.revealDelay || 0;
          setTimeout(() => entry.target.classList.add('is-visible'), delay);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => obs.observe(el));
  }

  initReveal();

  /* --------------------------------------------------------------------------
     8. AUDIO — Autoplay + Mute Toggle
     -------------------------------------------------------------------------- */
  const audioToggle = document.querySelector('.audio-toggle');
  const bgAudio = document.getElementById('bg-audio');
  let audioPlaying = true;

  const volOn = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
  const volOff = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';

  function tryAutoplay() {
    if (!bgAudio) return;
    bgAudio.volume = 0.10;
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        audioPlaying = true;
        if (audioToggle) audioToggle.innerHTML = volOn;
      }).catch(() => {
        // Autoplay blocked by browser — wait for first user interaction
        audioPlaying = false;
        if (audioToggle) audioToggle.innerHTML = volOff;
        document.addEventListener('click', function resumeAudio() {
          bgAudio.play().then(() => {
            audioPlaying = true;
            if (audioToggle) audioToggle.innerHTML = volOn;
          }).catch(() => {});
          document.removeEventListener('click', resumeAudio);
        }, { once: true });
      });
    }
  }

  // Try autoplay immediately
  tryAutoplay();

  if (audioToggle) {
    audioToggle.innerHTML = volOn;
    audioToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!bgAudio) return;
      if (audioPlaying) {
        bgAudio.pause();
        audioPlaying = false;
        audioToggle.innerHTML = volOff;
      } else {
        bgAudio.play();
        audioPlaying = true;
        audioToggle.innerHTML = volOn;
      }
    });
  }

});
