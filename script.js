const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');


hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});


navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});


navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        navLinks.forEach(l => l.classList.remove('active'));
        
        link.classList.add('active');
        
        const targetSection = link.getAttribute('data-section');
        const targetElement = document.getElementById(targetSection);
        
        sections.forEach(s => s.classList.remove('active'));
        
        if (targetElement) {
            targetElement.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {

        filterBtns.forEach(b => b.classList.remove('active'));
    
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.2s ease';
            } else {
                item.style.display = 'none';
            }
        });
        // sync dashboard karya count after filtering
        if (typeof updateArtworkCount === 'function') {
            updateArtworkCount();
        }
    });
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);


document.querySelectorAll('.stat-card, .achievement-card, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});



function animateCounters() {
   
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; 
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        setTimeout(updateCounter, Math.random() * 500);
    });
}

const dashboardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            dashboardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const dashboardSection = document.getElementById('dashboard');
if (dashboardSection) {
    dashboardObserver.observe(dashboardSection);
}


const images = document.querySelectorAll('img');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.style.opacity = '1';
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';
    imageObserver.observe(img);
});



window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});


const currentYear = new Date().getFullYear();
const footerYear = document.querySelector('.footer-bottom p');
if (footerYear) {
    footerYear.textContent = footerYear.textContent.replace('2024', currentYear);
}




function createModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <button class="modal-nav prev" aria-label="Sebelumnya">&#10094;</button>
            <button class="modal-nav next" aria-label="Berikutnya">&#10095;</button>
            <div class="modal-slides">
                <div class="slide slide-image active">
                    <img class="modal-image" src="" alt="">
                </div>
                <div class="slide slide-info">
                    <div class="modal-info">
                        <h3 class="modal-title"></h3>
                        <p class="modal-author"></p>
                        <p class="modal-date"></p>
                        <p class="modal-description"></p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);

    const modalStyles = `
        .modal {
            display: none;
            position: fixed;
            z-index: 2000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 15px;
            max-width: 90%;
            max-height: 90%;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-slides {
            position: relative;
            width: 90vw;
            max-width: 900px;
            height: auto;
            max-height: 85vh;
            background: #fff;
        }

        .slide {
            display: none;
        }
        .slide.active {
            display: block;
        }
        
        .modal-image {
            width: 100%;
            height: auto;
            max-height: 70vh;
            object-fit: contain;
        }
        
        .modal-info {
            padding: 2rem;
            text-align: center;
        }
        
        .modal-title {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            color: #333;
        }
        
        .modal-author {
            color: #666;
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
        }
        
        .modal-date {
            color: #888;
            font-size: 0.95rem;
            margin-bottom: 0.75rem;
        }

        .modal-description {
            color: #444;
            font-size: 1rem;
            line-height: 1.6;
            margin-top: 0.5rem;
        }
        
        .close {
            position: absolute;
            top: 1rem;
            right: 1.5rem;
            font-size: 2rem;
            font-weight: bold;
            color: white;
            cursor: pointer;
            z-index: 2001;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .close:hover {
            color: #667eea;
        }

        .modal-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0,0,0,0.5);
            color: #fff;
            border: none;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            cursor: pointer;
            z-index: 2001;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
        }
        .modal-nav:hover { background: rgba(0,0,0,0.7); }
        .modal-nav.prev { left: 1rem; }
        .modal-nav.next { right: 1rem; }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = modalStyles;
    document.head.appendChild(styleSheet);
    
    return modal;
}


const modal = createModal();
const modalImage = modal.querySelector('.modal-image');
const modalTitle = modal.querySelector('.modal-title');
const modalAuthor = modal.querySelector('.modal-author');
const modalDescription = modal.querySelector('.modal-description');
const modalDate = modal.querySelector('.modal-date');
const closeBtn = modal.querySelector('.close');
const prevBtn = modal.querySelector('.modal-nav.prev');
const nextBtn = modal.querySelector('.modal-nav.next');
const slides = () => Array.from(modal.querySelectorAll('.slide'));
let currentSlideIndex = 0;

function showSlide(index) {
    const allSlides = slides();
    if (!allSlides.length) return;
    currentSlideIndex = ((index % allSlides.length) + allSlides.length) % allSlides.length;
    allSlides.forEach((s, i) => {
        s.classList.toggle('active', i === currentSlideIndex);
    });
}

prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showSlide(currentSlideIndex - 1);
});

nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showSlide(currentSlideIndex + 1);
});


galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const title = item.querySelector('h3');
        const author = item.querySelector('p');
        const description = item.querySelector('h4');
        const uploaded = item.getAttribute('data-uploaded');
        
        if (img && title && author) {
            modalImage.src = img.src;
            modalImage.alt = img.alt;
            modalTitle.textContent = title.textContent;
            modalAuthor.textContent = author.textContent;
            modalDescription.textContent = description ? description.textContent : '';

            if (uploaded) {
                const dateObj = new Date(uploaded);
                const formatted = isNaN(dateObj.getTime())
                    ? uploaded
                    : dateObj.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
                modalDate.style.display = 'block';
                modalDate.textContent = formatted;
            } else {
                modalDate.style.display = 'none';
                modalDate.textContent = '';
            }

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            showSlide(0); // start on image slide
        }
    });
});


closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});


document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'block') {
        if (e.key === 'Escape') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        } else if (e.key === 'ArrowRight') {
            showSlide(currentSlideIndex + 1);
        } else if (e.key === 'ArrowLeft') {
            showSlide(currentSlideIndex - 1);
        }
    }
});




document.addEventListener('DOMContentLoaded', () => {
    // Set first section as active
    const firstSection = document.querySelector('.section');
    if (firstSection) {
        firstSection.classList.add('active');
    }
    
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    
    const cards = document.querySelectorAll('.stat-card, .achievement-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    updateArtworkCount();
});

function updateArtworkCount() {
    const visibleItems = Array.from(document.querySelectorAll('.gallery-item'))
        .filter(item => item.style.display !== 'none');

    const statItems = document.querySelectorAll('.hero-stats .stat-item');
    let karyaNumberEl = null;
    statItems.forEach(stat => {
        const label = stat.querySelector('.stat-label');
        if (label && label.textContent.trim().toLowerCase() === 'karya') {
            karyaNumberEl = stat.querySelector('.stat-number');
        }
    });

    if (karyaNumberEl) {
        const count = visibleItems.length;
        karyaNumberEl.setAttribute('data-target', String(count));
        karyaNumberEl.textContent = String(count);
    }
}
