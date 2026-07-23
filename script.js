/**
 * ======================================================
 * STARK PORTFOLIO FUNCTIONAL LOGIC (script.js)
 * ======================================================
 * Lightweight, functional interactions supporting the
 * monochrome catalog design system.
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

    // Close menu when a navigation link is clicked
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
    2. SCROLL LINK SPY (Navbar highlight)
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
    3. WIREFRAME CONTACT FORM HANDLER
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
      submitBtn.innerText = 'PROCESSING REQUEST //';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerText = originalText;

        formMessage.className = 'stark-status active';
        formMessage.innerHTML = `
          INQUIRY RECEIVED. THANK YOU, ${name.toUpperCase()}. 
          <br>Simulated response target: aqilasaffia@gmail.com
        `;

        contactForm.reset();

        // Dismiss alert after 8 seconds
        setTimeout(() => {
          formMessage.classList.remove('active');
        }, 8000);
      }, 1000);
    });
  }

});
