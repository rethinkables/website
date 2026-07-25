// Header Navbar Scroll Glass Effect
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Toggle custom sector manual entry field
const categorySelect = document.getElementById('challenge_category');
if (categorySelect) {
  categorySelect.addEventListener('change', function() {
    const wrapper = document.getElementById('other_sector_wrapper');
    const input = document.getElementById('other_sector_input');
    
    if (this.value === 'Other') {
      wrapper.style.display = 'flex';
      input.required = true;
    } else {
      wrapper.style.display = 'none';
      input.required = false;
      input.value = '';
    }
  });
}

// Direct Google Sheet Endpoint
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwvhJZpRngeCJoNNShy0Z6kHkbJMqZDAMiyQ3ji53TP1Ko6gnb7O8JPYqUJIipypCzX/exec";

document.getElementById('govForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.textContent = "Transmitting Field Scope...";

  const catVal = document.getElementById('challenge_category').value;
  const otherVal = document.getElementById('other_sector_input').value;
  
  const finalSector = catVal === 'Other' ? `Other: ${otherVal}` : catVal;

  const payload = {
      officer_name: document.getElementById('officer_name').value,
      department: document.getElementById('department').value,
      division: document.getElementById('division').value,
      contact: document.getElementById('contact_info').value,
      challenge: finalSector,
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
      document.getElementById('govForm').reset();
      document.getElementById('other_sector_wrapper').style.display = 'none';
      btn.disabled = false;
      btn.textContent = "Request Departmental Solution Blueprint";
  })
  .catch(error => {
      alert('Submission notice: If network latency occurs, please also write directly to contact@rethinkables.in');
      btn.disabled = false;
      btn.textContent = "Request Departmental Solution Blueprint";
  });
});

