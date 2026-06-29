/**
 * Shea PARC Admin Pipeline
 * Public Form JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scrollProgressBar = document.querySelector('.scroll-progress-bar');
    function updateScrollProgress() {
        if (!scrollProgressBar) {
            return;
        }
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
        scrollProgressBar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, progress)) + ')';
    }
    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    const revealTargets = document.querySelectorAll(
        '.warm-intro, .identity-item, .sister-cities-section, .city-card, .shea-sayings, .shea-commentary, .path-card, .department-card, .form-container, .benefit-card, .care-network-panel, .sister-facility-note'
    );
    revealTargets.forEach(function(target) {
        target.classList.add('reveal-on-scroll');
    });

    if ('IntersectionObserver' in window && !reduceMotion) {
        const revealObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.16 });

        revealTargets.forEach(function(target) {
            revealObserver.observe(target);
        });
    } else {
        revealTargets.forEach(function(target) {
            target.classList.add('visible');
        });
    }

    const sectionLinks = document.querySelectorAll('[data-section-link]');
    const sections = Array.from(sectionLinks).map(function(link) {
        const id = link.getAttribute('data-section-link');
        return {
            id: id,
            link: link,
            section: document.getElementById(id)
        };
    }).filter(function(item) {
        return item.section;
    });

    if ('IntersectionObserver' in window && sections.length) {
        const sectionObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    sections.forEach(function(item) {
                        item.link.classList.toggle('active', item.section === entry.target);
                    });
                }
            });
        }, { rootMargin: '-40% 0px -45% 0px', threshold: 0.01 });

        sections.forEach(function(item) {
            sectionObserver.observe(item.section);
        });
    }

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
    const formProgressLabel = document.querySelector('.form-progress-label');
    const formProgressBar = document.querySelector('.form-progress-bar');

    function hasValue(id) {
        const el = document.getElementById(id);
        return !!(el && el.value.trim());
    }

    function updateFormProgress() {
        if (!form || !formProgressLabel || !formProgressBar) {
            return;
        }

        const checks = [
            hasValue('first_name'),
            hasValue('last_name'),
            hasValue('phone'),
            hasValue('best_time_to_call'),
            document.querySelectorAll('input[name="departments"]:checked').length > 0,
            hasValue('experience_level'),
            hasValue('commute_preference')
        ];
        const complete = checks.filter(Boolean).length;
        const percent = Math.round((complete / checks.length) * 100);
        formProgressLabel.textContent = 'Signal ' + percent + '%';
        formProgressBar.style.width = percent + '%';
    }

    if (form) {
        form.addEventListener('input', updateFormProgress);
        form.addEventListener('change', updateFormProgress);
        updateFormProgress();

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
    function setDepartmentCardState() {
        deptCards.forEach(function(card) {
            const deptName = card.querySelector('h3').textContent;
            const firstWord = deptName.split(' ')[0];
            const selected = Array.from(document.querySelectorAll('input[name="departments"]:checked')).some(function(checkbox) {
                return checkbox.value.includes(firstWord);
            });
            card.classList.toggle('selected', selected);
        });
    }

    deptCards.forEach(function(card) {
        card.addEventListener('click', function() {
            // Scroll to form and check the corresponding checkbox
            const deptName = card.querySelector('h3').textContent;
            const checkboxes = document.querySelectorAll('input[name="departments"]');
            
            checkboxes.forEach(function(checkbox) {
                if (checkbox.value.includes(deptName.split(' ')[0])) {
                    checkbox.checked = true;
                    checkbox.parentElement.classList.add('selected');
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });

            setDepartmentCardState();
            
            const formSection = document.getElementById('form');
            if (formSection) {
                formSection.scrollIntoView({ behavior: 'smooth' });
            }
        });

        if (!reduceMotion) {
            card.addEventListener('mousemove', function(e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateY = ((x / rect.width) - 0.5) * 6;
                const rotateX = ((0.5 - (y / rect.height)) * 6);
                card.style.transform = 'translateY(-4px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
            });

            card.addEventListener('mouseleave', function() {
                card.style.transform = '';
            });
        }
        
        card.style.cursor = 'pointer';
    });

    // Checkbox visual feedback
    const checkboxLabels = document.querySelectorAll('.checkbox-label');
    checkboxLabels.forEach(function(label) {
        const checkbox = label.querySelector('input[type="checkbox"]');
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    label.classList.add('selected');
                } else {
                    label.classList.remove('selected');
                }
                setDepartmentCardState();
                updateFormProgress();
            });
        }
    });

    setDepartmentCardState();
});
