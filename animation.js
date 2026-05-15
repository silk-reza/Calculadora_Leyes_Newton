/**
 * Animaciones canvas para 2ª y 3ª Ley de Newton
 * Escenarios 2ª: bloque, atwood, mesa, inclinado
 * Escenarios 3ª: Elevador, bloques
 */

/* ============================================================
   UTILIDADES
   ============================================================ */

const COLOR = {
  accent:  '#e8ff47',
  accent2: '#47b4ff',
  accent3: '#ff6b47',
  accent4: '#a547ff',
  bg:      '#0a0a0f',
  bg3:     '#1a1a24',
  text:    '#e8e8f0',
  dim:     '#888899',
  border:  '#2a2a3a',
};

function setupCanvas(canvas) {
  const dpr  = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0) return null;
  canvas.width  = rect.width  * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return { ctx, w: rect.width, h: rect.height };
}

function drawArrow(ctx, x1, y1, x2, y2, color, label = '', headSize = 10) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 2) return;
  const ux = dx / len, uy = dy / len;
  const angle = Math.atan2(dy, dx);
  ctx.save();
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2 - ux * headSize, y2 - uy * headSize);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headSize * Math.cos(angle - Math.PI/6), y2 - headSize * Math.sin(angle - Math.PI/6));
  ctx.lineTo(x2 - headSize * Math.cos(angle + Math.PI/6), y2 - headSize * Math.sin(angle + Math.PI/6));
  ctx.closePath(); ctx.fill();
  if (label) {
    ctx.font = '11px Space Mono, monospace';
    ctx.fillStyle = color;
    ctx.fillText(label, (x1+x2)/2 + 6, (y1+y2)/2 - 6);
  }
  ctx.restore();
}

function drawGrid(ctx, w, h) {
  ctx.save();
  ctx.strokeStyle = COLOR.border; ctx.lineWidth = 0.5; ctx.globalAlpha = 0.35;
  for (let x = 0; x < w; x += 30) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
  for (let y = 0; y < h; y += 30) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
  ctx.restore();
}

function drawGround(ctx, y, w) {
  ctx.save();
  ctx.fillStyle = COLOR.bg3;
  ctx.fillRect(0, y, w, 200);
  ctx.strokeStyle = COLOR.border; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  ctx.strokeStyle = COLOR.dim; ctx.lineWidth = 1; ctx.globalAlpha = 0.35;
  for (let x = 10; x < w; x += 20) {
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x+10, y+10); ctx.stroke();
  }
  ctx.restore();
}

function drawBlock(ctx, x, y, bw, bh, fillColor, strokeColor, label1, label2, glow) {
  ctx.save();
  if (glow) { ctx.shadowColor = strokeColor; ctx.shadowBlur = 16; }
  ctx.fillStyle = fillColor; ctx.strokeStyle = strokeColor; ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.roundRect(x, y, bw, bh, 6); ctx.fill(); ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.font = 'bold 13px Syne, sans-serif';
  ctx.fillStyle = COLOR.text; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(label1, x + bw/2, y + bh/2 - (label2 ? 7 : 0));
  if (label2) {
    ctx.font = '10px Space Mono, monospace'; ctx.fillStyle = COLOR.dim;
    ctx.fillText(label2, x + bw/2, y + bh/2 + 8);
  }
  ctx.restore();
}

function drawRope(ctx, x1, y1, x2, y2, color = COLOR.dim) {
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.restore();
}

function drawPulley(ctx, cx, cy, r, color = COLOR.dim) {
  ctx.save();
  ctx.strokeStyle = color; ctx.fillStyle = COLOR.bg3; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(cx, cy, r*0.3, 0, Math.PI*2); ctx.fill();
  ctx.restore();
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function lerp(a, b, p) { return a + (b-a)*clamp(p,0,1); }
function easeOut(p) { return 1 - Math.pow(1-p, 3); }
function easeInOut(p) { return p < 0.5 ? 2*p*p : 1 - Math.pow(-2*p+2, 2)/2; }

/* ============================================================
   SEGUNDA LEY — ANIMACIÓN
   ============================================================ */

(function initSegunda() {
  const canvas = document.getElementById('canvas-segunda');
  if (!canvas) return;

  let data = { scenario: 'bloque', F: 80, m: 10, mu: 0.3, a: 5.06 };
  let animId = null, t = 0, running = false;

  /* ---- Escenario: BLOQUE DESLIZANTE ---- */
  function drawBloque(ctx, w, h) {
    drawGrid(ctx, w, h);
    const groundY = h * 0.68;
    const bW = 72, bH = 52;
    drawGround(ctx, groundY, w);

    const maxTravel = w - bW - 60;
    const normA = clamp((data.a || 0), 0, 20) / 20;
    const progress = running ? Math.min(1, (1 - Math.cos(t * 0.8 * (0.3 + normA * 0.7))) / 2) : 0;
    const blockX = 60 + progress * maxTravel * 0.72;
    const blockY = groundY - bH;
    const cx = blockX + bW/2, cy = blockY + bH/2;

    drawBlock(ctx, blockX, blockY, bW, bH, '#1e2440', COLOR.accent2, 'm', `${data.m ?? '?'} kg`, running);

    const Fscale = clamp((data.F || 0) * 0.8, 10, 110);
    drawArrow(ctx, blockX+bW, cy, blockX+bW+Fscale, cy, COLOR.accent, `F=${(data.F||0).toFixed(1)}N`);

    const Fr = (data.mu||0) * (data.m||1) * 9.8;
    const FrScale = clamp(Fr * 0.8, 0, 90);
    if (FrScale > 2) drawArrow(ctx, blockX, cy, blockX-FrScale, cy, COLOR.accent3, `Fr=${Fr.toFixed(1)}N`);

    drawArrow(ctx, cx, blockY+bH, cx, blockY+bH+34, COLOR.dim, 'mg');
    drawArrow(ctx, cx, blockY,   cx, blockY-34,      COLOR.dim, 'N');

    if ((data.a||0) !== 0) {
      ctx.save(); ctx.font = 'bold 12px Space Mono, monospace';
      ctx.fillStyle = (data.a||0) > 0 ? COLOR.accent : COLOR.accent3;
      ctx.fillText(`a = ${(data.a||0).toFixed(2)} m/s²  ${(data.a||0) > 0 ? '→' : '←'}`, 14, 20);
      ctx.restore();
    }

    if (running && (data.a||0) > 0 && progress > 0.05) {
      for (let i = 0; i < 5; i++) {
        ctx.save(); ctx.globalAlpha = (1-i/5)*0.3; ctx.fillStyle = COLOR.accent;
        ctx.beginPath(); ctx.arc(blockX-i*14-8, groundY-bH/2+(Math.random()-0.5)*8, 3-i*0.4, 0, Math.PI*2);
        ctx.fill(); ctx.restore();
      }
    }
  }

  /* ---- Escenario: MÁQUINA DE ATWOOD ---- */
  function drawAtwood(ctx, w, h) {
    drawGrid(ctx, w, h);
    const cx = w/2;
    const pulleyR = 22;
    const pulleyY = h * 0.18;
    const bW = 58, bH = 44;
    const ropeTopY = pulleyY + pulleyR;
    const maxDrop = h * 0.50;

    const m1 = data.m1 || 8, m2 = data.m2 || 5;
    const a  = data.a  || (m1-m2)*9.8/(m1+m2);
    const normA = clamp(a, 0, 15) / 15;

    const progress = running ? easeOut(Math.min(1, t / 3.5)) : 0;
    const drop1 = progress * maxDrop * 0.6 * normA;
    const drop2 = -drop1; 

    const y1 = ropeTopY + drop1;
    const y2 = ropeTopY - drop2;

    ctx.save(); ctx.strokeStyle = COLOR.border; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, pulleyY); ctx.stroke();
    ctx.restore();

    // Cuerdas
    drawRope(ctx, cx - pulleyR + 4, ropeTopY, cx - pulleyR + 4, y1 + bH/2);
    drawRope(ctx, cx + pulleyR - 4, ropeTopY, cx + pulleyR - 4, y2 + bH/2);

    // Polea
    drawPulley(ctx, cx, pulleyY, pulleyR, COLOR.accent2);

    // Bloque m1 (baja)
    drawBlock(ctx, cx - pulleyR + 4 - bW/2, y1, bW, bH, '#1e2440', COLOR.accent,
      'm₁', `${m1} kg`, running && a > 0.1);

    // Bloque m2 (sube)
    drawBlock(ctx, cx + pulleyR - 4 - bW/2, y2, bW, bH, '#1a2820', COLOR.accent2,
      'm₂', `${m2} kg`, running && a > 0.1);

    // Flechas de fuerza-peso
    const cy1 = y1 + bH/2, cy2 = y2 + bH/2;
    drawArrow(ctx, cx - pulleyR + 4, cy1 + bH/2, cx - pulleyR + 4, cy1 + bH/2 + 32, COLOR.accent, 'm₁g');
    drawArrow(ctx, cx + pulleyR - 4, cy2 + bH/2, cx + pulleyR - 4, cy2 + bH/2 + 32, COLOR.dim, 'm₂g');

    if (a > 0.01) {
      ctx.save(); ctx.font = 'bold 12px Space Mono, monospace'; ctx.fillStyle = COLOR.accent;
      ctx.fillText(`a = ${a.toFixed(2)} m/s²`, 14, 20);
      if (data.T) { ctx.fillStyle = COLOR.accent2; ctx.fillText(`T = ${data.T.toFixed(2)} N`, 14, 36); }
      ctx.restore();
    }
  }

  /* ---- Escenario: POLEA EN MESA ---- */
  function drawMesa(ctx, w, h) {
    drawGrid(ctx, w, h);
    const groundY = h * 0.50;
    const edgeX   = w * 0.78;
    const pulleyR  = 18;
    const bW = 64, bH = 44;

    drawGround(ctx, groundY, w);

    // Borde lateral (pared de la mesa)
    ctx.save(); ctx.strokeStyle = COLOR.border; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(edgeX, 0); ctx.lineTo(edgeX, groundY); ctx.stroke();
    ctx.restore();

    const M = data.M || 10, m = data.m || 3, mu = data.mu || 0;
    const a = data.a || (m*9.8 - mu*M*9.8)/(M+m);
    const normA = clamp(a, 0, 15)/15;
    const progress = running ? easeOut(Math.min(1, t/3.5)) : 0;
    const blockMoveX = progress * (edgeX - bW - 80) * 0.6 * normA;
    const hangDrop   = progress * (h - groundY - bH - 20) * 0.6 * normA;

    // Masa M sobre la mesa
    const MblockX = 60 + blockMoveX;
    const MblockY = groundY - bH;
    drawBlock(ctx, MblockX, MblockY, bW, bH, '#1e2440', COLOR.accent2, 'M', `${M} kg`, false);

    // Cuerda horizontal
    drawRope(ctx, MblockX+bW, MblockY + bH/2, edgeX - pulleyR, MblockY + bH/2);

    // Polea en el borde
    drawPulley(ctx, edgeX, groundY - pulleyR, pulleyR, COLOR.accent2);

    // Cuerda vertical
    drawRope(ctx, edgeX, groundY, edgeX, groundY + hangDrop + bH/2);

    // Masa colgante
    const hangX = edgeX - bW/2;
    const hangY = groundY + hangDrop;
    drawBlock(ctx, hangX, hangY, bW, bH, '#241820', COLOR.accent3, 'm', `${m} kg`, running && a > 0.1);

    // Flecha de Fuerza de rozamiento (M en la mesa)
    const Fr = mu * M * 9.8;
    if (Fr > 0.1) {
      const frScale = clamp(Fr * 0.6, 5, 60);
      drawArrow(ctx, MblockX, MblockY+bH/2, MblockX-frScale, MblockY+bH/2, COLOR.accent3, `Fr=${Fr.toFixed(1)}N`);
    }

    // Peso masa colgante
    drawArrow(ctx, edgeX, hangY+bH, edgeX, hangY+bH+32, COLOR.accent, `mg`);

    if (a > 0.01) {
      ctx.save(); ctx.font = 'bold 12px Space Mono, monospace'; ctx.fillStyle = COLOR.accent;
      ctx.fillText(`a = ${a.toFixed(2)} m/s²`, 14, 20);
      if (data.T) { ctx.fillStyle = COLOR.accent2; ctx.fillText(`T = ${data.T.toFixed(2)} N`, 14, 36); }
      ctx.restore();
    }
  }

  /* ---- Escenario: PLANO INCLINADO ---- */
  function drawInclinado(ctx, w, h) {
    drawGrid(ctx, w, h);
    const theta = (data.theta || 30) * Math.PI / 180;
    const baseX = w * 0.12, baseY = h * 0.82;
    const rampLen = w * 0.65;
    const tipX  = baseX + rampLen * Math.cos(theta);
    const tipY  = baseY - rampLen * Math.sin(theta);

    // Relleno triángulo
    ctx.save();
    ctx.fillStyle = COLOR.bg3; ctx.strokeStyle = COLOR.border; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(baseX, baseY); ctx.lineTo(tipX, tipY); ctx.lineTo(tipX, baseY);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();

    // Línea de suelo
    ctx.save(); ctx.strokeStyle = COLOR.border; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, baseY); ctx.lineTo(w, baseY); ctx.stroke();
    ctx.restore();

    // Label ángulo
    ctx.save(); ctx.font = '12px Space Mono, monospace'; ctx.fillStyle = COLOR.accent2;
    ctx.fillText(`θ=${data.theta||30}°`, baseX + 38, baseY - 10);
    ctx.restore();

    // Bloque sobre el plano
    const m  = data.m || 5;
    const aV = data.a || 0;
    const normA = clamp(Math.abs(aV), 0, 12) / 12;
    const progress = running ? easeOut(Math.min(1, t/3)) : 0;

    const bW = 50, bH = 36;
    const rampProgress = 0.3 + progress * 0.45 * normA;
    const bCx = baseX + rampLen * rampProgress * Math.cos(theta);
    const bCy = baseY - rampLen * rampProgress * Math.sin(theta);

    ctx.save();
    ctx.translate(bCx, bCy); ctx.rotate(-theta);
    if (running) { ctx.shadowColor = COLOR.accent; ctx.shadowBlur = 12; }
    ctx.fillStyle = '#1e2440'; ctx.strokeStyle = COLOR.accent; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.roundRect(-bW/2, -bH/2, bW, bH, 5); ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.font = 'bold 12px Syne, sans-serif'; ctx.fillStyle = COLOR.text;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('m', 0, -5);
    ctx.font = '10px Space Mono, monospace'; ctx.fillStyle = COLOR.dim;
    ctx.fillText(`${m}kg`, 0, 8);
    ctx.restore();

    // Fuerzas sobre el bloque (coordenadas del plano)
    const nx = -Math.sin(theta), ny = -Math.cos(theta); // normal al plano (hacia arriba)
    const px =  Math.cos(theta), py = -Math.sin(theta); // paralelo al plano (hacia arriba)
    const fLen = 40;

    // Normal
    drawArrow(ctx, bCx, bCy, bCx + nx*fLen, bCy + ny*fLen, COLOR.dim, 'N');
    // Peso (vertical abajo)
    drawArrow(ctx, bCx, bCy, bCx, bCy + fLen, COLOR.dim, 'mg');
    // Fricción (contraria al movimiento = hacia abajo del plano)
    const frDir = aV >= 0 ? -1 : 1; // si acelera hacia arriba, Fr hacia abajo
    drawArrow(ctx, bCx, bCy, bCx + frDir*px*30, bCy + frDir*py*30, COLOR.accent3, 'Fr');
    // Si hay fuerza aplicada
    if (data.F && Math.abs(data.F) > 0.1) {
      drawArrow(ctx, bCx, bCy, bCx + px*clamp(data.F*0.4,10,70), bCy + py*clamp(data.F*0.4,10,70), COLOR.accent, `F=${data.F.toFixed(1)}N`);
    }

    if (aV !== 0) {
      ctx.save(); ctx.font = 'bold 12px Space Mono, monospace';
      ctx.fillStyle = aV > 0 ? COLOR.accent : COLOR.accent3;
      ctx.fillText(`a = ${aV.toFixed(2)} m/s²  ${aV > 0 ? '↑plano' : '↓plano'}`, 14, 20);
      ctx.restore();
    }
  }

  /* ---- Dispatch ---- */
  function drawFrame() {
    const res = setupCanvas(canvas);
    if (!res) return;
    const { ctx, w, h } = res;
    ctx.fillStyle = COLOR.bg;
    ctx.fillRect(0, 0, w, h);

    if (data.scenario === 'bloque')     drawBloque(ctx, w, h);
    else if (data.scenario === 'atwood') drawAtwood(ctx, w, h);
    else if (data.scenario === 'mesa')   drawMesa(ctx, w, h);
    else if (data.scenario === 'inclinado') drawInclinado(ctx, w, h);
  }

  function animate() {
    t += 0.035;
    drawFrame();
    if (t < 6.5) animId = requestAnimationFrame(animate);
    else { running = false; drawFrame(); }
  }

  /* ---- Leyenda dinámica ---- */
  function updateLegend() {
    const legend = document.getElementById('legend-segunda');
    legend.innerHTML = `
      <div class="legend-item"><div class="legend-dot" style="background:${COLOR.accent}"></div>Fuerza aplicada</div>
      <div class="legend-item"><div class="legend-dot" style="background:${COLOR.accent3}"></div>Rozamiento</div>
      <div class="legend-item"><div class="legend-dot" style="background:${COLOR.dim}"></div>Peso / Normal</div>
    `;
  }

  document.getElementById('btn-play-segunda').addEventListener('click', () => {
    if (animId) cancelAnimationFrame(animId);
    t = 0; running = true; animate();
  });
  document.getElementById('btn-reset-segunda').addEventListener('click', () => {
    if (animId) cancelAnimationFrame(animId);
    running = false; t = 0; drawFrame();
  });

  window.updateSegundaAnim = d => {
    data = { ...data, ...d };
    if (!running) drawFrame();
  };

  window.changeScenario2 = scenario => {
    if (animId) cancelAnimationFrame(animId);
    running = false; t = 0;
    data = { scenario };
    drawFrame();
    updateLegend();
  };

  updateLegend();
  const ro = new ResizeObserver(() => drawFrame());
  ro.observe(canvas);
  setTimeout(drawFrame, 50);
})();

/* ============================================================
   TERCERA LEY — ANIMACIÓN
   ============================================================ */

(function initTercera() {
  const canvas = document.getElementById('canvas-tercera');
  if (!canvas) return;

  let data = { scenario: 'choque', F: 120, dt: 0.2, mA: 4, mB: 6, FAB: 120, FBA: -120, aA: 30, aB: 20 };
  let animId = null, t = 0, running = false;

  const T1 = 1.2, T2 = 2.4, T3 = 5.2;

  /* ---- BLOQUES EN CONTACTO ---- */
  function drawBloques(ctx, w, h) {
    drawGrid(ctx, w, h);
    const groundY = h * 0.70;
    drawGround(ctx, groundY, w);

    const bW = 68, bH = 52;
    const cx  = w/2;

    let sepA = 0, sepB = 0, arrowAlpha = 1, phase = 1;
    if (!running) { arrowAlpha = 1; phase = 1; }
    else if (t < T1) { phase = 1; arrowAlpha = easeOut(t/T1); }
    else if (t < T2) { phase = 2; arrowAlpha = 1; }
    else {
      phase = 3;
      const p = easeOut((t-T2)/(T3-T2));
      const rA = clamp((data.aA||0)/20, 0.1, 1);
      const rB = clamp((data.aB||0)/20, 0.1, 1);
      sepA = p * w * 0.22 * rA;
      sepB = p * w * 0.22 * rB;
      arrowAlpha = clamp(1-(t-T2)/0.6, 0, 1);
    }

    const Ax = cx - bW - sepA;
    const Bx = cx + sepB;
    const By = groundY - bH;
    const midY = By + bH/2;

    if (phase <= 2) {
      ctx.save();
      ctx.strokeStyle = phase===2 ? COLOR.accent : COLOR.dim;
      ctx.lineWidth = phase===2 ? 2 : 1;
      ctx.globalAlpha = phase===2 ? 0.5+0.5*Math.sin(t*8) : 0.5;
      ctx.setLineDash([4,4]);
      ctx.beginPath(); ctx.moveTo(cx, By-6); ctx.lineTo(cx, groundY); ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = '10px Space Mono, monospace'; ctx.fillStyle = COLOR.dim;
      ctx.textAlign = 'center'; ctx.fillText('CONTACTO', cx, By-12);
      ctx.restore();
    }

    drawBlock(ctx, Ax, By, bW, bH, '#1a2040', COLOR.accent2, 'A', `${data.mA||'?'} kg`, phase===3 && sepA>2);
    drawBlock(ctx, Bx, By, bW, bH, '#24182a', COLOR.accent,  'B', `${data.mB||'?'} kg`, phase===3 && sepB>2);

    if (phase <= 2 && arrowAlpha > 0.01) {
      const Fs = clamp((data.F||50)*0.55, 20, 75);
      const pulse = phase===2 ? 1+0.12*Math.sin(t*6) : arrowAlpha;
      ctx.save(); ctx.globalAlpha = arrowAlpha * pulse;
      drawArrow(ctx, cx-bW*0.1, midY, cx-bW*0.1+Fs, midY, COLOR.accent, `FAB=${(data.F||50).toFixed(0)}N`);
      drawArrow(ctx, cx+bW*0.1, midY, cx+bW*0.1-Fs, midY, COLOR.accent3, `FBA=−${(data.F||50).toFixed(0)}N`);
      if (phase===2) {
        ctx.font = 'bold 11px Space Mono, monospace'; ctx.textAlign = 'center';
        ctx.globalAlpha = 0.7+0.3*Math.sin(t*4);
        ctx.fillStyle = COLOR.accent;  ctx.fillText('ACCIÓN →',  cx+40, midY-22);
        ctx.fillStyle = COLOR.accent3; ctx.fillText('← REACCIÓN', cx-40, midY+22);
      }
      ctx.restore();
    }

    if (phase === 3) {
      const fadeIn = clamp((t-T2-0.3)/0.5, 0, 1);
      ctx.save(); ctx.globalAlpha = fadeIn;
      const lenA = clamp((data.aA||0)*3, 20, 70);
      drawArrow(ctx, Ax+bW/2, By-22, Ax+bW/2-lenA, By-22, COLOR.accent2, '');
      ctx.font = '11px Space Mono, monospace'; ctx.fillStyle = COLOR.accent2; ctx.textAlign = 'center';
      ctx.fillText(`← aA=${(data.aA||0).toFixed(2)}m/s²`, Ax+bW/2-lenA/2, By-28);
      const lenB = clamp((data.aB||0)*3, 20, 70);
      drawArrow(ctx, Bx+bW/2, By-22, Bx+bW/2+lenB, By-22, COLOR.accent, '');
      ctx.fillStyle = COLOR.accent;
      ctx.fillText(`aB=${(data.aB||0).toFixed(2)}m/s² →`, Bx+bW/2+lenB/2, By-28);
      ctx.restore();
    }

    ctx.save(); ctx.font = '10px Space Mono, monospace'; ctx.fillStyle = COLOR.dim;
    const labels = ['','Fase 1 · Fuerzas en contacto','Fase 2 · Acción = −Reacción','Fase 3 · Separación'];
    if (running && phase >= 1) ctx.fillText(labels[phase], 14, 18);
    ctx.restore();
  }

  /* ---- ELEVADOR CON PERSONA ---- */
  function drawElevador(ctx, w, h) {
    drawGrid(ctx, w, h);
    const cx = w/2;
    const shaftX = cx - 95;
    const shaftY = 22;
    const shaftW = 190;
    const shaftH = h - 44;
    const dir = data.dir || 'arriba';
    const a = data.a || 0;
    const N = data.N || 0;
    const peso = data.peso || 0;
    const progress = running ? Math.sin(Math.min(t, 4) * Math.PI / 2) : 0;
    const offset = dir === 'abajo' ? progress * 35 : dir === 'reposo' ? 0 : -progress * 35;

    ctx.save();
    ctx.strokeStyle = COLOR.border; ctx.lineWidth = 2;
    ctx.strokeRect(shaftX, shaftY, shaftW, shaftH);
    ctx.setLineDash([6,6]);
    ctx.beginPath(); ctx.moveTo(shaftX+20, shaftY); ctx.lineTo(shaftX+20, shaftY+shaftH);
    ctx.moveTo(shaftX+shaftW-20, shaftY); ctx.lineTo(shaftX+shaftW-20, shaftY+shaftH); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    const carW = 132, carH = 132;
    const carX = cx - carW/2;
    const carY = h*0.50 - carH/2 + offset;
    ctx.save();
    if (running) { ctx.shadowColor = COLOR.accent2; ctx.shadowBlur = 12; }
    ctx.fillStyle = '#141a2b'; ctx.strokeStyle = COLOR.accent2; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(carX, carY, carW, carH, 8); ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = COLOR.border; ctx.beginPath(); ctx.moveTo(cx, carY); ctx.lineTo(cx, carY+carH); ctx.stroke();
    ctx.restore();

    const floorY = carY + carH - 18;
    const px = cx - 16, py = floorY - 78;
    ctx.save();
    ctx.strokeStyle = COLOR.accent; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(px+16, py+12, 10, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px+16, py+24); ctx.lineTo(px+16, py+56);
    ctx.moveTo(px+16, py+34); ctx.lineTo(px, py+46); ctx.moveTo(px+16, py+34); ctx.lineTo(px+32, py+46);
    ctx.moveTo(px+16, py+56); ctx.lineTo(px+4, py+76); ctx.moveTo(px+16, py+56); ctx.lineTo(px+28, py+76); ctx.stroke();
    ctx.restore();

    drawArrow(ctx, cx+48, floorY-8, cx+48, floorY-70, COLOR.accent2, `N=${N.toFixed ? N.toFixed(0) : N}N`);
    drawArrow(ctx, cx-48, py+20, cx-48, py+82, COLOR.accent3, `W=${peso.toFixed ? peso.toFixed(0) : peso}N`);
    if (running && dir !== 'reposo') {
      const len = clamp(a*14, 20, 60);
      if (dir === 'abajo') drawArrow(ctx, carX+carW+28, carY+25, carX+carW+28, carY+25+len, COLOR.accent, `a=${a.toFixed(1)}↓`);
      else drawArrow(ctx, carX+carW+28, carY+carH-25, carX+carW+28, carY+carH-25-len, COLOR.accent, `a=${a.toFixed(1)}↑`);
    }
    ctx.save(); ctx.font = 'bold 12px Space Mono, monospace'; ctx.fillStyle = COLOR.accent;
    ctx.fillText(`Báscula: ${N.toFixed ? N.toFixed(1) : N} N`, 14, 20);
    ctx.fillStyle = COLOR.dim; ctx.fillText(dir === 'abajo' ? 'Acelera hacia abajo' : dir === 'reposo' ? 'Reposo / velocidad constante' : 'Acelera hacia arriba', 14, 38);
    ctx.restore();
  }

  /* ---- COHETE OBSOLETO ---- */
  function drawCohete(ctx, w, h) {
    drawGrid(ctx, w, h);
    const cx = w/2;

    const a = data.a || 0;
    const normA = clamp(a, 0, 40)/40;
    const progress = running ? easeOut(Math.min(1, t/4)) : 0;

    const rocketBaseY = h * 0.75 - progress * h * 0.55 * normA;
    const rocketW = 36, rocketH = 80;
    const rx = cx - rocketW/2, ry = rocketBaseY - rocketH;

    // Punta del cohete (triángulo)
    ctx.save();
    if (running) { ctx.shadowColor = COLOR.accent; ctx.shadowBlur = 16; }
    ctx.fillStyle = COLOR.accent2; ctx.strokeStyle = COLOR.accent; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, ry - 28);
    ctx.lineTo(rx, ry + 10); ctx.lineTo(rx + rocketW, ry + 10);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Cuerpo del cohete
    ctx.fillStyle = '#1e2440'; ctx.strokeStyle = COLOR.accent2;
    ctx.beginPath(); ctx.roundRect(rx, ry, rocketW, rocketH, 4); ctx.fill(); ctx.stroke();

    // Ventana
    ctx.fillStyle = COLOR.accent; ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.arc(cx, ry + rocketH*0.35, 9, 0, Math.PI*2); ctx.fill();

    // Aletas
    ctx.fillStyle = '#1a2040'; ctx.strokeStyle = COLOR.accent2;
    ctx.beginPath();
    ctx.moveTo(rx, rocketBaseY); ctx.lineTo(rx-18, rocketBaseY+18); ctx.lineTo(rx, rocketBaseY-22);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(rx+rocketW, rocketBaseY); ctx.lineTo(rx+rocketW+18, rocketBaseY+18); ctx.lineTo(rx+rocketW, rocketBaseY-22);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();

    // Llamas (escape de gases = ACCIÓN)
    if (running && progress > 0.05) {
      const flameCount = 8;
      for (let i = 0; i < flameCount; i++) {
        const fi = i / flameCount;
        ctx.save();
        const flameLen = (30 + 50*fi) * (0.8 + 0.4*Math.sin(t*12+i));
        ctx.globalAlpha = (1-fi) * 0.8;
        const grad = ctx.createLinearGradient(cx, rocketBaseY, cx, rocketBaseY + flameLen);
        grad.addColorStop(0, COLOR.accent);
        grad.addColorStop(0.5, '#ff8c00');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        const fw = (12 - i*1.2) * (0.7 + 0.6*Math.sin(t*15+i*1.5));
        ctx.beginPath(); ctx.ellipse(cx + (Math.random()-0.5)*6, rocketBaseY + flameLen*0.5, fw/2, flameLen/2, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Flechas de fuerza
    const arrowY = ry + rocketH*0.5;
    drawArrow(ctx, cx, arrowY, cx, arrowY - 55, COLOR.accent, `F=${(data.F||0).toFixed(0)}N (empuje)`);
    if (running) {
      drawArrow(ctx, cx, rocketBaseY+10, cx, rocketBaseY+60, COLOR.accent3, `gases ↓`);
    }

    // Labels
    ctx.save(); ctx.font = 'bold 12px Space Mono, monospace'; ctx.fillStyle = COLOR.accent;
    if (a > 0) ctx.fillText(`a = ${a.toFixed(2)} m/s²  ↑`, 14, 20);
    if (data.v) { ctx.fillStyle = COLOR.accent2; ctx.fillText(`v = ${data.v.toFixed(2)} m/s`, 14, 36); }
    ctx.restore();
  }

  /* ---- BOTE ---- */
  function drawBote(ctx, w, h) {
    drawGrid(ctx, w, h);
    const waterY = h * 0.62;

    // Agua
    ctx.save();
    const grad = ctx.createLinearGradient(0, waterY, 0, h);
    grad.addColorStop(0, '#0a1a2f');
    grad.addColorStop(1, '#050d1a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, waterY, w, h - waterY);
    ctx.strokeStyle = COLOR.accent2; ctx.lineWidth = 1; ctx.globalAlpha = 0.3;
    for (let x = 0; x < w; x += 40) {
      const wy = waterY + 6*Math.sin(x*0.05 + t*2);
      ctx.beginPath(); ctx.moveTo(x, wy); ctx.lineTo(x+20, wy+4); ctx.stroke();
    }
    ctx.restore();

    const mP = data.mP || 60, mB = data.mB || 200;
    const aP = data.aP || 0, aB = data.aB || 0;
    const normP = clamp(aP, 0, 20)/20, normB = clamp(aB, 0, 20)/20;
    const progress = running ? easeOut(Math.min(1, t/4)) : 0;

    // Posiciones
    const boteW = 120, boteH = 38;
    const personW = 28, personH = 52;
    const cx = w/2;

    const boteX = cx + progress * w * 0.28 * normB;
    const personX = cx - progress * w * 0.22 * normP;

    const boteY = waterY - boteH + 8;
    const personY = boteY - personH + 8;

    // Bote (casco)
    ctx.save();
    if (running) { ctx.shadowColor = COLOR.accent2; ctx.shadowBlur = 10; }
    ctx.fillStyle = '#1a2040'; ctx.strokeStyle = COLOR.accent2; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(boteX, boteY);
    ctx.lineTo(boteX + boteW, boteY);
    ctx.quadraticCurveTo(boteX+boteW+20, boteY+boteH, boteX+boteW, boteY+boteH);
    ctx.lineTo(boteX, boteY+boteH);
    ctx.quadraticCurveTo(boteX-20, boteY+boteH, boteX, boteY);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0;

    // Mástil / vela decorativa
    ctx.strokeStyle = COLOR.dim; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(boteX+boteW*0.5, boteY); ctx.lineTo(boteX+boteW*0.5, boteY-48); ctx.stroke();
    ctx.restore();

    // Persona (stick figure simplificado)
    ctx.save();
    if (running) { ctx.shadowColor = COLOR.accent3; ctx.shadowBlur = 8; }
    // Cuerpo
    ctx.strokeStyle = COLOR.accent3; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(personX + personW/2, personY + 20);
    ctx.lineTo(personX + personW/2, personY + personH - 12);
    ctx.stroke();
    // Cabeza
    ctx.fillStyle = COLOR.accent3; ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.arc(personX + personW/2, personY + 12, 10, 0, Math.PI*2); ctx.fill();
    // Piernas
    ctx.beginPath();
    ctx.moveTo(personX + personW/2, personY + personH - 12);
    ctx.lineTo(personX, personY + personH);
    ctx.moveTo(personX + personW/2, personY + personH - 12);
    ctx.lineTo(personX + personW, personY + personH);
    ctx.stroke();
    // Brazos (empujando)
    ctx.beginPath();
    ctx.moveTo(personX + personW/2, personY + 28);
    ctx.lineTo(personX + personW + 14, personY + 24);
    ctx.stroke();
    ctx.restore();

    // Flechas
    if (!running || t > 0.3) {
      const aP2 = clamp(aP*3, 15, 65);
      const aB2 = clamp(aB*3, 15, 65);
      drawArrow(ctx, personX + personW/2, personY + 30, personX + personW/2 - aP2, personY + 30, COLOR.accent3, '');
      ctx.font = '10px Space Mono, monospace'; ctx.fillStyle = COLOR.accent3; ctx.textAlign = 'center';
      ctx.fillText(`← aP=${aP.toFixed(2)}m/s²`, personX + personW/2 - aP2/2, personY + 20);

      drawArrow(ctx, boteX + boteW/2, boteY + 10, boteX + boteW/2 + aB2, boteY + 10, COLOR.accent2, '');
      ctx.fillStyle = COLOR.accent2;
      ctx.fillText(`aB=${aB.toFixed(2)}m/s² →`, boteX + boteW/2 + aB2/2, boteY);
    }

    ctx.save(); ctx.font = 'bold 12px Space Mono, monospace'; ctx.fillStyle = COLOR.accent;
    ctx.fillText(`F = ${(data.F||0).toFixed(1)} N (acción/reacción)`, 14, 20);
    ctx.restore();
  }

  /* ---- Dispatch ---- */
  function drawFrame() {
    const res = setupCanvas(canvas);
    if (!res) return;
    const { ctx, w, h } = res;
    ctx.fillStyle = COLOR.bg;
    ctx.fillRect(0, 0, w, h);

    if (data.scenario === 'choque' || data.scenario === 'bloques') drawBloques(ctx, w, h);
    else if (data.scenario === 'elevador') drawElevador(ctx, w, h);
  }

  function animate() {
    t += 0.03;
    drawFrame();
    const endTime = (data.scenario === 'choque' || data.scenario === 'bloques') ? T3 : 5.0;
    if (t < endTime) animId = requestAnimationFrame(animate);
    else { running = false; drawFrame(); }
  }

  function updateLegend3() {
    const legend = document.getElementById('legend-tercera');
    if (data.scenario === 'choque' || data.scenario === 'bloques') {
      legend.innerHTML = `
        <div class="legend-item"><div class="legend-dot" style="background:${COLOR.accent}"></div>Acción (A→B)</div>
        <div class="legend-item"><div class="legend-dot" style="background:${COLOR.accent3}"></div>Reacción (B→A)</div>
        <div class="legend-item"><div class="legend-dot" style="background:${COLOR.accent2}"></div>Separación / aceleración</div>`;
    } else if (data.scenario === 'elevador') {
      legend.innerHTML = `
        <div class="legend-item"><div class="legend-dot" style="background:${COLOR.accent2}"></div>Normal del piso</div>
        <div class="legend-item"><div class="legend-dot" style="background:${COLOR.accent3}"></div>Peso real</div>
        <div class="legend-item"><div class="legend-dot" style="background:${COLOR.accent}"></div>Aceleración</div>`;
    }
  }

  document.getElementById('btn-play-tercera').addEventListener('click', () => {
    if (animId) cancelAnimationFrame(animId);
    t = 0; running = true; animate();
  });
  document.getElementById('btn-reset-tercera').addEventListener('click', () => {
    if (animId) cancelAnimationFrame(animId);
    running = false; t = 0; drawFrame();
  });

  window.updateTerceraAnim = d => {
    data = { ...data, ...d };
    if (!running) drawFrame();
  };

  window.changeScenario3 = scenario => {
    if (animId) cancelAnimationFrame(animId);
    running = false; t = 0;
    data = { scenario };
    drawFrame();
    updateLegend3();
  };

  updateLegend3();
  const ro = new ResizeObserver(() => drawFrame());
  ro.observe(canvas);
  setTimeout(drawFrame, 50);
})();
