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

    // Update Showcase image
    const showcaseImg = document.getElementById('showcase-phone-img');
    if (showcaseImg) {
      const currentSrc = showcaseImg.getAttribute('src');
      const filename = currentSrc.split('/').pop();
      showcaseImg.src = `assets/screenshots/${theme}/${filename}`;
    }
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


  // --- Interactive Showcase Tabs ---
  const tabs = document.querySelectorAll('.showcase-tab');
  const showcaseImg = document.getElementById('showcase-phone-img');
  const calloutTitle = document.getElementById('callout-title');
  const calloutDesc = document.getElementById('callout-desc');

  // Callout text library matching each screen
  const calloutContent = {
    dashboard: {
      title: "Interactive Net Worth",
      desc: "Instantly trace net balances across Cash, Banks, and Cards. Toggle charts on/off in Settings."
    },
    analytics: {
      title: "Category Breakdown",
      desc: "Toggle debit vs credit, view percentage trends, and trigger offline PDF report exports."
    },
    budgets: {
      title: "Smart Spending Caps",
      desc: "Monitor limits for Dining, Travel, and Shopping. Limits warn you automatically if overspent."
    },
    goals: {
      title: "Visual Goal Tracker",
      desc: "Colors reflect target urgency: Green (on track), Blue (mid), or Amber (behind/near deadline)."
    },
    settings: {
      title: "Granular Controls",
      desc: "Customize UI settings, configure dashboard view, or securely wipe account variables locally."
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active state from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      
      // Add active state to clicked tab
      tab.classList.add('active');
      
      const screenName = tab.getAttribute('data-screen');
      const theme = getThemePrefix();
      
      if (showcaseImg && screenName) {
        // Smooth cross-fade transition
        showcaseImg.style.opacity = '0';
        
        setTimeout(() => {
          showcaseImg.src = `assets/screenshots/${theme}/${screenName}.png`;
          
          // Update details inside floating card
          if (calloutTitle && calloutDesc && calloutContent[screenName]) {
            calloutTitle.textContent = calloutContent[screenName].title;
            calloutDesc.textContent = calloutContent[screenName].desc;
          }
          
          showcaseImg.onload = () => {
            showcaseImg.style.opacity = '1';
          };
        }, 150);
      }
    });
  });


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
