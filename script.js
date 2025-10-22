// Professional Portfolio JavaScript - Enhanced UX
'use strict';

// ===== 0. Loading Screen =====
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loadingScreen');
  
  setTimeout(() => {
    if(loadingScreen){
      loadingScreen.classList.add('hidden');
      // Remove from DOM after animation
      setTimeout(() => loadingScreen.remove(), 500);
    }
    document.body.classList.add('loaded');
  }, 1500); // Show loading for 1.5 seconds
  
  // Update dynamic stats
  updateHeroStats();
});

// ===== Dynamic Hero Stats =====
function updateHeroStats(){
  // Count ALL projects (both individual and academic)
  const individualProjects = document.querySelectorAll('#individual-projects [data-category]');
  const academicProjects = document.querySelectorAll('#projects .card');
  const totalProjects = individualProjects.length + academicProjects.length;
  
  const projectCountEl = document.getElementById('projectCount');
  if(projectCountEl){
    projectCountEl.textContent = totalProjects;
  }
  
  // Count technologies from all project tags (both sections)
  const allTags = document.querySelectorAll('.tags span');
  const uniqueTechs = new Set();
  allTags.forEach(tag => uniqueTechs.add(tag.textContent.trim()));
  const techCountEl = document.getElementById('techCount');
  if(techCountEl && uniqueTechs.size > 0){
    techCountEl.textContent = uniqueTechs.size;
  }
  
  // Count skill categories
  const skillCards = document.querySelectorAll('#skills .card');
  const skillCountEl = document.getElementById('skillCount');
  if(skillCountEl && skillCards.length > 0){
    skillCountEl.textContent = skillCards.length;
  }
}

// ===== 1. Update year in footer =====
const yearEl = document.getElementById('year');
if(yearEl){ 
  yearEl.textContent = new Date().getFullYear(); 
}

// ===== 2. Mobile menu toggle =====
const menuBtn = document.getElementById('menu');
const nav = document.getElementById('nav');

if(menuBtn && nav){
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    nav.classList.toggle('open');
    menuBtn.textContent = nav.classList.contains('open') ? '✕' : '☰';
    menuBtn.setAttribute('aria-expanded', nav.classList.contains('open'));
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if(!nav.contains(e.target) && !menuBtn.contains(e.target)){
      nav.classList.remove('open');
      menuBtn.textContent = '☰';
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close menu on link click
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuBtn.textContent = '☰';
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

// ===== 3. Header scroll effect =====
const siteHeader = document.querySelector('.site-header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if(currentScroll > 50){
    siteHeader.classList.add('scrolled');
  } else {
    siteHeader.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
}, { passive: true });

// ===== 4. Scroll Progress Indicator =====
const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress(){
  if(!scrollProgress) return;
  
  const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  
  scrollProgress.style.width = scrolled + '%';
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });

// ===== 5. Back to Top Button =====
const backToTop = document.createElement('button');
backToTop.className = 'back-to-top';
backToTop.innerHTML = '↑';
backToTop.setAttribute('aria-label', 'Back to top');
backToTop.setAttribute('title', 'Back to top');
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
  if(window.pageYOffset > 300){
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ===== 6. Active Navigation Highlighting =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav a[data-section]');

function updateActiveNav(){
  const scrollY = window.pageYOffset;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
      navLinks.forEach(link => {
        link.classList.remove('active');
        if(link.getAttribute('data-section') === sectionId){
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav(); // Initial call

// ===== 7. Project Filtering =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('[data-category]');
const projectCountBadge = document.querySelector('.project-count');

function updateProjectCount(){
  const visibleProjects = document.querySelectorAll('[data-category]:not(.hidden)').length;
  if(projectCountBadge){
    projectCountBadge.textContent = visibleProjects;
  }
  
  // Also update hero stats
  const heroProjectCount = document.getElementById('projectCount');
  if(heroProjectCount){
    const totalProjects = document.querySelectorAll('[data-category]').length;
    heroProjectCount.textContent = totalProjects;
  }
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.getAttribute('data-filter');
    
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Filter projects
    projectCards.forEach(card => {
      const categories = card.getAttribute('data-category').split(' ');
      
      if(filter === 'all' || categories.includes(filter)){
        card.classList.remove('hidden', 'filtered-out');
        card.classList.add('filtered-in');
      } else {
        card.classList.add('filtered-out');
        setTimeout(() => {
          card.classList.add('hidden');
          card.classList.remove('filtered-out');
        }, 300);
      }
    });
    
    // Update count after animation
    setTimeout(updateProjectCount, 300);
  });
});

// Initial count
updateProjectCount();

// ===== 8. Reveal Animations on Scroll =====
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ===== 9. Lazy Loading Images =====
const lazyImages = document.querySelectorAll('.lazy-img');

const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const img = entry.target;
      
      // Add loading class
      img.classList.add('loading');
      
      // Create new image to preload
      const tempImg = new Image();
      tempImg.src = img.src;
      
      tempImg.onload = () => {
        img.classList.remove('loading');
        img.classList.add('loaded');
      };
      
      tempImg.onerror = () => {
        img.classList.remove('loading');
        img.src = 'assets/sample-project.png'; // Fallback
      };
      
      imageObserver.unobserve(img);
    }
  });
}, {
  rootMargin: '50px'
});

lazyImages.forEach(img => imageObserver.observe(img));

// ===== 10. Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e){
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if(target){
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ===== 11. Enhanced Image Error Handling =====
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function(){
    if(!this.hasAttribute('data-error-handled')){
      this.src = 'assets/sample-project.png';
      this.setAttribute('data-error-handled', 'true');
      this.alt = 'Project placeholder image';
    }
  });
});

// ===== 12. Keyboard Navigation Enhancement =====
document.addEventListener('keydown', (e) => {
  // Escape key closes mobile menu
  if(e.key === 'Escape' && nav && nav.classList.contains('open')){
    nav.classList.remove('open');
    menuBtn.textContent = '☰';
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  
  // Ctrl/Cmd + Home goes to top
  if((e.ctrlKey || e.metaKey) && e.key === 'Home'){
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// ===== 13. Add tooltips to tags =====
document.querySelectorAll('.tags span').forEach(tag => {
  tag.setAttribute('title', `Technology: ${tag.textContent}`);
});

// ===== 14. Performance: Debounce scroll events =====
function debounce(func, wait){
  let timeout;
  return function executedFunction(...args){
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debounce to scroll-heavy functions
const debouncedNavUpdate = debounce(updateActiveNav, 100);
window.addEventListener('scroll', debouncedNavUpdate, { passive: true });

// ===== 15. Accessibility: Focus trap for mobile menu =====
if(menuBtn && nav){
  const focusableElements = nav.querySelectorAll('a');
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  nav.addEventListener('keydown', (e) => {
    if(!nav.classList.contains('open')) return;
    
    if(e.key === 'Tab'){
      if(e.shiftKey){
        if(document.activeElement === firstFocusable){
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if(document.activeElement === lastFocusable){
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  });
}

// ===== 16. Smooth animations on page load =====
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  console.log('✨ Portfolio Loaded with Enhanced UX!');
  console.log('🎨 Features: Scroll Progress, Active Nav, Filters, Lazy Loading');
  console.log('♿ Accessibility: Keyboard Nav, Focus Management, ARIA labels');
});

// ===== 17. Contact Form Validation & Submission =====
const contactForm = document.getElementById('contactForm');

if(contactForm){
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = contactForm.querySelector('.submit-btn');
  
  // Validation functions
  function validateName(name){
    return name.trim().length >= 2;
  }
  
  function validateEmail(email){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  function validateSubject(subject){
    return subject.trim().length >= 3;
  }
  
  function validateMessage(message){
    return message.trim().length >= 10;
  }
  
  // Show error message
  function showError(input, errorId, message){
    input.classList.add('error');
    const errorEl = document.getElementById(errorId);
    errorEl.textContent = message;
    errorEl.classList.add('show');
  }
  
  // Clear error message
  function clearError(input, errorId){
    input.classList.remove('error');
    const errorEl = document.getElementById(errorId);
    errorEl.textContent = '';
    errorEl.classList.remove('show');
  }
  
  // Real-time validation
  nameInput.addEventListener('blur', () => {
    if(!validateName(nameInput.value)){
      showError(nameInput, 'nameError', 'Please enter a valid name (at least 2 characters)');
    } else {
      clearError(nameInput, 'nameError');
    }
  });
  
  emailInput.addEventListener('blur', () => {
    if(!validateEmail(emailInput.value)){
      showError(emailInput, 'emailError', 'Please enter a valid email address');
    } else {
      clearError(emailInput, 'emailError');
    }
  });
  
  subjectInput.addEventListener('blur', () => {
    if(!validateSubject(subjectInput.value)){
      showError(subjectInput, 'subjectError', 'Subject must be at least 3 characters');
    } else {
      clearError(subjectInput, 'subjectError');
    }
  });
  
  messageInput.addEventListener('blur', () => {
    if(!validateMessage(messageInput.value)){
      showError(messageInput, 'messageError', 'Message must be at least 10 characters');
    } else {
      clearError(messageInput, 'messageError');
    }
  });
  
  // Clear errors on input
  [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
    input.addEventListener('input', () => {
      clearError(input, input.id + 'Error');
    });
  });
  
  // Form submission
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous status
    formStatus.classList.remove('show', 'success', 'error');
    
    // Validate all fields
    let isValid = true;
    
    if(!validateName(nameInput.value)){
      showError(nameInput, 'nameError', 'Please enter a valid name');
      isValid = false;
    }
    
    if(!validateEmail(emailInput.value)){
      showError(emailInput, 'emailError', 'Please enter a valid email');
      isValid = false;
    }
    
    if(!validateSubject(subjectInput.value)){
      showError(subjectInput, 'subjectError', 'Please enter a subject');
      isValid = false;
    }
    
    if(!validateMessage(messageInput.value)){
      showError(messageInput, 'messageError', 'Please enter a message');
      isValid = false;
    }
    
    if(!isValid){
      formStatus.textContent = '⚠️ Please fix the errors above';
      formStatus.classList.add('show', 'error');
      return;
    }
    
    // Show loading state
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    btnText.style.display = 'none';
    btnLoader.style.display = 'flex';
    submitBtn.disabled = true;
    
    // Prepare form data
    const formData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      subject: subjectInput.value.trim(),
      message: messageInput.value.trim(),
      timestamp: new Date().toISOString()
    };
    
    // Simulate form submission (replace with actual backend endpoint)
    try {
      // For demonstration, we'll use a mailto fallback
      // In production, replace this with an actual API call
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      
      // Create mailto link as fallback
      const mailtoLink = `mailto:electrusgreen@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`;
      
      window.location.href = mailtoLink;
      
      // Show success message
      formStatus.textContent = '✅ Thank you! Your message has been sent. Opening your email client...';
      formStatus.classList.add('show', 'success');
      
      // Reset form
      contactForm.reset();
      
      // Alternative: Log to console (for development)
      console.log('📧 Form Submitted:', formData);
      
    } catch(error){
      // Show error message
      formStatus.textContent = '❌ Oops! Something went wrong. Please try again or email directly.';
      formStatus.classList.add('show', 'error');
      console.error('Form submission error:', error);
    } finally {
      // Reset button state
      btnText.style.display = 'flex';
      btnLoader.style.display = 'none';
      submitBtn.disabled = false;
    }
  });
}

// ===== 18. Enhanced Button Ripple Effect =====
document.querySelectorAll('.btn, .filter-btn').forEach(button => {
  button.addEventListener('click', function(e){
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple-effect');
    
    this.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  });
});

console.log('🎉 All UX enhancements loaded successfully!');

