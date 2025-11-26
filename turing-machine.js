class TuringMachine {
    constructor() {
        this.readTape = [];
        this.writeTape = [];
        this.position = 0;
        this.currentState = 'q0';
        this.previousState = null;
        this.isRunning = false;
        this.speed = 1000;
        this.digitsRead = 0;
        
        this.statePositions = {
            'q0': { x: 5, y: 50 },
            'q1': { x: 18, y: 50 },
            'q2': { x: 31, y: 50 },
            'q3': { x: 44, y: 50 },
            'q4': { x: 57, y: 50 },
            'q5': { x: 70, y: 50 },
            'q6': { x: 83, y: 50 },
            'accept': { x: 50, y: 15 },
            'reject': { x: 50, y: 85 }
        };
        
        this.initialize();
    }

    initialize() {
        this.elements = {
            readTape: document.getElementById('readTape'),
            writeTape: document.getElementById('writeTape'),
            input: document.getElementById('inputString'),
            currentState: document.getElementById('currentState'),
            currentSymbol: document.getElementById('currentSymbol'),
            digitsReadDisplay: document.getElementById('digitsRead'),
            readPosition: document.getElementById('readPosition'),
            writeCount: document.getElementById('writeCount'),
            result: document.getElementById('result'),
            console: document.getElementById('console'),
            transitionInfo: document.getElementById('transitionInfo'),
            transitionText: document.getElementById('transitionText'),
            stateDiagram: document.getElementById('stateDiagram')
        };

        this.bindEvents();
        this.createStateDiagram();
        this.renderTapes();
        this.updateDisplay();
        
        setTimeout(() => {
            this.drawTransitions();
        }, 100);
        
        this.addLog('✓ Sistema inicializado', 'success');
        this.addLog('→ Listo para recibir entrada');
    }

    bindEvents() {
        document.getElementById('loadBtn').addEventListener('click', () => this.loadTape());
        document.getElementById('stepBtn').addEventListener('click', () => this.step());
        document.getElementById('runBtn').addEventListener('click', () => this.run());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        
        this.elements.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.loadTape();
        });
    }

    loadTape() {
        const input = this.elements.input.value.trim();
        
        if (!input) {
            this.addLog('✗ Error: Ingrese una cadena primero', 'error');
            return;
        }

        if (input.length > 10) {
            this.addLog('✗ Error: Máximo 10 caracteres', 'error');
            return;
        }

        this.readTape = [...input.split(''), '□'];
        this.writeTape = [];
        this.position = 0;
        this.currentState = 'q0';
        this.previousState = null;
        this.digitsRead = 0;
        
        this.renderTapes();
        this.updateDisplay();
        this.highlightState('q0');
        
        this.addLog(`✓ Cadena cargada: "${input}"`, 'success');
        this.addLog(`→ Longitud: ${input.length} caracteres`);
        this.updateTransitionInfo(`Cargado: ${input.length} caracteres | Estado: q0`);
    }

    renderTapes() {
        this.elements.readTape.innerHTML = '';
        
        if (this.readTape.length === 0) {
            for (let i = 0; i < 7; i++) {
                this.elements.readTape.appendChild(this.createCell('□', false, true));
            }
        } else {
            this.readTape.forEach((symbol, index) => {
                const isActive = index === this.position;
                const isBlank = symbol === '□';
                this.elements.readTape.appendChild(this.createCell(symbol, isActive, isBlank));
            });
        }

        this.updateHeadPosition('read');

        this.elements.writeTape.innerHTML = '';
        
        if (this.writeTape.length === 0) {
            for (let i = 0; i < 7; i++) {
                this.elements.writeTape.appendChild(this.createCell('□', false, true));
            }
        } else {
            this.writeTape.forEach((symbol, index) => {
                const isActive = index === this.writeTape.length - 1;
                const isBlank = symbol === '□';
                const cell = this.createCell(symbol, isActive, isBlank);
                if (index === this.writeTape.length - 1) {
                    cell.classList.add('written');
                }
                this.elements.writeTape.appendChild(cell);
            });
            
            const remaining = Math.max(7 - this.writeTape.length, 0);
            for (let i = 0; i < remaining; i++) {
                this.elements.writeTape.appendChild(this.createCell('□', false, true));
            }
        }

        this.updateHeadPosition('write');
    }

    updateHeadPosition(tapeType) {
        requestAnimationFrame(() => {
            const tape = tapeType === 'read' ? this.elements.readTape : this.elements.writeTape;
            const container = tape.closest('.tape-container');
            if (!container) return;
            
            const headSelector = tapeType === 'read' ? '.tape-head:not(.write)' : '.tape-head.write';
            const head = container.querySelector(headSelector);
            
            if (!head || !tape) return;

            const cells = tape.querySelectorAll('.cell');
            let activeIndex = tapeType === 'read' ? this.position : Math.max(0, this.writeTape.length - 1);
            
            if (activeIndex >= cells.length) activeIndex = cells.length - 1;
            if (activeIndex < 0) activeIndex = 0;
            
            const activeCell = cells[activeIndex];
            
            if (activeCell) {
                const containerRect = container.getBoundingClientRect();
                const cellRect = activeCell.getBoundingClientRect();
                
                const leftPosition = (cellRect.left - containerRect.left) + (cellRect.width / 2) - (head.offsetWidth / 2);
                
                head.style.left = `${leftPosition}px`;
            }
        });
    }

    createCell(symbol, isActive, isBlank) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        if (isActive) cell.classList.add('active');
        if (isBlank) cell.classList.add('blank');
        cell.textContent = symbol;
        return cell;
    }

    step() {
        if (this.readTape.length === 0) {
            this.addLog('✗ Error: Primero cargue una cadena', 'error');
            return;
        }

        if (this.currentState === 'accept' || this.currentState === 'reject') {
            this.addLog('ℹ La máquina ya terminó', 'info');
            return;
        }

        const currentSymbol = this.readTape[this.position];
        this.previousState = this.currentState;
        this.transition(currentSymbol);
        this.renderTapes();
        this.updateDisplay();
        this.highlightState(this.currentState);
        this.animateTransition(this.previousState, this.currentState);
    }

    transition(symbol) {
        const isDigit = /^[0-9]$/.test(symbol);
        const isBlank = symbol === '□';
        
        switch(this.currentState) {
            case 'q0':
                if (isDigit) {
                    this.writeTape.push(symbol);
                    this.currentState = 'q1';
                    this.digitsRead++;
                    this.position++;
                    this.addLog(`→ Dígito "${symbol}" leído | q0 → q1`);
                    this.updateTransitionInfo(`Leyó: "${symbol}" | q0 → q1 | Dígitos: 1`);
                } else if (isBlank) {
                    this.currentState = 'reject';
                    this.addLog('✗ Cadena vacía → Rechazo', 'error');
                    this.updateTransitionInfo('Cadena vacía → RECHAZADO');
                } else {
                    this.writeTape.push(symbol);
                    this.currentState = 'reject';
                    this.position++;
                    this.addLog(`✗ Símbolo inválido "${symbol}" → Rechazo`, 'error');
                    this.updateTransitionInfo(`Símbolo inválido: "${symbol}" → RECHAZADO`);
                }
                break;

            case 'q1':
                if (isDigit) {
                    this.writeTape.push(symbol);
                    this.currentState = 'q2';
                    this.digitsRead++;
                    this.position++;
                    this.addLog(`→ Dígito "${symbol}" leído | q1 → q2`);
                    this.updateTransitionInfo(`Leyó: "${symbol}" | q1 → q2 | Dígitos: 2`);
                } else if (isBlank) {
                    this.currentState = 'reject';
                    this.addLog('✗ Solo 1 dígito → Rechazo', 'error');
                    this.updateTransitionInfo('1 dígito insuficiente → RECHAZADO');
                } else {
                    this.writeTape.push(symbol);
                    this.currentState = 'reject';
                    this.position++;
                    this.addLog(`✗ Símbolo inválido "${symbol}" → Rechazo`, 'error');
                    this.updateTransitionInfo(`Símbolo inválido: "${symbol}" → RECHAZADO`);
                }
                break;

            case 'q2':
                if (isDigit) {
                    this.writeTape.push(symbol);
                    this.currentState = 'q3';
                    this.digitsRead++;
                    this.position++;
                    this.addLog(`→ Dígito "${symbol}" leído | q2 → q3`);
                    this.updateTransitionInfo(`Leyó: "${symbol}" | q2 → q3 | Dígitos: 3`);
                } else if (isBlank) {
                    this.currentState = 'reject';
                    this.addLog('✗ Solo 2 dígitos → Rechazo', 'error');
                    this.updateTransitionInfo('2 dígitos insuficientes → RECHAZADO');
                } else {
                    this.writeTape.push(symbol);
                    this.currentState = 'reject';
                    this.position++;
                    this.addLog(`✗ Símbolo inválido "${symbol}" → Rechazo`, 'error');
                    this.updateTransitionInfo(`Símbolo inválido: "${symbol}" → RECHAZADO`);
                }
                break;

            case 'q3':
                if (isDigit) {
                    this.writeTape.push(symbol);
                    this.currentState = 'q4';
                    this.digitsRead++;
                    this.position++;
                    this.addLog(`→ Dígito "${symbol}" leído | q3 → q4`);
                    this.updateTransitionInfo(`Leyó: "${symbol}" | q3 → q4 | Dígitos: 4 (posible válido)`);
                } else if (isBlank) {
                    this.currentState = 'reject';
                    this.addLog('✗ Solo 3 dígitos → Rechazo', 'error');
                    this.updateTransitionInfo('3 dígitos insuficientes → RECHAZADO');
                } else {
                    this.writeTape.push(symbol);
                    this.currentState = 'reject';
                    this.position++;
                    this.addLog(`✗ Símbolo inválido "${symbol}" → Rechazo`, 'error');
                    this.updateTransitionInfo(`Símbolo inválido: "${symbol}" → RECHAZADO`);
                }
                break;

            case 'q4':
                if (isDigit) {
                    this.writeTape.push(symbol);
                    this.currentState = 'q5';
                    this.digitsRead++;
                    this.position++;
                    this.addLog(`→ Dígito "${symbol}" leído | q4 → q5`);
                    this.updateTransitionInfo(`Leyó: "${symbol}" | q4 → q5 | Dígitos: 5`);
                } else if (isBlank) {
                    this.currentState = 'accept';
                    this.addLog('✓ PIN de 4 dígitos → Aceptado', 'success');
                    this.updateTransitionInfo('4 dígitos → PIN VÁLIDO ✓');
                } else {
                    this.writeTape.push(symbol);
                    this.currentState = 'reject';
                    this.position++;
                    this.addLog(`✗ Símbolo inválido "${symbol}" → Rechazo`, 'error');
                    this.updateTransitionInfo(`Símbolo inválido: "${symbol}" → RECHAZADO`);
                }
                break;

            case 'q5':
                if (isDigit) {
                    this.writeTape.push(symbol);
                    this.currentState = 'q6';
                    this.digitsRead++;
                    this.position++;
                    this.addLog(`→ Dígito "${symbol}" leído | q5 → q6`);
                    this.updateTransitionInfo(`Leyó: "${symbol}" | q5 → q6 | Dígitos: 6 (posible válido)`);
                } else if (isBlank) {
                    this.currentState = 'reject';
                    this.addLog('✗ Solo 5 dígitos → Rechazo', 'error');
                    this.updateTransitionInfo('5 dígitos inválido → RECHAZADO');
                } else {
                    this.writeTape.push(symbol);
                    this.currentState = 'reject';
                    this.position++;
                    this.addLog(`✗ Símbolo inválido "${symbol}" → Rechazo`, 'error');
                    this.updateTransitionInfo(`Símbolo inválido: "${symbol}" → RECHAZADO`);
                }
                break;

            case 'q6':
                if (isBlank) {
                    this.currentState = 'accept';
                    this.addLog('✓ PIN de 6 dígitos → Aceptado', 'success');
                    this.updateTransitionInfo('6 dígitos → PIN VÁLIDO ✓');
                } else if (isDigit) {
                    this.writeTape.push(symbol);
                    this.currentState = 'reject';
                    this.digitsRead++;
                    this.position++;
                    this.addLog(`✗ Más de 6 dígitos → Rechazo`, 'error');
                    this.updateTransitionInfo('Más de 6 dígitos → RECHAZADO');
                } else {
                    this.writeTape.push(symbol);
                    this.currentState = 'reject';
                    this.position++;
                    this.addLog(`✗ Símbolo inválido "${symbol}" → Rechazo`, 'error');
                    this.updateTransitionInfo(`Símbolo inválido: "${symbol}" → RECHAZADO`);
                }
                break;
        }
    }

    run() {
        if (this.isRunning) return;
        
        if (this.readTape.length === 0) {
            this.addLog('✗ Error: Primero cargue una cadena', 'error');
            return;
        }
        
        this.isRunning = true;
        this.addLog('⚡ Ejecución automática iniciada', 'info');

        const execute = () => {
            if ((this.currentState !== 'accept' && this.currentState !== 'reject') && 
                this.position < this.readTape.length && this.isRunning) {
                this.step();
                setTimeout(execute, this.speed);
            } else {
                this.isRunning = false;
                if (this.currentState === 'accept') {
                    this.addLog('✓ ¡EJECUCIÓN COMPLETADA! PIN VÁLIDO', 'success');
                } else if (this.currentState === 'reject') {
                    this.addLog('✗ Ejecución completada - PIN INVÁLIDO', 'error');
                }
            }
        };
        
        execute();
    }

    reset() {
        this.readTape = [];
        this.writeTape = [];
        this.position = 0;
        this.currentState = 'q0';
        this.previousState = null;
        this.isRunning = false;
        this.digitsRead = 0;
        
        this.elements.input.value = '';
        this.renderTapes();
        this.updateDisplay();
        this.highlightState('q0');
        
        this.elements.console.innerHTML = '';
        this.addLog('✓ Sistema reiniciado', 'success');
        this.addLog('→ Listo para nueva entrada');
        this.updateTransitionInfo('Sistema reiniciado | Estado: q0');
    }

    updateDisplay() {
        this.elements.currentState.textContent = this.currentState;
        this.elements.currentSymbol.textContent = this.readTape[this.position] || '-';
        this.elements.digitsReadDisplay.textContent = this.digitsRead;
        this.elements.readPosition.textContent = this.position;
        this.elements.writeCount.textContent = this.writeTape.length;
        
        if (this.currentState === 'accept') {
            this.elements.result.textContent = '✅ PIN VÁLIDO';
            this.elements.result.style.color = 'var(--success-color)';
        } else if (this.currentState === 'reject') {
            this.elements.result.textContent = '❌ PIN INVÁLIDO';
            this.elements.result.style.color = 'var(--error-color)';
        } else {
            this.elements.result.textContent = '⏳ Procesando...';
            this.elements.result.style.color = 'var(--text-primary)';
        }
    }

    highlightState(state) {
        document.querySelectorAll('.state-node').forEach(node => {
            node.classList.remove('active');
        });
        
        const stateNode = document.getElementById(`state-${state}`);
        if (stateNode) {
            stateNode.classList.add('active');
        }
    }

    animateTransition(fromState, toState) {
        if (!fromState || !toState || fromState === toState) return;
        
        document.querySelectorAll('.transition-arrow').forEach(arrow => {
            arrow.classList.remove('active');
        });
        
        const arrow = document.querySelector(`.transition-arrow[data-from="${fromState}"][data-to="${toState}"]`);
        if (arrow) {
            arrow.classList.add('active');
            setTimeout(() => {
                arrow.classList.remove('active');
            }, 1000);
        }
    }

    updateTransitionInfo(text) {
        if (this.elements.transitionText) {
            this.elements.transitionText.textContent = text;
        }
    }

    createStateDiagram() {
        const diagram = this.elements.stateDiagram;
        if (!diagram) return;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.id = 'transitionsSVG';
        svg.classList.add('transitions-svg');
        diagram.appendChild(svg);

        const nodePositions = {
            'q0': { x: 10, y: 50, label: 'q0', desc: 'Inicio' },
            'q1': { x: 22, y: 50, label: 'q1', desc: '1 dígito' },
            'q2': { x: 34, y: 50, label: 'q2', desc: '2 dígitos' },
            'q3': { x: 46, y: 50, label: 'q3', desc: '3 dígitos' },
            'q4': { x: 58, y: 50, label: 'q4', desc: '4 dígitos' },
            'q5': { x: 70, y: 50, label: 'q5', desc: '5 dígitos' },
            'q6': { x: 82, y: 50, label: 'q6', desc: '6 dígitos' },
            'accept': { x: 50, y: 15, label: 'Accept', desc: 'Válido ✓', class: 'accept' },
            'reject': { x: 50, y: 85, label: 'Reject', desc: 'Inválido ✗', class: 'reject' }
        };

        Object.entries(nodePositions).forEach(([id, pos]) => {
            const node = document.createElement('div');
            node.className = `state-node ${pos.class || ''}`;
            node.id = `state-${id}`;
            node.style.left = `${pos.x}%`;
            node.style.top = `${pos.y}%`;
            node.innerHTML = `
                <span>${pos.label}</span>
                <div class="state-glow"></div>
                <div class="state-desc">${pos.desc}</div>
            `;
            diagram.appendChild(node);
        });

        const transitionInfo = document.createElement('div');
        transitionInfo.className = 'transition-info';
        transitionInfo.id = 'transitionInfo';
        transitionInfo.innerHTML = '<span id="transitionText">Estado: q0 | Símbolo: - | Acción: Esperando</span>';
        diagram.appendChild(transitionInfo);
        
        this.elements.transitionText = document.getElementById('transitionText');

        const diagramSection = diagram.closest('.diagram-section');
        if (diagramSection) {
            const legend = document.createElement('div');
            legend.className = 'diagram-legend';
            legend.innerHTML = `
                <div class="legend-item">
                    <div class="legend-color" style="background: var(--primary-color);"></div>
                    <span>Estado Activo</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background: var(--success-color);"></div>
                    <span>Aceptación (4 o 6 dígitos)</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background: var(--error-color);"></div>
                    <span>Rechazo</span>
                </div>
            `;
            diagramSection.appendChild(legend);
        }

        this.highlightState('q0');
    }

    drawTransitions() {
        const svg = document.getElementById('transitionsSVG');
        const diagram = document.querySelector('.state-diagram');
        
        if (!svg || !diagram) return;
        
        svg.innerHTML = '';
        
        const diagramRect = diagram.getBoundingClientRect();
        
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.setAttribute('viewBox', `0 0 ${diagramRect.width} ${diagramRect.height}`);
        svg.setAttribute('preserveAspectRatio', 'none');
        
        const transitions = [
            { from: 'q0', to: 'q1', type: 'main' },
            { from: 'q1', to: 'q2', type: 'main' },
            { from: 'q2', to: 'q3', type: 'main' },
            { from: 'q3', to: 'q4', type: 'main' },
            { from: 'q4', to: 'q5', type: 'main' },
            { from: 'q5', to: 'q6', type: 'main' },
            { from: 'q4', to: 'accept', type: 'success' },
            { from: 'q6', to: 'accept', type: 'success' },
            { from: 'q0', to: 'reject', type: 'error' },
            { from: 'q1', to: 'reject', type: 'error' },
            { from: 'q2', to: 'reject', type: 'error' },
            { from: 'q3', to: 'reject', type: 'error' },
            { from: 'q5', to: 'reject', type: 'error' },
            { from: 'q6', to: 'reject', type: 'error' }
        ];
        
        transitions.forEach(trans => {
            const fromNode = document.getElementById(`state-${trans.from}`);
            const toNode = document.getElementById(`state-${trans.to}`);
            
            if (fromNode && toNode) {
                const fromRect = fromNode.getBoundingClientRect();
                const toRect = toNode.getBoundingClientRect();
                
                const x1 = fromRect.left - diagramRect.left + fromRect.width / 2;
                const y1 = fromRect.top - diagramRect.top + fromRect.height / 2;
                const x2 = toRect.left - diagramRect.left + toRect.width / 2;
                const y2 = toRect.top - diagramRect.top + toRect.height / 2;
                
                const angle = Math.atan2(y2 - y1, x2 - x1);
                const nodeRadius = 45;
                
                const x1Adjusted = x1 + Math.cos(angle) * nodeRadius;
                const y1Adjusted = y1 + Math.sin(angle) * nodeRadius;
                const x2Adjusted = x2 - Math.cos(angle) * nodeRadius;
                const y2Adjusted = y2 - Math.sin(angle) * nodeRadius;
                
                const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                group.classList.add('transition-arrow');
                group.dataset.from = trans.from;
                group.dataset.to = trans.to;
                
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', x1Adjusted);
                line.setAttribute('y1', y1Adjusted);
                line.setAttribute('x2', x2Adjusted);
                line.setAttribute('y2', y2Adjusted);
                line.setAttribute('stroke', 'rgba(255, 255, 255, 0.2)');
                line.setAttribute('stroke-width', '2');
                
                if (trans.type === 'success') {
                    line.setAttribute('stroke', 'rgba(0, 255, 136, 0.3)');
                } else if (trans.type === 'error') {
                    line.setAttribute('stroke', 'rgba(255, 0, 128, 0.3)');
                }
                
                const arrowSize = 8;
                const arrowAngle = Math.PI / 6;
                
                const arrow1X = x2Adjusted - arrowSize * Math.cos(angle - arrowAngle);
                const arrow1Y = y2Adjusted - arrowSize * Math.sin(angle - arrowAngle);
                const arrow2X = x2Adjusted - arrowSize * Math.cos(angle + arrowAngle);
                const arrow2Y = y2Adjusted - arrowSize * Math.sin(angle + arrowAngle);
                
                const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                arrowPath.setAttribute('d', `M ${x2Adjusted} ${y2Adjusted} L ${arrow1X} ${arrow1Y} L ${arrow2X} ${arrow2Y} Z`);
                arrowPath.setAttribute('fill', 'rgba(255, 255, 255, 0.2)');
                
                if (trans.type === 'success') {
                    arrowPath.setAttribute('fill', 'rgba(0, 255, 136, 0.3)');
                } else if (trans.type === 'error') {
                    arrowPath.setAttribute('fill', 'rgba(255, 0, 128, 0.3)');
                }
                
                group.appendChild(line);
                group.appendChild(arrowPath);
                svg.appendChild(group);
            }
        });
    }

    addLog(message, type = '') {
        const log = document.createElement('div');
        log.className = `console-line ${type}`;
        log.textContent = `> ${message}`;
        this.elements.console.appendChild(log);
        this.elements.console.scrollTop = this.elements.console.scrollHeight;
    }
}

// Initialize Turing Machine
document.addEventListener('DOMContentLoaded', () => {
    const tm = new TuringMachine();
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            tm.drawTransitions();
            tm.updateHeadPosition('read');
            tm.updateHeadPosition('write');
        }, 200);
    });
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            tm.drawTransitions();
            tm.updateHeadPosition('read');
            tm.updateHeadPosition('write');
        }, 300);
    });
});