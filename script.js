// Global Variables
let calculatorHistory = JSON.parse(localStorage.getItem('calculatorHistory')) || [];
let currentCalculator = 'basic';
let currentExpression = '';
let lastResult = null;

// Exchange rates (mock data)
const exchangeRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110,
    INR: 74.5,
    CAD: 1.25,
    AUD: 1.35
};

// Unit conversion data
const unitConversions = {
    length: {
        mm: { name: 'Millimeter', factor: 0.001 },
        cm: { name: 'Centimeter', factor: 0.01 },
        m: { name: 'Meter', factor: 1 },
        km: { name: 'Kilometer', factor: 1000 },
        in: { name: 'Inch', factor: 0.0254 },
        ft: { name: 'Foot', factor: 0.3048 },
        yd: { name: 'Yard', factor: 0.9144 },
        mi: { name: 'Mile', factor: 1609.34 }
    },
    weight: {
        mg: { name: 'Milligram', factor: 0.000001 },
        g: { name: 'Gram', factor: 0.001 },
        kg: { name: 'Kilogram', factor: 1 },
        oz: { name: 'Ounce', factor: 0.0283495 },
        lb: { name: 'Pound', factor: 0.453592 },
        ton: { name: 'Ton', factor: 1000 }
    },
    temperature: {
        c: { name: 'Celsius' },
        f: { name: 'Fahrenheit' },
        k: { name: 'Kelvin' }
    },
    volume: {
        ml: { name: 'Milliliter', factor: 0.001 },
        l: { name: 'Liter', factor: 1 },
        gal: { name: 'Gallon', factor: 3.78541 },
        qt: { name: 'Quart', factor: 0.946353 },
        pt: { name: 'Pint', factor: 0.473176 },
        cup: { name: 'Cup', factor: 0.236588 },
        fl_oz: { name: 'Fluid Ounce', factor: 0.0295735 }
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeUnitConverter();
    loadHistory();
});

// Tab Management
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const calculatorPanels = document.querySelectorAll('.calculator-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;
            
            // Remove active class from all tabs and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            calculatorPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding panel
            button.classList.add('active');
            document.getElementById(tab).classList.add('active');
            
            currentCalculator = tab;
        });
    });
}

// Basic Calculator Functions
function appendNumber(calculator, number) {
    const display = document.getElementById(`${calculator}-display`);
    if (display.value === '0' || display.value === 'Error') {
        display.value = number;
    } else {
        display.value += number;
    }
}

function appendOperator(calculator, operator) {
    const display = document.getElementById(`${calculator}-display`);
    const lastChar = display.value.slice(-1);
    
    if (!['+', '-', '*', '/', '^'].includes(lastChar)) {
        display.value += operator;
    }
}

function clearAll(calculator) {
    const display = document.getElementById(`${calculator}-display`);
    display.value = '0';
    currentExpression = '';
}

function clearEntry(calculator) {
    const display = document.getElementById(`${calculator}-display`);
    display.value = '0';
}

function backspace(calculator) {
    const display = document.getElementById(`${calculator}-display`);
    if (display.value.length > 1) {
        display.value = display.value.slice(0, -1);
    } else {
        display.value = '0';
    }
}

function calculate(calculator) {
    const display = document.getElementById(`${calculator}-display`);
    let expression = display.value;
    
    try {
        // Replace display operators with JavaScript operators
        expression = expression.replace(/×/g, '*').replace(/÷/g, '/');
        
        // Handle power operator
        expression = expression.replace(/\^/g, '**');
        
        // Evaluate the expression
        let result = eval(expression);
        
        // Round to avoid floating point errors
        result = Math.round(result * 100000000) / 100000000;
        
        display.value = result;
        lastResult = result;
        
        // Add to history
        addToHistory(`${display.value.replace(/\*/g, '×').replace(/\//g, '÷')} = ${result}`, calculator);
        
    } catch (error) {
        display.value = 'Error';
    }
}

// Scientific Calculator Functions
function scientificFunction(func) {
    const display = document.getElementById('scientific-display');
    let value = parseFloat(display.value) || 0;
    let result;
    
    try {
        switch (func) {
            case 'sin':
                result = Math.sin(value * Math.PI / 180);
                break;
            case 'cos':
                result = Math.cos(value * Math.PI / 180);
                break;
            case 'tan':
                result = Math.tan(value * Math.PI / 180);
                break;
            case 'log':
                result = Math.log10(value);
                break;
            case 'ln':
                result = Math.log(value);
                break;
            case 'sqrt':
                result = Math.sqrt(value);
                break;
            case 'pi':
                result = Math.PI;
                break;
            case 'e':
                result = Math.E;
                break;
            case 'factorial':
                result = factorial(Math.floor(value));
                break;
            default:
                result = value;
        }
        
        result = Math.round(result * 100000000) / 100000000;
        display.value = result;
        
        addToHistory(`${func}(${value}) = ${result}`, 'scientific');
        
    } catch (error) {
        display.value = 'Error';
    }
}

function factorial(n) {
    if (n < 0) throw new Error('Negative factorial');
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

// BMI Calculator
function calculateBMI() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const weightUnit = document.getElementById('weight-unit').value;
    const heightUnit = document.getElementById('height-unit').value;
    
    if (!weight || !height) {
        alert('Please enter both weight and height');
        return;
    }
    
    // Convert to metric
    let weightKg = weight;
    let heightM = height;
    
    if (weightUnit === 'lbs') {
        weightKg = weight * 0.453592;
    }
    
    if (heightUnit === 'ft') {
        heightM = height * 0.3048;
    } else if (heightUnit === 'in') {
        heightM = height * 0.0254;
    } else if (heightUnit === 'cm') {
        heightM = height / 100;
    }
    
    const bmi = weightKg / (heightM * heightM);
    const roundedBMI = Math.round(bmi * 10) / 10;
    
    let category = '';
    let categoryClass = '';
    
    if (bmi < 18.5) {
        category = 'Underweight';
        categoryClass = 'underweight';
    } else if (bmi < 25) {
        category = 'Normal weight';
        categoryClass = 'normal';
    } else if (bmi < 30) {
        category = 'Overweight';
        categoryClass = 'overweight';
    } else {
        category = 'Obese';
        categoryClass = 'obese';
    }
    
    const resultHTML = `
        <h4>Your BMI Result</h4>
        <div class="result-value">${roundedBMI}</div>
        <div class="result-category ${categoryClass}">${category}</div>
        <div class="info-text">
            <strong>BMI Categories:</strong><br>
            Underweight: Below 18.5<br>
            Normal: 18.5 - 24.9<br>
            Overweight: 25 - 29.9<br>
            Obese: 30 and above
        </div>
    `;
    
    document.getElementById('bmi-result').innerHTML = resultHTML;
    
    addToHistory(`BMI: ${weight}${weightUnit} / ${height}${heightUnit} = ${roundedBMI} (${category})`, 'bmi');
}

// Unit Converter
function initializeUnitConverter() {
    updateUnits();
}

function updateUnits() {
    const category = document.getElementById('unit-category').value;
    const fromUnit = document.getElementById('from-unit');
    const toUnit = document.getElementById('to-unit');
    
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';
    
    const units = unitConversions[category];
    
    for (const [key, unit] of Object.entries(units)) {
        const option1 = new Option(`${unit.name} (${key})`, key);
        const option2 = new Option(`${unit.name} (${key})`, key);
        fromUnit.add(option1);
        toUnit.add(option2);
    }
    
    // Set default selections
    if (category === 'temperature') {
        fromUnit.value = 'c';
        toUnit.value = 'f';
    } else {
        toUnit.selectedIndex = 1;
    }
    
    convertUnit();
}

function convertUnit() {
    const category = document.getElementById('unit-category').value;
    const fromValue = parseFloat(document.getElementById('from-value').value);
    const fromUnit = document.getElementById('from-unit').value;
    const toUnit = document.getElementById('to-unit').value;
    
    if (isNaN(fromValue)) {
        document.getElementById('to-value').value = '';
        return;
    }
    
    let result;
    
    if (category === 'temperature') {
        result = convertTemperature(fromValue, fromUnit, toUnit);
    } else {
        const fromFactor = unitConversions[category][fromUnit].factor;
        const toFactor = unitConversions[category][toUnit].factor;
        result = (fromValue * fromFactor) / toFactor;
    }
    
    result = Math.round(result * 100000) / 100000;
    document.getElementById('to-value').value = result;
    
    if (fromValue && result) {
        addToHistory(`${fromValue} ${fromUnit} = ${result} ${toUnit}`, 'unit');
    }
}

function convertTemperature(value, from, to) {
    let celsius;
    
    // Convert to Celsius first
    switch (from) {
        case 'c':
            celsius = value;
            break;
        case 'f':
            celsius = (value - 32) * 5/9;
            break;
        case 'k':
            celsius = value - 273.15;
            break;
    }
    
    // Convert from Celsius to target
    switch (to) {
        case 'c':
            return celsius;
        case 'f':
            return celsius * 9/5 + 32;
        case 'k':
            return celsius + 273.15;
    }
}

// Currency Converter
function convertCurrency() {
    const amount = parseFloat(document.getElementById('currency-amount').value);
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    
    if (isNaN(amount)) {
        document.getElementById('converted-amount').value = '';
        document.getElementById('exchange-rate').textContent = '';
        return;
    }
    
    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];
    const exchangeRate = toRate / fromRate;
    
    const convertedAmount = amount * exchangeRate;
    const roundedAmount = Math.round(convertedAmount * 100) / 100;
    
    document.getElementById('converted-amount').value = roundedAmount;
    document.getElementById('exchange-rate').textContent = 
        `1 ${fromCurrency} = ${exchangeRate.toFixed(4)} ${toCurrency}`;
    
    if (amount && convertedAmount) {
        addToHistory(`${amount} ${fromCurrency} = ${roundedAmount} ${toCurrency}`, 'currency');
    }
}

// GST Calculator
function calculateGST() {
    const amount = parseFloat(document.getElementById('gst-amount').value);
    const gstRate = parseFloat(document.getElementById('gst-rate').value);
    const gstType = document.getElementById('gst-type').value;
    
    if (isNaN(amount)) {
        document.getElementById('gst-result').innerHTML = '';
        return;
    }
    
    let baseAmount, gstAmount, totalAmount;
    
    if (gstType === 'exclusive') {
        // Add GST to amount
        baseAmount = amount;
        gstAmount = (amount * gstRate) / 100;
        totalAmount = amount + gstAmount;
    } else {
        // Remove GST from amount
        totalAmount = amount;
        baseAmount = amount / (1 + gstRate / 100);
        gstAmount = amount - baseAmount;
    }
    
    const resultHTML = `
        <h4>GST Calculation Result</h4>
        <div class="result-breakdown">
            <div class="breakdown-item">
                <span>Base Amount:</span>
                <span>₹${baseAmount.toFixed(2)}</span>
            </div>
            <div class="breakdown-item">
                <span>GST (${gstRate}%):</span>
                <span>₹${gstAmount.toFixed(2)}</span>
            </div>
            <div class="breakdown-item" style="font-weight: bold; border-top: 1px solid #ddd; padding-top: 8px;">
                <span>Total Amount:</span>
                <span>₹${totalAmount.toFixed(2)}</span>
            </div>
        </div>
    `;
    
    document.getElementById('gst-result').innerHTML = resultHTML;
    
    const operation = gstType === 'exclusive' ? 'Added' : 'Removed';
    addToHistory(`GST ${operation}: ₹${amount} @ ${gstRate}% = ₹${totalAmount.toFixed(2)}`, 'gst');
}

// History Management
function addToHistory(calculation, type) {
    const historyItem = {
        calculation,
        type,
        timestamp: new Date().toLocaleString()
    };
    
    calculatorHistory.unshift(historyItem);
    
    // Keep only last 10 transactions
    if (calculatorHistory.length > 10) {
        calculatorHistory = calculatorHistory.slice(0, 10);
    }
    
    // Save to localStorage
    localStorage.setItem('calculatorHistory', JSON.stringify(calculatorHistory));
    
    // Update display
    loadHistory();
}

function loadHistory() {
    const historyList = document.getElementById('history-list');
    
    if (calculatorHistory.length === 0) {
        historyList.innerHTML = '<div class="no-history">No calculations yet</div>';
        return;
    }
    
    historyList.innerHTML = calculatorHistory.map(item => `
        <div class="history-item">
            <div class="history-calculation">${item.calculation}</div>
            <div class="history-time">${item.timestamp}</div>
        </div>
    `).join('');
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all history?')) {
        calculatorHistory = [];
        localStorage.removeItem('calculatorHistory');
        loadHistory();
    }
}

// Keyboard Support
document.addEventListener('keydown', function(e) {
    if (currentCalculator === 'basic' || currentCalculator === 'scientific') {
        const display = document.getElementById(`${currentCalculator}-display`);
        
        if (e.key >= '0' && e.key <= '9') {
            appendNumber(currentCalculator, e.key);
        } else if (e.key === '.') {
            appendNumber(currentCalculator, '.');
        } else if (e.key === '+') {
            appendOperator(currentCalculator, '+');
        } else if (e.key === '-') {
            appendOperator(currentCalculator, '-');
        } else if (e.key === '*') {
            appendOperator(currentCalculator, '*');
        } else if (e.key === '/') {
            e.preventDefault();
            appendOperator(currentCalculator, '/');
        } else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            calculate(currentCalculator);
        } else if (e.key === 'Escape') {
            clearAll(currentCalculator);
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            backspace(currentCalculator);
        }
    }
});

// Initialize currency converter on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set default currency values
    document.getElementById('from-currency').value = 'USD';
    document.getElementById('to-currency').value = 'INR';
});
