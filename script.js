const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

document.querySelectorAll('[data-dialog]').forEach(btn => {
  const dialog = document.getElementById(btn.dataset.dialog);
  if (!dialog) return;

  btn.addEventListener('click', () => dialog.showModal());
  dialog.querySelector('.tasks-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
});

document.querySelectorAll('.stack').forEach(stack => {
  const cards = [...stack.querySelectorAll('img')];
  if (cards.length < 2) return;

  stack.classList.add('is-stack');
  const media = stack.parentElement;
  let order = cards.slice();
  let busy = false;

  const caption = media.closest('figure')?.querySelector('figcaption');
  const count = document.createElement('span');
  count.className = 'slide-count';
  media.append(count);

  const render = () => {
    order.forEach((img, i) => {
      img.dataset.pos = Math.min(i, 3);
      img.style.zIndex = order.length - i;
      img.style.transform = '';
    });
    count.textContent = `${cards.indexOf(order[0]) + 1} / ${cards.length}`;
    if (caption) caption.textContent = order[0].alt;
  };

  const next = (side = -1) => {
    if (busy) return;
    busy = true;
    const top = order[0];
    top.style.transform = `translateX(${side * 120}%) rotate(${side * 14}deg)`;
    setTimeout(() => {
      top.classList.add('no-anim');
      order.push(order.shift());
      render();
      requestAnimationFrame(() => top.classList.remove('no-anim'));
      busy = false;
    }, 300);
  };

  const prev = () => {
    if (busy) return;
    order.unshift(order.pop());
    render();
  };

  [['prev', '‹', prev, 'Previous photo'], ['next', '›', () => next(-1), 'Next photo']].forEach(([cls, label, fn, name]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `slide-btn ${cls}`;
    btn.textContent = label;
    btn.setAttribute('aria-label', name);
    btn.addEventListener('click', fn);
    media.append(btn);
  });

  let startX = null;
  let dx = 0;

  stack.addEventListener('pointerdown', (e) => {
    if (busy) return;
    startX = e.clientX;
    dx = 0;
    order[0].classList.add('no-anim');
    stack.setPointerCapture(e.pointerId);
  });

  stack.addEventListener('pointermove', (e) => {
    if (startX === null) return;
    dx = e.clientX - startX;
    order[0].style.transform = `translateX(${dx}px) rotate(${dx / 20}deg)`;
  });

  const release = () => {
    if (startX === null) return;
    startX = null;
    order[0].classList.remove('no-anim');
    if (Math.abs(dx) > 60) next(Math.sign(dx));
    else if (Math.abs(dx) < 5) next(-1);
    else order[0].style.transform = '';
  };

  stack.addEventListener('pointerup', release);
  stack.addEventListener('pointercancel', release);

  render();
});

const mockups = document.querySelectorAll('.mockups');

if (mockups.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let ticking = false;

  const updateMockups = () => {
    ticking = false;
    mockups.forEach(el => {
      const rect = el.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - innerHeight / 2) / innerHeight;
      const t = Math.min(Math.max((0.62 - distance) / 0.42, 0), 1);
      el.style.setProperty('--open', (t * t * (3 - 2 * t)).toFixed(3));
    });
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateMockups);
  };

  addEventListener('scroll', requestUpdate, { passive: true });
  addEventListener('resize', requestUpdate);
  updateMockups();
}

const nfcDemo = document.querySelector('.nfc-demo');

if (nfcDemo) {
  new IntersectionObserver(([entry]) => {
    nfcDemo.classList.toggle('playing', entry.isIntersecting);
  }, { threshold: 0.25 }).observe(nfcDemo);
}

const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const message = document.getElementById('message').value;

    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n${name}\n${email}`);
    window.location.href = `mailto:aqilasaffia@gmail.com?subject=${subject}&body=${body}`;

    contactForm.reset();
  });
}
