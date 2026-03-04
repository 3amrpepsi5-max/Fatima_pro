/* =====================================================
   dr-fatima/js/main.js
   الجافاسكريبت الرئيسي المشترك بين جميع الصفحات
   ===================================================== */

'use strict';

// ── تهيئة الشريط العلوي ──
const initNavbar = () => {
  const navbar   = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  // تأثير التمرير على الشريط العلوي
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 40);
  });

  // القائمة الجانبية للموبايل
  hamburger?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = navLinks?.classList.contains('open') ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity   = navLinks?.classList.contains('open') ? '0' : '1';
    spans[2].style.transform = navLinks?.classList.contains('open') ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });

  // إغلاق القائمة عند الضغط على رابط
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  // تحديد الرابط النشط
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  navLinks?.querySelectorAll('a').forEach(a => {
    const href = a.getAttribute('href')?.split('/').pop();
    if (href === currentPage) a.classList.add('active');
  });
};

// ── كشف الظهور عند التمرير ──
const initScrollReveal = () => {
  const revealElements = document.querySelectorAll('.reveal, .reveal-right, .reveal-left, .reveal-scale');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // تأخير متسلسل للعناصر المتجاورة
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealElements.forEach((el, i) => {
    el.dataset.delay = el.dataset.delay || Math.min(i % 6, 5);
    observer.observe(el);
  });
};

// ── عداد الإحصاءات ──
const initCounters = () => {
  const counters = document.querySelectorAll('[data-count]');
  
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString('ar-EG') + suffix;
      if (current >= target) clearInterval(timer);
    }, 16);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
};

// ── إشعار Toast ──
const showToast = ({ title, message, type = 'success' }) => {
  const toast = document.createElement('div');
  toast.className = 'toast';
  
  const icons = { success: 'fa-check', error: 'fa-times', info: 'fa-info' };
  const colors = { success: '#5a9080', error: '#e05a5a', info: '#c4856a' };
  
  toast.style.borderRightColor = colors[type];
  toast.innerHTML = `
    <div class="toast-icon" style="background:${colors[type]}22; color:${colors[type]}">
      <i class="fas ${icons[type]}"></i>
    </div>
    <div class="toast-text">
      <div class="title">${title}</div>
      <div class="msg">${message}</div>
    </div>`;
  
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
};

// ── التمرير السلس للروابط الداخلية ──
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
};

// ── زر الرجوع للأعلى ──
const initBackToTop = () => {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  btn.style.cssText = `
    position:fixed; bottom:100px; left:28px; width:44px; height:44px;
    background:var(--navy); color:white; border:none; border-radius:50%;
    cursor:pointer; font-size:14px; display:flex; align-items:center;
    justify-content:center; opacity:0; transition:all 0.3s ease;
    z-index:998; box-shadow: 0 4px 16px rgba(0,0,0,0.2);`;
  
  document.body.appendChild(btn);
  
  window.addEventListener('scroll', () => {
    btn.style.opacity = window.scrollY > 400 ? '1' : '0';
    btn.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
  });
  
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
};

// ── تهيئة كل الصفحة ──
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initCounters();
  initSmoothScroll();
  initBackToTop();
});

// تصدير الدوال للاستخدام في ملفات أخرى
window.DrFatima = { showToast };
