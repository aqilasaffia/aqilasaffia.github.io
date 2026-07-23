/**
 * ======================================================
 * PORTFOLIO CLIENT LOGIC (script.js)
 * ======================================================
 * Minimalist, highly optimized animations and interaction handling.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* 
    ------------------------------------------------------
    1. MOBILE MENU TRIGGERS
    ------------------------------------------------------
  */
  const navToggle = document.getElementById('nav-toggle');
  const navLinksList = document.getElementById('nav-links');

  if (navToggle && navLinksList) {
    navToggle.addEventListener('click', () => {
      navLinksList.classList.toggle('active');
      const icon = navToggle.querySelector('i');
      if (navLinksList.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    // Dismiss menu on anchor clicks
    const links = navLinksList.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinksList.classList.remove('active');
        navToggle.querySelector('i').className = 'fa-solid fa-bars';
      });
    });
  }

  /* 
    ------------------------------------------------------
    2. TYPING RECURSION (Hero)
    ------------------------------------------------------
  */
  const typedTextSpan = document.getElementById('typed-text');
  const roles = ["Software Engineer", "Laravel & PHP Specialist", "Flutter Mobile Developer"];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      typedTextSpan.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedTextSpan.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 30 : 60;

    if (!isDeleting && charIndex === currentRole.length) {
      typeSpeed = 2200; // Wait longer once word is typed
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 400; // Brief pause before typing next
    }

    setTimeout(type, typeSpeed);
  }

  if (typedTextSpan) {
    setTimeout(type, 1000);
  }

  /* 
    ------------------------------------------------------
    3. ACTIVE LINK SPY (Scroll tracking)
    ------------------------------------------------------
  */
  const sections = document.querySelectorAll('main section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function scrollActiveLinkSpy() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
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
    ------------------------------------------------------
    4. FORM INTERACTION (Simulated Feedback)
    ------------------------------------------------------
  */
  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');

  if (contactForm && formMessage) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('user-name').value;
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;
      
      submitBtn.disabled = true;
      submitBtn.innerText = 'Sending...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerText = originalText;

        formMessage.className = 'form-status success';
        formMessage.innerHTML = `
          <strong>Message sent successfully!</strong> Thank you, ${name}. 
          <br><span style="font-size:0.8rem; opacity:0.8;">Recruiter inquiry simulated for: aqilasaffia@gmail.com</span>
        `;

        contactForm.reset();

        setTimeout(() => {
          formMessage.style.display = 'none';
        }, 8000);
      }, 1200);
    });
  }

});
