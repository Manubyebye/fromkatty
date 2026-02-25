// ===== HAMBURGER MENU =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
}

document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('active');
    navMenu?.classList.remove('active');
  });
});

// ===== FILTER TABS =====
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

// Function to filter items
function filterItems(filterValue) {
  let visibleCount = 0;
  
  galleryItems.forEach(item => {
    if (filterValue === 'all' || item.dataset.category === filterValue) {
      item.style.display = 'block';
      visibleCount++;
    } else {
      item.style.display = 'none';
    }
  });
  
  // Show/hide no results message
  const existingNoResults = document.querySelector('.no-results');
  if (visibleCount === 0) {
    if (!existingNoResults) {
      const message = document.createElement('div');
      message.className = 'no-results';
      message.innerHTML = '<i class="fas fa-images"></i><p>Žádné obrázky v této kategorii</p>';
      document.querySelector('.gallery-grid').appendChild(message);
    }
  } else {
    if (existingNoResults) existingNoResults.remove();
  }
}

// Add filter click handlers
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterItems(btn.dataset.filter);
  });
});

// ===== MODAL PRO ZVĚTŠENÍ =====
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const closeModal = document.querySelector('.close-modal');

// Open modal when clicking on gallery item
galleryItems.forEach(item => {
  item.addEventListener('click', function() {
    const img = this.querySelector('img');
    const caption = this.querySelector('.overlay span').textContent;
    
    if (modal && modalImg && modalCaption) {
      modal.style.display = 'flex';
      modalImg.src = img.src;
      modalCaption.textContent = caption;
      document.body.style.overflow = 'hidden';
    }
  });
});

// Close modal
if (closeModal) {
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });
}

if (modal) {
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal?.style.display === 'flex') {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// ===== LAZY LOADING WITH FADE =====
const images = document.querySelectorAll('.gallery-item img');
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.5s ease';
      
      if (img.complete) {
        img.style.opacity = '1';
      } else {
        img.onload = () => {
          img.style.opacity = '1';
        };
      }
      imageObserver.unobserve(img);
    }
  });
}, { threshold: 0.1 });

images.forEach(img => {
  imageObserver.observe(img);
});

// ===== SMOOTH SCROLL TO TOP =====
const scrollTopBtn = document.createElement('button');
scrollTopBtn.className = 'scroll-top';
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(scrollTopBtn);

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollTopBtn.style.display = 'block';
  } else {
    scrollTopBtn.style.display = 'none';
  }
});

// ===== INITIAL FILTER CHECK =====
// Ensure all items are visible initially
filterItems('all');