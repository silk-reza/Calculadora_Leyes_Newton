/**
 * logic.js — Calculadora 2ª y 3ª Ley de Newton
 * Escenarios: bloque, Atwood, polea en mesa, plano inclinado (2ª)
 *             bloques, cohete, bote (3ª)
 */

const g = 9.8;

/* ============================================================
   CONFIGURACIÓN DE ESCENARIOS — 2ª LEY
   ============================================================ */

const ESCENARIOS2 = {
  bloque: {
    titulo: 'F = m · a',
    subtitulo: 'Bloque deslizante con rozamiento',
    descripcion: `Un bloque de masa <em>m</em> reposa sobre una superficie horizontal con coeficiente
      de rozamiento cinético μ<sub>k</sub>. Una fuerza horizontal <em>F</em> es aplicada sobre el bloque.`,
    preguntas: [
      '¿Cuál es la aceleración del bloque si se conocen <em>F</em>, <em>m</em> y μ<sub>k</sub>?',
      '¿Qué fuerza se necesita aplicar para que el bloque alcance una aceleración deseada?',
      '¿Cuál es la fuerza de rozamiento que actúa sobre el bloque?',
    ],
    formula: 'F<sub>neta</sub> = F − μ<sub>k</sub>·m·g &nbsp;|&nbsp; a = F<sub>neta</sub> / m',
    modos: [
      { key: 'aceleracion', label: 'Aceleración (a)' },
      { key: 'fuerza',      label: 'Fuerza (F)'      },
      { key: 'masa',        label: 'Masa (m)'         },
    ],
  },
  atwood: {
    titulo: 'Máquina de Atwood',
    subtitulo: 'Dos masas unidas por una cuerda en una polea',
    descripcion: `Dos masas m<sub>1</sub> y m<sub>2</sub> cuelgan de una cuerda ideal que pasa por una
      polea sin fricción. La masa mayor desciende y la menor asciende.`,
    preguntas: [
      '¿Cuál es la aceleración del sistema si se conocen m<sub>1</sub> y m<sub>2</sub>?',
      '¿Cuál es la tensión en la cuerda?',
      '¿Si la aceleración es conocida, qué relación de masas la produce?',
    ],
    formula: 'a = (m<sub>1</sub> − m<sub>2</sub>)·g / (m<sub>1</sub> + m<sub>2</sub>) &nbsp;|&nbsp; T = 2·m<sub>1</sub>·m<sub>2</sub>·g / (m<sub>1</sub> + m<sub>2</sub>)',
    modos: [
      { key: 'aceleracion', label: 'Aceleración (a)' },
      { key: 'tension',     label: 'Tensión (T)'     },
    ],
  },
  mesa: {
    titulo: 'Polea en mesa',
    subtitulo: 'Masa en mesa conectada a masa colgante',
    descripcion: `Una masa M reposa sobre una mesa con rozamiento μ<sub>k</sub>.
      Está conectada por una cuerda horizontal (sobre la mesa) que pasa por una polea
      al borde, y del otro extremo cuelga una masa m.`,
    preguntas: [
      '¿Cuál es la aceleración del sistema?',
      '¿Cuál es la tensión en la cuerda?',
      '¿Qué masa colgante m se necesita para lograr una aceleración dada?',
    ],
    formula: 'a = (m·g − μ<sub>k</sub>·M·g) / (M + m) &nbsp;|&nbsp; T = M·(a + μ<sub>k</sub>·g)',
    modos: [
      { key: 'aceleracion', label: 'Aceleración (a)' },
      { key: 'tension',     label: 'Tensión (T)'     },
      { key: 'masaColgante',label: 'Masa colgante (m)'},
    ],
  },
  inclinado: {
    titulo: 'Plano inclinado',
    subtitulo: 'Bloque sobre plano con ángulo θ y rozamiento',
    descripcion: `Un bloque de masa <em>m</em> reposa sobre un plano inclinado un ángulo θ
      respecto a la horizontal. El coeficiente de rozamiento cinético es μ<sub>k</sub>.
      Una fuerza <em>F</em> paralela al plano puede ser aplicada hacia arriba o abajo.`,
    preguntas: [
      '¿Cuál es la aceleración del bloque si se deja deslizar libremente (F = 0)?',
      '¿Qué fuerza F es necesaria para que suba con aceleración a?',
      '¿Cuál es la fuerza normal y la fuerza de rozamiento?',
    ],
    formula: 'a = g·(sin θ − μ<sub>k</sub>·cos θ) &nbsp;|&nbsp; N = m·g·cos θ &nbsp;|&nbsp; F<sub>r</sub> = μ<sub>k</sub>·N',
    modos: [
      { key: 'libre',  label: 'Deslizamiento libre' },
      { key: 'subida', label: 'Fuerza para subir'   },
    ],
  },
};

/* ============================================================
   CONFIGURACIÓN DE ESCENARIOS — 3ª LEY
   ============================================================ */

const ESCENARIOS3 = {
  choque: {
    titulo: 'F<sub>12</sub> = −F<sub>21</sub>',
    subtitulo: 'Bloques que chocan',
    descripcion: `Dos bloques A y B se mueven sobre una superficie horizontal y chocan entre sí durante un intervalo de tiempo Δt. Durante el contacto, A ejerce una fuerza sobre B y B ejerce una fuerza igual en magnitud pero en sentido contrario sobre A.`,
    preguntas: [
      'Si conocemos el impulso o la fuerza promedio del choque, ¿cuál es la fuerza de acción y reacción?',
      '¿Qué aceleración instantánea experimenta cada bloque durante el contacto?',
      '¿Cómo cambia la velocidad de cada bloque después del choque usando impulso?'
    ],
    formula: 'F<sub>A→B</sub> = −F<sub>B→A</sub> &nbsp;|&nbsp; a = F/m &nbsp;|&nbsp; J = F·Δt = m·Δv',
  },
  elevador: {
    titulo: 'N = m(g ± a)',
    subtitulo: 'Persona dentro de un elevador',
    descripcion: `Una persona está de pie sobre una báscula dentro de un elevador. La persona empuja la báscula hacia abajo y la báscula empuja a la persona hacia arriba con una fuerza normal N. Ese par normal es un ejemplo directo de acción y reacción.`,
    preguntas: [
      '¿Cuál es el peso real de la persona?',
      '¿Cuál es la fuerza normal o peso aparente que marca la báscula?',
      '¿Cuál es el par acción–reacción entre la persona y el piso del elevador?'
    ],
    formula: 'Peso real = m·g &nbsp;|&nbsp; N = m(g+a) si sube/acelera arriba &nbsp;|&nbsp; N = m(g−a) si acelera abajo',
  },
  bloques: {
    titulo: 'F<sub>AB</sub> = −F<sub>BA</sub>',
    subtitulo: 'Bloques en contacto',
    descripcion: `Dos objetos A y B están en contacto. El objeto A ejerce una fuerza F sobre B. Por la 3ª Ley de Newton, B ejerce sobre A una fuerza igual en magnitud pero opuesta en dirección.`,
    preguntas: [
      'Si A ejerce 50 N sobre B, ¿qué fuerza ejerce B sobre A?',
      '¿Cuál es la aceleración de cada objeto si conocemos sus masas?',
      '¿Qué ocurre con la aceleración de cada cuerpo si tienen masas diferentes?'
    ],
    formula: 'F<sub>B→A</sub> = −F<sub>A→B</sub> &nbsp;|&nbsp; a<sub>A</sub> = F/m<sub>A</sub> &nbsp;|&nbsp; a<sub>B</sub> = F/m<sub>B</sub>',
  },
};

/* ============================================================
   ESTADO GLOBAL
   ============================================================ */

let currentScenario2 = 'bloque';
let currentSolve2    = 'aceleracion';
let currentScenario3 = 'bloques';

/* ============================================================
   RENDER ENUNCIADO
   ============================================================ */

function renderEnunciado2() {
  const esc = ESCENARIOS2[currentScenario2];
  const el  = document.getElementById('enunciado-segunda');
  el.innerHTML = `
    <div class="card-tag">Enunciado · 2ª Ley · ${esc.subtitulo}</div>
    <h2 class="card-title">${esc.titulo}</h2>
    <p class="card-body">${esc.descripcion}</p>
    <div class="preguntas">
      ${esc.preguntas.map((p, i) => `
        <div class="pregunta-item">
          <span class="pq-num">${String.fromCharCode(97 + i)})</span>
          <span>${p}</span>
        </div>`).join('')}
    </div>
  `;
}

function renderEnunciado3() {
  const esc = ESCENARIOS3[currentScenario3];
  const el  = document.getElementById('enunciado-tercera');
  el.innerHTML = `
    <div class="card-tag">Enunciado · 3ª Ley · ${esc.subtitulo}</div>
    <h2 class="card-title">${esc.titulo}</h2>
    <p class="card-body">${esc.descripcion}</p>
    <div class="preguntas">
      ${esc.preguntas.map((p, i) => `
        <div class="pregunta-item">
          <span class="pq-num">${String.fromCharCode(97 + i)})</span>
          <span>${p}</span>
        </div>`).join('')}
    </div>
  `;
}

/* ============================================================
   RENDER SOLVE SELECTOR & INPUTS — 2ª LEY
   ============================================================ */

function renderSolveSelector2() {
  const esc = ESCENARIOS2[currentScenario2];
  const container = document.getElementById('solve-selector-segunda');
  container.innerHTML = `
    <span class="solve-label">Calcular:</span>
    ${esc.modos.map(m => `
      <button class="solve-btn ${m.key === currentSolve2 ? 'active' : ''}" data-solve2="${m.key}">
        ${m.label}
      </button>`).join('')}
  `;
  container.querySelectorAll('.solve-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.solve-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSolve2 = btn.dataset.solve2;
      renderInputs2();
      resetResult('segunda');
    });
  });
}

function renderInputs2() {
  const container = document.getElementById('inputs-segunda');
  const formula   = document.getElementById('formula-segunda');
  const esc = ESCENARIOS2[currentScenario2];
  formula.innerHTML = `<span>${esc.formula}</span>`;
  container.innerHTML = buildInputs2();
}

function buildInputs2() {
  const s = currentScenario2;
  const m = currentSolve2;

  const inp = (id, label, placeholder, disabled = false) => `
    <div class="input-group">
      <label for="${id}">${label}</label>
      <input type="number" id="${id}" placeholder="${placeholder}" step="any"${disabled ? ' disabled' : ''}/>
    </div>`;

  if (s === 'bloque') {
    const isA = m === 'aceleracion';
    const isF = m === 'fuerza';
    const isM = m === 'masa';
    return inp('s2-fuerza', 'Fuerza aplicada F (N)', isF ? 'RESULTADO' : 'ej. 100', isF)
         + inp('s2-masa',   'Masa m (kg)',             isM ? 'RESULTADO' : 'ej. 10',  isM)
         + inp('s2-mu',     'Coef. rozamiento μk',     'ej. 0.3')
         + (isA ? inp('s2-target', 'Aceleración a (m/s²)', 'RESULTADO', true)
                : inp('s2-target', isF ? 'Aceleración deseada a (m/s²)' : 'Aceleración a (m/s²)', 'ej. 5'));
  }

  if (s === 'atwood') {
    const isA = m === 'aceleracion';
    const isT = m === 'tension';
    return inp('at-m1', 'Masa mayor m₁ (kg)', 'ej. 8')
         + inp('at-m2', 'Masa menor m₂ (kg)', 'ej. 5')
         + (isA
            ? inp('at-result', 'Aceleración a (m/s²)', 'RESULTADO', true)
            : inp('at-result', 'Tensión T (N)',         'RESULTADO', true));
  }

  if (s === 'mesa') {
    const isA = m === 'aceleracion';
    const isT = m === 'tension';
    const isMc = m === 'masaColgante';
    return inp('ms-M',  'Masa en mesa M (kg)',         'ej. 10')
         + inp('ms-mu', 'Coef. rozamiento μk',         'ej. 0.2')
         + (isMc ? inp('ms-m', 'Masa colgante m (kg)', 'RESULTADO', true)
                 : inp('ms-m', 'Masa colgante m (kg)', 'ej. 3'))
         + (isMc ? inp('ms-a', 'Aceleración deseada a (m/s²)', 'ej. 2')
                 : inp('ms-result', isA ? 'Aceleración a (m/s²)' : 'Tensión T (N)', 'RESULTADO', true));
  }

  if (s === 'inclinado') {
    const isL = m === 'libre';
    const isS = m === 'subida';
    return inp('inc-m',     'Masa m (kg)',                 'ej. 5')
         + inp('inc-theta', 'Ángulo θ (grados)',           'ej. 30')
         + inp('inc-mu',    'Coef. rozamiento μk',         'ej. 0.2')
         + (isS ? inp('inc-a', 'Aceleración deseada a (m/s²)', 'ej. 2') : '')
         + (isS ? inp('inc-F', 'Fuerza necesaria F (N)', 'RESULTADO', true)
                : inp('inc-a-res', 'Aceleración a (m/s²)', 'RESULTADO', true));
  }

  return '';
}

/* ============================================================
   RENDER INPUTS — 3ª LEY
   ============================================================ */

function renderInputs3() {
  const container = document.getElementById('inputs-tercera');
  const formula   = document.getElementById('formula-tercera');
  const esc = ESCENARIOS3[currentScenario3];
  formula.innerHTML = `<span>${esc.formula}</span>`;

  const inp = (id, label, placeholder) => `
    <div class="input-group">
      <label for="${id}">${label}</label>
      <input type="number" id="${id}" placeholder="${placeholder}" step="any"/>
    </div>`;

  if (currentScenario3 === 'choque') {
    container.innerHTML =
        inp('ch-F',  'Fuerza promedio del choque F (N)', 'ej. 120')
      + inp('ch-dt', 'Tiempo de contacto Δt (s)', 'ej. 0.20')
      + inp('ch-mA', 'Masa del bloque A (kg)', 'ej. 4')
      + inp('ch-mB', 'Masa del bloque B (kg)', 'ej. 6')
      + inp('ch-vA', 'Velocidad inicial de A hacia B (m/s)', 'ej. 3')
      + inp('ch-vB', 'Velocidad inicial de B hacia A (m/s)', 'ej. 1');
  } else if (currentScenario3 === 'elevador') {
    container.innerHTML =
        inp('el-m', 'Masa de la persona m (kg)', 'ej. 70')
      + inp('el-a', 'Aceleración del elevador a (m/s²)', 'ej. 2')
      + `<div class="input-group"><label for="el-dir">Dirección de la aceleración</label><select id="el-dir"><option value="arriba">Hacia arriba</option><option value="abajo">Hacia abajo</option><option value="reposo">Reposo / velocidad constante</option></select></div>`;
  } else if (currentScenario3 === 'bloques') {
    container.innerHTML =
        inp('t3-fuerza', 'Fuerza aplicada F (N)', 'ej. 50')
      + inp('t3-masaA',  'Masa de A — mₐ (kg)',   'ej. 5')
      + inp('t3-masaB',  'Masa de B — m_B (kg)',   'ej. 3');
  }
}

/* ============================================================
   CÁLCULOS — 2ª LEY
   ============================================================ */

function calcularSegunda() {
  const resultBox = document.getElementById('result-segunda');
  const getVal = id => {
    const el = document.getElementById(id);
    if (!el || el.disabled) return null;
    const v = parseFloat(el.value);
    return isNaN(v) ? null : v;
  };

  try {
    if (currentScenario2 === 'bloque') calcBloque(resultBox, getVal);
    else if (currentScenario2 === 'atwood') calcAtwood(resultBox, getVal);
    else if (currentScenario2 === 'mesa') calcMesa(resultBox, getVal);
    else if (currentScenario2 === 'inclinado') calcInclinado(resultBox, getVal);
  } catch (e) {
    mostrarError(resultBox, 'Error: ' + e.message);
  }
}

/* --- Bloque deslizante --- */
function calcBloque(box, get) {
  const F  = get('s2-fuerza');
  const m  = get('s2-masa');
  const mu = get('s2-mu') ?? 0;
  const aT = get('s2-target');

  if (currentSolve2 === 'aceleracion') {
    if (F === null) return mostrarError(box, 'Ingresa la Fuerza F');
    if (m === null || m <= 0) return mostrarError(box, 'Ingresa la Masa m (> 0)');
    const Fr = mu * m * g;
    const Fn = F - Fr;
    const a  = Fn / m;
    mostrarResultado(box, {
      label: 'Aceleración', value: a.toFixed(4), unit: 'm/s²',
      steps: [
        `Fr = μk·m·g = ${mu}×${m}×${g} = <strong>${Fr.toFixed(3)} N</strong>`,
        `Fnet = F − Fr = ${F} − ${Fr.toFixed(3)} = <strong>${Fn.toFixed(3)} N</strong>`,
        `a = Fnet/m = ${Fn.toFixed(3)}/${m} = <strong>${a.toFixed(4)} m/s²</strong>`,
      ]
    });
    window._s2data = { scenario: 'bloque', F, m, mu, a };

  } else if (currentSolve2 === 'fuerza') {
    if (m === null || m <= 0) return mostrarError(box, 'Ingresa la Masa m (> 0)');
    if (aT === null) return mostrarError(box, 'Ingresa la aceleración deseada a');
    const Fr  = mu * m * g;
    const Fn  = aT * m;
    const Fap = Fn + Fr;
    mostrarResultado(box, {
      label: 'Fuerza necesaria', value: Fap.toFixed(4), unit: 'N',
      steps: [
        `Fnet = m·a = ${m}×${aT} = <strong>${Fn.toFixed(3)} N</strong>`,
        `Fr = μk·m·g = ${mu}×${m}×${g} = <strong>${Fr.toFixed(3)} N</strong>`,
        `F = Fnet + Fr = <strong>${Fap.toFixed(4)} N</strong>`,
      ]
    });
    window._s2data = { scenario: 'bloque', F: Fap, m, mu, a: aT };

  } else { // masa
    if (F === null) return mostrarError(box, 'Ingresa la Fuerza F');
    if (aT === null || aT === 0) return mostrarError(box, 'Ingresa la aceleración a (≠ 0)');
    const denom = aT + mu * g;
    if (denom <= 0) return mostrarError(box, '(a + μk·g) debe ser > 0');
    const mR = F / denom;
    const Fr = mu * mR * g;
    mostrarResultado(box, {
      label: 'Masa', value: mR.toFixed(4), unit: 'kg',
      steps: [
        `F = m·(a + μk·g)  →  m = F/(a+μk·g)`,
        `m = ${F}/(${aT}+${mu}×${g}) = <strong>${mR.toFixed(4)} kg</strong>`,
        `Verificación: Fr = ${Fr.toFixed(3)} N, a = ${((F-Fr)/mR).toFixed(4)} m/s²`,
      ]
    });
    window._s2data = { scenario: 'bloque', F, m: mR, mu, a: aT };
  }
  if (window.updateSegundaAnim) window.updateSegundaAnim(window._s2data);
}

/* --- Máquina de Atwood --- */
function calcAtwood(box, get) {
  const m1 = get('at-m1');
  const m2 = get('at-m2');
  if (m1 === null || m1 <= 0) return mostrarError(box, 'Ingresa m₁ (> 0)');
  if (m2 === null || m2 <= 0) return mostrarError(box, 'Ingresa m₂ (> 0)');
  if (m1 <= m2) return mostrarError(box, 'm₁ debe ser mayor que m₂');

  const a = (m1 - m2) * g / (m1 + m2);
  const T = 2 * m1 * m2 * g / (m1 + m2);

  if (currentSolve2 === 'aceleracion') {
    mostrarResultado(box, {
      label: 'Aceleración', value: a.toFixed(4), unit: 'm/s²',
      steps: [
        `a = (m₁−m₂)·g / (m₁+m₂)`,
        `a = (${m1}−${m2})×${g} / (${m1}+${m2}) = <strong>${a.toFixed(4)} m/s²</strong>`,
        `Tensión T = 2·m₁·m₂·g/(m₁+m₂) = <strong>${T.toFixed(3)} N</strong>`,
      ]
    });
  } else {
    mostrarResultado(box, {
      label: 'Tensión', value: T.toFixed(4), unit: 'N',
      steps: [
        `T = 2·m₁·m₂·g / (m₁+m₂)`,
        `T = 2×${m1}×${m2}×${g} / (${m1}+${m2}) = <strong>${T.toFixed(4)} N</strong>`,
        `Aceleración del sistema: a = <strong>${a.toFixed(4)} m/s²</strong>`,
      ]
    });
  }
  window._s2data = { scenario: 'atwood', m1, m2, a, T };
  if (window.updateSegundaAnim) window.updateSegundaAnim(window._s2data);
}

/* --- Polea en mesa --- */
function calcMesa(box, get) {
  const M  = get('ms-M');
  const mu = get('ms-mu') ?? 0;

  if (M === null || M <= 0) return mostrarError(box, 'Ingresa la Masa en mesa M (> 0)');

  if (currentSolve2 === 'masaColgante') {
    const a = get('ms-a');
    if (a === null) return mostrarError(box, 'Ingresa la aceleración deseada a');
    // a = (m·g − μk·M·g)/(M+m) → m·(g−a) = M·(a+μk·g) → m = M·(a+μk·g)/(g−a)
    const denom = g - a;
    if (denom <= 0) return mostrarError(box, 'La aceleración no puede ser ≥ g');
    const m = M * (a + mu * g) / denom;
    const Fr = mu * M * g;
    const T  = M * (a + mu * g);
    mostrarResultado(box, {
      label: 'Masa colgante', value: m.toFixed(4), unit: 'kg',
      steps: [
        `m = M·(a + μk·g) / (g − a)`,
        `m = ${M}×(${a}+${mu}×${g}) / (${g}−${a}) = <strong>${m.toFixed(4)} kg</strong>`,
        `Tensión T = M·(a+μk·g) = <strong>${T.toFixed(3)} N</strong>`,
      ]
    });
    window._s2data = { scenario: 'mesa', M, mu, m, a, T };

  } else {
    const m = get('ms-m');
    if (m === null || m <= 0) return mostrarError(box, 'Ingresa la Masa colgante m (> 0)');
    const Fr = mu * M * g;
    const a  = (m * g - Fr) / (M + m);
    const T  = M * (a + mu * g);

    if (currentSolve2 === 'aceleracion') {
      mostrarResultado(box, {
        label: 'Aceleración', value: a.toFixed(4), unit: 'm/s²',
        steps: [
          `Fr = μk·M·g = ${mu}×${M}×${g} = <strong>${Fr.toFixed(3)} N</strong>`,
          `a = (m·g − Fr)/(M+m) = (${m}×${g}−${Fr.toFixed(3)})/(${M}+${m}) = <strong>${a.toFixed(4)} m/s²</strong>`,
          `Tensión: T = M·(a+μk·g) = <strong>${T.toFixed(3)} N</strong>`,
        ]
      });
    } else { // tension
      mostrarResultado(box, {
        label: 'Tensión', value: T.toFixed(4), unit: 'N',
        steps: [
          `a = (m·g − μk·M·g)/(M+m) = <strong>${a.toFixed(4)} m/s²</strong>`,
          `T = M·(a + μk·g) = ${M}×(${a.toFixed(4)}+${mu}×${g}) = <strong>${T.toFixed(4)} N</strong>`,
        ]
      });
    }
    window._s2data = { scenario: 'mesa', M, mu, m, a, T };
  }
  if (window.updateSegundaAnim) window.updateSegundaAnim(window._s2data);
}

/* --- Plano inclinado --- */
function calcInclinado(box, get) {
  const m     = get('inc-m');
  const theta = get('inc-theta');
  const mu    = get('inc-mu') ?? 0;

  if (m === null || m <= 0)    return mostrarError(box, 'Ingresa la masa m (> 0)');
  if (theta === null || theta < 0 || theta >= 90) return mostrarError(box, 'Ingresa θ entre 0° y 90°');

  const rad = theta * Math.PI / 180;
  const N   = m * g * Math.cos(rad);
  const Fr  = mu * N;

  if (currentSolve2 === 'libre') {
    const a = g * (Math.sin(rad) - mu * Math.cos(rad));
    mostrarResultado(box, {
      label: 'Aceleración', value: a.toFixed(4), unit: 'm/s²',
      steps: [
        `N = m·g·cos θ = ${m}×${g}×cos(${theta}°) = <strong>${N.toFixed(3)} N</strong>`,
        `Fr = μk·N = ${mu}×${N.toFixed(3)} = <strong>${Fr.toFixed(3)} N</strong>`,
        `a = g·(sin θ − μk·cos θ) = ${g}×(sin${theta}°−${mu}·cos${theta}°) = <strong>${a.toFixed(4)} m/s²</strong>`,
        a < 0 ? `<span style="color:var(--accent3)">a < 0: el bloque no desliza (rozamiento domina)</span>` : '',
      ].filter(Boolean)
    });
    window._s2data = { scenario: 'inclinado', m, theta, mu, a, N, Fr };

  } else { // subida
    const a = get('inc-a');
    if (a === null) return mostrarError(box, 'Ingresa la aceleración deseada a');
    // F − Fr − m·g·sin θ = m·a  →  F = m·a + m·g·sinθ + Fr
    const F = m * a + m * g * Math.sin(rad) + Fr;
    mostrarResultado(box, {
      label: 'Fuerza para subir', value: F.toFixed(4), unit: 'N',
      steps: [
        `N = ${N.toFixed(3)} N  |  Fr = ${Fr.toFixed(3)} N`,
        `F = m·a + m·g·sin θ + Fr`,
        `F = ${m}×${a} + ${m}×${g}×sin(${theta}°) + ${Fr.toFixed(3)} = <strong>${F.toFixed(4)} N</strong>`,
      ]
    });
    window._s2data = { scenario: 'inclinado', m, theta, mu, a, N, Fr, F };
  }
  if (window.updateSegundaAnim) window.updateSegundaAnim(window._s2data);
}

/* ============================================================
   CÁLCULOS — 3ª LEY
   ============================================================ */

function calcularTercera() {
  const box = document.getElementById('result-tercera');
  const getVal = id => {
    const el = document.getElementById(id);
    if (!el) return null;
    const v = parseFloat(el.value);
    return isNaN(v) ? null : v;
  };

  try {
    if (currentScenario3 === 'choque') calcChoque3(box, getVal);
    else if (currentScenario3 === 'elevador') calcElevador3(box, getVal);
    else if (currentScenario3 === 'bloques') calcBloques3(box, getVal);
  } catch (e) {
    mostrarError(box, 'Error: ' + e.message);
  }
}

function calcChoque3(box, get) {
  const F = get('ch-F');
  const dt = get('ch-dt');
  const mA = get('ch-mA');
  const mB = get('ch-mB');
  const vA = get('ch-vA') ?? 0;
  const vB = get('ch-vB') ?? 0;
  if (F === null || F <= 0) return mostrarError(box, 'Ingresa la fuerza promedio del choque (> 0)');
  if (dt === null || dt <= 0) return mostrarError(box, 'Ingresa el tiempo de contacto Δt (> 0)');
  if (mA === null || mA <= 0) return mostrarError(box, 'Ingresa la masa del bloque A (> 0)');
  if (mB === null || mB <= 0) return mostrarError(box, 'Ingresa la masa del bloque B (> 0)');

  const FAB = F;
  const FBA = -F;
  const J = F * dt;
  const aA = F / mA;
  const aB = F / mB;
  const vAf = vA - J / mA;
  const vBf = -vB + J / mB;

  mostrarResultadoMulti(box, [
    { label: 'FUERZA A→B', value: FAB.toFixed(3), unit: 'N →', color: 'accent' },
    { label: 'FUERZA B→A', value: FBA.toFixed(3), unit: 'N ←', color: 'accent3' },
    { label: 'IMPULSO', value: J.toFixed(3), unit: 'N·s', color: 'accent2' },
    { label: 'aA / aB', value: `${aA.toFixed(2)} / ${aB.toFixed(2)}`, unit: 'm/s²', color: 'accent' },
  ], [
    `3ª Ley: F_B→A = −F_A→B = <strong>${FBA.toFixed(3)} N</strong>.`,
    `Impulso del choque: J = F·Δt = ${F}×${dt} = <strong>${J.toFixed(3)} N·s</strong>.`,
    `Aceleraciones instantáneas: a_A = ${aA.toFixed(3)} m/s² hacia la izquierda; a_B = ${aB.toFixed(3)} m/s² hacia la derecha.`,
    `Velocidades estimadas después del contacto: v_Af = ${vAf.toFixed(3)} m/s, v_Bf = ${vBf.toFixed(3)} m/s.`,
  ]);
  window._t3data = { scenario: 'choque', F, dt, mA, mB, vA, vB, FAB, FBA, J, aA, aB, vAf, vBf };
  if (window.updateTerceraAnim) window.updateTerceraAnim(window._t3data);
}

function calcElevador3(box, get) {
  const m = get('el-m');
  const aIn = get('el-a') ?? 0;
  const dir = document.getElementById('el-dir')?.value || 'arriba';
  if (m === null || m <= 0) return mostrarError(box, 'Ingresa la masa de la persona (> 0)');
  if (aIn < 0) return mostrarError(box, 'La aceleración debe ser positiva; elige la dirección en el selector');

  const a = dir === 'reposo' ? 0 : aIn;
  const peso = m * g;
  const N = dir === 'abajo' ? m * (g - a) : m * (g + a);
  if (N < 0) return mostrarError(box, 'Con esos datos habría caída libre o pérdida de contacto. Usa a ≤ g cuando acelera hacia abajo.');
  const personaSobrePiso = -N;

  mostrarResultadoMulti(box, [
    { label: 'PESO REAL', value: peso.toFixed(3), unit: 'N ↓', color: 'accent3' },
    { label: 'NORMAL / BÁSCULA', value: N.toFixed(3), unit: 'N ↑', color: 'accent' },
    { label: 'PERSONA→PISO', value: personaSobrePiso.toFixed(3), unit: 'N ↓', color: 'accent3' },
    { label: 'PISO→PERSONA', value: N.toFixed(3), unit: 'N ↑', color: 'accent2' },
  ], [
    `Peso real: W = m·g = ${m}×9.8 = <strong>${peso.toFixed(3)} N</strong>.`,
    dir === 'abajo' ? `Elevador acelerando hacia abajo: N = m(g−a) = <strong>${N.toFixed(3)} N</strong>.` : `Elevador acelerando hacia arriba o constante: N = m(g+a) = <strong>${N.toFixed(3)} N</strong>.`,
    `Par de 3ª Ley: la persona empuja el piso con ${N.toFixed(3)} N hacia abajo y el piso empuja a la persona con ${N.toFixed(3)} N hacia arriba.`,
    `La báscula mide la normal, no el peso real; por eso cambia cuando el elevador acelera.`,
  ]);
  window._t3data = { scenario: 'elevador', m, a, dir, peso, N };
  if (window.updateTerceraAnim) window.updateTerceraAnim(window._t3data);
}

function calcBloques3(box, get) {
  const F  = get('t3-fuerza');
  const mA = get('t3-masaA');
  const mB = get('t3-masaB');
  if (F === null) return mostrarError(box, 'Ingresa la Fuerza F');
  if (mA === null || mA <= 0) return mostrarError(box, 'Ingresa mₐ (> 0)');
  if (mB === null || mB <= 0) return mostrarError(box, 'Ingresa m_B (> 0)');

  const FAB = F;
  const FBA = -F;
  const aA  = F / mA;
  const aB  = F / mB;

  mostrarResultadoMulti(box, [
    { label: 'FUERZA A→B (acción)',  value: FAB.toFixed(3), unit: 'N →', color: 'accent'  },
    { label: 'FUERZA B→A (reacción)',value: FBA.toFixed(3), unit: 'N ←', color: 'accent3' },
    { label: 'ACELERACIÓN DE A',     value: aA.toFixed(4),  unit: 'm/s² ←', color: 'accent2' },
    { label: 'ACELERACIÓN DE B',     value: aB.toFixed(4),  unit: 'm/s² →', color: 'accent'  },
  ], [
    `3ª Ley: F_BA = −F_AB → <strong>${FBA.toFixed(3)} N = −(${FAB.toFixed(3)} N)</strong>`,
    `aₐ = |F_BA|/mₐ = ${Math.abs(FBA).toFixed(3)}/${mA} = <strong>${aA.toFixed(4)} m/s²</strong>`,
    `a_B = F_AB/m_B = ${FAB.toFixed(3)}/${mB} = <strong>${aB.toFixed(4)} m/s²</strong>`,
    `Aunque las fuerzas son iguales, las aceleraciones difieren por la masa de cada cuerpo.`,
  ]);
  window._t3data = { scenario: 'bloques', F, mA, mB, FAB, FBA, aA, aB };
  if (window.updateTerceraAnim) window.updateTerceraAnim(window._t3data);
}

function calcCohete(box, get) {
  const F = get('rkt-F');
  const m = get('rkt-m');
  const t = get('rkt-t');
  if (F === null || F <= 0) return mostrarError(box, 'Ingresa el Empuje F (> 0)');
  if (m === null || m <= 0) return mostrarError(box, 'Ingresa la Masa del cohete (> 0)');
  if (t === null || t <= 0) return mostrarError(box, 'Ingresa el Tiempo t (> 0)');

  const a = F / m;
  const v = a * t;
  const Fgases = -F; // Fuerza que el cohete ejerce sobre los gases

  mostrarResultadoMulti(box, [
    { label: 'EMPUJE (reacción)',       value: F.toFixed(3),   unit: 'N ↑', color: 'accent'  },
    { label: 'F. SOBRE GASES (acción)', value: Fgases.toFixed(3), unit: 'N ↓', color: 'accent3' },
    { label: 'ACELERACIÓN',             value: a.toFixed(4),   unit: 'm/s²',  color: 'accent2' },
    { label: 'VELOCIDAD en t='+t+'s',   value: v.toFixed(3),   unit: 'm/s',   color: 'accent'  },
  ], [
    `Por 3ª Ley: F_cohete←gases = −F_cohete→gases`,
    `Empuje = F = <strong>${F.toFixed(3)} N</strong>  (hacia arriba)`,
    `a = F/m = ${F}/${m} = <strong>${a.toFixed(4)} m/s²</strong>`,
    `v = a·t = ${a.toFixed(4)}×${t} = <strong>${v.toFixed(3)} m/s</strong>`,
  ]);
  window._t3data = { scenario: 'cohete', F, m, a, v, Fgases };
  if (window.updateTerceraAnim) window.updateTerceraAnim(window._t3data);
}

function calcBote(box, get) {
  const F  = get('bt-F');
  const mP = get('bt-mP');
  const mB = get('bt-mB');
  if (F === null || F <= 0) return mostrarError(box, 'Ingresa la Fuerza F (> 0)');
  if (mP === null || mP <= 0) return mostrarError(box, 'Ingresa la masa de la persona (> 0)');
  if (mB === null || mB <= 0) return mostrarError(box, 'Ingresa la masa del bote (> 0)');

  const aP = F / mP;  // persona se mueve hacia atrás
  const aB = F / mB;  // bote se mueve hacia adelante

  mostrarResultadoMulti(box, [
    { label: 'FUERZA persona→bote', value: F.toFixed(3),   unit: 'N →', color: 'accent'  },
    { label: 'FUERZA bote→persona', value: (-F).toFixed(3),unit: 'N ←', color: 'accent3' },
    { label: 'ACELERACIÓN PERSONA', value: aP.toFixed(4),  unit: 'm/s² ←', color: 'accent2' },
    { label: 'ACELERACIÓN BOTE',    value: aB.toFixed(4),  unit: 'm/s² →', color: 'accent'  },
  ], [
    `Por 3ª Ley: F_bote→persona = −F_persona→bote = <strong>−${F.toFixed(3)} N</strong>`,
    `aₚ = F/mₚ = ${F}/${mP} = <strong>${aP.toFixed(4)} m/s²</strong> (hacia atrás)`,
    `a_B = F/m_B = ${F}/${mB} = <strong>${aB.toFixed(4)} m/s²</strong> (hacia adelante)`,
    `El bote más pesado tiene menor aceleración que la persona más ligera.`,
  ]);
  window._t3data = { scenario: 'bote', F, mP, mB, aP, aB };
  if (window.updateTerceraAnim) window.updateTerceraAnim(window._t3data);
}

/* ============================================================
   HELPERS DE RESULTADO
   ============================================================ */

function mostrarResultado(box, { label, value, unit, steps }) {
  box.classList.add('has-result');
  box.classList.remove('has-error');
  box.innerHTML = `
    <div class="result-main">
      <span class="result-label">${label.toUpperCase()}</span>
      <span class="result-value">${value}</span>
      <span class="result-unit">${unit}</span>
    </div>
    <div class="result-steps">
      ${steps.map(s => `<div class="result-step">${s}</div>`).join('')}
    </div>`;
}

function mostrarResultadoMulti(box, blocks, steps) {
  box.classList.add('has-result');
  box.classList.remove('has-error');
  box.innerHTML = `
    <div class="result-multi">
      ${blocks.map(b => `
        <div class="result-block">
          <div class="result-block-label">${b.label}</div>
          <div class="result-block-value" style="color:var(--${b.color})">${b.value}</div>
          <div class="result-block-unit">${b.unit}</div>
        </div>`).join('')}
    </div>
    <div class="result-steps">
      ${steps.map(s => `<div class="result-step">${s}</div>`).join('')}
    </div>`;
}

function mostrarError(box, msg) {
  box.classList.remove('has-result');
  box.classList.add('has-error');
  box.innerHTML = `<div class="result-error">⚠ ${msg}</div>`;
}

function resetResult(which) {
  const box = document.getElementById(`result-${which}`);
  box.classList.remove('has-result', 'has-error');
  box.innerHTML = '<div class="result-placeholder">Ingresa los valores y presiona Calcular</div>';
}

/* ============================================================
   INIT — EVENT LISTENERS
   ============================================================ */

// Valores por defecto para la 3ra. Ley
function setDefaultTerceraData() {
  if (currentScenario3 === 'choque') {
    const F  = 120;
    const dt = 0.20;
    const mA = 4;
    const mB = 6;
    const vA = 3;
    const vB = 1;

    const FAB = F;
    const FBA = -F;
    const J   = F * dt;
    const aA  = F / mA;
    const aB  = F / mB;
    const vAf = vA - J / mA;
    const vBf = -vB + J / mB;

    window._t3data = {
      scenario: 'choque',
      F, dt, mA, mB, vA, vB,
      FAB, FBA, J, aA, aB, vAf, vBf
    };
  }

  else if (currentScenario3 === 'elevador') {
    const m   = 70;
    const a   = 2;
    const dir = 'arriba';

    const peso = m * g;
    const N    = m * (g + a);

    window._t3data = {
      scenario: 'elevador',
      m, a, dir, peso, N
    };
  }

  else if (currentScenario3 === 'bloques') {
    const F  = 50;
    const mA = 5;
    const mB = 3;

    const FAB = F;
    const FBA = -F;
    const aA  = F / mA;
    const aB  = F / mB;

    window._t3data = {
      scenario: 'bloques',
      F, mA, mB,
      FAB, FBA, aA, aB
    };
  }

  if (window.updateTerceraAnim) {
    window.updateTerceraAnim(window._t3data);
  }
}

document.addEventListener('DOMContentLoaded', () => {

  // --- Tabs ---
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });

  // --- Scenario selectors 2ª ---
  document.querySelectorAll('[data-scenario2]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-scenario2]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentScenario2 = btn.dataset.scenario2;
      currentSolve2 = ESCENARIOS2[currentScenario2].modos[0].key;
      renderEnunciado2();
      renderSolveSelector2();
      renderInputs2();
      resetResult('segunda');
      if (window.changeScenario2) window.changeScenario2(currentScenario2);
    });
  });

  // --- Scenario selectors 3ª ---
  document.querySelectorAll('[data-scenario3]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-scenario3]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentScenario3 = btn.dataset.scenario3;
      renderEnunciado3();
      renderInputs3();
      resetResult('tercera');
      if (window.changeScenario3) window.changeScenario3(currentScenario3);
      setDefaultTerceraData();
    });
  });

  // --- Calcular ---
  document.getElementById('btn-calc-segunda').addEventListener('click', calcularSegunda);
  document.getElementById('btn-calc-tercera').addEventListener('click', calcularTercera);

  // --- Enter ---
  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const active = document.querySelector('.tab-content.active');
    if (active.id === 'tab-segunda') calcularSegunda();
    else calcularTercera();
  });

  // --- Render inicial ---
  renderEnunciado2();
  renderSolveSelector2();
  renderInputs2();
  renderEnunciado3();
  renderInputs3();
  setDefaultTerceraData();
});
