//ตัวแปรเก็บข้อมูลคำนวณ
let currentInput = '';
let operator = '';
let previousInput = '';
let shouldResetDisplay = false;

//คำนวณ + - * /
const Calculator = {
    add: (a, b) => a + b,
    
    subtract: (a, b) => a - b,
    
    multiply: (a, b) => a * b,
    
    divide: (a, b) => {
        if (b === 0) {
            throw new Error('Cannot divide by zero');
        }
        return a / b;
    },
    
    //คำนวณตามเครื่องหมาย
    calculate: (num1, operator, num2) => {
        const a = parseFloat(num1);
        const b = parseFloat(num2);
        
        switch (operator) {
            case '+':
                return Calculator.add(a, b);
            case '-':
                return Calculator.subtract(a, b);
            case '*':
            case '×':
                return Calculator.multiply(a, b);
            case '/':
            case '÷':
                return Calculator.divide(a, b);
            default:
                throw new Error('Unknown operator');
        }
    }
};

//เพิ่มข้อมูลไป dispay 
function appendToDisplay(value) {
    const display = document.getElementById('display');
    
    if (shouldResetDisplay) {
        display.value = '';
        shouldResetDisplay = false;
    }
    
    //ป้องกันการใส่ตัวดำเนินการหลายตัวติดกัน
    if (['+', '-', '*', '/'].includes(value)) {
        if (display.value === '' || ['+', '-', '*', '/'].includes(display.value.slice(-1))) {
            return;
        }
    }
    
    //ป้องกันการใส่จุดทศนิยมหลายตัว
    if (value === '.') {
        const parts = display.value.split(/[\+\-\*\/]/);
        const lastPart = parts[parts.length - 1];
        if (lastPart.includes('.')) {
            return;
        }
    }
    
    display.value += value;
}

//clearข้อมูล
function clearDisplay() {
    document.getElementById('display').value = '';
    currentInput = '';
    operator = '';
    previousInput = '';
    shouldResetDisplay = false;
}

//ลบตัวหลัง
function deleteLast() {
    const display = document.getElementById('display');
    display.value = display.value.slice(0, -1);
}

//คำนวณผลลัพธ์
function calculateResult() {
    const display = document.getElementById('display');
    const expression = display.value;
    
    if (expression === '') return;
    
    try {
        //แทนที่สัญลักษณ์ × ด้วย *
        const sanitizedExpression = expression.replace(/×/g, '*');
        
        //ตรวจสอบ expression ปลอดภัย (มีเฉพาะตัวเลข และเครื่องหมาย +, -, *, /, ., (, ))
        if (!/^[0-9+\-*/.() ]+$/.test(sanitizedExpression)) {
            throw new Error('Invalid expression');
        }
        
        //ใช้คำนวณแบบปลอดภัย
        const result = evaluateExpression(sanitizedExpression);
        
        if (isNaN(result) || !isFinite(result)) {
            display.value = 'Error';
        } else {
            display.value = parseFloat(result.toFixed(10)).toString();
        }
        
        shouldResetDisplay = true;
    } catch (error) {
        display.value = 'Error';
        shouldResetDisplay = true;
    }
}

//ประมวลผลสมการแบบปลอดภัย
function evaluateExpression(expression) {
    // แยกสมการเป็นส่วนๆ
    const tokens = expression.match(/(\d+\.?\d*|[+\-*/])/g);
    
    if (!tokens) throw new Error('Invalid expression');
    
    //คำนวณการคูณและหารก่อน
    for (let i = 1; i < tokens.length; i += 2) {
        if (tokens[i] === '*' || tokens[i] === '/') {
            const result = Calculator.calculate(tokens[i-1], tokens[i], tokens[i+1]);
            tokens.splice(i-1, 3, result.toString());
            i -= 2;
        }
    }
    
    //คำนวณการบวกและลบ
    for (let i = 1; i < tokens.length; i += 2) {
        if (tokens[i] === '+' || tokens[i] === '-') {
            const result = Calculator.calculate(tokens[i-1], tokens[i], tokens[i+1]);
            tokens.splice(i-1, 3, result.toString());
            i -= 2;
        }
    }
    
    return parseFloat(tokens[0]);
}

//การรองรับปุ่มคีย์บอร์ด
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        appendToDisplay(key);
    } else if (key === '+' || key === '-') {
        appendToDisplay(key);
    } else if (key === '*') {
        appendToDisplay('*');
    } else if (key === '/') {
        event.preventDefault();
        appendToDisplay('/');
    } else if (key === '.') {
        appendToDisplay('.');
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculateResult();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLast();
    }
});