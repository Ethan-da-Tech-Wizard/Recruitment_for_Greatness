/**
 * Santé of Mesa Recruitment Pipeline
 * Public Form JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 6) {
                value = '(' + value.substring(0, 3) + ') ' + value.substring(3, 6) + '-' + value.substring(6, 10);
            } else if (value.length >= 3) {
                value = '(' + value.substring(0, 3) + ') ' + value.substring(3);
            }
            e.target.value = value;
        });
    }

    // Form validation enhancement
    const form = document.querySelector('.interest-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            const firstName = document.getElementById('first_name').value.trim();
            const lastName = document.getElementById('last_name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            
            if (!firstName || !lastName || !phone) {
                e.preventDefault();
                alert('Please fill in all required fields (First Name, Last Name, and Phone).');
                return false;
            }
            
            // Show loading state on button
            const submitBtn = form.querySelector('.submit-btn');
            if (submitBtn) {
                submitBtn.innerHTML = '<span>Submitting...</span>';
                submitBtn.disabled = true;
            }
        });
    }

    // Smooth scroll to form
    document.querySelectorAll('a[href="#form"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const form = document.getElementById('form');
            if (form) {
                form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Auto-dismiss flash messages
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(function(msg) {
        setTimeout(function() {
            msg.style.opacity = '0';
            msg.style.transform = 'translateX(100%)';
            setTimeout(function() {
                msg.remove();
            }, 300);
        }, 5000);
    });

    // Department card hover effects
    const deptCards = document.querySelectorAll('.department-card');
    deptCards.forEach(function(card) {
        card.addEventListener('click', function() {
            // Scroll to form and check the corresponding checkbox
            const deptName = card.querySelector('h3').textContent;
            const checkboxes = document.querySelectorAll('input[name="departments"]');
            
            checkboxes.forEach(function(checkbox) {
                if (checkbox.value.includes(deptName.split(' ')[0])) {
                    checkbox.checked = true;
                    checkbox.parentElement.style.backgroundColor = 'var(--gold-light)';
                }
            });
            
            const formSection = document.getElementById('form');
            if (formSection) {
                formSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
        
        card.style.cursor = 'pointer';
    });

    // Checkbox visual feedback
    const checkboxLabels = document.querySelectorAll('.checkbox-label');
    checkboxLabels.forEach(function(label) {
        const checkbox = label.querySelector('input[type="checkbox"]');
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    label.style.backgroundColor = 'var(--gold-light)';
                    label.style.borderColor = 'var(--gold)';
                } else {
                    label.style.backgroundColor = '';
                    label.style.borderColor = '';
                }
            });
        }
    });
});
