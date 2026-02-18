// ===== script.js =====

// Slideshow – opraveno pro okamžité zobrazení prvního obrázku
const slideUrls = [
  "img/armennano-pink-rose-5270511_1280.jpg",
  "img/armennano-red-roses-3794768_1280.jpg",
  "img/armennano-rose-4482544_1280.jpg",
  "img/amydiycraft-crepe-paper-4024134_1280.jpg",
  "img/amydiycraft-handmade-4022208_1280.jpg"
];

let slideIndex = 1;
let slides = [];
let dots = [];
let autoInterval;

function initSlideshow() {
  const container = document.querySelector('.slideshow-container');
  const dotsContainer = document.getElementById('dots');
  
  slideUrls.forEach((url, i) => {
    const slideDiv = document.createElement('div');
    slideDiv.className = 'mySlides';
    slideDiv.style.backgroundImage = `url('${url}')`;
    container.appendChild(slideDiv);
    
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.setAttribute('onclick', `jumpToSlide(${i})`);
    dotsContainer.appendChild(dot);
  });
  
  slides = document.querySelectorAll('.mySlides');
  dots = document.querySelectorAll('.dot');
  
  // Zajistí, že první slide je aktivní ihned
  showSlide(slideIndex);
  startAutoSlide();
}

function showSlide(index) {
  if (index >= slides.length) slideIndex = 0;
  if (index < 0) slideIndex = slides.length - 1;
  
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  
  slides[slideIndex].classList.add('active');
  dots[slideIndex].classList.add('active');
}

function changeSlide(n) {
  stopAutoSlide();
  slideIndex += n;
  showSlide(slideIndex);
  startAutoSlide();
}

function jumpToSlide(n) {
  stopAutoSlide();
  slideIndex = n;
  showSlide(slideIndex);
  startAutoSlide();
}

function startAutoSlide() {
  autoInterval = setInterval(() => {
    slideIndex++;
    showSlide(slideIndex);
  }, 5000);
}

function stopAutoSlide() {
  clearInterval(autoInterval);
}

window.changeSlide = changeSlide;
window.jumpToSlide = jumpToSlide;

// ===== LIGHTBOX PRO VIDEA =====
const modal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const closeModal = document.querySelector('.close-modal');

// Otevření modalu po kliknutí na video kartu nebo reel
document.querySelectorAll('.video-card, .reel-item').forEach(card => {
  card.addEventListener('click', function(e) {
    const videoSrc = this.dataset.videoSrc;
    if (videoSrc) {
      modalVideo.src = videoSrc;
      modal.style.display = 'flex';
      modalVideo.play(); // automatické přehrání
    } else {
      alert('Video ještě není vloženo. Přidejte odkaz do data-video-src.');
    }
  });
});

// Zavření modalu
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
  modalVideo.pause();
  modalVideo.src = '';
});

// Kliknutí mimo modal zavře
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    modalVideo.pause();
    modalVideo.src = '';
  }
});

// ===== SCROLL REVEAL (fade-in) =====
const fadeElements = document.querySelectorAll('.section-padding, .section-pink, .prices-grid, .gallery-grid, .reels-scroll, .contact-wrapper');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

fadeElements.forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ===== SPUŠTĚNÍ SLIDESHOW =====
document.addEventListener('DOMContentLoaded', () => {
  initSlideshow();
  
  const hero = document.querySelector('.hero');
  hero.addEventListener('mouseenter', stopAutoSlide);
  hero.addEventListener('mouseleave', startAutoSlide);
});