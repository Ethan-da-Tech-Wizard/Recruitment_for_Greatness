/**
 * Shea PARC Recruitment Pipeline
 * Admin Dashboard JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Auto-dismiss flash messages
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(function(msg) {
        setTimeout(function() {
            msg.style.opacity = '0';
            msg.style.transform = 'translateX(100%)';
            setTimeout(function() {
                msg.remove();
            }, 300);
        }, 3000);
    });

    // Auto-save notes (debounced)
    const notesTextarea = document.querySelector('.notes-form textarea');
    if (notesTextarea) {
        let saveTimeout;
        const saveIndicator = document.createElement('span');
        saveIndicator.className = 'save-indicator';
        saveIndicator.style.cssText = 'font-size: 12px; color: var(--gray-500); margin-left: 10px;';
        
        const notesTitle = document.querySelector('.notes-section h2');
        if (notesTitle) {
            notesTitle.appendChild(saveIndicator);
        }

        notesTextarea.addEventListener('input', function() {
            saveIndicator.textContent = 'Unsaved changes...';
            saveIndicator.style.color = 'var(--warning)';
            
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(function() {
                // Auto-save functionality could be added here via API
                saveIndicator.textContent = '';
            }, 2000);
        });
    }

    // Confirm before status change to "Do Not Call"
    const statusSelect = document.querySelector('.status-select');
    if (statusSelect) {
        statusSelect.addEventListener('change', function() {
            if (this.value === 'do_not_call') {
                if (!confirm('Are you sure you want to mark this candidate as "Do Not Call"?')) {
                    // Reset to previous value
                    this.value = this.getAttribute('data-previous') || 'new';
                }
            }
            this.setAttribute('data-previous', this.value);
        });
        
        // Store initial value
        statusSelect.setAttribute('data-previous', statusSelect.value);
    }

    // Search input - submit on enter
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                this.closest('form').submit();
            }
        });
    }

    // Row click to view candidate (except on action buttons)
    const candidateRows = document.querySelectorAll('.candidate-row');
    candidateRows.forEach(function(row) {
        row.style.cursor = 'pointer';
        row.addEventListener('click', function(e) {
            // Don't navigate if clicking on a link or button
            if (e.target.closest('a') || e.target.closest('button')) {
                return;
            }
            
            const viewLink = row.querySelector('.name-cell a');
            if (viewLink) {
                window.location.href = viewLink.href;
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + F to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                e.preventDefault();
                searchInput.focus();
            }
        }
        
        // Escape to go back to dashboard from candidate view
        if (e.key === 'Escape') {
            const backBtn = document.querySelector('.btn-back');
            if (backBtn && window.location.pathname.includes('/candidate/')) {
                window.location.href = backBtn.href;
            }
        }
    });

    // Periodic refresh of candidate counts (every 30 seconds)
    if (document.querySelector('.status-nav')) {
        setInterval(function() {
            fetch('/api/counts')
                .then(response => response.json())
                .then(data => {
                    // Update status counts
                    Object.keys(data).forEach(function(status) {
                        const countElement = document.querySelector(`.status-${status} .status-count`);
                        if (countElement) {
                            countElement.textContent = data[status];
                        }
                    });
                    
                    // Update "All" count
                    const allCount = document.querySelector('.status-link:first-child .status-count');
                    if (allCount) {
                        allCount.textContent = data.all || 0;
                    }
                })
                .catch(function(error) {
                    console.log('Could not refresh counts:', error);
                });
        }, 30000);
    }

    // Copy phone number to clipboard
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            // Copy to clipboard
            const phone = this.textContent.trim();
            navigator.clipboard.writeText(phone).then(function() {
                // Show copied indicator
                const original = link.textContent;
                link.textContent = 'Copied!';
                setTimeout(function() {
                    link.textContent = original;
                }, 1000);
            });
        });
    });
});
