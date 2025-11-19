class TuringMachine {
    constructor() {
        this.tape = ['□', '□', '□', '□', '□', '□', '□'];
        this.position = 0;
        this.currentState = 'q0';
        this.isRunning = false;
        this.speed = 800;
        this.digitsRead = 0;
        
        this.states = {
            'q0': this.stateQ0.bind(this),
            'q1': this.stateQ1.bind(this),
            'q2': this.stateQ2.bind(this),
            'q3': this.stateQ3.bind(this),
            'q4': this.stateQ4.bind(this),
            'q5': this.stateQ5.bind(this),
            'q6': this.stateQ6.bind(this),
            'q7': this.stateQ7.bind(this),
            'check': this.stateCheck.bind(this)
        };
        
        this.initialize();
    }

    initialize() {
        this.elements = {
            tape: document.getElementById('tape'),
            head: document.getElementById('tapeHead'),
            state: document.getElementById('currentState'),
            symbol: document.getElementById('currentSymbol'),
            position: document.getElementById('currentPosition'),
            result: document.getElementById('result'),
            console: document.getElementById('console'),
            input: document.getElementById('inputString')
        };

        this.bindEvents();
        this.addLog('Sistema listo. Ingrese un PIN de 4 o 6 dígitos.');
    }

    bindEvents() {
        document.getElementById('loadBtn').addEventListener('click', () => this.loadTape());
        document.getElementById('stepBtn').addEventListener('click', () => this.step());
        document.getElementById('runBtn').addEventListener('click', () => this.run());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
    }

    loadTape() {
        const input = this.elements.input.value.trim();
        
        if (!input) {
            this.addLog('Error: Ingrese una cadena primero');
            return;
        }

        if (input.length > 10) {
            this.addLog('Error: La cadena no puede tener más de 10 caracteres');
            return;
        }

        this.tape = [...input.split(''), '□'];
        this.position = 0;
        this.currentState = 'q0';
        this.digitsRead = 0;
        
        this.renderTape();
        this.updateDisplay();
        this.addLog(`Cadena cargada: "${input}"`);
        this.addLog(`Longitud: ${input.length} caracteres`);
    }

    renderTape() {
        this.elements.tape.innerHTML = '';
        
        this.tape.forEach((symbol, index) => {
            const cell = document.createElement('div');
            cell.className = `cell ${index === this.position ? 'active' : ''} ${symbol === '□' ? 'blank' : ''}`;
            cell.textContent = symbol;
            this.elements.tape.appendChild(cell);
        });

        this.updateHeadPosition();
    }

    updateHeadPosition() {
        const cells = this.elements.tape.querySelectorAll('.cell');
        
        if (cells[this.position]) {
            const cellRect = cells[this.position].getBoundingClientRect();
            const tapeRect = this.elements.tape.getBoundingClientRect();
            const left = cellRect.left - tapeRect.left + (cellRect.width / 2);
            this.elements.head.style.left = `calc(${left}px - 1rem)`;
        }
    }

    step() {
        if (this.tape.length === 0) {
            this.addLog('Error: Primero cargue una cadena');
            return;
        }

        if (this.currentState === 'accept' || this.currentState === 'reject') {
            this.addLog('La máquina ya terminó su ejecución');
            return;
        }

        if (this.position >= this.tape.length) {
            this.currentState = 'check';
            this.addLog('Fin de cinta alcanzado - Verificando longitud');
            this.checkLength();
            return;
        }

        const currentSymbol = this.tape[this.position];
        this.addLog(`Estado ${this.currentState}, símbolo: "${currentSymbol}"`);

        const stateHandler = this.states[this.currentState];
        if (stateHandler) {
            stateHandler(currentSymbol);
        }

        this.renderTape();
        this.updateDisplay();
    }

    stateQ0(symbol) {
        if (this.isDigit(symbol)) {
            this.currentState = 'q1';
            this.digitsRead++;
            this.position++;
            this.addLog('Primer dígito válido → q1');
        } else if (symbol === '□') {
            this.currentState = 'check';
            this.addLog('Cadena vacía - Verificando longitud');
            this.checkLength();
        } else {
            this.currentState = 'q7';
            this.position++;
            this.addLog('Símbolo inválido - debe ser dígito → q7');
        }
    }

    stateQ1(symbol) {
        if (this.isDigit(symbol)) {
            this.currentState = 'q2';
            this.digitsRead++;
            this.position++;
            this.addLog('Segundo dígito válido → q2');
        } else if (symbol === '□') {
            this.currentState = 'check';
            this.addLog('Fin de cadena - Verificando longitud');
            this.checkLength();
        } else {
            this.currentState = 'q7';
            this.position++;
            this.addLog('Símbolo inválido - debe ser dígito → q7');
        }
    }

    stateQ2(symbol) {
        if (this.isDigit(symbol)) {
            this.currentState = 'q3';
            this.digitsRead++;
            this.position++;
            this.addLog('Tercer dígito válido → q3');
        } else if (symbol === '□') {
            this.currentState = 'check';
            this.addLog('Fin de cadena - Verificando longitud');
            this.checkLength();
        } else {
            this.currentState = 'q7';
            this.position++;
            this.addLog('Símbolo inválido - debe ser dígito → q7');
        }
    }

    stateQ3(symbol) {
        if (this.isDigit(symbol)) {
            this.currentState = 'q4';
            this.digitsRead++;
            this.position++;
            this.addLog('Cuarto dígito válido → q4');
        } else if (symbol === '□') {
            this.currentState = 'check';
            this.addLog('Fin de cadena - Verificando longitud');
            this.checkLength();
        } else {
            this.currentState = 'q7';
            this.position++;
            this.addLog('Símbolo inválido - debe ser dígito → q7');
        }
    }

    stateQ4(symbol) {
        if (this.isDigit(symbol)) {
            this.currentState = 'q5';
            this.digitsRead++;
            this.position++;
            this.addLog('Quinto dígito válido → q5');
        } else if (symbol === '□') {
            this.currentState = 'check';
            this.addLog('Fin de cadena - Verificando longitud');
            this.checkLength();
        } else {
            this.currentState = 'q7';
            this.position++;
            this.addLog('Símbolo inválido - debe ser dígito → q7');
        }
    }

    stateQ5(symbol) {
        if (this.isDigit(symbol)) {
            this.currentState = 'q6';
            this.digitsRead++;
            this.position++;
            this.addLog('Sexto dígito válido → q6');
        } else if (symbol === '□') {
            this.currentState = 'check';
            this.addLog('Fin de cadena - Verificando longitud');
            this.checkLength();
        } else {
            this.currentState = 'q7';
            this.position++;
            this.addLog('Símbolo inválido - debe ser dígito → q7');
        }
    }

    stateQ6(symbol) {
        if (symbol === '□') {
            this.currentState = 'check';
            this.addLog('Fin de cadena - Verificando longitud');
            this.checkLength();
        } else if (this.isDigit(symbol)) {
            this.digitsRead++;
            this.position++;
            this.addLog(`Dígito ${this.digitsRead} leído - Continuando lectura`);
        } else {
            this.currentState = 'q7';
            this.position++;
            this.addLog('Símbolo inválido - debe ser dígito → q7');
        }
    }

    stateQ7(symbol) {
        if (symbol === '□') {
            this.currentState = 'reject';
            this.addLog('❌ PIN INVÁLIDO - Contiene símbolos no numéricos');
        } else {
            this.position++;
            this.addLog('Continuando lectura de símbolos inválidos...');
        }
    }

    stateCheck(symbol) {
        this.checkLength();
    }

    checkLength() {
        if (this.currentState === 'q7') {
            this.currentState = 'reject';
            this.addLog('❌ PIN INVÁLIDO - Contiene símbolos no numéricos');
        } else if (this.digitsRead === 4 || this.digitsRead === 6) {
            this.currentState = 'accept';
            this.addLog(`✅ PIN VÁLIDO - ${this.digitsRead} dígitos exactos`);
        } else {
            this.currentState = 'reject';
            this.addLog(`❌ PIN INVÁLIDO - ${this.digitsRead} dígitos (debe ser 4 o 6)`);
        }
        this.updateDisplay();
    }

    isDigit(symbol) {
        return /^[0-9]$/.test(symbol);
    }

    run() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.addLog('Ejecución automática iniciada');

        const execute = () => {
            if ((this.currentState !== 'accept' && this.currentState !== 'reject') && 
                this.position < this.tape.length && this.isRunning) {
                this.step();
                setTimeout(execute, this.speed);
            } else {
                this.isRunning = false;
                if (this.currentState === 'accept') {
                    this.addLog('✅ Ejecución completada - PIN VÁLIDO');
                } else if (this.currentState === 'reject') {
                    this.addLog('❌ Ejecución completada - PIN INVÁLIDO');
                }
            }
        };
        
        execute();
    }

    reset() {
        this.tape = ['□', '□', '□', '□', '□', '□', '□'];
        this.position = 0;
        this.currentState = 'q0';
        this.isRunning = false;
        this.digitsRead = 0;
        
        this.elements.input.value = '';
        this.renderTape();
        this.updateDisplay();
        this.addLog('Sistema reiniciado');
    }

    updateDisplay() {
        this.elements.state.textContent = this.currentState;
        this.elements.symbol.textContent = this.tape[this.position] || '-';
        this.elements.position.textContent = this.position;
        
        if (this.currentState === 'accept') {
            this.elements.result.textContent = '✅ PIN VÁLIDO';
            this.elements.result.style.color = '#00ff88';
        } else if (this.currentState === 'reject') {
            this.elements.result.textContent = '❌ PIN INVÁLIDO';
            this.elements.result.style.color = '#ff0080';
        } else {
            this.elements.result.textContent = '⏳ Procesando...';
            this.elements.result.style.color = '#ffffff';
        }
    }

    addLog(message) {
        const log = document.createElement('div');
        log.className = 'console-line';
        log.textContent = `> ${message}`;
        this.elements.console.appendChild(log);
        this.elements.console.scrollTop = this.elements.console.scrollHeight;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TuringMachine();
});