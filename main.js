/* ============================================================
   Rethinkables Technology — Interactive Core Script
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Navigation Scroll Effects
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  // Optimized Intersection Observer for Scroll Animations
  // Low threshold + negative rootMargin ensures triggers happen reliably on mobile
  const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        obs.unobserve(entry.target); // Stop watching once revealed for smooth performance
      }
    });
  }, observerOptions);

  // Observe all reveal elements
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Modal Open / Close Logic
  const modal = document.getElementById('solutionModal');
  const openBtns = document.querySelectorAll('.open-modal-btn');
  const closeBtn = document.getElementById('modalCloseBtn');

  function openModal() {
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
  }

  openBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Toggle Custom Sector Input
  const categorySelect = document.getElementById('challenge_category');
  const otherSectorWrapper = document.getElementById('other_sector_wrapper');
  const otherSectorInput = document.getElementById('other_sector_input');

  if (categorySelect && otherSectorWrapper && otherSectorInput) {
    categorySelect.addEventListener('change', function () {
      if (this.value === 'Other') {
        otherSectorWrapper.style.display = 'flex';
        otherSectorInput.required = true;
      } else {
        otherSectorWrapper.style.display = 'none';
        otherSectorInput.required = false;
        otherSectorInput.value = '';
      }
    });
  }

  // Pre-linked Google Apps Script Endpoint
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwvhJZpRngeCJoNNShy0Z6kHkbJMqZDAMiyQ3ji53TP1Ko6gnb7O8JPYqUJIipypCzX/exec";

  const govForm = document.getElementById('govForm');
  if (govForm) {
    govForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = document.getElementById('submitBtn');
      btn.disabled = true;
      btn.textContent = "Transmitting Departmental Scope...";

      const selectedCat = categorySelect ? categorySelect.value : '';
      const customCat = otherSectorInput ? otherSectorInput.value : '';
      const finalCategory = selectedCat === 'Other' ? `Other: ${customCat}` : selectedCat;

      const payload = {
        officer_name: document.getElementById('officer_name').value,
        department: document.getElementById('department').value,
        division: document.getElementById('division').value,
        contact: document.getElementById('contact_info').value,
        challenge: finalCategory,
        problem: document.getElementById('problem').value
      };

      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(() => {
        alert('Departmental Solution Blueprint Request Received. A senior solution architect from Rethinkables Technology will analyze your field scope and contact your office within 24 hours.');
        govForm.reset();
        if (otherSectorWrapper) otherSectorWrapper.style.display = 'none';
        btn.disabled = false;
        btn.textContent = "Transmit Departmental Blueprint Scope";
        closeModal();
      })
      .catch(error => {
        alert('Submission notice: If network latency occurs, please also write directly to contact@rethinkables.in');
        btn.disabled = false;
        btn.textContent = "Transmit Departmental Blueprint Scope";
      });
    });
  }
});
