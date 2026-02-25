// ===== SLIDESHOW =====
const slideUrls = [
  "img/azul marino1.jfif",
  "img/beachcorazon.jfif",
  "img/birdazqueenred.jfif",
  "img/fuxiaa2.jfif"
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

// ===== FUNKCE PRO ODSTRANĚNÍ DIAKRITIKY =====
function removeDiacritics(text) {
  const diacriticsMap = {
    'á': 'a', 'č': 'c', 'ď': 'd', 'é': 'e', 'ě': 'e', 'í': 'i', 'ň': 'n',
    'ó': 'o', 'ř': 'r', 'š': 's', 'ť': 't', 'ú': 'u', 'ů': 'u', 'ý': 'y',
    'ž': 'z', 'Á': 'A', 'Č': 'C', 'Ď': 'D', 'É': 'E', 'Ě': 'E', 'Í': 'I',
    'Ň': 'N', 'Ó': 'O', 'Ř': 'R', 'Š': 'S', 'Ť': 'T', 'Ú': 'U', 'Ů': 'U',
    'Ý': 'Y', 'Ž': 'Z'
  };
  
  return text.replace(/[áčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]/g, function(match) {
    return diacriticsMap[match] || match;
  });
}

// ===== FUNKCE PRO GENEROVÁNÍ QR KÓDU =====
function generateQRCode(amount, message) {
  const qrContainer = document.getElementById('qrContainer');
  
  // Základní údaje
  const accountNumber = '2403037528';
  const bankCode = '2010';
  const cleanAmount = Math.round(amount);
  
  // Vyčištěná zpráva
  let cleanMessage = removeDiacritics(message);
  cleanMessage = cleanMessage.replace(/[^A-Z0-9]/g, '');
  cleanMessage = cleanMessage.substring(0, 16);
  
  // URL z qr-platba.cz
  const qrUrl = `https://api.paylibo.com/paylibo/generator/czech/image?accountNumber=${accountNumber}&bankCode=${bankCode}&amount=${cleanAmount}&currency=CZK&message=${cleanMessage}`;
  
  console.log('QR URL:', qrUrl);
  
  // Vyčistíme kontejner
  qrContainer.innerHTML = '';
  
  // Vytvoříme QR kód
  const qrImg = document.createElement('img');
  qrImg.src = qrUrl;
  qrImg.alt = "QR kód pro platbu";
  qrImg.style.maxWidth = '200px';
  qrImg.style.margin = '0 auto';
  qrImg.style.display = 'block';
  qrImg.style.borderRadius = '8px';
  
  qrContainer.appendChild(qrImg);
  
  // Přidáme textové údaje
  const paymentDetails = document.getElementById('paymentDetails');
  
  const oldManual = document.getElementById('manual-payment-info');
  if (oldManual) oldManual.remove();
  
  const manualInfo = document.createElement('div');
  manualInfo.id = 'manual-payment-info';
  manualInfo.style.marginTop = '1rem';
  manualInfo.style.padding = '0.8rem';
  manualInfo.style.background = '#f9e6e8';
  manualInfo.style.borderRadius = '20px 6px 20px 6px';
  manualInfo.style.fontSize = '0.9rem';
  manualInfo.style.textAlign = 'left';
  manualInfo.innerHTML = `
    <p><strong>📱 Platební údaje:</strong></p>
    <p>Číslo účtu: <strong>${accountNumber}/${bankCode}</strong><br>
    Částka: <strong>${cleanAmount} Kč</strong><br>
    Zpráva: <strong>${cleanMessage}</strong></p>
  `;
  paymentDetails.appendChild(manualInfo);
}

// ===== OBJEDNÁVKA RŮŽÍ =====
document.addEventListener('DOMContentLoaded', () => {
  initSlideshow();

  const previewRose = document.getElementById('previewRose');
  const colorItems = document.querySelectorAll('.color-item');
  const counterValues = {
    'červená': 0,
    'růžová': 0,
    'bílá': 0,
    'krémová': 0,
    'modrá': 0,
    'béžová': 0,
    'oranžová': 0,
    'mint': 0
  };
  
  // Price per rose - 50 Kč
  const pricePerPiece = 50;
  
  // Updated image paths
  const colorImages = {
    'červená': 'img/rojacorona.jfif',
    'růžová': 'img/pinkbonit.jfif',
    'bílá': 'img/white11.jfif',
    'krémová': 'img/beaich1.jfif',
    'modrá': 'img/bluecorona.jfif',
    'béžová': 'img/beachcorazon.jfif',
    'oranžová': 'img/beachoragnelove.jfif',
    'mint': 'img/fuxiaa2.jfif'
  };

  colorItems.forEach(item => {
    item.addEventListener('click', function(e) {
      if (e.target.classList.contains('counter-btn') || e.target.classList.contains('counter-value')) {
        return;
      }
      
      const color = this.dataset.color;
      const image = this.dataset.image;
      
      colorItems.forEach(i => i.classList.remove('selected'));
      this.classList.add('selected');
      
      if (image) {
        previewRose.src = image;
      }
    });
  });

  document.querySelectorAll('.counter-btn.plus').forEach(btn => {
    btn.addEventListener('click', function() {
      const color = this.dataset.color;
      counterValues[color]++;
      document.getElementById(`count-${color}`).textContent = counterValues[color];
      
      if (colorImages[color]) {
        previewRose.src = colorImages[color];
      }
      
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

  document.getElementById('generateOrder').addEventListener('click', function() {
    const totalCount = Object.values(counterValues).reduce((a, b) => a + b, 0);
    
    if (totalCount === 0) {
      alert('Prosím, vyberte alespoň jednu růži.');
      return;
    }
    
    const totalPrice = totalCount * pricePerPiece;
    
    const orderItems = [];
    for (const [color, count] of Object.entries(counterValues)) {
      if (count > 0) {
        let colorLetter = '';
        if (color === 'červená') colorLetter = 'C';
        else if (color === 'růžová') colorLetter = 'R';
        else if (color === 'bílá') colorLetter = 'B';
        else if (color === 'krémová') colorLetter = 'K';
        else if (color === 'modrá') colorLetter = 'M';
        else if (color === 'béžová') colorLetter = 'BE';
        else if (color === 'oranžová') colorLetter = 'O';
        else if (color === 'mint') colorLetter = 'MI';
        
        orderItems.push(`${count}${colorLetter}`);
      }
    }
    
    const orderRef = `RUZE${orderItems.join('')}`;
    document.getElementById('orderReference').textContent = orderRef;
    
    generateQRCode(totalPrice, orderRef);
    
    document.getElementById('paymentDetails').style.display = 'block';
    
    setTimeout(() => {
      document.getElementById('paymentDetails').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  });

  // ===== MODAL PRO OBRÁZKY A VIDEA =====
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modalImage');
  const modalVideo = document.getElementById('modalVideo');
  const closeModal = document.querySelector('.close-modal');

  document.querySelectorAll('.gallery-grid img').forEach(img => {
    img.addEventListener('click', function() {
      modalImg.src = this.src;
      modalImg.style.display = 'block';
      modalVideo.style.display = 'none';
      modal.style.display = 'flex';
    });
  });

  document.querySelectorAll('.reel-item').forEach(item => {
    item.addEventListener('click', function() {
      const videoSrc = this.dataset.videoSrc;
      if (videoSrc) {
        modalVideo.src = videoSrc;
        modalVideo.style.display = 'block';
        modalImg.style.display = 'none';
        modal.style.display = 'flex';
        modalVideo.play();
      } else {
        alert('Video bude přidáno brzy!');
      }
    });
  });

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

  // ===== HAMBURGER MENU =====
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

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
      const submitBtn = this.querySelector('.btn-submit');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> odesílám...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 5000);
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