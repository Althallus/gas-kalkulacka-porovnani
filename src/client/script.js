
/**
 * F!Dos Porovnání produktů - Moderní JavaScript kalkulačka
 * ES6+ verze s podporou pro Google Apps Script
 */

// Hlavní třída kalkulačky
class FinancialCalculator {
    constructor() {
        this.results = {};
        this.isCalculating = false;
        this.initializeEventListeners();
        this.setupInputFormatting();
        this.loadSettings();
        this.calculateAll(); // Počáteční výpočet
    }

    /**
     * Inicializace event listenerů
     */
    initializeEventListeners() {
        // Checkbox listenery pro zobrazení produktů
        ['sporak', 'stavebko', 'penzijko', 'investice'].forEach(product => {
            const checkbox = document.getElementById(`check_${product}`);
            if (checkbox) {
                checkbox.addEventListener('change', () => this.toggleProductVisibility());
            }
        });

        // Checkbox listenery pro zobrazení sekcí
        ['nominal', 'real', 'plusy'].forEach(section => {
            const checkbox = document.getElementById(`check_${section}`);
            if (checkbox) {
                checkbox.addEventListener('change', () => this.toggleSectionVisibility());
            }
        });

        // Auto-výpočet při změně vstupů
        ['jednoraz', 'pravidelka', 'doba'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', this.debounce(() => {
                    this.updateInvestmentRate(); // Dynamické nastavení investic
                    this.calculateAll();
                }, 500));
                element.addEventListener('blur', () => this.calculateAll());
            }
        });

        // Event listener pro změnu doby - dynamické nastavení investic
        const dobaElement = document.getElementById('doba');
        if (dobaElement) {
            dobaElement.addEventListener('change', () => {
                this.updateInvestmentRate();
                this.calculateAll();
            });
        }

        // Event listenery pro nastavení
        const settingsIds = [
            'set_sporak_urok', 'set_stavebko_urok', 'set_penzijko_urok', 'set_investice_urok',
            'set_dan', 'set_inflace'
        ];

        settingsIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', this.debounce(() => {
                    this.saveSettings();
                    this.calculateAll();
                }, 300));
            }
        });

        // Prevent form submission
        document.addEventListener('submit', (e) => e.preventDefault());
    }

    /**
     * Nastavení formátování vstupních polí
     */
    setupInputFormatting() {
        ['jednoraz', 'pravidelka'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', (e) => this.formatNumberInput(e));
                element.addEventListener('blur', (e) => this.formatNumberInput(e));
            }
        });
    }

    /**
     * Formátování čísel s oddělovači tisíců
     */
    formatNumberInput(event) {
        const input = event.target;
        let value = input.value.replace(/\s/g, ''); // Odstraň mezery
        
        // Pouze čísla
        if (!/^\d*$/.test(value)) {
            value = value.replace(/\D/g, '');
        }
        
        // Formátování s mezerami
        if (value) {
            const formatted = parseInt(value).toLocaleString('cs-CZ').replace(/,/g, ' ');
            input.value = formatted;
        }
    }

    /**
     * Získání čísla z formátovaného inputu
     */
    getNumberFromFormattedInput(id) {
        const element = document.getElementById(id);
        if (!element) return 0;
        const value = element.value.replace(/\s/g, ''); // Odstraň mezery
        return parseInt(value) || 0;
    }

    /**
     * Dynamické nastavení úroku investic podle doby
     */
    updateInvestmentRate() {
        const doba = this.getNumberFromFormattedInput('doba') || parseInt(document.getElementById('doba')?.value) || 10;
        const investiceUrokElement = document.getElementById('set_investice_urok');
        
        if (investiceUrokElement) {
            let newRate;
            if (doba <= 3) {
                newRate = 3; // 1-3 roky: 3%
            } else if (doba <= 6) {
                newRate = 5; // 3-6 let: 5%
            } else {
                newRate = 7; // 7+ let: 7%
            }
            
            investiceUrokElement.value = newRate;
        }
    }

    /**
     * Debounce funkce pro optimalizaci výkonu
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Získání vstupních hodnot z formuláře
     */
    getInputValues() {
        const getValue = (id, defaultValue = 0) => {
            const element = document.getElementById(id);
            return element ? (Number(element.value) || defaultValue) : defaultValue;
        };

        return {
            jednoraz: this.getNumberFromFormattedInput('jednoraz'),
            pravidelka: this.getNumberFromFormattedInput('pravidelka'),
            doba: Math.max(1, getValue('doba', 10)), // Minimálně 1 rok, default 10
            
            // Nastavení úroků - nové defaulty
            sporakUrok: getValue('set_sporak_urok', 2), // Změněno z 1 na 2
            stavebkoUrok: getValue('set_stavebko_urok', 1.5),
            penzijkoUrok: getValue('set_penzijko_urok', 4), // Změněno z 2 na 4
            investiceUrok: getValue('set_investice_urok', 5), // Změněno z 4 na 5
            dan: getValue('set_dan', 15),
            inflace: getValue('set_inflace', 3)
        };
    }

    /**
     * Výpočet složeného úročení
     */
    calculateCompoundInterest(principal, monthlyPayment, annualRate, years) {
        if (annualRate <= 0) {
            return principal + (monthlyPayment * years * 12);
        }

        const monthlyRate = annualRate / 100 / 12;
        const totalPeriods = years * 12;
        
        // Budoucí hodnota jednorázového vkladu
        const futureValuePrincipal = principal * Math.pow(1 + monthlyRate, totalPeriods);
        
        // Budoucí hodnota pravidelných vkladů (anuita)
        const futureValueAnnuity = monthlyPayment === 0 ? 0 : 
            monthlyPayment * ((Math.pow(1 + monthlyRate, totalPeriods) - 1) / monthlyRate);
        
        return futureValuePrincipal + futureValueAnnuity;
    }

    /**
     * Výpočet pro spořící účet
     */
    calculateSporak(inputs) {
        const { jednoraz, pravidelka, doba, sporakUrok, inflace, dan } = inputs;
        
        const totalInvested = jednoraz + (pravidelka * doba * 12);
        
        // Nominální výpočet
        const nominal = this.calculateCompoundInterest(jednoraz, pravidelka, sporakUrok, doba);
        const nominalReturn = totalInvested > 0 ? ((nominal / totalInvested) - 1) * 100 : 0;
        
        // Reálný výpočet (s inflací a daněmi)
        const realRate = sporakUrok - inflace;
        const afterTaxRate = sporakUrok * (1 - dan / 100);
        const real = this.calculateCompoundInterest(jednoraz, pravidelka, realRate, doba);
        const realReturn = totalInvested > 0 ? ((real / totalInvested) - 1) * 100 : 0;
        
        return {
            nominal: {
                vlozeno: this.formatCurrency(totalInvested),
                urok: `${sporakUrok}%`,
                celkem: this.formatCurrency(nominal),
                vykonnost: `${nominalReturn.toFixed(2)}%`
            },
            real: {
                urok: `${realRate.toFixed(2)}%`,
                celkem: this.formatCurrency(real),
                vynos: `${realReturn.toFixed(2)}%`,
                urokPoDani: `${afterTaxRate.toFixed(2)}%`
            }
        };
    }

    /**
     * Výpočet pro investice
     */
    calculateInvestice(inputs) {
        const { jednoraz, pravidelka, doba, investiceUrok, inflace, dan } = inputs;
        
        const totalInvested = jednoraz + (pravidelka * doba * 12);
        
        // Nominální výpočet
        const nominal = this.calculateCompoundInterest(jednoraz, pravidelka, investiceUrok, doba);
        const nominalReturn = totalInvested > 0 ? ((nominal / totalInvested) - 1) * 100 : 0;
        
        // Reálný výpočet
        const realRate = investiceUrok - inflace;
        const real = this.calculateCompoundInterest(jednoraz, pravidelka, realRate, doba);
        const profit = Math.max(0, nominal - totalInvested);
        const taxOnProfit = profit * (dan / 100);
        const realReturn = totalInvested > 0 ? ((real / totalInvested) - 1) * 100 : 0;
        
        return {
            nominal: {
                vlozeno: this.formatCurrency(totalInvested),
                urok: `${investiceUrok}%`,
                celkem: this.formatCurrency(nominal),
                vykonnost: `${nominalReturn.toFixed(2)}%`
            },
            real: {
                urok: `${realRate.toFixed(2)}%`,
                celkem: this.formatCurrency(real),
                vynos: `${realReturn.toFixed(2)}%`,
                dan: this.formatCurrency(taxOnProfit)
            }
        };
    }

    /**
     * Výpočet pro stavební spoření
     */
    calculateStavebko(inputs) {
        const { jednoraz, pravidelka, doba, stavebkoUrok, inflace } = inputs;
        
        const totalInvested = jednoraz + (pravidelka * doba * 12);
        
        // Výpočet státních příspěvků
        const yearlyContribution = Math.min((jednoraz + pravidelka * 12) * 0.1, 2000);
        const monthlyContribution = Math.min(pravidelka * 12 * 0.1 / 12, 2000 / 12);
        
        // Nominální výpočet s příspěvky
        const clientDeposits = this.calculateCompoundInterest(jednoraz, pravidelka, stavebkoUrok, doba);
        const stateContributions = this.calculateCompoundInterest(0, monthlyContribution, stavebkoUrok, doba);
        const nominal = clientDeposits + stateContributions;
        
        const totalStateContributions = monthlyContribution * 12 * doba;
        const nominalReturn = totalInvested > 0 ? ((nominal / totalInvested) - 1) * 100 : 0;
        
        // Reálný výpočet
        const realRate = stavebkoUrok - inflace;
        const realClientDeposits = this.calculateCompoundInterest(jednoraz, pravidelka, realRate, doba);
        const realStateContributions = this.calculateCompoundInterest(0, monthlyContribution, realRate, doba);
        const real = realClientDeposits + realStateContributions;
        const realReturn = totalInvested > 0 ? ((real / totalInvested) - 1) * 100 : 0;
        
        return {
            nominal: {
                vlozeno: this.formatCurrency(totalInvested),
                urok: `${stavebkoUrok}%`,
                celkem: this.formatCurrency(nominal),
                vykonnost: `${nominalReturn.toFixed(0)}%`,
                prispevek: this.formatCurrency(monthlyContribution * 12),
                prispevekCelkem: this.formatCurrency(totalStateContributions)
            },
            real: {
                urok: `${realRate.toFixed(2)}%`,
                celkem: this.formatCurrency(real),
                vynos: `${realReturn.toFixed(2)}%`
            }
        };
    }

    /**
     * Výpočet pro penzijní spoření
     */
    calculatePenzijko(inputs) {
        const { jednoraz, pravidelka, doba, penzijkoUrok, inflace } = inputs;
        
        const totalInvested = jednoraz + (pravidelka * doba * 12);
        
        // Státní příspěvek podle výše měsíční platby
        let stateContribution = 0;
        if (pravidelka >= 300 && pravidelka < 400) stateContribution = 90;
        else if (pravidelka >= 400 && pravidelka < 500) stateContribution = 110;
        else if (pravidelka >= 500 && pravidelka < 600) stateContribution = 130;
        else if (pravidelka >= 600 && pravidelka < 700) stateContribution = 150;
        else if (pravidelka >= 700 && pravidelka < 800) stateContribution = 170;
        else if (pravidelka >= 800 && pravidelka < 900) stateContribution = 190;
        else if (pravidelka >= 900 && pravidelka < 1000) stateContribution = 210;
        else if (pravidelka >= 1000) stateContribution = 230;
        
        // Nominální výpočet
        const clientDeposits = this.calculateCompoundInterest(jednoraz, pravidelka, penzijkoUrok, doba);
        const stateContributions = this.calculateCompoundInterest(0, stateContribution, penzijkoUrok, doba);
        const nominal = clientDeposits + stateContributions;
        
        const totalStateContributions = stateContribution * doba * 12;
        const nominalReturn = totalInvested > 0 ? ((nominal / totalInvested) - 1) * 100 : 0;
        
        // Reálný výpočet
        const realRate = penzijkoUrok - inflace;
        const realClientDeposits = this.calculateCompoundInterest(jednoraz, pravidelka, realRate, doba);
        const realStateContributions = this.calculateCompoundInterest(0, stateContribution, realRate, doba);
        const real = realClientDeposits + realStateContributions;
        const clientProfit = Math.max(0, realClientDeposits - totalInvested);
        const realReturn = totalInvested > 0 ? ((real / totalInvested) - 1) * 100 : 0;
        
        return {
            nominal: {
                vlozeno: this.formatCurrency(totalInvested),
                urok: `${penzijkoUrok}%`,
                celkem: this.formatCurrency(nominal),
                vykonnost: `${nominalReturn.toFixed(2)}%`,
                prispevekPlatba: `${stateContribution}`,
                prispevekCelkem: this.formatCurrency(totalStateContributions)
            },
            real: {
                urok: `${realRate.toFixed(2)}%`,
                celkem: this.formatCurrency(real),
                vynos: `${realReturn.toFixed(2)}%`,
                vynosKlienta: this.formatCurrency(clientProfit)
            }
        };
    }

    /**
     * Formátování měny
     */
    formatCurrency(amount) {
        if (isNaN(amount) || amount === null || amount === undefined) {
            return '0 Kč';
        }
        
        return new Intl.NumberFormat('cs-CZ', {
            style: 'currency',
            currency: 'CZK',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    /**
     * Aktualizace výsledků v UI
     */
    updateResults(product, results) {
        // Aktualizace nominálních hodnot
        Object.entries(results.nominal).forEach(([key, value]) => {
            const element = document.getElementById(`${product}_${key}`);
            if (element) {
                element.textContent = value;
                element.classList.add('fade-in');
                
                // Barevné kódování pro výkonnost
                if (key.includes('vykonnost') || key.includes('vynos')) {
                    const numValue = parseFloat(value);
                    element.classList.remove('profit-positive', 'profit-negative');
                    if (numValue > 0) {
                        element.classList.add('profit-positive');
                    } else if (numValue < 0) {
                        element.classList.add('profit-negative');
                    }
                }
            }
        });

        // Aktualizace reálných hodnot
        Object.entries(results.real).forEach(([key, value]) => {
            const element = document.getElementById(`${product}_r_${key}`);
            if (element) {
                element.textContent = value;
                element.classList.add('fade-in');
                
                // Barevné kódování pro výnosy
                if (key.includes('vynos') || key.includes('return')) {
                    const numValue = parseFloat(value);
                    element.classList.remove('profit-positive', 'profit-negative');
                    if (numValue > 0) {
                        element.classList.add('profit-positive');
                    } else if (numValue < 0) {
                        element.classList.add('profit-negative');
                    }
                }
            }
        });
    }

    /**
     * Hlavní výpočetní funkce
     */
    calculateAll() {
        if (this.isCalculating) return;
        
        this.isCalculating = true;
        const inputs = this.getInputValues();
        
        // Zobrazení loading stavu
        this.showLoading(true);
        
        // Simulace async výpočtu pro lepší UX
        setTimeout(() => {
            try {
                // Výpočty všech produktů
                const sporakResults = this.calculateSporak(inputs);
                const investiceResults = this.calculateInvestice(inputs);
                const stavebkoResults = this.calculateStavebko(inputs);
                const penzijkoResults = this.calculatePenzijko(inputs);
                
                // Aktualizace UI
                this.updateResults('sporak', sporakResults);
                this.updateResults('investice', investiceResults);
                this.updateResults('stavebko', stavebkoResults);
                this.updateResults('penzijko', penzijkoResults);
                
                // Uložení výsledků pro export
                this.results = {
                    inputs,
                    sporak: sporakResults,
                    investice: investiceResults,
                    stavebko: stavebkoResults,
                    penzijko: penzijkoResults,
                    timestamp: new Date()
                };
                
                // Adjust card heights based on visible sections
                this.adjustCardHeights();
                
                // Logování použití (pokud je dostupné)
                this.logUsage('calculation', {
                    jednoraz: inputs.jednoraz,
                    pravidelka: inputs.pravidelka,
                    doba: inputs.doba
                });
                
            } catch (error) {
                console.error('Chyba při výpočtu:', error);
                this.showError('Došlo k chybě při výpočtu. Zkuste to prosím znovu.');
            } finally {
                this.showLoading(false);
                this.isCalculating = false;
            }
        }, 200);
    }

    /**
     * Přizpůsobení výšky karet podle viditelných sekcí
     */
    adjustCardHeights() {
        const showNominal = document.getElementById('check_nominal')?.checked ?? true;
        const showReal = document.getElementById('check_real')?.checked ?? true;
        const showPlusy = document.getElementById('check_plusy')?.checked ?? true;
        
        const visibleSections = [showNominal, showReal, showPlusy].filter(Boolean).length;
        
        // Dynamické nastavení minimální výšky podle počtu viditelných sekcí
        const baseHeight = 200;
        const sectionHeight = 150;
        const minHeight = baseHeight + (visibleSections * sectionHeight);
        
        document.querySelectorAll('.product-card').forEach(card => {
            card.style.minHeight = `${minHeight}px`;
        });
    }

    /**
     * Zobrazení/skrytí loading stavu
     */
    showLoading(show) {
        const resultsDiv = document.getElementById('results');
        const loadingOverlay = document.getElementById('loadingOverlay');
        
        if (show) {
            if (resultsDiv) resultsDiv.classList.add('loading');
            if (loadingOverlay) loadingOverlay.classList.remove('d-none');
        } else {
            if (resultsDiv) resultsDiv.classList.remove('loading');
            if (loadingOverlay) loadingOverlay.classList.add('d-none');
        }
    }

    /**
     * Zobrazení chybové zprávy
     */
    showError(message) {
        this.showToast(message, 'error');
    }

    /**
     * Zobrazení toast notifikace
     */
    showToast(message, type = 'info') {
        const toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) return;

        const toastId = 'toast-' + Date.now();
        const toastEl = document.createElement('div');
        toastEl.className = `toast align-items-center text-white bg-${type === 'error' ? 'danger' : 'primary'} border-0`;
        toastEl.id = toastId;
        toastEl.setAttribute('role', 'alert');
        toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;

        toastContainer.appendChild(toastEl);
        const toast = new bootstrap.Toast(toastEl);
        toast.show();

        // Remove element after hiding
        toastEl.addEventListener('hidden.bs.toast', () => {
            toastEl.remove();
        });
    }

    /**
     * Toggle zobrazení produktů
     */
    toggleProductVisibility() {
        ['sporak', 'stavebko', 'penzijko', 'investice'].forEach(product => {
            const checkbox = document.getElementById(`check_${product}`);
            const container = document.getElementById(`${product}_container`);
            
            if (checkbox && container) {
                if (checkbox.checked) {
                    container.style.display = 'block';
                    container.classList.add('fade-in');
                } else {
                    container.style.display = 'none';
                    container.classList.remove('fade-in');
                }
            }
        });
    }

    /**
     * Toggle zobrazení sekcí
     */
    toggleSectionVisibility() {
        const showNominal = document.getElementById('check_nominal')?.checked ?? true;
        const showReal = document.getElementById('check_real')?.checked ?? true;
        const showPlusy = document.getElementById('check_plusy')?.checked ?? true;
        
        document.querySelectorAll('.nominal-section').forEach(el => {
            el.style.display = showNominal ? 'block' : 'none';
        });
        
        document.querySelectorAll('.real-section').forEach(el => {
            el.style.display = showReal ? 'block' : 'none';
        });
        
        document.querySelectorAll('.plusy-section').forEach(el => {
            el.style.display = showPlusy ? 'block' : 'none';
        });

        // Přizpůsobení výšky karet
        this.adjustCardHeights();
    }

    /**
     * Uložení nastavení do localStorage nebo GAS
     */
    saveSettings() {
        const settings = this.getInputValues();
        
        try {
            // Lokální uložení
            if (typeof Storage !== 'undefined') {
                localStorage.setItem('fidosCalculatorSettings', JSON.stringify(settings));
            }
            
            // GAS uložení (pokud je dostupné)
            if (typeof google !== 'undefined' && google.script && google.script.run) {
                google.script.run
                    .withSuccessHandler(() => console.log('Nastavení uloženo na server'))
                    .withFailureHandler((error) => console.warn('Chyba při ukládání na server:', error))
                    .saveUserSettings(settings);
            }
        } catch (error) {
            console.warn('Chyba při ukládání nastavení:', error);
        }
    }

    /**
     * Načtení nastavení z localStorage nebo GAS
     */
    loadSettings() {
        try {
            // Nastavení výchozích hodnot
            this.setDefaultValues();
            
            // Načtení z localStorage
            if (typeof Storage !== 'undefined') {
                const localSettings = localStorage.getItem('fidosCalculatorSettings');
                if (localSettings) {
                    const settings = JSON.parse(localSettings);
                    this.applySettings(settings);
                }
            }
            
            // GAS načtení (pokud je dostupné)
            if (typeof google !== 'undefined' && google.script && google.script.run) {
                google.script.run
                    .withSuccessHandler((settings) => {
                        if (settings) this.applySettings(settings);
                    })
                    .withFailureHandler((error) => console.warn('Chyba při načítání ze serveru:', error))
                    .loadUserSettings();
            }
        } catch (error) {
            console.warn('Chyba při načítání nastavení:', error);
        }
    }

    /**
     * Nastavení výchozích hodnot
     */
    setDefaultValues() {
        // Nové výchozí hodnoty
        const defaults = {
            sporakUrok: 2,    // Změněno z 1
            penzijkoUrok: 4,  // Změněno z 2
            investiceUrok: 5, // Změněno z 4
            stavebkoUrok: 1.5,
            dan: 15,
            inflace: 3
        };

        Object.entries(defaults).forEach(([key, value]) => {
            const elementMappings = {
                sporakUrok: 'set_sporak_urok',
                stavebkoUrok: 'set_stavebko_urok',
                penzijkoUrok: 'set_penzijko_urok',
                investiceUrok: 'set_investice_urok',
                dan: 'set_dan',
                inflace: 'set_inflace'
            };
            
            const elementId = elementMappings[key];
            if (elementId) {
                const element = document.getElementById(elementId);
                if (element && !element.value) {
                    element.value = value;
                }
            }
        });

        // Dynamické nastavení investic podle doby
        this.updateInvestmentRate();
    }

    /**
     * Aplikace nastavení na formulář
     */
    applySettings(settings) {
        Object.entries(settings).forEach(([key, value]) => {
            const elementMappings = {
                sporakUrok: 'set_sporak_urok',
                stavebkoUrok: 'set_stavebko_urok',
                penzijkoUrok: 'set_penzijko_urok',
                investiceUrok: 'set_investice_urok',
                dan: 'set_dan',
                inflace: 'set_inflace'
            };
            
            const elementId = elementMappings[key];
            if (elementId) {
                const element = document.getElementById(elementId);
                if (element) {
                    element.value = value;
                }
            }
        });
    }

    /**
     * Logování použití
     */
    logUsage(action, data = {}) {
        try {
            const logData = {
                action,
                data,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href
            };
            
            console.log('Usage log:', logData);
            
            // GAS logování (pokud je dostupné)
            if (typeof google !== 'undefined' && google.script && google.script.run) {
                google.script.run
                    .withFailureHandler((error) => console.warn('Chyba při logování:', error))
                    .logUsage(action, data);
            }
        } catch (error) {
            console.warn('Chyba při logování:', error);
        }
    }
}

// Přednastavené profily investic
function setInvestmentProfile(profile) {
    const profiles = {
        conservative: { urok: 4 },
        balanced: { urok: 6 },
        dynamic: { urok: 9 }
    };
    
    const selected = profiles[profile];
    if (selected) {
        const urokElement = document.getElementById('set_investice_urok');
        if (urokElement) {
            urokElement.value = selected.urok;
        }
        
        // Přepočítej po změně
        if (window.calculator) {
            window.calculator.calculateAll();
        }
    }
}

// PDF Export funkce
function exportToPDF() {
    if (!window.calculator || !window.calculator.results) {
        alert('Nejdříve proveďte výpočet');
        return;
    }
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Nastavení fontů pro češtinu
        doc.setFont('helvetica');
        
        // Hlavička
        doc.setFontSize(20);
        doc.text('F!Dos Porovnani produktu', 20, 30);
        
        // Datum a čas
        doc.setFontSize(12);
        const now = new Date();
        doc.text(`Datum: ${now.toLocaleDateString('cs-CZ')} ${now.toLocaleTimeString('cs-CZ')}`, 20, 45);
        
        // Vstupní parametry
        doc.setFontSize(14);
        doc.text('Vstupni parametry:', 20, 60);
        doc.setFontSize(10);
        const inputs = window.calculator.results.inputs;
        doc.text(`Jednorazovy vklad: ${inputs.jednoraz.toLocaleString('cs-CZ')} Kc`, 20, 70);
        doc.text(`Mesicni vklad: ${inputs.pravidelka.toLocaleString('cs-CZ')} Kc`, 20, 80);
        doc.text(`Doba sporeni: ${inputs.doba} let`, 20, 90);
        
        // Výsledky pro každý produkt
        let yPos = 110;
        const produkty = [
            { key: 'sporak', name: 'Sporici ucet' },
            { key: 'investice', name: 'Investice' },
            { key: 'stavebko', name: 'Stavebni sporeni' },
            { key: 'penzijko', name: 'Penzijni sporeni' }
        ];
        
        produkty.forEach(produkt => {
            const results = window.calculator.results[produkt.key];
            if (results) {
                doc.setFontSize(12);
                doc.text(produkt.name, 20, yPos);
                yPos += 10;
                
                doc.setFontSize(10);
                doc.text(`Nominalne celkem: ${results.nominal.celkem}`, 25, yPos);
                yPos += 8;
                doc.text(`Nominalni vykonnost: ${results.nominal.vykonnost}`, 25, yPos);
                yPos += 8;
                doc.text(`Realne celkem: ${results.real.celkem}`, 25, yPos);
                yPos += 8;
                doc.text(`Realny vynos: ${results.real.vynos}`, 25, yPos);
                yPos += 15;
            }
        });
        
        // Disclaimer
        doc.setFontSize(8);
        doc.text('Upozorneni: Vysledky kalkulacky jsou pouze orientacni.', 20, 270);
        doc.text('Pro konkretni investicni rozhodnuti konzultujte s financnim poradcem.', 20, 280);
        
        // Uložení PDF
        doc.save(`FiDos_Porovnani_${now.toLocaleDateString('cs-CZ').replace(/\./g, '-')}.pdf`);
        
        if (window.calculator) {
            window.calculator.showToast('PDF export dokončen', 'success');
        }
        
    } catch (error) {
        console.error('Chyba při PDF exportu:', error);
        alert('Chyba při vytváření PDF. Ujistěte se, že máte stabilní internetové připojení.');
    }
}

// Google Sheets Export funkce
function exportToGoogleSheets() {
    if (!window.calculator || !window.calculator.results) {
        alert('Nejdříve proveďte výpočet');
        return;
    }
    
    const btn = document.getElementById('exportSheetsBtn');
    if (btn) {
        btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Exportuji...';
        btn.disabled = true;
    }
    
    try {
        // GAS export (pokud je dostupné)
        if (typeof google !== 'undefined' && google.script && google.script.run) {
            google.script.run
                .withSuccessHandler((result) => {
                    if (result.success) {
                        if (window.calculator) {
                            window.calculator.showToast('Export do Google Sheets dokončen', 'success');
                        }
                        if (result.url) {
                            window.open(result.url, '_blank');
                        }
                    } else {
                        throw new Error(result.message || 'Chyba při exportu');
                    }
                })
                .withFailureHandler((error) => {
                    console.error('Chyba při GAS exportu:', error);
                    alert('Chyba při exportu do Google Sheets: ' + error.toString());
                })
                .exportToSheets(window.calculator.results, window.calculator.results.inputs);
        } else {
            // Fallback - CSV download
            exportToCSV();
        }
        
    } catch (error) {
        console.error('Chyba při exportu:', error);
        alert('Chyba při exportu do Google Sheets');
    } finally {
        if (btn) {
            btn.innerHTML = '<i class="bi bi-file-earmark-spreadsheet"></i> Export do Sheets';
            btn.disabled = false;
        }
    }
}

// CSV Export fallback
function exportToCSV() {
    if (!window.calculator || !window.calculator.results) {
        alert('Nejdříve proveďte výpočet');
        return;
    }
    
    const results = window.calculator.results;
    const inputs = results.inputs;
    
    // Hlavička CSV
    let csvContent = 'Produkt,Vlozeno,Nominalne celkem,Nominalni vykonnost,Realne celkem,Realny vynos\n';
    
    // Data pro každý produkt
    const produkty = [
        { key: 'sporak', name: 'Sporici ucet' },
        { key: 'investice', name: 'Investice' },
        { key: 'stavebko', name: 'Stavebni sporeni' },
        { key: 'penzijko', name: 'Penzijni sporeni' }
    ];
    
    produkty.forEach(produkt => {
        const data = results[produkt.key];
        if (data) {
            csvContent += `${produkt.name},${data.nominal.vlozeno},${data.nominal.celkem},${data.nominal.vykonnost},${data.real.celkem},${data.real.vynos}\n`;
        }
    });
    
    // Stažení CSV souboru
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `FiDos_Export_${new Date().toLocaleDateString('cs-CZ').replace(/\./g, '-')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        if (window.calculator) {
            window.calculator.showToast('CSV soubor stažen', 'success');
        }
    }
}

// Globální funkce pro volání z HTML
function calculateAll() {
    if (window.calculator) {
        window.calculator.calculateAll();
    }
}

// Inicializace kalkulačky po načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializuji F!Dos kalkulačku...');
    
    // Čekání na Bootstrap
    if (typeof bootstrap !== 'undefined') {
        initializeCalculator();
    } else {
        // Fallback pokud Bootstrap ještě není načten
        setTimeout(initializeCalculator, 100);
    }
});

function initializeCalculator() {
    try {
        // Vytvoření instance kalkulačky
        window.calculator = new FinancialCalculator();
        
        // Počáteční nastavení viditelnosti
        window.calculator.toggleProductVisibility();
        window.calculator.toggleSectionVisibility();
        
        console.log('F!Dos kalkulačka úspěšně inicializována');
        
        // Toast o úspěšné inicializaci
        setTimeout(() => {
            if (window.calculator) {
                window.calculator.showToast('Kalkulačka připravena k použití', 'success');
            }
        }, 1000);
        
    } catch (error) {
        console.error('Chyba při inicializaci kalkulačky:', error);
        alert('Chyba při načítání kalkulačky. Obnovte prosím stránku.');
    }
}

// Globální error handler
window.addEventListener('error', function(e) {
    console.error('Globální chyba:', e.error);
    if (window.calculator) {
        window.calculator.showToast('Došlo k neočekávané chybě', 'error');
    }
});

// Service Worker registrace (pro případnou offline funkcionalitu)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Zatím pouze log - implementace SW pro později
        console.log('Service Worker podporován');
    });
}

// Dodatečné utility funkce
const Utils = {
    /**
     * Formatování čísla pro český locale
     */
    formatNumber(number, options = {}) {
        return new Intl.NumberFormat('cs-CZ', options).format(number);
    },
    
    /**
     * Debounce funkce
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * Throttle funkce
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    /**
     * Validace emailu
     */
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    /**
     * Získání query parametrů z URL
     */
    getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    }
};

// Připojení Utils k window objektu pro globální dostupnost
window.FiDosUtils = Utils;

