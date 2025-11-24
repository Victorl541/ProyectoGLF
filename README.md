# ProyectoGLF — Validación de PIN con AFD y Máquina de Turing

Este proyecto implementa un simulador visual de una Máquina de Turing usando **HTML, CSS y JavaScript**, siguiendo la estructura de un **AFD** previamente diseñado para validar PINs de **4 o 6 dígitos**.

---

## 1. Regex elegido y justificación

El patrón seleccionado para validar un PIN es: \d{4} | \d{6}


Este regex fue elegido porque coincide con el estándar real utilizado en sistemas de autenticación modernos (bancos, cajeros automáticos y plataformas de acceso seguro).  
Permite únicamente cadenas numéricas de exactamente **4 o 6 cifras**, lo que facilita su traducción a un **Autómata Finito Determinista (AFD)** y posteriormente a una **Máquina de Turing (MT)** capaz de contarlas mediante estados.

---

## 2. Diagrama del AFD utilizado

El siguiente AFD modela el comportamiento del regex anterior, permitiendo únicamente cadenas de dígitos `d` cuya longitud válida es 4 o 6. 
 
<img width="449" height="328" alt="image" src="https://github.com/user-attachments/assets/fe016f23-2040-4f1f-a2d9-56867a603f07" />



Este diagrama describe la estructura determinista usada luego para diseñar la Máquina de Turing que emula el conteo de dígitos y valida la aceptación o rechazo de la entrada.

---

## 3. Tabla de transición completa de la Máquina de Turing

La Máquina de Turing diseñada simula el mismo proceso que el AFD pero con capacidades de lectura secuencial sobre una cinta.  
Cada dígito hace que la MT avance y cambie de estado, y al encontrar el símbolo blanco `B` se decide si la longitud es válida.

---

### **Estados de la MT**

- `q0` — estado inicial  
- `q1`, `q2`, `q3`, `q4`, `q5`, `q6` — representan la cantidad de dígitos leídos  
- `qA` — estado de aceptación  
- `qR` — estado de rechazo  

---

### Manejo del símbolo blanco `B`

El símbolo `B` representa el final de la cadena.  
Cuando la MT lo encuentra, determina:

- Si se han leído **4 dígitos → aceptación (`qA`)**  
- Si se han leído **6 dígitos → aceptación (`qA`)**  
- Si se han leído **1, 2, 3, 5 o más de 6 → rechazo (`qR`)**

Esto permite replicar perfectamente el comportamiento del regex original.

---

### **Tabla de Transición**

| Estado | Símbolo leído | Símbolo escrito | Movimiento | Siguiente estado | Descripción |
|--------|----------------|------------------|------------|-------------------|-------------|
| `q0` | `d` | mismo | R | `q1` | Primer dígito (conteo = 1) |
| `q1` | `d` | mismo | R | `q2` | Segundo dígito |
| `q1` | `B` | `B` | R | `qR` | No puede terminar con 1 dígito |
| `q2` | `d` | mismo | R | `q3` | Tercer dígito |
| `q2` | `B` | `B` | R | `qR` | No puede terminar con 2 dígitos |
| `q3` | `d` | mismo | R | `q4` | Cuarto dígito (posible PIN válido) |
| `q3` | `B` | `B` | R | `qR` | No puede terminar con 3 dígitos |
| `q4` | `B` | `B` |R | `qA` | PIN válido de 4 dígitos |
| `q4` | `d` | mismo | R | `q5` | Quinto dígito |
| `q5` | `d` | mismo | R | `q6` | Sexto dígito |
| `q5` | `B` | `B` | R | `qR` | No puede terminar con 5 dígitos |
| `q6` | `B` | `B` | R | `qA` | PIN válido de 6 dígitos |
| `q6` | `d` | mismo | R | `qR` | No puede tener más de 6 dígitos |
| `qA` | cualquier | mismo | R | `qA` | Aceptación |
| `qR` | cualquier | mismo | R | `qR` | Rechazo |

---

## Conclusiones

El proyecto demuestra la equivalencia entre expresiones regulares, AFDs y Máquinas de Turing, integrando:

- diseño formal de autómatas  
- simulación gráfica en JavaScript  
- manejo de cadenas por medio de lógica determinista  

La implementación permite visualizar paso a paso cómo la MT analiza y determina si un PIN es válido.

---




