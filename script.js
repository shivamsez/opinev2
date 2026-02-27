document.addEventListener('DOMContentLoaded', () => {
  const bgVideo = document.getElementById('bgVideo');
  const heroContent = document.getElementById('heroContent');
  const heroTitle = document.getElementById('heroTitle');
  const videoBox = document.getElementById('videoBox');
  const btnWaitlist = document.getElementById('btnWaitlist');
  const waitlistForm = document.getElementById('waitlistForm');
  const waitlistInput = document.getElementById('waitlistInput');
  const waitlistWrap = document.getElementById('waitlistWrap');
  const definitionContent = document.getElementById('definitionContent');
  const mobileHand = document.getElementById('mobileHand');
  const mainLogo = document.getElementById('mainLogo');
  const scrollTrack = document.getElementById('scrollTrack');
  const sectionImagine = document.getElementById('sectionImagine');
  const imagineGrid = document.querySelector('.imagine-grid');
  const sectionBuilt = document.getElementById('sectionBuilt');
  const builtContent = document.querySelector('.built-content');
  const sectionHow = document.getElementById('sectionHow');
  const howPill = document.querySelector('.how-pill');
  const howParts = document.querySelectorAll('.how-part');
  const sectionFeatures = document.getElementById('sectionFeatures');
  const featuresWrap = document.querySelector('.features-wrap');
  const btnCtaWaitlist = document.getElementById('btnCtaWaitlist');
  const ctaWaitlistForm = document.getElementById('ctaWaitlistForm');
  const ctaWaitlistInput = document.getElementById('ctaWaitlistInput');

  // Wait for bg video to be ready, then fade in hero content
  function onVideoReady() {
    heroContent.classList.add('visible');
  }

  if (bgVideo.readyState >= 3) {
    onVideoReady();
  } else {
    bgVideo.addEventListener('canplaythrough', onVideoReady, { once: true });
    // Fallback in case event doesn't fire (some browsers)
    setTimeout(onVideoReady, 3000);
  }

  // Waitlist button → input field transition
  btnWaitlist.addEventListener('click', () => {
    btnWaitlist.classList.add('hiding');
    setTimeout(() => {
      btnWaitlist.style.display = 'none';
      waitlistForm.classList.remove('hidden');
      waitlistForm.classList.add('visible');
      waitlistInput.focus();
    }, 250);
  });

  // Close form if clicking outside
  document.addEventListener('click', (e) => {
    if (
      waitlistForm.classList.contains('visible') &&
      !waitlistForm.contains(e.target) &&
      e.target !== btnWaitlist
    ) {
      waitlistForm.classList.remove('visible');
      waitlistForm.classList.add('hidden');
      btnWaitlist.style.display = '';
      btnWaitlist.classList.remove('hiding');
    }
  });

  // Form submission
  waitlistForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = waitlistInput.value;
    if (email) {
      waitlistForm.innerHTML = '<span class="success-msg">you\'re on the list ✓</span>';
    }
  });

  // CTA waitlist button → input field transition
  btnCtaWaitlist.addEventListener('click', () => {
    btnCtaWaitlist.classList.add('hiding');
    setTimeout(() => {
      btnCtaWaitlist.style.display = 'none';
      ctaWaitlistForm.classList.remove('hidden');
      ctaWaitlistForm.classList.add('visible');
      ctaWaitlistInput.focus();
    }, 250);
  });

  document.addEventListener('click', (e) => {
    if (
      ctaWaitlistForm.classList.contains('visible') &&
      !ctaWaitlistForm.contains(e.target) &&
      e.target !== btnCtaWaitlist
    ) {
      ctaWaitlistForm.classList.remove('visible');
      ctaWaitlistForm.classList.add('hidden');
      btnCtaWaitlist.style.display = '';
      btnCtaWaitlist.classList.remove('hiding');
    }
  });

  ctaWaitlistForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = ctaWaitlistInput.value;
    if (email) {
      ctaWaitlistForm.innerHTML = '<span class="success-msg">you\'re on the list ✓</span>';
    }
  });

  // ===== Smooth Scroll (lerp-based) =====
  let smoothTarget = window.scrollY;
  let smoothCurrent = window.scrollY;
  const smoothEase = 0.075;
  let smoothRafRunning = false;
  let wheelActive = false;
  let wheelTimer = null;

  function getMaxScroll() {
    return document.body.scrollHeight - window.innerHeight;
  }

  window.addEventListener('wheel', (e) => {
    e.preventDefault();

    if (!wheelActive) {
      smoothCurrent = window.scrollY;
      smoothTarget = window.scrollY;
    }

    wheelActive = true;
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => { wheelActive = false; }, 600);

    smoothTarget += e.deltaY;
    smoothTarget = Math.max(0, Math.min(smoothTarget, getMaxScroll()));

    if (!smoothRafRunning) {
      smoothRafRunning = true;
      requestAnimationFrame(smoothTick);
    }
  }, { passive: false });

  function smoothTick() {
    smoothCurrent += (smoothTarget - smoothCurrent) * smoothEase;

    if (Math.abs(smoothCurrent - smoothTarget) < 0.5) {
      smoothCurrent = smoothTarget;
      window.scrollTo(0, smoothCurrent);
      smoothRafRunning = false;
      return;
    }

    window.scrollTo(0, smoothCurrent);
    requestAnimationFrame(smoothTick);
  }

  // Scroll-driven animations
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateOnScroll);
      ticking = true;
    }
  }

  // Linear interpolation helper for animations
  function mapRange(value, inMin, inMax, outMin, outMax) {
    const clamped = Math.max(inMin, Math.min(value, inMax));
    return outMin + ((clamped - inMin) / (inMax - inMin)) * (outMax - outMin);
  }

  function updateOnScroll() {
    ticking = false;
    
    // Get scroll boundaries relative to the scroll track
    const rect = scrollTrack.getBoundingClientRect();
    const trackTop = rect.top;
    const trackHeight = rect.height;
    const viewportH = window.innerHeight;
    
    // Calculate progress through the scroll track (0 to 1)
    // 0 = just started scrolling down, 1 = reached the bottom of the track
    let progress = 0;
    
    if (trackTop <= 0) {
      progress = Math.min((-trackTop) / (trackHeight - viewportH), 1);
    }
    // Safety fallback
    if (trackHeight <= viewportH) progress = 0;

    // 1. Hero Content Fade Out (progress 0.0 to 0.3)
    const heroOpacity = mapRange(progress, 0.0, 0.3, 1, 0);
    const boxScale = mapRange(progress, 0.0, 0.3, 1, 0.8);
    
    mainLogo.style.opacity = heroOpacity;
    heroTitle.style.opacity = heroOpacity;
    waitlistWrap.style.opacity = heroOpacity;
    videoBox.style.opacity = heroOpacity;
    videoBox.style.transform = `scale(${boxScale})`;

    // Prevent interactions with invisible hero content
    heroContent.style.pointerEvents = heroOpacity < 0.1 ? 'none' : 'auto';

    // 2. Definition Text Fade In (progress 0.3 to 0.6)
    const defOpacity = mapRange(progress, 0.3, 0.6, 0, 1);
    const defY = mapRange(progress, 0.3, 0.6, 20, 0);
    
    definitionContent.style.opacity = defOpacity;
    definitionContent.style.transform = `translateY(${defY}px)`;

    // 3. Mobile Hand Slide Up (progress 0.5 to 0.9)
    const handOpacity = mapRange(progress, 0.5, 0.9, 0, 1);
    const handY = mapRange(progress, 0.5, 0.9, 120, 0);
    
    mobileHand.style.opacity = handOpacity;
    mobileHand.style.transform = `translateY(${handY}px)`;

    // 4. Section Imagine Fade In
    const imagineRect = sectionImagine.getBoundingClientRect();
    if (imagineRect.top < viewportH * 0.8) {
      imagineGrid.classList.add('visible');
    } else {
      imagineGrid.classList.remove('visible');
    }

    // 5. Section Built Fade In
    const builtRect = sectionBuilt.getBoundingClientRect();
    if (builtRect.top < viewportH * 0.8) {
      builtContent.classList.add('visible');
    } else {
      builtContent.classList.remove('visible');
    }

    // 6. Section How It Works Fade In
    const howRect = sectionHow.getBoundingClientRect();
    if (howRect.top < viewportH * 0.8) {
      howPill.classList.add('visible');
    } else {
      howPill.classList.remove('visible');
    }

    howParts.forEach(part => {
      const partRect = part.getBoundingClientRect();
      if (partRect.top < viewportH * 0.85) {
        part.classList.add('visible');
      } else {
        part.classList.remove('visible');
      }
    });

    // 7. Section Features Fade In
    const featuresRect = sectionFeatures.getBoundingClientRect();
    if (featuresRect.top < viewportH * 0.8) {
      featuresWrap.classList.add('visible');
    } else {
      featuresWrap.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true }); // handle resize updates
  updateOnScroll();
});
