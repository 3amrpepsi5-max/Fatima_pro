/* =====================================================
   dr-fatima/js/appointment.js
   نظام حجز المواعيد - إرسال عبر الواتساب
   ===================================================== */

'use strict';

// رقم الواتساب الخاص بالعيادة
const CLINIC_WHATSAPP = '201033910907';

// ── خدمات العيادة ──
const SERVICES = [
  'متابعة الحمل',
  'الولادة الطبيعية',
  'الولادة القيصرية',
  'علاج أمراض النساء',
  'علاج العقم',
  'الموجات فوق الصوتية',
  'تنظيم الأسرة',
  'هرمونات ودورة شهرية',
  'التثدي وسن اليأس',
  'فحص ما قبل الزواج',
];

// ── تهيئة قائمة الخدمات ──
const populateServices = () => {
  const select = document.getElementById('service');
  if (!select) return;
  
  SERVICES.forEach(service => {
    const option = document.createElement('option');
    option.value = service;
    option.textContent = service;
    select.appendChild(option);
  });
};

// ── تحديد أقل تاريخ مسموح (اليوم) ──
const setMinDate = () => {
  const dateInput = document.getElementById('appointmentDate');
  if (!dateInput) return;
  
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
};

// ── التحقق من صحة البيانات ──
const validateForm = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim().length < 3) {
    errors.push('الاسم يجب أن يكون 3 أحرف على الأقل');
  }
  
  const phoneRegex = /^(\+20|0)1[0-2,5]\d{8}$/;
  if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
    errors.push('رقم الهاتف غير صحيح (يجب أن يكون رقم مصري)');
  }
  
  if (!data.date) {
    errors.push('يرجى اختيار تاريخ الموعد');
  }
  
  if (!data.service) {
    errors.push('يرجى اختيار نوع الخدمة');
  }
  
  return errors;
};

// ── بناء رسالة الواتساب ──
const buildWhatsAppMessage = (data) => {
  const msg = `
🌸 *طلب حجز موعد جديد*
━━━━━━━━━━━━━━━━━━━━
👤 *الاسم:* ${data.name}
📱 *الهاتف:* ${data.phone}
🗓️ *التاريخ المطلوب:* ${formatDate(data.date)}
🕐 *الوقت المفضل:* ${data.time || 'أي وقت مناسب'}
💊 *الخدمة المطلوبة:* ${data.service}
${data.notes ? `📝 *ملاحظات:* ${data.notes}` : ''}
━━━━━━━━━━━━━━━━━━━━
📍 عيادة الدكتورة فاطمة صلاح عاشور
  `.trim();
  
  return encodeURIComponent(msg);
};

// ── تنسيق التاريخ بالعربية ──
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// ── معالج إرسال النموذج ──
const handleFormSubmit = (e) => {
  e.preventDefault();
  
  const data = {
    name:    document.getElementById('patientName')?.value?.trim() || '',
    phone:   document.getElementById('patientPhone')?.value?.trim() || '',
    date:    document.getElementById('appointmentDate')?.value || '',
    time:    document.getElementById('appointmentTime')?.value || '',
    service: document.getElementById('service')?.value || '',
    notes:   document.getElementById('notes')?.value?.trim() || '',
  };
  
  // مسح رسائل الخطأ السابقة
  clearErrors();
  
  // التحقق من البيانات
  const errors = validateForm(data);
  if (errors.length > 0) {
    showFieldErrors(errors);
    return;
  }
  
  // إرسال عبر الواتساب
  const message = buildWhatsAppMessage(data);
  const waUrl = `https://wa.me/${CLINIC_WHATSAPP}?text=${message}`;
  
  // إظهار رسالة النجاح
  showSuccessMessage();
  
  // فتح الواتساب بعد ثانية
  setTimeout(() => {
    window.open(waUrl, '_blank');
  }, 800);
  
  // إعادة تعيين النموذج
  setTimeout(() => {
    e.target.reset();
    hideSuccessMessage();
  }, 4000);
};

// ── عرض أخطاء الحقول ──
const showFieldErrors = (errors) => {
  const container = document.getElementById('formErrors');
  if (!container) return;
  
  container.innerHTML = errors.map(err => `
    <div class="form-error-item">
      <i class="fas fa-exclamation-circle"></i>
      <span>${err}</span>
    </div>
  `).join('');
  
  container.style.display = 'block';
  container.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

// ── مسح الأخطاء ──
const clearErrors = () => {
  const container = document.getElementById('formErrors');
  if (container) {
    container.innerHTML = '';
    container.style.display = 'none';
  }
};

// ── رسالة النجاح ──
const showSuccessMessage = () => {
  const success = document.getElementById('successMessage');
  if (success) {
    success.style.display = 'flex';
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

const hideSuccessMessage = () => {
  const success = document.getElementById('successMessage');
  if (success) success.style.display = 'none';
};

// ── تهيئة النموذج ──
document.addEventListener('DOMContentLoaded', () => {
  populateServices();
  setMinDate();
  
  const form = document.getElementById('appointmentForm');
  form?.addEventListener('submit', handleFormSubmit);
  
  // التحقق الفوري عند الكتابة
  document.getElementById('patientPhone')?.addEventListener('input', (e) => {
    const phone = e.target.value;
    const isValid = /^(\+20|0)1[0-2,5]\d{8}$/.test(phone.replace(/\s/g, ''));
    e.target.style.borderColor = phone.length > 5 ? (isValid ? '#5a9080' : '#e05a5a') : '';
  });
});
