# Leyes de Newton ⚙️

Proyecto de Física I — Dinámica: Segunda y Tercera Ley de Newton.

Calculadora web interactiva que resuelve distintos escenarios físicos relacionados con la **2ª Ley de Newton** y la **3ª Ley de Newton**, mostrando procedimientos paso a paso, resultados numéricos y simulaciones visuales mediante Canvas API.

---

## ¿Qué son las Leyes de Newton?

Las **Leyes de Newton** describen la relación entre las fuerzas que actúan sobre los cuerpos y el movimiento que producen.

En este proyecto se trabajan especialmente:

- **Segunda Ley de Newton:** establece que la aceleración de un cuerpo depende de la fuerza neta aplicada y de su masa.  
  `F = m · a`

- **Tercera Ley de Newton:** indica que toda acción genera una reacción de igual magnitud y dirección opuesta.  
  `F₁₂ = −F₂₁`

---

## Escenarios implementados

### Segunda Ley de Newton

| Escenario | Descripción | Cálculos disponibles |
|----------|-------------|----------------------|
| Bloque deslizante | Bloque sobre superficie horizontal con rozamiento | Aceleración, fuerza necesaria y masa |
| Máquina de Atwood | Dos masas unidas por una cuerda sobre una polea | Aceleración del sistema y tensión |
| Polea en mesa | Masa sobre mesa conectada a una masa colgante | Aceleración, tensión y masa colgante |
| Plano inclinado | Bloque sobre un plano con ángulo y rozamiento | Aceleración libre y fuerza para subir |

### Tercera Ley de Newton

| Escenario | Descripción | Cálculos disponibles |
|----------|-------------|----------------------|
| Bloques en contacto | Dos bloques que ejercen fuerzas mutuas | Fuerzas de acción y reacción, aceleraciones |
| Elevador con persona | Persona sobre una báscula dentro de un elevador | Peso real, peso aparente y par acción–reacción |

---

## Fórmulas implementadas

### Segunda Ley

| Escenario | Fórmulas principales |
|----------|----------------------|
| Bloque deslizante | `Fnet = F − μk·m·g` , `a = Fnet / m` |
| Máquina de Atwood | `a = (m₁ − m₂)·g / (m₁ + m₂)` , `T = 2·m₁·m₂·g / (m₁ + m₂)` |
| Polea en mesa | `a = (m·g − μk·M·g) / (M + m)` , `T = M·(a + μk·g)` |
| Plano inclinado | `a = g·(sinθ − μk·cosθ)` , `N = m·g·cosθ` , `Fr = μk·N` |

### Tercera Ley

| Escenario | Fórmulas principales |
|----------|----------------------|
| Bloques en contacto | `FBA = −FAB` , `aA = F / mA` , `aB = F / mB` |
| Elevador con persona | `Peso = m·g` , `N = m(g+a)` al acelerar hacia arriba , `N = m(g−a)` al acelerar hacia abajo |

---

## Estructura del proyecto

```text
/
├── index.html       # Estructura principal de la interfaz
├── style.css        # Diseño visual, tarjetas, botones y estilos responsivos
├── logic.js         # Lógica de escenarios, cálculos, validaciones y resultados
├── animation.js     # Animaciones físicas renderizadas con Canvas API
└── README.md
```

### `index.html`

Contiene toda la estructura de la aplicación:

- Encabezado principal del proyecto
- Navegación por pestañas para 2ª y 3ª Ley
- Selectores de escenarios
- Tarjetas de enunciado dinámico
- Área de animación
- Formularios de calculadora
- Sección de resultados y fórmulas

---

### `style.css`

Define la identidad visual del proyecto:

- Diseño oscuro con acentos neón
- Tipografías `Space Mono` y `Syne`
- Tarjetas, botones, formularios y estados de resultado
- Sistema de pestañas y selectores de escenario
- Diseño responsive para pantallas pequeñas
- Estilos para resultados múltiples y selector del elevador

---

### `logic.js`

Gestiona la lógica completa de la calculadora:

- Configuración de escenarios y enunciados dinámicos
- Renderizado de inputs según el caso seleccionado
- Validación de datos ingresados
- Cálculos físicos para cada escenario
- Generación de resultados paso a paso
- Comunicación con las animaciones mediante:
  - `window.updateSegundaAnim()`
  - `window.updateTerceraAnim()`
  - `window.changeScenario2()`
  - `window.changeScenario3()`

---

### `animation.js`

Controla las simulaciones visuales usando **Canvas API nativo**, sin librerías externas.

#### Animaciones de la Segunda Ley

- Bloque desplazándose sobre una superficie con rozamiento
- Máquina de Atwood con movimiento de masas
- Sistema de polea en mesa con masa colgante
- Bloque sobre plano inclinado con representación de fuerzas

#### Animaciones de la Tercera Ley

- Bloques en contacto con fuerzas de acción y reacción
- Elevador con persona y visualización de:
  - Fuerza normal
  - Peso real
  - Aceleración
  - Lectura de la báscula

---

## Características principales

- Interfaz dividida por leyes físicas
- Escenarios interactivos con descripciones contextualizadas
- Resultados detallados con procedimiento matemático
- Validación de entradas incorrectas
- Animaciones independientes para cada sistema físico
- Reinicio y simulación manual mediante botones
- Diseño visual moderno y adaptable

---

## Casos de prueba

Usá los siguientes ejemplos para comprobar que la calculadora funciona correctamente:

| Caso | Escenario | Datos ingresados | Resultado esperado |
|------|-----------|------------------|--------------------|
| 1 | Bloque deslizante | `F = 100 N`, `m = 10 kg`, `μk = 0.3` | `a = 7.0600 m/s²` |
| 2 | Máquina de Atwood | `m₁ = 8 kg`, `m₂ = 5 kg` | `a ≈ 2.2615 m/s²`, `T ≈ 60.308 N` |
| 3 | Polea en mesa | `M = 10 kg`, `m = 3 kg`, `μk = 0.2` | `a ≈ 0.7538 m/s²`, `T ≈ 27.138 N` |
| 4 | Plano inclinado | `m = 5 kg`, `θ = 30°`, `μk = 0.2` | `a ≈ 3.2026 m/s²` |
| 5 | Bloques en contacto | `F = 50 N`, `mA = 5 kg`, `mB = 3 kg` | `FBA = −50 N`, `aA = 10 m/s²`, `aB ≈ 16.6667 m/s²` |
| 6 | Elevador hacia arriba | `m = 70 kg`, `a = 2 m/s²` | `Peso = 686 N`, `N = 826 N` |
| 7 | Elevador hacia abajo | `m = 70 kg`, `a = 2 m/s²` | `Peso = 686 N`, `N = 546 N` |

---

## Cómo usar

1. Seleccioná la ley de Newton que querés explorar
2. Elegí el escenario físico correspondiente
3. Ingresá los valores solicitados
4. Presioná **Calcular**
5. Revisá el resultado y el procedimiento paso a paso
6. Usá **Simular** para observar la animación
7. Presioná **Reiniciar** para devolver la animación a su estado inicial

---

## Tecnologías

- HTML5
- CSS3
- JavaScript ES6+
- Canvas API
- Google Fonts — Space Mono y Syne

---

## Autores
 
- **Donny Luis Ramiro Ramos Alvarez** — 0910-25-3526  

Proyecto desarrollado para el curso de **Física I** — Facultad de Ingeniería en Sistemas de la Información y Ciencias de la Computación — Universidad Mariano Gálvez de Guatemala.
