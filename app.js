const digitalTitles = [
  'Принцесса Алтея в маковом поле',
  'Концепт-арт Фиалки',
  'Концепт-арт Лайлы',
  'Зарисовка Леи',
  'Шарлота и Флоренс болтают',
  'Коллаж с Лайлой',
  'Таблица эмоций Тома',
  'Таблица эмоций Лайлы',
  'Лайла в стране Морфея (во сне)',
  'Концепт-арт сирены и лже-русалки',
  'Я (посередине) и мои персонажи',
  'Мини-комикс Тома и Одиночной души',
  'Том в 111 лет на скейте',
  'Флоренс и Анж в полный рост',
  'Морок и Лайла',
  'Том и Лайла спустя сто лет после основных событий',
  'Концепт-арт моего аватара',
  'Пример обложки к пилотной серии',
  'Концепт-арт Томико',
  'Рисунок девушки-мотылька',
  'Концепт-арт кота Гида',
  'Рисунок с антропоморфными животными-тортами',
  'Шел 01',
  'Шел 02',
  'Шел 04',
  'Персонаж №26',
  'Шел 03',
  ...Array.from({length: 33}, (_, i) => `Иллюстрация №${i + 28}`)
];

const academicTitles = [
  'Раскадровка к сказке «Теремок»',
  'Раскадровка по эпизоду из сказки «Снежная королева»',
  'Раскадровка к сказке «Курочка Ряба»',
  'Раскадровка к сказке «Гуси-лебеди»',
  'Раскадровка к сказке «Красная Шапочка»',
  'Автопортрет, карандаш',
  'Натюрморт, графика',
  'Натюрморт, графика',
  'Натюрморт, графика',
  'Натюрморт, графика',
  'Натюрморт, гуашь',
  'Растение в горшке, акварель',
  'Натюрморт, акварель',
  'Натюрморт, гуашь',
  'Натюрморт, акварель',
  '«Ужин вегана», акварель',
  'Натюрморт, акварель',
  'Натюрморт, гуашь',
  'Академическая работа №19',
  'Натюрморт в стиле абстракционизма, гуашь',
  'Натюрморт, графика',
  'Натюрморт, гуашь'
];

const animationTitles = [
  'КривоКот — мультфильм',
  'Анимация с печкой',
  'Анимация плачущей девушки'
];

const works = {
  digital: Array.from({length: 60}, (_, i) => ({
    src: `assets/digital/digital-${String(i + 1).padStart(2, '0')}.jpg`,
    title: digitalTitles[i],
    meta: 'Цифровая иллюстрация · 2026'
  })),
  academic: Array.from({length: 22}, (_, i) => ({
    src: `assets/academic/academic-v3-${String(i + 1).padStart(2, '0')}.jpg`,
    title: academicTitles[i],
    meta: 'Учебная работа · 2025–2026'
  }))
};

const galleryItems = [];
function makeGallery(type) {
  const root = document.querySelector(`#${type}-gallery`);
  works[type].forEach((work, index) => {
    const globalIndex = galleryItems.push(work) - 1;
    const card = document.createElement('button');
    card.className = 'art-card reveal';
    card.setAttribute('aria-label', `Открыть: ${work.title}`);
    const loading = type === 'academic' ? '' : ' loading="lazy" decoding="async"';
    card.innerHTML = `<figure><img src="${work.src}" alt="${work.title}"${loading}><figcaption><span>${work.title}</span><small>${work.meta}</small></figcaption></figure>`;
    const image = card.querySelector('img');
    image.addEventListener('error', () => {
      if (image.dataset.retried) return;
      image.dataset.retried = 'true';
      const separator = image.src.includes('?') ? '&' : '?';
      image.src = `${image.src}${separator}retry=1`;
    });
    card.addEventListener('click', () => openLightbox(globalIndex));
    root.append(card);
  });
}
makeGallery('digital');
makeGallery('academic');

const videoRoot = document.querySelector('#video-gallery');
for (let i = 1; i <= 3; i++) {
  const figure = document.createElement('figure');
  figure.className = 'video-card reveal';
  const number = String(i).padStart(2, '0');
  figure.innerHTML = `<video controls playsinline preload="metadata" poster="assets/video/poster-${number}.png" src="assets/video/animation-${number}.mp4"></video><figcaption><span>${animationTitles[i - 1]}</span><small>2026</small></figcaption>`;
  videoRoot.append(figure);
}

const dialog = document.querySelector('.lightbox');
const dialogImage = dialog.querySelector('img');
let current = 0;
function showCurrent() {
  const work = galleryItems[current];
  dialogImage.src = work.src;
  dialogImage.alt = work.title;
  dialog.querySelector('figcaption span').textContent = work.title;
  dialog.querySelector('figcaption small').textContent = work.meta;
}
function openLightbox(index) { current = index; showCurrent(); dialog.showModal(); document.body.style.overflow = 'hidden'; }
function move(step) { current = (current + step + galleryItems.length) % galleryItems.length; showCurrent(); }
dialog.querySelector('.close').onclick = () => dialog.close();
dialog.querySelector('.prev').onclick = () => move(-1);
dialog.querySelector('.next').onclick = () => move(1);
dialog.addEventListener('close', () => { document.body.style.overflow = ''; });
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
document.addEventListener('keydown', e => { if (!dialog.open) return; if (e.key === 'ArrowLeft') move(-1); if (e.key === 'ArrowRight') move(1); });

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), {rootMargin: '80px 0px'});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const menuButton = document.querySelector('.menu-button');
const menu = document.querySelector('.menu');
menuButton.onclick = () => { const open = menu.classList.toggle('open'); menuButton.setAttribute('aria-expanded', open); };
menu.querySelectorAll('a').forEach(a => a.onclick = () => menu.classList.remove('open'));

const character = document.querySelector('.hero-character');
character.addEventListener('click', () => { character.classList.remove('bounce'); void character.offsetWidth; character.classList.add('bounce'); });

const guide = document.querySelector('.alice-guide');
const guideText = guide.querySelector('span');
const sections = [...document.querySelectorAll('main > section')];
const guideLines = new Map([
  ['digital', 'Это мои персонажи!'],
  ['animation', 'А теперь — движение!'],
  ['academic', 'Ещё я рисую с натуры'],
  ['contacts', 'Спасибо за просмотр!']
]);
function updateGuide() {
  const active = [...sections].reverse().find(section => section.getBoundingClientRect().top < innerHeight * .55);
  const insidePage = window.scrollY > window.innerHeight * .65 && active?.id !== 'contacts';
  guide.classList.toggle('visible', insidePage);
  guideText.textContent = guideLines.get(active?.id) || 'Листай дальше!';
}
window.addEventListener('scroll', updateGuide, {passive: true});
guide.addEventListener('click', () => {
  const next = sections.find(section => section.getBoundingClientRect().top > 80);
  (next || document.querySelector('#contacts')).scrollIntoView({behavior: 'smooth'});
  guide.classList.add('talking');
  setTimeout(() => guide.classList.remove('talking'), 1400);
});
updateGuide();

fetch('assets/about/portfolio.pdf', {method: 'HEAD'}).then(response => {
  if (response.ok) document.querySelector('.download').hidden = false;
}).catch(() => {});
