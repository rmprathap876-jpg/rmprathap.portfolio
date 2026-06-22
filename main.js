/* ==========================================================================
   PRATHAP PORTFOLIO INTERACTIVE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. INTRO SPLASH REVEAL
  const introReveal = document.getElementById('intro-reveal');
  const body = document.body;

  // Temporarily lock scrolling during intro
  body.style.overflow = 'hidden';

  // Typewriter with letter-by-letter glow effect
  const revealTitleEl = document.getElementById('reveal-title');
  if (revealTitleEl) {
    const text = "PRATHAP R M";
    revealTitleEl.innerHTML = '';
    const chars = text.split('');
    const spans = chars.map((char) => {
      const span = document.createElement('span');
      if (char === ' ') {
        span.innerHTML = '&nbsp;';
      } else {
        span.textContent = char;
      }
      span.className = 'intro-char';
      revealTitleEl.appendChild(span);
      return span;
    });

    spans.forEach((span, index) => {
      setTimeout(() => {
        span.classList.add('reveal-active');
      }, 100 + index * 90); // 90ms typewriter delay per letter
    });
  }

  const unlockScroll = () => {
    introReveal.style.transform = 'translateY(-100vh)';
    body.style.overflow = '';
    
    // Add revealed class to hero card after intro reveal finishes (1 second)
    const heroCard = document.querySelector('.hero-banner-container');
    if (heroCard) {
      setTimeout(() => {
        heroCard.classList.add('revealed');
      }, 900); // 900ms delay to start right as the first animation ends
    }

    // Trigger transition after intro reveal completes
    setTimeout(() => {
      introReveal.style.display = 'none';
      // Trigger header active state
      document.getElementById('main-header').style.opacity = '1';
      if (typeof updateHeaderTheme === 'function') updateHeaderTheme();
    }, 1000);
    
    // Clean up event listeners
    window.removeEventListener('wheel', handleIntroScroll);
    window.removeEventListener('touchmove', handleIntroScroll);
    window.removeEventListener('click', unlockScroll);
    window.removeEventListener('keydown', handleIntroKey);
  };

  const handleIntroScroll = (e) => {
    if (e.deltaY > 10 || e.touches) {
      unlockScroll();
    }
  };

  const handleIntroKey = (e) => {
    if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter') {
      unlockScroll();
    }
  };

  // Listen for scroll or click events to reveal
  window.addEventListener('wheel', handleIntroScroll, { passive: true });
  window.addEventListener('touchmove', handleIntroScroll, { passive: true });
  window.addEventListener('click', unlockScroll);
  window.addEventListener('keydown', handleIntroKey);

  // Fallback auto-reveal after 3 seconds
  setTimeout(() => {
    if (introReveal.parentNode && introReveal.style.transform !== 'translateY(-100vh)') {
      unlockScroll();
    }
  }, 3000);


  // 2. CUSTOM CURSOR WITH MODERN TRAIL EFFECT
  const customCursor = document.getElementById('custom-cursor');
  const cursorGlow = customCursor.querySelector('.cursor-glow');
  const cursorDot = customCursor.querySelector('.cursor-dot');
  const cursorRing = customCursor.querySelector('.cursor-ring');
  const cursorText = customCursor.querySelector('.cursor-text');
  const trailContainer = document.getElementById('cursor-trail-container');

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let lastTrailX = 0, lastTrailY = 0;

  // Create cursor trail dots
  const createTrailDot = (x, y) => {
    const dot = document.createElement('div');
    dot.className = 'cursor-trail-dot';
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';
    trailContainer.appendChild(dot);
    
    setTimeout(() => {
      dot.remove();
    }, 800);
  };

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Create trail dots at intervals
    const distance = Math.hypot(mouseX - lastTrailX, mouseY - lastTrailY);
    if (distance > 5) {
      createTrailDot(mouseX, mouseY);
      lastTrailX = mouseX;
      lastTrailY = mouseY;
    }
  });

  const updateCursor = () => {
    // Smooth trailing for the outer ring using lerp
    let dx = mouseX - cursorX;
    let dy = mouseY - cursorY;
    cursorX += dx * 0.12;
    cursorY += dy * 0.12;

    cursorGlow.style.left = `${cursorX}px`;
    cursorGlow.style.top = `${cursorY}px`;

    cursorRing.style.left = `${cursorX}px`;
    cursorRing.style.top = `${cursorY}px`;
    
    // Instant dot movement with slight smoothing
    let dotDx = mouseX - (parseFloat(cursorDot.style.left) || mouseX);
    let dotDy = mouseY - (parseFloat(cursorDot.style.top) || mouseY);
    const dotX = (parseFloat(cursorDot.style.left) || mouseX) + dotDx * 0.6;
    const dotY = (parseFloat(cursorDot.style.top) || mouseY) + dotDy * 0.6;
    
    cursorDot.style.left = `${dotX}px`;
    cursorDot.style.top = `${dotY}px`;

    // Text follows the cursor ring center
    cursorText.style.left = `${cursorX}px`;
    cursorText.style.top = `${cursorY}px`;

    requestAnimationFrame(updateCursor);
  };
  requestAnimationFrame(updateCursor);

  // Bind cursor states to interactive elements
  const bindCursorStates = () => {
    // Cards with specific cursor labels
    const hoverElements = document.querySelectorAll('[data-cursor-badge]');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        const badgeText = el.getAttribute('data-cursor-badge') || 'VIEW';
        cursorText.textContent = badgeText;
        customCursor.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        customCursor.classList.remove('hovering');
      });
    });

    // Dark-themed section cursor adjustments (if any)
    const darkSections = document.querySelectorAll('.about-section, .process-section, .experience-summary-section, .contact-section, .case-study-overlay');
    darkSections.forEach(section => {
      section.addEventListener('mouseenter', () => {
        customCursor.classList.add('dark-bg');
      });
      section.addEventListener('mouseleave', () => {
        customCursor.classList.remove('dark-bg');
      });
    });
  };
  bindCursorStates();


  // 2.5 HERO FLOATING ICONS CLICK HANDLER
  const heroFloatingIcons = document.querySelectorAll('.hero-floating-icon');
  const toolSections = {
    'xd': { section: 'selected-projects', title: 'Adobe XD' },
    'figma': { section: 'selected-projects', title: 'Figma' },
    'photoshop': { section: 'selected-projects', title: 'Photoshop' },
    'blender': { section: 'skills', title: 'Blender 3D' },
    'canva': { section: 'skills', title: 'Canva' }
  };

  heroFloatingIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      const toolName = icon.getAttribute('data-tool');
      const toolInfo = toolSections[toolName];
      
      if (toolInfo) {
        // Scroll to relevant section
        const targetSection = document.getElementById(toolInfo.section);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
          
          // Highlight the section briefly
          targetSection.style.opacity = '0.8';
          setTimeout(() => {
            targetSection.style.opacity = '1';
          }, 300);
        }
      }
    });
  });


  // 2.6 CONNECTION SECTION - Social Links Footer Animation
  const socialIconLinks = document.querySelectorAll('.social-icon-link');
  socialIconLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.transform = 'translateY(-8px) scale(1.1)';
    });

    link.addEventListener('mouseleave', () => {
      link.style.transform = 'translateY(0) scale(1)';
    });
  });


  // 3. MOUSE-MOVE PARALLAX (HERO SECTION)
  const heroSection = document.getElementById('hero');
  const parallaxElements = document.querySelectorAll('.hero-floating-icon');

  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      parallaxElements.forEach(el => {
        const depth = parseFloat(el.getAttribute('data-depth')) || 0.1;
        const translateX = x * depth;
        const translateY = y * depth;
        el.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
      });
    });

    heroSection.addEventListener('mouseleave', () => {
      parallaxElements.forEach(el => {
        el.style.transform = 'translate3d(0, 0, 0)';
      });
    });
  }


  // 4. 3D CARD TILT EFFECT
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const percentX = x / rect.width;
      const percentY = y / rect.height;
      
      // Calculate rotation (-10deg to 10deg)
      const rotateX = (0.5 - percentY) * 12;
      const rotateY = (percentX - 0.5) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  });


  // 5. MAGNETIC BUTTONS
  const magneticButtons = document.querySelectorAll('.magnetic-btn, .social-icon-circle');
  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      // Translate the button towards the cursor (pull factor 0.35)
      btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });


  // 6. SCROLL REVEALS (FADE & CLIP PATH)
  const revealElements = document.querySelectorAll('.text-reveal, .image-reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once revealed
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // 7. INTERACTIVE CREATIVE PROCESS TIMELINE
  const processSection = document.getElementById('process');
  const processSteps = document.querySelectorAll('.process-step');
  const indicatorBar = document.getElementById('timeline-indicator-bar');

  const updateTimelineProgress = () => {
    if (!processSection || !indicatorBar) return;

    const rect = processSection.getBoundingClientRect();
    const windowH = window.innerHeight;

    // Start filling when section top is 60% of viewport
    const startPoint = windowH * 0.6;
    // Section bottom trigger
    const endPoint = rect.height - windowH * 0.4;

    let progressPct = 0;

    if (rect.top < startPoint) {
      const scrolledIn = startPoint - rect.top;
      const totalScrollable = rect.height - windowH * 0.2;
      progressPct = Math.min(100, Math.max(0, (scrolledIn / totalScrollable) * 100));
    }

    indicatorBar.style.height = `${progressPct}%`;

    // Set active class on active process step based on viewport location
    processSteps.forEach(step => {
      const stepRect = step.getBoundingClientRect();
      // Step is active if it passes the 55% screen mark
      if (stepRect.top < windowH * 0.55 && stepRect.bottom > windowH * 0.2) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', updateTimelineProgress);


  // 8. ROUTING & SCREEN WIPE VIEW TRANSITIONS
  const screenWipe = document.getElementById('screen-wipe');
  const homeView = document.getElementById('home-view');
  const projectsView = document.getElementById('projects-view');
  const aboutMeView = document.getElementById('about-me-view');
  const headerLinks = document.querySelectorAll('.nav-link');
  const mainHeader = document.getElementById('main-header');

  const navigateToView = (viewName) => {
    screenWipe.classList.add('trigger-up');

    setTimeout(() => {
      // Toggle active view
      homeView.classList.remove('active');
      projectsView.classList.remove('active');
      aboutMeView.classList.remove('active');

      const heroCard = document.querySelector('.hero-banner-container');
      if (heroCard) heroCard.classList.remove('revealed');

      if (viewName === 'projects') {
        projectsView.classList.add('active');
        updateNavState('projects');
      } else if (viewName === 'about-me') {
        aboutMeView.classList.add('active');
        updateNavState('none');
      } else {
        homeView.classList.add('active');
        updateNavState('home');
        if (heroCard) {
          setTimeout(() => heroCard.classList.add('revealed'), 100);
        }
      }
      
      // Reset scroll position
      window.scrollTo(0, 0);
      if (typeof updateHeaderTheme === 'function') updateHeaderTheme();
      
      // Trigger animations on the new view
      setTimeout(() => {
        const activeViewReveals = document.querySelectorAll('.view-container.active .text-reveal, .view-container.active .image-reveal');
        activeViewReveals.forEach(el => revealObserver.observe(el));
      }, 100);

    }, 550); // Midpoint of 1.2s wipe animation

    setTimeout(() => {
      screenWipe.classList.remove('trigger-up');
    }, 1200);
  };

  const updateNavState = (target) => {
    headerLinks.forEach(link => {
      if (link.getAttribute('data-target') === target) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  // Nav clicks
  headerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-target');
      const isHomeActive = homeView.classList.contains('active');
      
      if (target === 'home') {
        if (!isHomeActive) {
          navigateToView('home');
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (target === 'projects') {
        if (!projectsView.classList.contains('active')) {
          navigateToView('projects');
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (target === 'contact' && aboutMeView.classList.contains('active')) {
        scrollToSection('contact');
      } else {
        // experience or contact
        if (!isHomeActive) {
          navigateToView('home');
          setTimeout(() => scrollToSection(target), 1250);
        } else {
          scrollToSection(target);
        }
      }
    });
  });

  const scrollToSection = (id) => {
    let elementId = id;
    if (id === 'contact' && aboutMeView.classList.contains('active')) {
      elementId = 'about-contact';
    }
    const section = document.getElementById(elementId);
    if (section) {
      const offsetTop = section.offsetTop - 70; // Header offset
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  // Click RM Logo
  document.getElementById('nav-logo').addEventListener('click', (e) => {
    e.preventDefault();
    if (!homeView.classList.contains('active')) {
      navigateToView('home');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // Projects View All trigger
  document.getElementById('trigger-view-projects').addEventListener('click', () => {
    navigateToView('projects');
  });

  // Back to home trigger (Projects view)
  document.getElementById('trigger-back-home').addEventListener('click', () => {
    navigateToView('home');
  });

  // Back to home trigger (About view)
  const triggerAboutBackHome = document.getElementById('trigger-about-back-home');
  if (triggerAboutBackHome) {
    triggerAboutBackHome.addEventListener('click', () => {
      navigateToView('home');
    });
  }

  // Discover the Journey trigger (About view)
  const btnDiscoverJourney = document.getElementById('btn-discover-journey');
  if (btnDiscoverJourney) {
    btnDiscoverJourney.addEventListener('click', () => {
      openCaseStudy('sahara-pizza');
    });
  }

  // Little More About Me click trigger (Home page About section)
  const btnAboutMe = document.getElementById('btn-about-me') || document.getElementById('btn-about-timeline');
  if (btnAboutMe) {
    btnAboutMe.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToView('about-me');
    });
  }

  // Dynamic header theme switcher based on scroll section overlap
  const sections = document.querySelectorAll('section, footer');
  
  const updateHeaderTheme = () => {
    // If we are on the projects subview, keep header in light-bg (black text)
    if (projectsView.classList.contains('active')) {
      mainHeader.classList.add('light-bg');
      mainHeader.classList.remove('dark-bg');
      return;
    }

    let activeTheme = 'light'; // Fallback default
    
    sections.forEach(section => {
      if (section.offsetParent === null) return; // Skip hidden sections

      const rect = section.getBoundingClientRect();
      // If the section overlaps the navbar height (navbar is approx 0-70px from top)
      if (rect.top <= 50 && rect.bottom >= 50) {
        const theme = section.getAttribute('data-nav-theme');
        if (theme) {
          activeTheme = theme;
        }
      }
    });

    if (activeTheme === 'dark') {
      mainHeader.classList.add('dark-bg');
      mainHeader.classList.remove('light-bg');
    } else {
      mainHeader.classList.add('light-bg');
      mainHeader.classList.remove('dark-bg');
    }
  };

  // Sticky header class update on scroll & dynamic theme toggle
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
    updateHeaderTheme();
  });

  // Initialize header theme on load
  updateHeaderTheme();


  // 9. PROJECTS PAGE CATEGORY FILTERS
  const filterButtons = document.querySelectorAll('.filter-btn');
  const categorySections = document.querySelectorAll('.gallery-category-section');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      categorySections.forEach(section => {
        const cat = section.getAttribute('data-category');
        
        if (filterValue === 'all' || filterValue === cat) {
          section.classList.remove('hidden');
          section.style.opacity = '0';
          section.style.transform = 'translateY(20px)';
          setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
          }, 100);
        } else {
          section.classList.add('hidden');
        }
      });
    });
  });


  // 10. DYNAMIC CASE STUDY DATABASE & OVERLAY
  const caseStudies = {
    'shoppie': {
      title: 'Shoppie',
      category: 'UI/UX Design • Mobile App',
      heroImg: 'assets/images/Shoppie.png',
      client: 'Boutique Retail Startup',
      timeline: '1 Month (2025)',
      role: 'Lead UI/UX Designer',
      tools: 'Figma, Canva, Prototyping',
      overview: 'Shoppie is a social-centered mobile shopping application designed to bridge the gap between local retail discovery and online purchasing. The app transforms a lonely ecommerce path into a shared digital activity by introducing custom sharing boards, integrated vendor maps, and social-checkout elements.',
      problem: 'Physical fashion boutiques struggle to achieve discoverability, while digital shoppers report screen fatigue and feel disconnected from their social groups when deciding on visual products.',
      research: 'Our team conducted interviews with 15 active digital shoppers. The results indicated that over 80% of users share product screenshots on chat apps like WhatsApp or Instagram before checking out. However, copying links, managing image cards, and keeping track of sizing details created huge friction points.',
      solution: 'We introduced the "Shared Cart" and "Co-Board" system. Users can collaborate in real time on shopping lists, check sizes, vote on item choices, and review local retail paths. An integrated map highlights local boutiques offering pickup, increasing overall sales metrics for physical partners.',
      process: [
        { name: 'Wireframing', desc: 'Mapped out user flows focused on cart collaboration. Kept layout elements extremely basic to emphasize visual cards.' },
        { name: 'Interface Layout', desc: 'Crafted high-fidelity designs inside Figma. Adhered to a sleek dark-themed editorial structure that makes apparel pop.' },
        { name: 'Usability Auditing', desc: 'Iterated on size selection cards and social feeds to minimize purchase friction.' }
      ],
      outcome: 'A 30% increase in product-sharing metrics and a 15% reduction in overall cart abandonment rates during prototype testing.',
      reflection: 'This project proved that designing with social collaboration at the core drastically changes traditional funnel metrics.'
    },
    'tvk': {
      title: 'TVK-Tamilaga Vetri Kondan',
      category: 'UI/UX Design • Civic Portal',
      heroImg: 'assets/images/TVK.png',
      client: 'Civic Initiative',
      timeline: '1 Month (2025)',
      role: 'UI/UX Designer',
      tools: 'Figma, Google Stitch',
      overview: 'TVK is a community engagement and citizen communication mobile interface. It simplifies civic interaction by bringing local announcements, official initiative timelines, municipal task workflows, and community success stories under one highly legible dashboard.',
      problem: 'Citizens face immense information barriers. Official updates are scattered across press outlets and PDF files, leading to civic disengagement and misinformation.',
      research: 'A localized survey showed that 72% of citizens obtain public details from unverified social circles. Users expressed frustration over navigation complexity when looking up municipal works or local development trackers.',
      solution: 'We designed a structured editorial feed that divides information into "Active Announcements", "Ongoing Projects", and "Verified Outcomes". Large, high-contrast serif typography builds professional trust and ensures clean readability across screen sizes.',
      process: [
        { name: 'Information Architecture', desc: 'Grouped civic updates into simple linear feeds. Built custom category icons to distinguish transport, municipal, and health updates.' },
        { name: 'Visual Branding', desc: 'Combined a corporate layout grid with traditional colors, giving the portal a premium, trusted public feel.' },
        { name: 'Interactive Prototypes', desc: 'Designed custom notification transitions and slide-out dashboard cards for simple exploration.' }
      ],
      outcome: '90% of prototype testers rated the portal "High" or "Very High" on reading legibility, citing the clean grid structures as a key upgrade over current sites.',
      reflection: 'Working with complex text hierarchies showed me that minimalist layout discipline is vital when handling massive volumes of data.'
    },
    'sahara-pizza': {
      title: 'Sahara Pizza',
      category: 'UI/UX Design • Web Platform',
      heroImg: 'assets/images/Sahara Pizza Home Page.png',
      client: 'Sahara Pizzeria Chain',
      timeline: '5 Weeks (2024)',
      role: 'UI/UX & Brand Designer',
      tools: 'Figma, Adobe Illustrator, Canva',
      overview: 'Sahara Pizza is a web ordering experience built for a regional artisan pizzeria. The project reimagined traditional ordering steps by creating an immersive, narrative-driven food ordering web platform.',
      problem: 'Most food delivery portals treat menu items as basic line cards. As a result, premium food brands struggle to communicate quality ingredients, reducing checkout value.',
      research: 'Conducted user ordering walk-throughs. Customers indicated they would spend more on specialized ingredients if they could visualize the cooking method and see clear ingredient sourcing details.',
      solution: 'We structured the web app around full-width typography banners and large pizza cards. As users scroll the catalog, ingredients float in behind the items using parallax. An intuitive checkout slider allows quick pizza customizations.',
      process: [
        { name: 'Visual Strategy', desc: 'Crafted premium design cards matching Sahara Pizzerias physical menus. Prioritized high-contrast elements.' },
        { name: 'Responsive Layouts', desc: 'Built flexible grid containers (optimized for mobile ordering and tablet setups in restaurant checkout lines).' },
        { name: 'Micro-Interactions', desc: 'Created smooth canvas animations for card overlays showing fresh ingredients.' }
      ],
      outcome: 'A 40% reduction in checkout abandonment and a 20% increase in cart add-on orders (sides, craft sodas) during user-testing phases.',
      reflection: 'Integrating editorial typography with food ordering highlights how emotional connection drives conversions.'
    },
    'fashion-club': {
      title: 'Fashion Club',
      category: 'UI/UX Design • Web Showcase',
      heroImg: 'assets/images/Fashion Club.png',
      client: 'Artisan Runway Guild',
      timeline: '3 Weeks (2024)',
      role: 'Digital Designer',
      tools: 'Figma, Adobe Photoshop',
      overview: 'Fashion Club is a premium ecommerce and editorial layout designed to display seasonal clothing collections and runway showcases. It combines bold brutalist-inspired layouts with high-end minimal polish.',
      problem: 'Commercial fashion stores use cluttered grids that distract from clothing textures and silhouettes.',
      research: 'Studied award-winning Awwwards luxury portfolios. Discovered that the highest-converting luxury storefronts use minimal borders, massive whitespace, and single-type families to elevate the products.',
      solution: 'Designed a spacious grid utilizing a dark, high-contrast monochrome design system. Large, detailed mockups showcase the clothing in action on a mock MacBook setup.',
      process: [
        { name: 'Grid Structuring', desc: 'Designed asymmetrical grids where images align in overlapping layers, creating a premium runway feel.' },
        { name: 'Typography Scale', desc: 'Set up a dominant serif headline system combined with a light, monospace sub-label grid.' },
        { name: 'Visual Assets Creation', desc: 'Cleaned raw photography, styled texture previews, and exported MacBook mockup layouts.' }
      ],
      outcome: 'Created a stunning, award-worthy interface design that emphasizes visual space, clean alignment, and brand sophistication.',
      reflection: 'Designing minimal interfaces requires absolute precision; when there are few elements, spacing and typography weights must be perfect.'
    },
    'room-theory': {
      title: 'Room Theory',
      category: 'UI/UX Design • Two Themes',
      heroImg: 'assets/images/room theory 2.png',
      client: 'Interior Design Platform',
      timeline: '1 Day',
      role: 'UI/UX Designer',
      tools: 'Figma, Prototyping',
      overview: 'Room Theory is a spatial planning and interior design platform homepage. This project focuses specifically on the Home Page design in two distinct theme variations—a Light Warm Editorial theme (wood and cream) and a Dark Muted Earthy theme (sandstone and olive). Both themes are designed to be exceptionally clear, intuitive, and extremely easy for users to understand at a single glance.',
      problem: 'Most home decoration tools default to a single layout theme, which fails to capture how a client\'s space looks under different light and color tones.',
      research: 'Our study showed that users are highly visual when making interior decisions. Over 85% of users prefer to compare dark and light themes of a layout side-by-side to understand how furniture textures interact with background colors.',
      solution: 'We developed two customized design themes with distinct color palettes. Theme 1 is a light, warm cream palette emphasizing natural light and deep oak accents. Theme 2 is a dark, muted earthy palette emphasizing intimate lighting and warm stone tones. Each theme has a direct interactive Figma prototype link.',
      process: [
        { name: 'Color Consultation', desc: 'Identified wood-heavy and stone-heavy tones that evoke high-end residential luxury.' },
        { name: 'Wireframe Layouts', desc: 'Designed a spacious homepage structure highlighting furniture items, catalog grids, and typography details.' },
        { name: 'Double Theme Implementation', desc: 'Configured light and dark theme prototypes to demonstrate spatial adaptability.' }
      ],
      outcome: 'A dual-concept homepage design that showcases how identical UI wireframes look under entirely different aesthetic vibes.',
      reflection: 'Designing two themes for the same interface highlights how color and tone shift user perception of space and luxury.'
    }
  };

  const caseStudyOverlay = document.getElementById('case-study-overlay');
  const caseStudyContent = document.getElementById('case-study-content');
  const closeCaseStudyBtn = document.getElementById('close-case-study');

  const getShoppieHTML = () => `
    <div class="shoppie-cs">
      <div class="shoppie-section shoppie-hero shoppie-bg-black">
        <span class="case-study-type" style="display: block; margin-bottom: 1rem;">UI/UX DESIGN • MOBILE E-COMMERCE APP</span>
        <h1 class="shoppie-main-title serif-font" style="margin-top: 0; margin-bottom: 3rem;">Shoppie</h1>
        <div class="shoppie-hero-mockup">
           <img src="assets/images/Shoppie.png" alt="Shoppie Mockup">
        </div>
      </div>
      <div class="shoppie-divider"></div>
      <div class="shoppie-meta-grid shoppie-bg-black">
         <div><div class="shoppie-meta-label">ROLE</div><div class="shoppie-meta-value">Lead UI/UX Designer</div></div>
         <div><div class="shoppie-meta-label">TIMELINE</div><div class="shoppie-meta-value">1 Month</div></div>
         <div><div class="shoppie-meta-label">TOOLS</div><div class="shoppie-meta-value">Figma, Canva, Prototyping</div></div>
         <div><div class="shoppie-meta-label">UI FRAMES</div><div class="shoppie-meta-value">15 Mobile Frames</div></div>
      </div>
      <div class="shoppie-divider"></div>
      
      <div class="shoppie-section shoppie-bg-black">
        <div class="shoppie-2col">
          <div class="col-left">
            <h2 class="serif-font">Project <br><i>Overview</i></h2>
          </div>
          <div class="col-right">
            <p><strong>Shoppie</strong> is a modern mobile e-commerce platform designed for seamless fashion and clothing shopping. The project features 15 highly polished mobile frames in Figma, creating an accessible, intuitive, and engaging shopping flow.</p>
            <p>The UI is designed to be extremely user-friendly, allowing customers to easily browse, select, and purchase clothing items with zero friction.</p>
            <a href="https://www.figma.com/proto/lvTFAJJiKW7V5f2c04gDTK/Shoppie?node-id=0-1&t=OveBTRddfq3EuVJd-1" class="shoppie-link serif-font" target="_blank">Figma Link : https://www.figma.com/proto/lvTFAJJiKW7V5f2c04gDTK/Shoppie</a>
          </div>
        </div>
      </div>
      
      <div class="shoppie-section shoppie-bg-black">
        <div class="shoppie-2col">
          <div class="col-left">
            <h2 class="serif-font">Brand <br><i>Color Palette</i></h2>
          </div>
          <div class="col-right">
            <p>The visual design leverages rich, vibrant colors tailored for fashion retail, set against a dark theme to make apparel textures pop:</p>
            <div class="shoppie-color-palette" style="display: flex; gap: 1.5rem; margin-top: 1.5rem; flex-wrap: wrap;">
              <div class="shoppie-color-swatch" style="text-align: center; min-width: 80px;">
                <div style="width: 70px; height: 70px; border-radius: 50%; background-color: #7C4DFF; margin: 0 auto 0.5rem; border: 2px solid rgba(255,255,255,0.2);"></div>
                <strong style="font-size: 0.9rem; display: block;">Royal Violet</strong>
                <div style="font-size: 0.8rem; color: #aaa;">#7C4DFF</div>
              </div>
              <div class="shoppie-color-swatch" style="text-align: center; min-width: 80px;">
                <div style="width: 70px; height: 70px; border-radius: 50%; background-color: #FF4081; margin: 0 auto 0.5rem; border: 2px solid rgba(255,255,255,0.2);"></div>
                <strong style="font-size: 0.9rem; display: block;">Neon Pink</strong>
                <div style="font-size: 0.8rem; color: #aaa;">#FF4081</div>
              </div>
              <div class="shoppie-color-swatch" style="text-align: center; min-width: 80px;">
                <div style="width: 70px; height: 70px; border-radius: 50%; background-color: #121212; margin: 0 auto 0.5rem; border: 2px solid rgba(255,255,255,0.2);"></div>
                <strong style="font-size: 0.9rem; display: block;">Charcoal Black</strong>
                <div style="font-size: 0.8rem; color: #aaa;">#121212</div>
              </div>
              <div class="shoppie-color-swatch" style="text-align: center; min-width: 80px;">
                <div style="width: 70px; height: 70px; border-radius: 50%; background-color: #FFFFFF; margin: 0 auto 0.5rem; border: 2px solid rgba(255,255,255,0.2);"></div>
                <strong style="font-size: 0.9rem; display: block;">Pure White</strong>
                <div style="font-size: 0.8rem; color: #aaa;">#FFFFFF</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="shoppie-divider"></div>

      <div class="shoppie-pillars shoppie-bg-black">
         <div class="shoppie-pillar-card">
           <h3 class="serif-font" style="color: #FF4081;">Scrolling Offers</h3>
           <p class="serif-font">The Home page features a dynamic, auto-scrolling promo carousel at the top, immediately drawing users' attention to active seasonal discounts and fashion flash sales.</p>
         </div>
         <div class="shoppie-pillar-card">
           <h3 class="serif-font" style="color: #FF4081;">Purchase History</h3>
           <p class="serif-font">A dedicated space listing all past clothing purchases. Users can quickly review items, re-order favorites, and manage invoices with one tap.</p>
         </div>
         <div class="shoppie-pillar-card">
           <h3 class="serif-font" style="color: #FF4081;">Track Order</h3>
           <p class="serif-font">An integrated tracking layout enabling users to monitor their active package status, showing courier transit checkpoints, delivery times, and maps.</p>
         </div>
      </div>

      <div class="shoppie-divider"></div>

      <div class="shoppie-section shoppie-bg-black">
        <div class="shoppie-2col">
          <div class="col-left">
            <h2 class="serif-font">Detailed <br><i>Profile Section</i></h2>
          </div>
          <div class="col-right">
            <p>Shoppie includes a highly customized <strong>Profile Page</strong>. This profile contains extensive settings and details, separating user options logically into sections: saved address books, personalized clothing sizes, security settings, payment methods, and reward points.</p>
          </div>
        </div>
      </div>

      <div class="shoppie-divider"></div>

      <div class="shoppie-section shoppie-bg-black">
        <div class="shoppie-2col">
          <div class="col-left">
            <h2 class="serif-font">Design <br><i>Philosophy</i></h2>
          </div>
          <div class="col-right">
            <div style="padding: 2rem; background-color: #151515; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 1.5rem; text-align: left;">
              <h4 style="color: #FF4081; margin-top: 0; margin-bottom: 0.5rem; font-size: 1.1rem;">Clean E-Commerce Flow</h4>
              <p style="margin: 0; font-size: 0.95rem; line-height: 1.6; color: #ccc;">By dividing pages into distinct task modules (e.g. separate profile, purchase history, and tracking panels) and introducing interactive scrolling promo banners, the user flow becomes highly accessible and reduces conversion drop-off.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const getTVKHTML = () => `
    <div class="tvk-cs">
      <div class="tvk-section tvk-hero tvk-bg-black">
        <span class="case-study-type" style="display: block; margin-bottom: 1rem;">UI/UX DESIGN • MOBILE APPLICATION</span>
        <h1 class="tvk-main-title serif-font" style="margin-top: 0; margin-bottom: 3rem;">TVK - Tamilaga Vetri Kondan</h1>
        <div class="tvk-hero-mockup">
           <img src="assets/images/TVK.png" alt="TVK Mockup">
        </div>
      </div>
      <div class="tvk-divider"></div>
      <div class="tvk-meta-grid tvk-bg-black">
         <div><div class="tvk-meta-label">ROLE</div><div class="tvk-meta-value">UI/UX Designer</div></div>
         <div><div class="tvk-meta-label">TIMELINE</div><div class="tvk-meta-value">1 Month</div></div>
         <div><div class="tvk-meta-label">TOOLS</div><div class="tvk-meta-value">Figma, Google Stitch</div></div>
         <div><div class="tvk-meta-label">UI DESIGN</div><div class="tvk-meta-value">User-Friendly (Easy to Understand)</div></div>
      </div>
      <div class="tvk-divider"></div>
      
      <div class="tvk-section tvk-bg-black">
        <div class="tvk-2col">
          <div class="col-left">
            <h2 class="serif-font">Project <br><i>Overview</i></h2>
          </div>
          <div class="col-right">
            <p><strong>Tamilaga Vetri Kondan (TVK)</strong> is an intuitive mobile application designed to bridge the gap between citizens and community services. It enables members to connect, stay informed with the latest news, apply for essential public documents, and track their application status on the go.</p>
            <p>The interface is crafted with a highly clean and user-friendly UI layout, making it extremely easy for users of all age groups to navigate and understand without any technical barriers.</p>
            <a href="https://www.figma.com/proto/JybcBMjgIBnt25FESCbdTp/TVK?node-id=1-2&t=71Pl7Xk0nMcxY2ld-1" class="tvk-link serif-font" target="_blank">Figma Link : https://www.figma.com/proto/JybcBMjgIBnt25FESCbdTp/TVK</a>
          </div>
        </div>
      </div>
      
      <div class="tvk-section tvk-bg-black">
        <div class="tvk-2col">
          <div class="col-left">
            <h2 class="serif-font">Brand <br><i>Color Palette</i></h2>
          </div>
          <div class="col-right">
            <p>The application employs a signature color scheme that reflects community strength, leadership, and trust, drawing inspiration from party colors:</p>
            <div class="tvk-color-palette" style="display: flex; gap: 1.5rem; margin-top: 1.5rem; flex-wrap: wrap;">
              <div class="tvk-color-swatch" style="text-align: center; min-width: 80px;">
                <div style="width: 70px; height: 70px; border-radius: 50%; background-color: #8B0000; margin: 0 auto 0.5rem; border: 2px solid rgba(255,255,255,0.2);"></div>
                <strong style="font-size: 0.9rem; display: block;">Primary Red</strong>
                <div style="font-size: 0.8rem; color: #aaa;">#8B0000</div>
              </div>
              <div class="tvk-color-swatch" style="text-align: center; min-width: 80px;">
                <div style="width: 70px; height: 70px; border-radius: 50%; background-color: #FFD700; margin: 0 auto 0.5rem; border: 2px solid rgba(255,255,255,0.2);"></div>
                <strong style="font-size: 0.9rem; display: block;">Golden Yellow</strong>
                <div style="font-size: 0.8rem; color: #aaa;">#FFD700</div>
              </div>
              <div class="tvk-color-swatch" style="text-align: center; min-width: 80px;">
                <div style="width: 70px; height: 70px; border-radius: 50%; background-color: #1A1A1A; margin: 0 auto 0.5rem; border: 2px solid rgba(255,255,255,0.2);"></div>
                <strong style="font-size: 0.9rem; display: block;">Dark Slate</strong>
                <div style="font-size: 0.8rem; color: #aaa;">#1A1A1A</div>
              </div>
              <div class="tvk-color-swatch" style="text-align: center; min-width: 80px;">
                <div style="width: 70px; height: 70px; border-radius: 50%; background-color: #FFFFFF; margin: 0 auto 0.5rem; border: 2px solid rgba(255,255,255,0.2);"></div>
                <strong style="font-size: 0.9rem; display: block;">Pure White</strong>
                <div style="font-size: 0.8rem; color: #aaa;">#FFFFFF</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="tvk-divider"></div>

      <div class="tvk-pillars tvk-bg-black">
         <div class="tvk-pillar-card">
           <h3 class="serif-font" style="color: #FFD700;">Home & News</h3>
           <p class="serif-font">A dedicated hub showcasing public updates, official announcements, success stories, and local event listings to keep citizens connected in real time.</p>
         </div>
         <div class="tvk-pillar-card">
           <h3 class="serif-font" style="color: #FFD700;">Document Apply</h3>
           <p class="serif-font">A secure online application panel where users can apply for key certificates and documents such as Aadhaar Card, Birth Certificate, and more.</p>
         </div>
         <div class="tvk-pillar-card">
           <h3 class="serif-font" style="color: #FFD700;">Status Check</h3>
           <p class="serif-font">An integrated tracking timeline where citizens can instantly check the real-time processing status of their submitted document applications.</p>
         </div>
      </div>

      <div class="tvk-divider"></div>

      <div class="tvk-section tvk-bg-black">
        <div class="tvk-2col">
          <div class="col-left">
            <h2 class="serif-font">Member <br><i>ID Card Profile</i></h2>
          </div>
          <div class="col-right">
            <p>To establish identity and community pride, the TVK app contains a personalized <strong>Profile Page</strong>. Upon membership verification, it dynamically displays the verified <strong>TVK Member ID Card</strong> with member details, QR code, and official verification badges.</p>
            <div class="tvk-id-card-preview" style="margin-top: 2rem; padding: 2rem; border-radius: 16px; background: linear-gradient(135deg, #2a0000 0%, #110000 100%); border: 1.5px solid #FFD700; max-width: 400px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); text-align: left;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,215,0,0.3); padding-bottom: 1rem; margin-bottom: 1.5rem;">
                <h4 style="margin: 0; color: #FFD700; font-family: var(--font-accent);">TAMILAGA VETRI KONDAN</h4>
                <span style="font-size: 0.7rem; padding: 2px 8px; background-color: #8B0000; color: #fff; border-radius: 20px; font-weight: 700;">MEMBER</span>
              </div>
              <div style="display: flex; gap: 1.5rem; align-items: center;">
                <div style="width: 80px; height: 100px; background-color: #333; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; color: #aaa; font-size: 0.8rem;">PHOTO</div>
                <div style="flex: 1; display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.9rem;">
                  <div><strong style="color: #aaa; font-size: 0.75rem;">NAME:</strong> PRATHAP R M</div>
                  <div><strong style="color: #aaa; font-size: 0.75rem;">MEMBER ID:</strong> TVK-2026-8769</div>
                  <div><strong style="color: #aaa; font-size: 0.75rem;">VERIFIED DATE:</strong> 06-07-2026</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="tvk-divider"></div>

      <div class="tvk-section tvk-bg-black">
        <div class="tvk-2col">
          <div class="col-left">
            <h2 class="serif-font">Design <br><i>Philosophy</i></h2>
          </div>
          <div class="col-right">
            <div style="padding: 2rem; background-color: #151515; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 1.5rem; text-align: left;">
              <h4 style="color: #FFD700; margin-top: 0; margin-bottom: 0.5rem; font-size: 1.1rem;">User-Friendly Accessibility</h4>
              <p style="margin: 0; font-size: 0.95rem; line-height: 1.6; color: #ccc;">Designed with clean grids, bold fonts, and intuitive icons to ensure that even users with minimal smartphone experience can easily apply for documents, check news, and find their ID card instantly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const getSaharaPizzaHTML = () => `
    <div class="sahara-cs">
      <div class="sahara-section sahara-hero sahara-bg-light">
        <span class="case-study-type" style="display: block; margin-bottom: 1rem;">UI/UX DESIGN • WEB UI</span>
        <h1 class="sahara-main-title serif-font" style="margin-top: 0; margin-bottom: 3rem;">Sahara Pizza</h1>
        <div class="sahara-hero-mockup">
           <img src="assets/images/Sahara Pizza Home Page.png" alt="Sahara Pizza Mockup">
        </div>
      </div>
      <div class="sahara-divider"></div>
      <div class="sahara-meta-grid sahara-bg-light">
         <div><div class="sahara-meta-label">ROLE</div><div class="sahara-meta-value">UI Design</div></div>
         <div><div class="sahara-meta-label">TIMELINE</div><div class="sahara-meta-value">3 Days</div></div>
         <div><div class="sahara-meta-label">TOOLS</div><div class="sahara-meta-value">Stitch, AI Studio</div></div>
         <div><div class="sahara-meta-label">PLATFORM</div><div class="sahara-meta-value">Web</div></div>
      </div>
      <div class="sahara-divider"></div>
      <div class="sahara-section sahara-bg-light">
        <div class="sahara-2col">
          <div class="col-left">
            <h2 class="serif-font">The Art of <br><i>Discovery</i></h2>
          </div>
          <div class="col-right">
            <p>Sahara Pizza follows a discovery-first experience, helping users explore local offers and community favorites before ordering. Through strong visual storytelling, curated deals, and intuitive navigation, the design creates an engaging flow that drives exploration, trust, and quick conversion.</p>
            <a href="https://sahara-pizza.vercel.app/" class="sahara-link serif-font" target="_blank">Link : https://sahara-pizza.vercel.app/</a>
          </div>
        </div>
      </div>
      <div class="sahara-section sahara-bg-black">
        <div class="sahara-2col">
          <div class="col-left">
            <h2 class="serif-font">Problem <br><i>Statement</i></h2>
          </div>
          <div class="col-right">
            <p class="serif-font" style="font-size: 1.5rem; line-height: 1.6;">Most pizza ordering apps focus only on fast checkout, limiting user discovery of <i style="color:#C2652A;">“ local offers and community favorites ”</i> which reduces engagement and makes the experience feel repetitive.</p>
          </div>
        </div>
      </div>
      <div class="sahara-pillars sahara-bg-light">
         <div class="sahara-pillar-card">
           <h3 class="serif-font">Limited Discovery</h3>
           <p class="serif-font">Most pizza ordering apps focus only on quick ordering, giving users little space to explore local specials, trending deals, and curated recommendations.</p>
         </div>
         <div class="sahara-pillar-card">
           <h3 class="serif-font">Low Engagement</h3>
           <p class="serif-font">Current platforms act as utility-based ordering tools rather than discovery experiences, reducing repeat interaction and emotional connection.</p>
         </div>
         <div class="sahara-pillar-card">
           <h3 class="serif-font">Exploration Gap</h3>
           <p class="serif-font">The absence of curated recommendations turns ordering into a routine task rather than an enjoyable experience.</p>
         </div>
      </div>
      <div class="sahara-section sahara-bg-light">
        <div class="sahara-2col">
          <div class="col-left">
            <h2 class="serif-font">Research <br><i>Insights</i></h2>
          </div>
          <div class="col-right">
            <div class="sahara-research-card">
              <p>Users prefer visual discovery, curated offers, and community-driven recommendations over static menu browsing, making engagement and trust key factors in improving conversion.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="sahara-divider"></div>
      <div class="sahara-section sahara-bg-light">
        <h2 class="sahara-voice-title">Voice of the User</h2>
        <div class="sahara-quotes-container">
          <div class="sahara-quote-card left-align">
            <h3>Age 21, frequent customer</h3>
            <p>"I order regularly. The experience would be even better if I could find exclusive offers and rewards that are relevant to me."</p>
          </div>
          <div class="sahara-quote-card right-align">
            <h3>Age 21, Food Explorer</h3>
            <p>"When I'm hungry, I don't want to scroll through endless menu items. I want to quickly discover what's popular, what's worth trying, and what deal I shouldn't miss."</p>
          </div>
        </div>
      </div>
      <div class="sahara-section sahara-bg-slate">
        <div class="sahara-2col">
          <div class="col-left">
             <div class="sahara-slideshow">
               <div class="sahara-slide-track">
                 <img src="assets/images/ovan page.png" alt="Ovan Page" class="sahara-solution-img">
                 <img src="assets/images/Patners.png" alt="Partners" class="sahara-solution-img">
                 <img src="assets/images/order page.png" alt="Order Page" class="sahara-solution-img">
                 <img src="assets/images/Profile.png" alt="Profile" class="sahara-solution-img">
               </div>
             </div>
          </div>
          <div class="col-right">
             <h2 class="serif-font">The Solution: <br><i>Discovery-Driven Ordering</i></h2>
             <div class="sahara-solution-point">
               <h4>Visual Appetite Triggers</h4>
               <p>Large food imagery and curated deal cards help users discover exciting options at a glance.</p>
             </div>
             <div class="sahara-solution-point">
               <h4>Community-Powered Recommendations</h4>
               <p>Trending picks, local favorites, and shared ordering experiences build trust and encourage exploration.</p>
             </div>
             <div class="sahara-solution-point">
               <h4>Smart Deal Discovery</h4>
               <p>Personalized offers and location-based recommendations surface the most relevant choices, making decision-making faster and more engaging.</p>
             </div>
          </div>
        </div>
      </div>
      <div class="sahara-divider"></div>
      <div class="sahara-section sahara-bg-light">
        <h2 class="serif-font" style="margin-bottom: 3rem;">Wireframe <i>flows</i></h2>
        <div class="sahara-2col">
          <div class="col-left">
             <img src="assets/images/Wireframe_ Pizza Feed.png" alt="Wireframes" class="sahara-solution-img" id="wireframe-display-img">
          </div>
          <div class="col-right">
             <div class="sahara-wf-point active" data-img="assets/images/Wireframe_ Pizza Feed.png"><h4 class="serif-font">1. Discovery Feed:</h4><p>Users land on a dynamic feed showcasing trending deals, community favorites, and curated pizza recommendations.</p></div>
             <div class="sahara-wf-point" data-img="assets/images/Wireframe_ Special Offers.png"><h4 class="serif-font">2. Explore Offers:</h4><p>Visually rich promotions help users browse personalized deals and discover new menu items effortlessly.</p></div>
             <div class="sahara-wf-point" data-img="assets/images/Wireframe_ Order Map.png"><h4 class="serif-font">3. Pizza Details:</h4><p>Selecting a pizza reveals ingredients, pricing, reviews, and active offers to support informed decisions.</p></div>
             <div class="sahara-wf-point" data-img="assets/images/Wireframe_ Order Map.png"><h4 class="serif-font">4. Place Order:</h4><p>Users customize their pizza, add items to cart, and complete checkout through a smooth ordering flow.</p></div>
             <div class="sahara-wf-point" data-img="assets/images/Wireframe_ Delivery Partners.png"><h4 class="serif-font">5. Community Ordering:</h4><p>Users join nearby group orders, unlock shared discounts, and engage with local food communities.</p></div>
             <div class="sahara-wf-point" data-img="assets/images/Wireframe_ User Profile.png"><h4 class="serif-font">6. Rewards & Profile:</h4><p>Users track orders, manage rewards, save favorites, and receive personalized recommendations.</p></div>
          </div>
        </div>
      </div>
      <div class="sahara-divider"></div>
      <div class="sahara-section sahara-bg-slate">
        <h2 class="sahara-section-title serif-font">Crafted End <i>Experience</i></h2>
        <div class="sahara-ee-mockups">
          <div class="sahara-ee-mockup-full">
            <img src="assets/images/Free MacBook Air 15_ mockup on dark textured rocks (Mockuuups Studio).png" alt="Free MacBook Air 15 Mockup">
          </div>
          <div class="sahara-ee-mockup-split">
            <img src="assets/images/Crafted End Experience 1.png" alt="Crafted End Experience I">
            <img src="assets/images/Crafted End Experience 2.png" alt="Crafted End Experience II">
          </div>
        </div>
      </div>
      <div class="sahara-divider"></div>
      <div class="sahara-section sahara-bg-light">
        <h2 class="sahara-section-title serif-font">Impact <i>Results</i></h2>
        <p class="sahara-impact-quote">“A redesigned discovery-led experience that significantly improved engagement, conversions, and repeat usage across the platform.”</p>
      </div>
      <div class="sahara-section sahara-bg-slate">
        <div class="sahara-2col">
          <div class="col-left">
            <h3>Reflection</h3>
            <p>This project taught me to design beyond screens — focusing on a discovery-led, user-first experience. I learned how structure, visuals, and personalization can shape user decisions while keeping the flow simple and engaging.</p>
          </div>
          <div class="col-right">
            <h3>Key Learnings</h3>
            <ul class="sahara-reflection-list">
              <li>Design for behavior, not just screens.</li>
              <li>Discovery drives engagement.</li>
              <li>Simplicity improves decision-making.</li>
              <li>Personalization creates relevance.</li>
              <li>Great UX balances user and business goals.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;

  const getRoomTheoryHTML = () => `
    <div class="room-theory-cs">
      <div class="room-theory-section room-theory-hero room-theory-bg-black">
        <span class="case-study-type" style="display: block; margin-bottom: 1rem;">UI/UX DESIGN • WEB UI</span>
        <h1 class="room-theory-main-title serif-font" style="margin-top: 0; margin-bottom: 3rem;">Room Theory</h1>
        <div class="room-theory-hero-split" style="display: flex; gap: 2rem; margin-bottom: 2rem; justify-content: center; align-items: stretch; flex-wrap: wrap;">
          <div class="theme-hero-col" style="flex: 1; min-width: 280px; text-align: center; background: #121212; padding: 1.5rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05);">
            <h3 class="serif-font" style="color: #CDCAC5; margin-top: 0;">Theme 1: Light Warm</h3>
            <img src="assets/images/room theory 1.png" alt="Room Theory Light Theme" style="width: 100%; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);">
          </div>
          <div class="theme-hero-col" style="flex: 1; min-width: 280px; text-align: center; background: #121212; padding: 1.5rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05);">
            <h3 class="serif-font" style="color: #928E83; margin-top: 0;">Theme 2: Dark Muted</h3>
            <img src="assets/images/room theory 2.png" alt="Room Theory Dark Theme" style="width: 100%; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);">
          </div>
        </div>
      </div>
      <div class="room-theory-divider"></div>
      <div class="room-theory-meta-grid room-theory-bg-black">
         <div><div class="room-theory-meta-label">ROLE</div><div class="room-theory-meta-value">UI/UX Designer</div></div>
         <div><div class="room-theory-meta-label">TIMELINE</div><div class="room-theory-meta-value">1 Day</div></div>
         <div><div class="room-theory-meta-label">TOOLS</div><div class="room-theory-meta-value">Figma, Prototyping</div></div>
         <div><div class="room-theory-meta-label">THEMES</div><div class="room-theory-meta-value">Light Warm & Dark Muted</div></div>
      </div>
      <div class="room-theory-divider"></div>
      
      <div class="room-theory-section room-theory-bg-black">
        <div class="room-theory-2col">
          <div class="col-left">
            <h2 class="serif-font">Project <br><i>Overview</i></h2>
          </div>
          <div class="col-right">
            <p><strong>Room Theory</strong> is a luxury interior design homepage concept designed to be exceptionally intuitive and extremely easy for users to navigate and understand. This project focuses solely on the <strong>Home Page design</strong>, presenting it in two distinct theme variations: <strong>Light Warm Editorial</strong> and <strong>Dark Muted Earthy</strong>.</p>
            <p>Both themes are homepage-only designs, carefully optimized for visual clarity to ensure that users can effortlessly grasp the spatial layout, product hierarchy, and aesthetic vibe without any complexity.</p>
          </div>
        </div>
      </div>
      
      <!-- THEME 1 SECTION -->
      <div class="room-theory-divider"></div>
      <div class="room-theory-section room-theory-bg-black" style="background: rgba(205, 202, 197, 0.05); padding: 3rem; border-radius: 16px;">
        <div class="room-theory-2col">
          <div class="col-left">
            <h2 class="serif-font" style="color: #CDCAC5; margin: 0;">Theme 1<br><i style="color: #584838;">Light Warm</i></h2>
            <div class="room-theory-color-palette" style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;">
              <div class="room-theory-color-swatch" style="text-align: center; min-width: 70px;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background-color: #CDCAC5; margin: 0 auto 0.5rem; border: 1.5px solid rgba(255,255,255,0.2);"></div>
                <strong style="font-size: 0.8rem; display: block; color: #fff;">Warm Cream</strong>
                <div style="font-size: 0.75rem; color: #aaa;">#CDCAC5</div>
              </div>
              <div class="room-theory-color-swatch" style="text-align: center; min-width: 70px;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background-color: #584838; margin: 0 auto 0.5rem; border: 1.5px solid rgba(255,255,255,0.2);"></div>
                <strong style="font-size: 0.8rem; display: block; color: #fff;">Oak Brown</strong>
                <div style="font-size: 0.75rem; color: #aaa;">#584838</div>
              </div>
              <div class="room-theory-color-swatch" style="text-align: center; min-width: 70px;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background-color: #705848; margin: 0 auto 0.5rem; border: 1.5px solid rgba(255,255,255,0.2);"></div>
                <strong style="font-size: 0.8rem; display: block; color: #fff;">Warm Clay</strong>
                <div style="font-size: 0.75rem; color: #aaa;">#705848</div>
              </div>
              <div class="room-theory-color-swatch" style="text-align: center; min-width: 70px;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background-color: #C4C1BC; margin: 0 auto 0.5rem; border: 1.5px solid rgba(255,255,255,0.2);"></div>
                <strong style="font-size: 0.8rem; display: block; color: #fff;">Dune Sand</strong>
                <div style="font-size: 0.75rem; color: #aaa;">#C4C1BC</div>
              </div>
            </div>
          </div>
          <div class="col-right">
            <p>The <strong>Light Warm Theme</strong> focuses on natural illumination, spaciousness, and editorial breathing room. It is inspired by soft morning light filtering through linen curtains, utilizing warm creams and deep wood oak colors to evoke cozy Scandinavian interiors.</p>
            <p style="margin-bottom: 2rem;">Accents of forest oak and warm clay anchor the layout, making the minimalist text highly legible and professional.</p>
            <a href="https://www.figma.com/proto/9jJSAunVUG41zqbtXMV4EK/Room-theory?node-id=72-91&t=VBhzMvwWTVSDt0jJ-1" class="room-theory-link serif-font" target="_blank" style="display: inline-flex; align-items: center; justify-content: center; background-color: #584838; color: #fff; padding: 0.8rem 1.8rem; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 0.85rem; letter-spacing: 0.05em; transition: 0.3s ease;">
              View Light Theme Prototype &rarr;
            </a>
          </div>
        </div>
      </div>

      <!-- THEME 2 SECTION -->
      <div class="room-theory-divider"></div>
      <div class="room-theory-section room-theory-bg-black" style="background: rgba(146, 142, 131, 0.05); padding: 3rem; border-radius: 16px;">
        <div class="room-theory-2col">
          <div class="col-left">
            <h2 class="serif-font" style="color: #928E83; margin: 0;">Theme 2<br><i style="color: #a09080;">Dark Muted</i></h2>
            <div class="room-theory-color-palette" style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;">
              <div class="room-theory-color-swatch" style="text-align: center; min-width: 70px;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background-color: #928E83; margin: 0 auto 0.5rem; border: 1.5px solid rgba(255,255,255,0.2);"></div>
                <strong style="font-size: 0.8rem; display: block; color: #fff;">Sage Gray</strong>
                <div style="font-size: 0.75rem; color: #aaa;">#928E83</div>
              </div>
              <div class="room-theory-color-swatch" style="text-align: center; min-width: 70px;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background-color: #A09080; margin: 0 auto 0.5rem; border: 1.5px solid rgba(255,255,255,0.2);"></div>
                <strong style="font-size: 0.8rem; display: block; color: #fff;">Sandstone</strong>
                <div style="font-size: 0.75rem; color: #aaa;">#A09080</div>
              </div>
              <div class="room-theory-color-swatch" style="text-align: center; min-width: 70px;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background-color: #8C8070; margin: 0 auto 0.5rem; border: 1.5px solid rgba(255,255,255,0.2);"></div>
                <strong style="font-size: 0.8rem; display: block; color: #fff;">Earthy Umber</strong>
                <div style="font-size: 0.75rem; color: #aaa;">#8C8070</div>
              </div>
              <div class="room-theory-color-swatch" style="text-align: center; min-width: 70px;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background-color: #887868; margin: 0 auto 0.5rem; border: 1.5px solid rgba(255,255,255,0.2);"></div>
                <strong style="font-size: 0.8rem; display: block; color: #fff;">Warm Basalt</strong>
                <div style="font-size: 0.75rem; color: #aaa;">#887868</div>
              </div>
            </div>
          </div>
          <div class="col-right">
            <p>The <strong>Dark Muted Theme</strong> emphasizes intimate lighting, earthy luxury, and sophisticated architectural depth. It is inspired by basalt stones, sage leaves, and dark desert sandstone, bringing a premium, tactile quality to modern spaces.</p>
            <p style="margin-bottom: 2rem;">Muted clay and gray olive tones reduce eye fatigue and make high-contrast furniture images pop, creating a highly premium presentation.</p>
            <a href="https://www.figma.com/proto/9jJSAunVUG41zqbtXMV4EK/Room-theory?node-id=1-2&t=VBhzMvwWTVSDt0jJ-1" class="room-theory-link serif-font" target="_blank" style="display: inline-flex; align-items: center; justify-content: center; background-color: #A09080; color: #fff; padding: 0.8rem 1.8rem; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 0.85rem; letter-spacing: 0.05em; transition: 0.3s ease;">
              View Dark Theme Prototype &rarr;
            </a>
          </div>
        </div>
      </div>
      
      <div class="room-theory-divider"></div>
      
      <div class="room-theory-section room-theory-bg-black">
        <div class="room-theory-2col">
          <div class="col-left">
            <h2 class="serif-font">Design <br><i>Philosophy</i></h2>
          </div>
          <div class="col-right">
            <div style="padding: 2rem; background-color: #151515; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 1.5rem; text-align: left;">
              <h4 style="color: #CDCAC5; margin-top: 0; margin-bottom: 0.5rem; font-size: 1.1rem;">Tone-Based Spatial Adaptability</h4>
              <p style="margin: 0; font-size: 0.95rem; line-height: 1.6; color: #ccc;">By building a design system where background and accent values can swap smoothly (maintaining contrast and font weights), we allow users to explore how living room designs adapt to different atmospheric vibes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const openCaseStudy = (id) => {
    const data = caseStudies[id];
    if (!data) return;

    if (id === 'sahara-pizza') {
      caseStudyOverlay.classList.add('sahara-pizza-mode');
      caseStudyOverlay.classList.remove('tvk-mode');
      caseStudyOverlay.classList.remove('shoppie-mode');
      caseStudyContent.innerHTML = getSaharaPizzaHTML();
      body.style.overflow = 'hidden';
      
      // Delay open class addition to ensure smooth CSS transition
      setTimeout(() => {
        caseStudyOverlay.classList.add('open');
      }, 50);
      
      closeCaseStudyBtn.setAttribute('data-cursor-badge', 'CLOSE');
      bindCursorStates();

      // Bind wireframe clicks
      const wfDisplayImg = document.getElementById('wireframe-display-img');
      const wfPoints = document.querySelectorAll('.sahara-wf-point');
      wfPoints.forEach(point => {
        point.addEventListener('click', () => {
          wfPoints.forEach(p => p.classList.remove('active'));
          point.classList.add('active');
          if (wfDisplayImg) {
            wfDisplayImg.style.opacity = 0;
            setTimeout(() => {
              wfDisplayImg.src = point.getAttribute('data-img');
              wfDisplayImg.style.opacity = 1;
            }, 300);
          }
        });
      });

      return;
    } else if (id === 'tvk') {
      caseStudyOverlay.classList.add('tvk-mode');
      caseStudyOverlay.classList.remove('sahara-pizza-mode');
      caseStudyOverlay.classList.remove('shoppie-mode');
      caseStudyContent.innerHTML = getTVKHTML();
      body.style.overflow = 'hidden';
      
      setTimeout(() => {
        caseStudyOverlay.classList.add('open');
      }, 50);
      
      closeCaseStudyBtn.setAttribute('data-cursor-badge', 'CLOSE');
      bindCursorStates();
      return;
    } else if (id === 'shoppie') {
      caseStudyOverlay.classList.add('shoppie-mode');
      caseStudyOverlay.classList.remove('sahara-pizza-mode');
      caseStudyOverlay.classList.remove('tvk-mode');
      caseStudyOverlay.classList.remove('room-theory-mode');
      caseStudyContent.innerHTML = getShoppieHTML();
      body.style.overflow = 'hidden';
      
      setTimeout(() => {
        caseStudyOverlay.classList.add('open');
      }, 50);
      
      closeCaseStudyBtn.setAttribute('data-cursor-badge', 'CLOSE');
      bindCursorStates();
      return;
    } else if (id === 'room-theory') {
      caseStudyOverlay.classList.add('room-theory-mode');
      caseStudyOverlay.classList.remove('sahara-pizza-mode');
      caseStudyOverlay.classList.remove('tvk-mode');
      caseStudyOverlay.classList.remove('shoppie-mode');
      caseStudyContent.innerHTML = getRoomTheoryHTML();
      body.style.overflow = 'hidden';
      
      setTimeout(() => {
        caseStudyOverlay.classList.add('open');
      }, 50);
      
      closeCaseStudyBtn.setAttribute('data-cursor-badge', 'CLOSE');
      bindCursorStates();
      return;
    } else {
      caseStudyOverlay.classList.remove('sahara-pizza-mode');
      caseStudyOverlay.classList.remove('tvk-mode');
      caseStudyOverlay.classList.remove('shoppie-mode');
      caseStudyOverlay.classList.remove('room-theory-mode');
    }

    // Build Case Study HTML
    let processHTML = '';
    data.process.forEach((step, i) => {
      processHTML += `
        <div class="cs-process-step">
          <h4>0${i+1}. ${step.name}</h4>
          <p>${step.desc}</p>
        </div>
      `;
    });

    const html = `
      <div class="case-study-hero">
        <span class="case-study-type">${data.category}</span>
        <h1 class="case-study-title serif-font">${data.title}</h1>
      </div>

      <div class="case-study-banner">
        <img src="${data.heroImg}" alt="${data.title} Case Study Banner">
      </div>

      <div class="case-study-meta-grid">
        <div class="meta-item">
          <span class="meta-label">Client</span>
          <span class="meta-value">${data.client}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Timeline</span>
          <span class="meta-value">${data.timeline}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">My Role</span>
          <span class="meta-value">${data.role}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Tools</span>
          <span class="meta-value">${data.tools}</span>
        </div>
      </div>

      <div class="case-study-section">
        <h3 class="cs-section-title serif-font">Overview</h3>
        <p>${data.overview}</p>
      </div>

      <div class="case-study-section">
        <h3 class="cs-section-title serif-font">The Problem</h3>
        <p>${data.problem}</p>
      </div>

      <div class="case-study-section">
        <h3 class="cs-section-title serif-font">Research & Insights</h3>
        <p>${data.research}</p>
      </div>

      <div class="case-study-section">
        <h3 class="cs-section-title serif-font">The Solution</h3>
        <p>${data.solution}</p>
      </div>

      <div class="case-study-section">
        <h3 class="cs-section-title serif-font">Design Process</h3>
        ${processHTML}
      </div>

      <div class="case-study-section">
        <h3 class="cs-section-title serif-font">Outcome & Results</h3>
        <p>${data.outcome}</p>
      </div>

      <div class="case-study-section">
        <h3 class="cs-section-title serif-font">Reflection</h3>
        <p>${data.reflection}</p>
      </div>
    `;

    caseStudyContent.innerHTML = html;
    
    // Disable main body scroll
    body.style.overflow = 'hidden';
    
    // Delay open class addition to ensure smooth CSS transition
    setTimeout(() => {
      caseStudyOverlay.classList.add('open');
    }, 50);

    // Make sure Close button registers custom cursor close text
    closeCaseStudyBtn.setAttribute('data-cursor-badge', 'CLOSE');
    bindCursorStates();
  };

  const closeCaseStudy = () => {
    caseStudyOverlay.classList.remove('open');
    setTimeout(() => {
      caseStudyOverlay.classList.remove('sahara-pizza-mode');
      caseStudyOverlay.classList.remove('tvk-mode');
      caseStudyOverlay.classList.remove('shoppie-mode');
      caseStudyOverlay.classList.remove('room-theory-mode');
    }, 500);
    // Restore scrolling based on active view
    if (introReveal.style.transform === 'translateY(-100vh)') {
      body.style.overflow = '';
    }
  };

  // Bind clicks on project cards in both views
  const bindProjectCardClicks = () => {
    const projectCards = document.querySelectorAll('.project-card, .gallery-card:not(.poster-card)');
    projectCards.forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-project-id');
        if (id && id !== 'fashion-club') {
          openCaseStudy(id);
        }
      });
    });

    // Prevent figma link click from flipping card back
    const figmaLinks = document.querySelectorAll('.btn-figma-proto');
    figmaLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    });
  };
  bindProjectCardClicks();

  closeCaseStudyBtn.addEventListener('click', closeCaseStudy);


  // 11. LIGHTBOX IMAGES (POSTERS & 3D DESIGNS)
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeLightboxBtn = document.getElementById('close-lightbox');

  const openLightbox = (imgSrc) => {
    lightboxImg.src = imgSrc;
    body.style.overflow = 'hidden';
    lightboxOverlay.classList.add('open');
    closeLightboxBtn.setAttribute('data-cursor-badge', 'CLOSE');
    bindCursorStates();
  };

  const closeLightbox = () => {
    lightboxOverlay.classList.remove('open');
    if (introReveal.style.transform === 'translateY(-100vh)') {
      body.style.overflow = '';
    }
  };

  // Bind poster clicks
  const bindPosterClicks = () => {
    const posterCards = document.querySelectorAll('.poster-card');
    posterCards.forEach(card => {
      card.addEventListener('click', () => {
        const src = card.getAttribute('data-poster-src') || card.getAttribute('data-poster-src');
        if (src) {
          openLightbox(src);
        } else {
          // Fallback to finding img tag source
          const img = card.querySelector('img');
          if (img) openLightbox(img.src);
        }
      });
    });
  };
  bindPosterClicks();

  closeLightboxBtn.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay || e.target.classList.contains('lightbox-media-wrapper')) {
      closeLightbox();
    }
  });


  // 13. CONTACT FORM SUBMISSIONS
  const contactForm = document.getElementById('contact-form');
  const submitStatus = document.getElementById('submit-status');
  const aboutContactForm = document.getElementById('about-contact-form');
  const aboutSubmitStatus = document.getElementById('about-submit-status');

  const setupContactForm = (form, status) => {
    if (form && status) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = form.querySelector('.btn-submit');
        const btnText = btn.querySelector('span');
        const origText = btnText.textContent;
        
        btn.disabled = true;
        btnText.textContent = 'SENDING...';

        // Gather form data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
          data[key] = value;
        });

        // Submit via Formspree AJAX
        fetch("https://formspree.io/f/xaqvpyol", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(res => {
          // Show success status
          status.classList.add('show');
          btnText.textContent = 'SENT ✓';
          form.reset();
          
          setTimeout(() => {
            status.classList.remove('show');
            btn.disabled = false;
            btnText.textContent = origText;
          }, 5000);
        })
        .catch(err => {
          console.error("Form submission error:", err);
          btnText.textContent = 'FAILED ✗';
          setTimeout(() => {
            btn.disabled = false;
            btnText.textContent = origText;
          }, 3000);
        });
      });
    }
  };

  setupContactForm(contactForm, submitStatus);
  setupContactForm(aboutContactForm, aboutSubmitStatus);


  // 14. WIREFRAME FLOWS INTERACTIVE SECTION
  const wireframeFlowsInit = () => {
    const featureItems = document.querySelectorAll('.feature-item');
    const wireframeImage = document.getElementById('wireframe-image');
    const wireframeLabel = document.getElementById('wireframe-label-text');

    if (!featureItems.length || !wireframeImage) return;

    // Define wireframe images for each feature (you can update these paths)
    const wireframeData = {
      1: {
        label: 'Discovery Feed',
        image: 'assets/images/Sahara Pizza Home Page.png'
      },
      2: {
        label: 'Explore Offers',
        image: 'assets/images/Sahara Pizza Home Page.png'
      },
      3: {
        label: 'Pizza Details',
        image: 'assets/images/Sahara Pizza Home Page.png'
      },
      4: {
        label: 'Place Order',
        image: 'assets/images/Sahara Pizza Home Page.png'
      },
      5: {
        label: 'Community Ordering',
        image: 'assets/images/Sahara Pizza Home Page.png'
      },
      6: {
        label: 'Rewards & Profile',
        image: 'assets/images/Sahara Pizza Home Page.png'
      }
    };

    featureItems.forEach(item => {
      const featureNum = item.getAttribute('data-feature');
      
      item.addEventListener('mouseenter', () => {
        // Remove active class from all items
        featureItems.forEach(i => i.classList.remove('active'));
        // Add active class to current item
        item.classList.add('active');
        
        // Update wireframe display
        if (wireframeData[featureNum]) {
          wireframeImage.style.opacity = '0';
          
          setTimeout(() => {
            wireframeImage.src = wireframeData[featureNum].image;
            wireframeLabel.textContent = wireframeData[featureNum].label;
            wireframeImage.style.opacity = '1';
          }, 300);
        }
      });
    });

    // Keep first item active on page load
    if (featureItems.length > 0) {
      featureItems[0].classList.add('active');
    }
  };

  wireframeFlowsInit();

  // 15. HERO FLOATING ICONS PHYSICS ENGINE
  const initHeroIconsPhysics = () => {
    const container = document.querySelector('.hero-floating-icons-container');
    const icons = Array.from(document.querySelectorAll('.hero-floating-icon'));
    if (!container || !icons.length) return;

    let containerWidth = container.clientWidth;
    let containerHeight = container.clientHeight;

    const radius = 40; // 80px by 80px icons
    const diameter = radius * 2;
    const speedVal = 1.2; // Smooth movement speed

    const initConfigs = {
      figma: { px: 0.08, py: 0.30 },
      xd: { px: 0.06, py: 0.65 },
      photoshop: { px: 0.88, py: 0.20 },
      canva: { px: 0.88, py: 0.60 },
      blender: { px: 0.50, py: 0.15 }
    };

    const balls = icons.map((el) => {
      const tool = el.getAttribute('data-tool') || 'figma';
      const conf = initConfigs[tool] || { px: Math.random() * 0.8 + 0.1, py: Math.random() * 0.8 + 0.1 };

      let x = conf.px * containerWidth - radius;
      let y = conf.py * containerHeight - radius;

      x = Math.max(0, Math.min(containerWidth - diameter, x));
      y = Math.max(0, Math.min(containerHeight - diameter, y));

      const angle = Math.random() * Math.PI * 2;
      const vx = Math.cos(angle) * speedVal;
      const vy = Math.sin(angle) * speedVal;

      return {
        el,
        x,
        y,
        vx,
        vy,
        radius,
        mass: 1
      };
    });

    window.addEventListener('resize', () => {
      const oldWidth = containerWidth;
      const oldHeight = containerHeight;
      containerWidth = container.clientWidth;
      containerHeight = container.clientHeight;

      balls.forEach(ball => {
        ball.x = (ball.x / (oldWidth || 1)) * containerWidth;
        ball.y = (ball.y / (oldHeight || 1)) * containerHeight;
        ball.x = Math.max(0, Math.min(containerWidth - diameter, ball.x));
        ball.y = Math.max(0, Math.min(containerHeight - diameter, ball.y));
      });
    });

    const updatePhysics = () => {
      balls.forEach(ball => {
        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.x <= 0) {
          ball.x = 0;
          ball.vx = Math.abs(ball.vx);
        } else if (ball.x >= containerWidth - diameter) {
          ball.x = containerWidth - diameter;
          ball.vx = -Math.abs(ball.vx);
        }

        if (ball.y <= 0) {
          ball.y = 0;
          ball.vy = Math.abs(ball.vy);
        } else if (ball.y >= containerHeight - diameter) {
          ball.y = containerHeight - diameter;
          ball.vy = -Math.abs(ball.vy);
        }
      });

      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const b1 = balls[i];
          const b2 = balls[j];

          const c1x = b1.x + b1.radius;
          const c1y = b1.y + b1.radius;
          const c2x = b2.x + b2.radius;
          const c2y = b2.y + b2.radius;

          const dx = c2x - c1x;
          const dy = c2y - c1y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = b1.radius + b2.radius;

          if (distance < minDistance) {
            const overlap = minDistance - distance;
            const nx = dx / (distance || 1);
            const ny = dy / (distance || 1);

            b1.x -= nx * overlap * 0.5;
            b1.y -= ny * overlap * 0.5;
            b2.x += nx * overlap * 0.5;
            b2.y += ny * overlap * 0.5;

            const rvx = b1.vx - b2.vx;
            const rvy = b1.vy - b2.vy;
            const vn = rvx * nx + rvy * ny;

            if (vn > 0) {
              b1.vx -= vn * nx;
              b1.vy -= vn * ny;
              b2.vx += vn * nx;
              b2.vy += vn * ny;
            }
          }
        }
      }

      balls.forEach(ball => {
        ball.el.style.left = `${ball.x}px`;
        ball.el.style.top = `${ball.y}px`;
      });

      requestAnimationFrame(updatePhysics);
    };

    requestAnimationFrame(updatePhysics);
  };
  initHeroIconsPhysics();

});
