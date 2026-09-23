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
