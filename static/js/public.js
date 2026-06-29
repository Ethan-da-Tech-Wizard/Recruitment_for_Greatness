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
        '.warm-intro, .identity-item, .sister-cities-section, .city-card, .az-map-section, .az-map-board, .map-detail, .shea-sayings, .shea-commentary, .path-card, .department-card, .form-container, .benefit-card, .care-network-panel, .sister-facility-note'
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

    const mapLocations = {
        'Scottsdale': [
            { name: 'Shea Post Acute Rehabilitation Center', address: '11150 North 92nd St' },
            { name: 'Heritage Court Post Acute of Scottsdale', address: '3339 North Drinkwater Blvd' },
            { name: 'Osborn Health and Rehabilitation', address: '3333 North Civic Center Plaza' }
        ],
        'Tucson': [
            { name: 'Sabino Canyon Rehabilitation & Care Center', address: '5830 East Pima St' },
            { name: 'Casas Adobes Post Acute Rehabilitation Center', address: '1919 W Medical St' },
            { name: 'Mountain View Care Center', address: '1313 West Magee Rd' },
            { name: 'La Canada Care Center', address: '7970 North La Canada Dr' },
            { name: 'Pueblo Springs Rehabilitation Center', address: '5545 East Lee Street' },
            { name: 'Catalina Post Acute Care and Rehabilitation', address: '2611 N Warren Ave' },
            { name: 'Park Avenue Health and Rehabilitation', address: '2001 North Park Ave' },
            { name: 'Villa Maria Health & Recovery', address: '4310 E Grant Rd' },
            { name: 'Santa Rosa Care Center', address: '1650 N Santa Rosa Ave' }
        ],
        'Mesa': [
            { name: 'Citadel Post Acute', address: '5121 East Broadway Rd' },
            { name: 'Alta Mesa Health and Rehabilitation', address: '5848 E University Dr' },
            { name: 'Desert Blossom Health & Rehabilitation', address: '60 South 58th St' },
            { name: 'Mission Palms Post Acute', address: '6461 E Baywood Ave' },
            { name: 'The Citadel Senior Living Community', address: '520 South Higley Rd' },
            { name: 'Montecito Post Acute Care and Rehabilitation', address: '51 South 48th St' },
            { name: 'Springdale Post Acute', address: '7255 East Broadway Road' },
            { name: 'Citrus Heights Respiratory and Rehabilitation', address: '3130 East Broadway Road' }
        ],
        'Phoenix': [
            { name: 'South Mountain Post Acute', address: '8008 South Jesse Owens Parkway' },
            { name: 'Phoenix Mountain', address: '13232 N Tatum Blvd' },
            { name: 'Capstone Transportation', address: '1606 W Whispering Wind Dr, Suite #101' },
            { name: 'Coronado Healthcare Center', address: '11411 North 19th Ave' },
            { name: 'Desert Terrace Healthcare Center', address: '2509 North 24th St' },
            { name: 'Camelback Post Acute Care and Rehabilitation', address: '4635 North 14th St' },
            { name: 'North Mountain Medical & Rehabilitation Center', address: '9155 North 3rd St' }
        ],
        'Peoria': [
            { name: 'Lake Pleasant Post Acute Rehabilitation Center', address: '20625 North Lake Pleasant Rd' },
            { name: 'Peoria Post Acute', address: '13215 North 94th Dr' },
            { name: 'Rio Vista Post Acute & Rehabilitation', address: '10323 W Olive Ave' },
            { name: 'Olive Ridge Senior Living', address: '10333 W Olive Ave' },
            { name: 'Sonoran Hills Behavioral Health Center', address: '10323 W Olive Ave, Suite ABH' }
        ],
        'Glendale': [
            { name: 'Horizon Post Acute and Rehabilitation Center', address: '4704 West Diana Ave' },
            { name: 'Bella Vita Health & Rehabilitation Center', address: '5125 North 58th Ave' },
            { name: 'Amarsi Assisted Living', address: '5125 North 58th Ave' },
            { name: 'Agave Grove Post Acute', address: '8641 N 67th Ave' }
        ],
        'Chandler': [
            { name: 'Chandler Post Acute and Rehabilitation', address: '2121 West Elgin St' },
            { name: 'River Park Post Acute', address: '2555 N Price Road' },
            { name: 'Elmwood Senior Living', address: '2555 N Price Road' }
        ],
        'Tempe': [
            { name: 'Medstar Medical Transport', address: '1827 W 3rd Street' },
            { name: 'Tempe Post Acute', address: '6100 S Rural Rd' },
            { name: 'Desert Marigold Senior Living', address: '6100 S Rural Rd' }
        ],
        'Surprise': [
            { name: 'Surprise Health & Rehabilitation Center', address: '14660 W Parkwood Dr' }
        ],
        'Youngtown': [
            { name: 'Sunview Health and Rehabilitation Center', address: '12207 North 113th Ave' }
        ],
        'Sun City West': [
            { name: 'Sun West Choice Healthcare and Rehab', address: '14002 Meeker Blvd' }
        ],
        'Gilbert': [
            { name: 'Wellsprings of Gilbert', address: '3319 S Mercy Rd' }
        ],
        'Avondale': [
            { name: 'Estrella Health and Rehab Center', address: '350 East La Canada Boulevard' }
        ],
        'Fountain Hills': [
            { name: 'Fountain Hills Post Acute', address: '16300 E Keith McMahan Dr' }
        ],
        'Prescott': [
            { name: 'Granite Creek Health and Rehabilitation Center', address: '1045 Scott Dr' }
        ]
    };

    const mapPins = document.querySelectorAll('.map-pin');
    const mapBoard = document.querySelector('.az-map-board');
    const mapSection = document.querySelector('.az-map-section');
    const mapModeButtons = document.querySelectorAll('[data-map-mode-button]');
    const mapRegionButtons = document.querySelectorAll('[data-map-region]');
    const mapDetail = document.querySelector('.map-detail');
    const mapDetailLabel = mapDetail ? mapDetail.querySelector('.map-detail-label') : null;
    const mapDetailTitle = mapDetail ? mapDetail.querySelector('h3') : null;
    const mapDetailCopy = mapDetail ? mapDetail.querySelector('p') : null;
    const mapLocationList = mapDetail ? mapDetail.querySelector('.map-location-list') : null;
    const mapDetailNote = mapDetail ? mapDetail.querySelector('strong') : null;
    const mapDetailRegion = mapDetail ? mapDetail.querySelector('[data-map-detail-region]') : null;
    const mapDetailDistance = mapDetail ? mapDetail.querySelector('[data-map-detail-distance]') : null;
    const mapDetailCount = mapDetail ? mapDetail.querySelector('[data-map-detail-count]') : null;
    const mapCityPoints = {
        'Scottsdale': { x: 63, y: 40 },
        'Phoenix': { x: 55, y: 47 },
        'Mesa': { x: 71, y: 48 },
        'Glendale': { x: 48, y: 44 },
        'Peoria': { x: 43, y: 39 },
        'Surprise': { x: 36, y: 34 },
        'Tempe': { x: 56, y: 52 },
        'Chandler': { x: 64, y: 58 },
        'Tucson': { x: 58, y: 78 },
        'Youngtown': { x: 41, y: 36 },
        'Sun City West': { x: 33, y: 31 },
        'Gilbert': { x: 72, y: 62 },
        'Avondale': { x: 45, y: 48 },
        'Fountain Hills': { x: 74, y: 38 },
        'Prescott': { x: 38, y: 18 }
    };
    const locationOffsets = [
        { x: 0, y: 0 },
        { x: 4.6, y: -4.2 },
        { x: -4.6, y: 4.2 },
        { x: 4.8, y: 4.6 },
        { x: -4.8, y: -4.6 },
        { x: 0.2, y: -6.6 },
        { x: 0.3, y: 6.8 },
        { x: 6.8, y: 0.2 },
        { x: -6.8, y: -0.2 }
    ];
    let activeLocationPin = null;
    let activeRegion = 'all';

    if (mapSection) {
        mapSection.dataset.mapMode = 'clusters';
        mapSection.dataset.mapRegion = 'all';
    }

    function getCityPin(city) {
        return Array.from(mapPins).find(function(pin) {
            return pin.dataset.city === city;
        });
    }

    function formatLocationAddress(location, city) {
        return location.address + ', ' + city + ', AZ';
    }

    function updateMapMetrics(pin, locationCount) {
        if (!pin) {
            return;
        }
        if (mapDetailRegion) {
            mapDetailRegion.textContent = pin.dataset.zone || 'Arizona';
        }
        if (mapDetailDistance) {
            mapDetailDistance.textContent = pin.dataset.distance || 'Ask the Shea team';
        }
        if (mapDetailCount) {
            mapDetailCount.textContent = pin.dataset.count || locationCount + ' locations';
        }
    }

    function pinMatchesRegion(pin, region) {
        return region === 'all' || pin.dataset.region === region;
    }

    function getFirstRegionPin(region) {
        return Array.from(mapPins).find(function(pin) {
            return pinMatchesRegion(pin, region);
        });
    }

    function renderLocationList(city, selectedIndex) {
        const locations = mapLocations[city] || [];
        mapLocationList.replaceChildren();
        locations.forEach(function(location, index) {
            const item = document.createElement('li');
            const name = document.createElement('span');
            const address = document.createElement('small');
            item.tabIndex = 0;
            item.classList.toggle('active', index === selectedIndex);
            name.textContent = location.name;
            address.textContent = formatLocationAddress(location, city);
            item.appendChild(name);
            item.appendChild(address);
            item.addEventListener('click', function() {
                activateLocation(city, index);
            });
            item.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    activateLocation(city, index);
                }
            });
            mapLocationList.appendChild(item);
        });
    }

    function activateLocation(city, index) {
        if (!mapDetail || !mapDetailLabel || !mapDetailTitle || !mapDetailCopy || !mapLocationList || !mapDetailNote) {
            return;
        }
        const locations = mapLocations[city] || [];
        const location = locations[index];
        const cityPin = getCityPin(city);
        if (!location || !cityPin) {
            return;
        }

        mapPins.forEach(function(item) {
            item.classList.toggle('active', item === cityPin);
            item.setAttribute('aria-pressed', item === cityPin ? 'true' : 'false');
        });

        document.querySelectorAll('.location-pin').forEach(function(pin) {
            const active = pin.dataset.city === city && Number(pin.dataset.locationIndex) === index;
            pin.classList.toggle('active', active);
            pin.setAttribute('aria-pressed', active ? 'true' : 'false');
            if (active) {
                activeLocationPin = pin;
            }
        });

        mapDetailLabel.textContent = city + ' - location ' + (index + 1) + ' of ' + locations.length;
        mapDetailTitle.textContent = location.name;
        mapDetailCopy.textContent = formatLocationAddress(location, city);
        updateMapMetrics(cityPin, locations.length);
        renderLocationList(city, index);
        mapDetailNote.textContent = cityPin.dataset.note || 'Same care energy, different doorway.';
    }

    function activateMapPin(pin) {
        if (!pin || !mapDetail || !mapDetailLabel || !mapDetailTitle || !mapDetailCopy || !mapLocationList || !mapDetailNote) {
            return;
        }

        mapPins.forEach(function(item) {
            item.classList.toggle('active', item === pin);
            item.setAttribute('aria-pressed', item === pin ? 'true' : 'false');
        });

        const city = pin.dataset.city || 'Arizona';
        const locations = mapLocations[city] || [];

        activeLocationPin = null;
        document.querySelectorAll('.location-pin').forEach(function(item) {
            item.classList.remove('active');
            item.setAttribute('aria-pressed', 'false');
        });
        mapDetailLabel.textContent = (pin.dataset.zone || 'Care Network Area') + ' - ' + (pin.dataset.count || locations.length + ' locations');
        mapDetailTitle.textContent = city;
        mapDetailCopy.textContent = pin.dataset.copy || '';
        updateMapMetrics(pin, locations.length);
        renderLocationList(city, -1);
        mapDetailNote.textContent = pin.dataset.note || '';
    }

    function buildLocationPins() {
        if (!mapBoard || mapBoard.querySelector('.location-pin-layer')) {
            return;
        }

        const layer = document.createElement('div');
        layer.className = 'location-pin-layer';
        Object.keys(mapLocations).forEach(function(city) {
            const point = mapCityPoints[city];
            const locations = mapLocations[city];
            if (!point || !locations) {
                return;
            }
            locations.forEach(function(location, index) {
                const offset = locationOffsets[index % locationOffsets.length];
                const pin = document.createElement('button');
                const label = document.createElement('span');
                pin.type = 'button';
                pin.className = 'location-pin';
                pin.dataset.city = city;
                pin.dataset.locationIndex = String(index);
                pin.dataset.region = getCityPin(city)?.dataset.region || 'all';
                pin.style.setProperty('--loc-x', Math.max(18, Math.min(80, point.x + offset.x)) + '%');
                pin.style.setProperty('--loc-y', Math.max(8, Math.min(92, point.y + offset.y)) + '%');
                pin.setAttribute('aria-label', 'Show ' + location.name + ' in ' + city);
                pin.setAttribute('aria-pressed', 'false');
                label.textContent = location.name;
                pin.appendChild(label);
                pin.addEventListener('click', function() {
                    activateLocation(city, index);
                });
                pin.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        activateLocation(city, index);
                    }
                });
                layer.appendChild(pin);
            });
        });
        mapBoard.appendChild(layer);
    }

    function applyMapRegion(region) {
        activeRegion = region || 'all';
        if (mapSection) {
            mapSection.dataset.mapRegion = activeRegion;
        }

        mapRegionButtons.forEach(function(button) {
            const active = button.dataset.mapRegion === activeRegion;
            button.classList.toggle('active', active);
            button.setAttribute('aria-pressed', active ? 'true' : 'false');
        });

        mapPins.forEach(function(pin) {
            const muted = !pinMatchesRegion(pin, activeRegion);
            pin.classList.toggle('region-muted', muted);
            pin.tabIndex = muted ? -1 : 0;
        });

        document.querySelectorAll('.location-pin').forEach(function(pin) {
            const muted = activeRegion !== 'all' && pin.dataset.region !== activeRegion;
            pin.classList.toggle('region-muted', muted);
            pin.tabIndex = muted ? -1 : 0;
        });

        const activePin = document.querySelector('.map-pin.active');
        if (!activePin || !pinMatchesRegion(activePin, activeRegion)) {
            const nextPin = getFirstRegionPin(activeRegion) || mapPins[0];
            if (nextPin) {
                activateMapPin(nextPin);
            }
        }
    }

    function setMapMode(mode) {
        if (!mapSection) {
            return;
        }
        mapSection.dataset.mapMode = mode;
        mapModeButtons.forEach(function(button) {
            const active = button.dataset.mapModeButton === mode;
            button.classList.toggle('active', active);
            button.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        if (mode === 'locations') {
            buildLocationPins();
            if (!activeLocationPin) {
                const city = document.querySelector('.map-pin.active')?.dataset.city || 'Scottsdale';
                activateLocation(city, 0);
            }
        } else {
            const cityPin = document.querySelector('.map-pin.active') || mapPins[0];
            activateMapPin(cityPin);
        }
        applyMapRegion(activeRegion);
    }

    if (mapPins.length) {
        buildLocationPins();
        mapPins.forEach(function(pin) {
            pin.setAttribute('aria-pressed', pin.classList.contains('active') ? 'true' : 'false');
            pin.addEventListener('click', function() {
                activateMapPin(pin);
            });
            pin.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    activateMapPin(pin);
                }
            });
        });
        if (mapBoard) {
            mapBoard.addEventListener('pointerup', function(e) {
                const target = e.target && e.target.closest ? e.target.closest('.map-pin, .location-pin') : null;
                if (!target) {
                    return;
                }
                if (target.classList.contains('location-pin')) {
                    activateLocation(target.dataset.city, Number(target.dataset.locationIndex));
                } else {
                    activateMapPin(target);
                }
            });
        }
        mapModeButtons.forEach(function(button) {
            button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');
            button.addEventListener('click', function() {
                setMapMode(button.dataset.mapModeButton || 'clusters');
            });
        });
        mapRegionButtons.forEach(function(button) {
            button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');
            button.addEventListener('click', function() {
                applyMapRegion(button.dataset.mapRegion || 'all');
            });
        });
        activateMapPin(document.querySelector('.map-pin.active') || mapPins[0]);
        applyMapRegion('all');
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
