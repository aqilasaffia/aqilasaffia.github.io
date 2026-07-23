/**
 * =========================================
 * PORTFOLIO INTERACTIVE LOGIC (script.js)
 * =========================================
 * This script adds dynamic behavior to the portfolio site.
 * 
 * LEARNING NOTE: DOM (Document Object Model)
 * DOM manipulation is how JavaScript communicates with HTML. We select HTML elements
 * using document.querySelector or document.getElementById, then modify their classes,
 * text, or listen to user actions (events).
 */

document.addEventListener('DOMContentLoaded', () => {

  /* 
    -----------------------------------------
    1. MOBILE NAVIGATION MENU TOGGLE
    -----------------------------------------
    Listens to clicks on the hamburger button and slides the navbar in/out.
  */
  const navToggle = document.getElementById('nav-toggle');
  const navLinksList = document.getElementById('nav-links');

  if (navToggle && navLinksList) {
    navToggle.addEventListener('click', () => {
      // Toggle the 'active' class on the menu container
      navLinksList.classList.toggle('active');
      
      // Update hamburger icon between "bars" and "close (X)"
      const icon = navToggle.querySelector('i');
      if (navLinksList.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    // Close mobile menu automatically when a navigation link is clicked
    const links = navLinksList.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinksList.classList.remove('active');
        navToggle.querySelector('i').className = 'fa-solid fa-bars';
      });
    });
  }

  /* 
    -----------------------------------------
    2. HERO TYPING ANIMATION
    -----------------------------------------
    LEARNING NOTE: SetTimeout and Recursion
    We use recursion (a function calling itself) combined with setTimeout to delay
    drawing each letter, creating a natural typing and deleting effect.
  */
  const typedTextSpan = document.getElementById('typed-text');
  const roles = ["Software Engineer", "Network Specialist", "IoT Developer"];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      // Remove last character
      typedTextSpan.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Add next character
      typedTextSpan.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    // Determine typing speed based on status
    let typeSpeed = isDeleting ? 40 : 80;

    // Check if word is fully typed
    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at the end of the word before starting deletion
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Word is fully deleted, move to the next role
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 500; // Pause before typing the next word
    }

    setTimeout(type, typeSpeed);
  }

  // Start the typing animation if the element exists
  if (typedTextSpan) {
    setTimeout(type, 1000);
  }

  /* 
    -----------------------------------------
    3. SCROLL REVEAL (Intersection Observer)
    -----------------------------------------
    LEARNING NOTE: Intersection Observer API
    This modern browser API is highly performant. It alerts us when elements 
    are visible on the screen, letting us add CSS animation classes (.active) 
    only when the user scrolls down to them, instead of loading them all at once.
  */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      // If element is visible in the viewport
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once revealed to maintain state
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15, // Triggers when 15% of the element is visible
    rootMargin: "0px 0px -50px 0px" // Slight offset for better feel
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* 
    -----------------------------------------
    4. SKILL BAR FILL ANIMATION
    -----------------------------------------
    Fills progress bars dynamically when the skills section scrolls into view.
  */
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fillBar = entry.target;
        const targetPercent = fillBar.getAttribute('data-percent');
        fillBar.style.width = targetPercent;
      }
    });
  }, { threshold: 0.2 });

  skillBars.forEach(bar => skillObserver.observe(bar));

  /* 
    -----------------------------------------
    5. SCROLL ACTIVE NAV LINK SPY
    -----------------------------------------
    Highlights the current section's link in the navbar as you scroll.
  */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function scrollActiveLinkSpy() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      // Subtract navbar offset for accurate triggers
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        // Find navbar link matching this section ID and add active class
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}` || link.getAttribute('href') === `index.html#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', scrollActiveLinkSpy);

  /* 
    -----------------------------------------
    6. CONTACT FORM HANDLING (Mock Action)
    -----------------------------------------
    Handles message submissions with user feedback.
  */
  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');

  if (contactForm && formMessage) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Stop standard form submission page reload

      // Retrieve user inputs
      const name = document.getElementById('user-name').value;
      const email = document.getElementById('user-email').value;

      // Show mock sending feedback
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';

      setTimeout(() => {
        // Simulate successful email dispatch
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        formMessage.className = 'form-message success';
        formMessage.innerHTML = `
          <strong>Message Sent!</strong> Thank you ${name}. Your message has been simulated successfully. 
          <br><span style="font-size:0.8rem; opacity:0.8;">In production, this submission would mail to: aqilasaffia@gmail.com</span>
        `;

        // Clear input boxes
        contactForm.reset();

        // Auto hide success alert after 8 seconds
        setTimeout(() => {
          formMessage.style.display = 'none';
        }, 8000);
      }, 1500);
    });
  }

});
