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
