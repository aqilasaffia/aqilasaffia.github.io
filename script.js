/**
 * ======================================================
 * SKEUOMORPHIC FILE-FOLDER SCRIPT (script.js)
 * ======================================================
 * Manages tabbed page-flipping and simulated correspondence submissions.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* 
    ------------------------------------------------------
    1. FILE FOLDER TAB INTERACTION
    ------------------------------------------------------
  */
  const folderTabs = document.querySelectorAll('.folder-tab-item');
  const folderPages = document.querySelectorAll('.folder-page');

  folderTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // 1. Remove active states from all tabs
      folderTabs.forEach(t => t.classList.remove('active'));
      
      // 2. Set active state on clicked tab
      tab.classList.add('active');

      // 3. Get target page ID
      const targetId = tab.getAttribute('data-target');
      const targetPage = document.getElementById(`page-${targetId}`);

      if (targetPage) {
        // 4. Hide all pages with a smooth fade-out
        folderPages.forEach(page => {
          page.classList.remove('active');
        });

        // 5. Show targeted page
        targetPage.classList.add('active');
      }
    });
  });

  /* 
    ------------------------------------------------------
    2. CORRESPONDENCE FORM HANDLER
    ------------------------------------------------------
  */
  const contactForm = document.getElementById('scrap-contact-form');
  const statusMsg = document.getElementById('mail-status-msg');

  if (contactForm && statusMsg) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const senderName = document.getElementById('sender-name').value;
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;

      submitBtn.disabled = true;
      submitBtn.innerText = 'STAMPING MAIL //';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerText = originalText;

        statusMsg.className = 'mail-status-box active';
        statusMsg.innerHTML = `
          MEMO SENT. THANK YOU, ${senderName.toUpperCase()}.
          <br>Deliver target: aqilasaffia@gmail.com
        `;

        contactForm.reset();

        // Dismiss status box after 6 seconds
        setTimeout(() => {
          statusMsg.classList.remove('active');
        }, 6000);
      }, 1000);
    });
  }
  /* 
    ------------------------------------------------------
    3. DYNAMIC MOBILE SCALING FOR FIXED DESKTOP VIEW
    ------------------------------------------------------
  */
  function adjustMobileScale() {
    const folder = document.querySelector('.folder-container');
    if (!folder) return;
    
    const screenWidth = window.innerWidth;
    const folderWidth = 1080; // Total width of the desktop folder container
    
    if (screenWidth < folderWidth) {
      const scaleFactor = (screenWidth - 24) / folderWidth; // 12px margin on sides
      folder.style.transform = `scale(${scaleFactor})`;
      folder.style.transformOrigin = 'top center';
      
      // Adjust body height dynamically to fit the scaled folder
      const scaledHeight = folder.getBoundingClientRect().height;
      document.body.style.height = `${scaledHeight + 60}px`;
    } else {
      folder.style.transform = 'none';
      document.body.style.height = 'auto';
    }
  }

  // Bind event listeners
  window.addEventListener('resize', adjustMobileScale);
  adjustMobileScale();
  
  // Re-run after fonts and image sizes settle
  setTimeout(adjustMobileScale, 300);

});
