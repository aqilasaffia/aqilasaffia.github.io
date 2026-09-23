const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const filters = document.querySelectorAll('.filters button');
const cards = document.querySelectorAll('.card[data-tags]');

function applyFilter(tag) {
  filters.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === tag));
  cards.forEach(card => {
    card.hidden = tag !== 'all' && !card.dataset.tags.split(' ').includes(tag);
  });
}

if (filters.length) {
  filters.forEach(btn => btn.addEventListener('click', () => applyFilter(btn.dataset.filter)));

  const fromHash = location.hash.slice(1);
  if ([...filters].some(btn => btn.dataset.filter === fromHash)) applyFilter(fromHash);
}

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
