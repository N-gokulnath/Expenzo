document.addEventListener('DOMContentLoaded', () => {

  // --- Theme Toggle Setup ---
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  
  // Set default theme from localStorage or system preference
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    body.classList.add('light-theme');
  }

  // Helper to get active theme prefix ('light' or 'dark')
  const getThemePrefix = () => body.classList.contains('light-theme') ? 'light' : 'dark';

  // Apply theme prefix to images
  const updateImagesForTheme = () => {
    const theme = getThemePrefix();
    
    // Update Hero Screen image
    const heroImg = document.getElementById('hero-phone-img');
    if (heroImg) {
      const currentSrc = heroImg.getAttribute('src');
      const filename = currentSrc.split('/').pop();
      heroImg.src = `assets/screenshots/${theme}/${filename}`;
    }

    // Update all 5 Showcase images
    const showcaseImages = document.querySelectorAll('.showcase-scene .phone-screen-img');
    showcaseImages.forEach(img => {
      const currentSrc = img.getAttribute('src');
      const filename = currentSrc.split('/').pop();
      img.src = `assets/screenshots/${theme}/${filename}`;
    });
  };

  // Toggle theme click listener
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const newTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    
    // Smooth image source swapping
    updateImagesForTheme();
  });

  // Ensure initial images are in sync
  updateImagesForTheme();


  // --- Interactive 3D Circular Rotating Showcase Carousel ---
  const tabs = document.querySelectorAll('.showcase-navigation .showcase-tab');
  const devices = document.querySelectorAll('.showcase-scene .phone-device');
  const container = document.querySelector('.showcase-carousel-container');
  const showcaseScene = document.querySelector('.showcase-scene');
  const showcaseWrapper = document.querySelector('.showcase-visual-wrapper');

  const screens = ['dashboard', 'analytics', 'budgets', 'goals', 'settings'];

  const calloutContent = {
    dashboard: {
      title: "Interactive Net Worth",
      desc: "Monitor net worth, weekly spending charts, and local transaction ledgers."
    },
    analytics: {
      title: "Advanced Analytics",
      desc: "Analyze spending distributions with donut charts and export data as PDF reports."
    },
    budgets: {
      title: "Smart Budgeting",
      desc: "Allocate spending limits to custom categories and get real-time warning alerts."
    },
    goals: {
      title: "Savings Goals",
      desc: "Set target savings accounts with visual trackers that adapt to goal deadlines."
    },
    settings: {
      title: "Advanced Settings",
      desc: "Toggle main dashboard graphs and wipe local account variables securely."
    }
  };

  // Carousel angles (degrees)
  let currentAngle = 0;
  let targetAngle = 0;
  let isDragging = false;
  let dragDistance = 0;
  let startX = 0;
  let startAngle = 0;
  let lastX = 0;
  let velocity = 0;
  let activeIndex = 0;
  let animFrameId = null;

  // Responsive layout dimensions
  let spread = 320;
  let depth = 180;
  let maxRotate = 35;
  let baseScale = 1.0;
  let isMobileLayout = false;

  const updateDimensions = () => {
    const w = window.innerWidth;
    if (w > 992) {
      spread = 320;
      depth = 180;
      maxRotate = 35;
      baseScale = 1.0;
      isMobileLayout = false;
    } else if (w > 768) {
      spread = 220;
      depth = 120;
      maxRotate = 25;
      baseScale = 0.85;
      isMobileLayout = false;
    } else { // Mobile (width <= 768px)
      const w = window.innerWidth;
      // Single face layout matching the reference design (mockup width same as hero)
      spread = Math.max(200, Math.min(240, w * 0.65));
      baseScale = Math.min(1.0, w / 360);
      depth = 0; // Flat layout on mobile
      maxRotate = 0; // No Y-rotation on mobile
      isMobileLayout = true;
    }
  };

  const updateCarouselPositions = () => {
    devices.forEach((device) => {
      const deviceIdx = parseInt(device.getAttribute('data-device-index'), 10);
      const angle = (deviceIdx * 72) + currentAngle;
      
      // Normalize angle to range [-180, 180]
      let normAngle = ((angle + 180) % 360 + 360) % 360 - 180;
      
      const rad = normAngle * Math.PI / 180;
      const cosVal = Math.cos(rad);
      const sinVal = Math.sin(rad);
      
      // Compute positions
      let x, z, rY, s, opacity, brightness, blurVal;
      
      if (isMobileLayout) {
        // Flat horizontal linear carousel positioning on mobile
        x = (normAngle / 72) * spread;
        z = 0;
        rY = 0;
        s = baseScale * (0.8 + 0.2 * (cosVal + 1) / 2);
        
        // Show faded side screens on mobile viewports (fades to 0 at 180 degrees to hide warp)
        const fadeFactor = Math.max(0, 1 - Math.abs(normAngle) / 180);
        opacity = (0.45 + 0.55 * (cosVal + 1) / 2) * fadeFactor;
        brightness = 0.5 + 0.5 * (cosVal + 1) / 2;
        blurVal = 0;
      } else {
        // 3D cylinder layout on desktop/tablet
        x = sinVal * spread;
        z = cosVal * depth - depth;
        rY = -sinVal * maxRotate;
        s = baseScale * (0.8 + 0.2 * (cosVal + 1) / 2);
        
        opacity = 0.45 + 0.55 * (cosVal + 1) / 2;
        brightness = 0.6 + 0.4 * (cosVal + 1) / 2;
        blurVal = (1 - (cosVal + 1) / 2) * 2;
      }
      const zIndex = Math.round((cosVal + 1) * 10);
      
      device.style.transform = `translate3d(${x}px, 0, ${z}px) scale(${s}) rotateY(${rY}deg)`;
      device.style.opacity = opacity;
      device.style.filter = `brightness(${brightness}) blur(${blurVal}px)`;
      device.style.zIndex = zIndex;
    });
  };

  const updateActiveContent = () => {
    // Sync navigation tabs
    tabs.forEach((tab) => {
      const tabIdx = parseInt(tab.getAttribute('data-screen-index'), 10);
      if (tabIdx === activeIndex) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    const screenName = screens[activeIndex];
    const content = calloutContent[screenName];
    
    // Smooth text cross-fade
    const infoContainer = document.querySelector('.showcase-feature-info');
    if (infoContainer) {
      infoContainer.style.opacity = '0';
      infoContainer.style.transform = 'translateY(10px)';
      
      setTimeout(() => {
        document.getElementById('showcase-info-title').textContent = content.title;
        document.getElementById('showcase-info-desc').textContent = content.desc;
        
        infoContainer.style.opacity = '1';
        infoContainer.style.transform = 'translateY(0)';
      }, 150);
    }
  };

  const onRotationSnap = () => {
    const newActiveIndex = (Math.round(-currentAngle / 72) % 5 + 5) % 5;
    if (newActiveIndex !== activeIndex) {
      activeIndex = newActiveIndex;
      updateActiveContent();
    }
  };

  const animate = () => {
    if (isDragging) {
      currentAngle += (targetAngle - currentAngle) * 0.3; // fast follow
    } else {
      currentAngle += (targetAngle - currentAngle) * 0.1; // smooth spring snap
    }
    
    updateCarouselPositions();
    
    if (isDragging || Math.abs(targetAngle - currentAngle) > 0.05) {
      animFrameId = requestAnimationFrame(animate);
    } else {
      currentAngle = targetAngle;
      updateCarouselPositions();
      animFrameId = null;
      onRotationSnap();
    }
  };

  const startAnimationLoop = () => {
    if (!animFrameId) {
      animFrameId = requestAnimationFrame(animate);
    }
  };

  // Drag and Swipe Handlers
  const handleDragStart = (clientX) => {
    isDragging = true;
    dragDistance = 0;
    startX = clientX;
    startAngle = targetAngle;
    lastX = clientX;
    velocity = 0;
    
    // Reset wrapper tilt during drag
    if (showcaseWrapper) {
      showcaseWrapper.style.transform = 'rotateX(0deg) rotateY(0deg)';
      showcaseWrapper.style.transition = 'transform 0.3s ease';
    }
    
    startAnimationLoop();
  };

  const handleDragMove = (clientX) => {
    if (!isDragging) return;
    const dx = clientX - startX;
    // Map pixels to rotation degrees
    targetAngle = startAngle + dx * 0.45;
    
    dragDistance += Math.abs(clientX - lastX);
    
    velocity = clientX - lastX;
    lastX = clientX;
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    
    // Add touch momentum/inertia
    targetAngle += velocity * 1.5;
    
    // Snap targetAngle to nearest multiple of 72
    targetAngle = Math.round(targetAngle / 72) * 72;
    startAnimationLoop();
  };

  // Bind Mouse events
  if (container) {
    container.addEventListener('mousedown', (e) => {
      handleDragStart(e.clientX);
      e.preventDefault(); // prevent text selection highlights
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        handleDragMove(e.clientX);
      }
    });

    window.addEventListener('mouseup', () => {
      handleDragEnd();
    });

    // Bind Touch events
    container.addEventListener('touchstart', (e) => {
      handleDragStart(e.touches[0].clientX);
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
      handleDragMove(e.touches[0].clientX);
    }, { passive: true });

    container.addEventListener('touchend', () => {
      handleDragEnd();
    });
  }

  // Bind mockups direct click/tap selections
  devices.forEach((device) => {
    device.addEventListener('click', (e) => {
      // If we dragged by more than 10 pixels total, ignore click selection
      if (dragDistance > 10) return;
      
      const deviceIdx = parseInt(device.getAttribute('data-device-index'), 10);
      
      // Calculate shortest rotation distance
      let diff = (-deviceIdx * 72 - targetAngle) % 360;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      
      targetAngle += diff;
      startAnimationLoop();
      
      e.stopPropagation();
    });
  });

  // Bind Pill Navigation Clicks
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const tabIdx = parseInt(tab.getAttribute('data-screen-index'), 10);
      
      // Calculate shortest rotation distance
      let diff = (-tabIdx * 72 - targetAngle) % 360;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      
      targetAngle += diff;
      startAnimationLoop();
    });
  });

  // --- Showcase 3D Mouse Parallax Effect (Idle Only) ---
  if (showcaseScene && showcaseWrapper) {
    showcaseScene.addEventListener('mousemove', (e) => {
      if (isDragging) return;
      
      const rect = showcaseScene.getBoundingClientRect();
      const x = e.clientX - rect.left - (rect.width / 2);
      const y = e.clientY - rect.top - (rect.height / 2);
      
      // Subtle rotation tilt
      const rotateX = -(y / (rect.height / 2)) * 10;
      const rotateY = (x / (rect.width / 2)) * 10;
      
      showcaseWrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    showcaseScene.addEventListener('mouseleave', () => {
      showcaseWrapper.style.transform = 'rotateX(0deg) rotateY(0deg)';
      showcaseWrapper.style.transition = 'transform 0.5s ease';
    });

    showcaseScene.addEventListener('mouseenter', () => {
      showcaseWrapper.style.transition = 'none';
    });
  }

  // Initial Layout Setup
  updateDimensions();
  updateCarouselPositions();
  updateActiveContent();


  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all open items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = '0';
      });
      
      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });


  // --- Scroll Reveal Animations ---
  const scrollTriggers = document.querySelectorAll('.scroll-trigger');
  
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Once revealed, no need to observe again
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null, // browser viewport
    threshold: 0.15 // trigger when 15% visible
  });

  scrollTriggers.forEach(trigger => {
    revealObserver.observe(trigger);
  });


  // --- Hero 3D Parallax Effect ---
  const heroSection = document.querySelector('.hero');
  const phoneWrapper = document.querySelector('.phone-mockup-wrapper');

  if (heroSection && phoneWrapper) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left - (rect.width / 2);
      const y = e.clientY - rect.top - (rect.height / 2);
      
      // Calculate rotation degree (max 8 degrees for subtle effect)
      const rotateX = -(y / (rect.height / 2)) * 8;
      const rotateY = (x / (rect.width / 2)) * 8;
      
      phoneWrapper.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      phoneWrapper.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      phoneWrapper.style.transition = 'transform 0.5s ease';
    });

    heroSection.addEventListener('mouseenter', () => {
      phoneWrapper.style.transition = 'none'; // remove transition for smooth tracking
    });
  }
});
