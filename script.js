// ===== SLIDESHOW =====
const slideUrls = [
  "img/venechero.jfif",
  "img/svicky2.jfif",
  "img/recimopink.jfif",
  "img/bluecorona.jfif"
];

let slideIndex = 0;
let slides = [];
let dots = [];
let autoInterval;

function initSlideshow() {
  const container = document.querySelector('.slideshow-container');
  const dotsContainer = document.getElementById('dots');
  if (!container) return;

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

  showSlide(slideIndex);
  startAutoSlide();
}

function showSlide(index) {
  if (index >= slides.length) slideIndex = 0;
  if (index < 0) slideIndex = slides.length - 1;
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
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

// ===== OBJEDNÁVKA RŮŽÍ =====
document.addEventListener('DOMContentLoaded', () => {
  initSlideshow();

  const previewRose = document.getElementById('previewRose');
  const colorItems = document.querySelectorAll('.color-item');
  const counterValues = {
    'červená': 0,
    'růžová': 0,
    'bílá': 0,
    'krémová': 0
  };
  
  const pricePerPiece = 120; // průměrná cena 100-150 Kč
  const bankAccount = "2403037528/2010";
  
  // Mapování barev na obrázky
  const colorImages = {
    'červená': 'img/rojacorona.jfif',
    'růžová': 'img/pinkbonit.jfif',
    'bílá': 'img/redlove.jfif',
    'krémová': 'img/rosasred.jfif'
  };

  // Výběr barvy pro náhled
  colorItems.forEach(item => {
    item.addEventListener('click', function(e) {
      // Nechceme přepínat při kliknutí na tlačítka
      if (e.target.classList.contains('counter-btn') || e.target.classList.contains('counter-value')) {
        return;
      }
      
      const color = this.dataset.color;
      const image = this.dataset.image;
      
      // Odebrat selected ze všech
      colorItems.forEach(i => i.classList.remove('selected'));
      // Přidat selected aktuálnímu
      this.classList.add('selected');
      
      // Změnit náhledový obrázek
      if (image) {
        previewRose.src = image;
      }
    });
  });

  // Čítače pro každou barvu
  document.querySelectorAll('.counter-btn.plus').forEach(btn => {
    btn.addEventListener('click', function() {
      const color = this.dataset.color;
      counterValues[color]++;
      document.getElementById(`count-${color}`).textContent = counterValues[color];
      
      // Aktualizovat náhled na tuto barvu
      if (colorImages[color]) {
        previewRose.src = colorImages[color];
      }
      
      // Označit vybranou barvu
      colorItems.forEach(i => i.classList.remove('selected'));
      document.querySelector(`.color-item[data-color="${color}"]`).classList.add('selected');
      
      updateTotal();
    });
  });

  document.querySelectorAll('.counter-btn.minus').forEach(btn => {
    btn.addEventListener('click', function() {
      const color = this.dataset.color;
      if (counterValues[color] > 0) {
        counterValues[color]--;
        document.getElementById(`count-${color}`).textContent = counterValues[color];
        updateTotal();
      }
    });
  });

  function updateTotal() {
    const totalCount = Object.values(counterValues).reduce((a, b) => a + b, 0);
    const totalPrice = totalCount * pricePerPiece;
    
    document.getElementById('totalCount').textContent = totalCount;
    document.getElementById('totalPrice').textContent = totalPrice;
  }

  // Generování objednávky
  document.getElementById('generateOrder').addEventListener('click', function() {
    const totalCount = Object.values(counterValues).reduce((a, b) => a + b, 0);
    
    if (totalCount === 0) {
      alert('Prosím, vyberte alespoň jednu růži.');
      return;
    }
    
    const totalPrice = totalCount * pricePerPiece;
    
    // Sestavit objednávkový řetězec
    const orderItems = [];
    for (const [color, count] of Object.entries(counterValues)) {
      if (count > 0) {
        orderItems.push(`${count}x ${color}`);
      }
    }
    
    const orderRef = `RŮŽE-${orderItems.join('-')}`;
    document.getElementById('orderReference').textContent = orderRef;
    
    // Vytvořit QR kód pro platbu
    generateQRCode(totalPrice, orderRef);
    
    // Zobrazit platební údaje
    document.getElementById('paymentDetails').style.display = 'block';
    
    // Scroll k platebním údajům
    setTimeout(() => {
      document.getElementById('paymentDetails').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  });

  // ===== FUNKCE PRO GENEROVÁNÍ QR KÓDU =====
  function generateQRCode(amount, message) {
    const qrImg = document.getElementById('qrImage');
    
    // Formát pro Fio banku - Standard pro české banky (SPD)
    // Číslo účtu: 2403037528/2010 -> IBAN: CZ4520100000002403037528
    const iban = 'CZ4520100000002403037528';
    
    // Vytvoření QR platby ve formátu českého standardu
    const qrData = `SPD*1.0*ACC:${iban}*AM:${amount}*CC:CZK*MSG:${message}`;
    
    // Použití API pro generování QR kódu
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
    
    console.log('QR Data:', qrData); // Pro kontrolu
  }

  // ===== MODAL PRO OBRÁZKY A VIDEA =====
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modalImage');
  const modalVideo = document.getElementById('modalVideo');
  const closeModal = document.querySelector('.close-modal');

  // Otevření obrázků v galerii
  document.querySelectorAll('.gallery-grid img').forEach(img => {
    img.addEventListener('click', function() {
      modalImg.src = this.src;
      modalImg.style.display = 'block';
      modalVideo.style.display = 'none';
      modal.style.display = 'flex';
    });
  });

  // Otevření videí
  document.querySelectorAll('.reel-item').forEach(item => {
    item.addEventListener('click', function() {
      const videoSrc = this.dataset.videoSrc;
      if (videoSrc) {
        modalVideo.src = videoSrc;
        modalVideo.style.display = 'block';
        modalImg.style.display = 'none';
        modal.style.display = 'flex';
        modalVideo.play();
      }
    });
  });

  // Zavření modalu
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    modalVideo.pause();
    modalVideo.src = '';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      modalVideo.pause();
      modalVideo.src = '';
    }
  });

  // ===== ZOBRAZIT CELOU GALERII =====
  document.getElementById('viewAllRoses').addEventListener('click', function(e) {
    e.preventDefault();
    const gallery = document.getElementById('roseGallery');
    // Zde by byla logika pro zobrazení skrytých obrázků
    this.style.opacity = '0.5';
    this.textContent = 'všechny obrázky zobrazeny';
  });

  document.getElementById('viewAllAutumn').addEventListener('click', function(e) {
    e.preventDefault();
    const gallery = document.getElementById('autumnGallery');
    this.style.opacity = '0.5';
    this.textContent = 'všechny obrázky zobrazeny';
  });

  // ===== HAMBURGER MENU =====
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Zavření menu po kliknutí na odkaz
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

    // ===== FORMULÁŘ PRO NETLIFY =====
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      // Don't prevent default - let Netlify handle it
      // Just show a loading state or success message
      
      // Optional: Show loading state
      const submitBtn = this.querySelector('.btn-submit');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> odesílám...';
      submitBtn.disabled = true;
      
      // Netlify will handle the rest
      // The page will redirect to a success page or show Netlify's default success message
      
      // Re-enable after 3 seconds in case of error (optional)
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 3000);
    });
  }


  // ===== FADE-IN EFFECT =====
  const sections = document.querySelectorAll('section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
  });
});