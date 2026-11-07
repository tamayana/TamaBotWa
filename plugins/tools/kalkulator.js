let handler = async (m, { conn }) => {
    const html = `
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<title>YorumiMD — Kalkulator</title>
<style>
/* ============================================================
   DESIGN TOKENS
   ============================================================ */
:root{
  --bg:#07070c;
  --text:#f4f3f8;
  --muted:#8b8b9e;
  --accent:#8b5cf6;
  --accent-h:#a78bfa;
  --accent-2:#22d3ee;
  --accent-soft:rgba(139,92,246,.13);
  --danger:#fb7185;
  --line:rgba(255,255,255,.06);
  --line-h:rgba(255,255,255,.14);
  --radius:26px;
}

/* ============================================================
   RESET & BASE
   ============================================================ */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

html{-webkit-text-size-adjust:100%}

body{
  min-height:100dvh;
  display:grid;
  place-items:center;
  padding:22px;
  font-family:"Inter",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  background:var(--bg);
  color:var(--text);
  overflow-x:hidden;
  overflow-y:auto;
  position:relative;
  -webkit-font-smoothing:antialiased;
  -webkit-tap-highlight-color:transparent;
}

/* Ambient background orbs */
body::before,
body::after{
  content:"";
  position:fixed;
  border-radius:50%;
  filter:blur(100px);
  opacity:.3;
  pointer-events:none;
  z-index:0;
}
body::before{
  width:520px;height:520px;
  background:radial-gradient(circle,#7c3aed,transparent 70%);
  top:-180px;left:-140px;
  animation:drift1 20s ease-in-out infinite alternate;
}
body::after{
  width:460px;height:460px;
  background:radial-gradient(circle,#0891b2,transparent 70%);
  bottom:-180px;right:-140px;
  animation:drift2 26s ease-in-out infinite alternate;
}
@keyframes drift1{to{transform:translate(80px,60px) scale(1.15)}}
@keyframes drift2{to{transform:translate(-70px,-60px) scale(1.1)}}

/* ============================================================
   CALCULATOR CARD
   ============================================================ */
.calc{
  position:relative;
  z-index:1;
  width:min(410px,100%);
  padding:15px;
  border-radius:var(--radius);
  background:linear-gradient(165deg,rgba(26,26,38,.95),rgba(10,10,16,.98));
  border:1px solid rgba(255,255,255,.08);
  box-shadow:
    0 50px 90px -40px rgba(0,0,0,.95),
    0 0 0 1px rgba(255,255,255,.02) inset,
    0 1px 0 rgba(255,255,255,.06) inset;
  backdrop-filter:blur(24px);
  overflow:hidden;
  user-select:none;
  animation:riseIn .7s cubic-bezier(.16,1,.3,1) both;
}
@keyframes riseIn{
  from{opacity:0;transform:translateY(26px) scale(.96)}
  to{opacity:1;transform:none}
}
.calc::before{
  content:"";
  position:absolute;
  top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,var(--accent),var(--accent-2),transparent);
  opacity:.9;
}

/* ---------- Header ---------- */
.calc__header{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  padding:6px 5px 13px;
}
.brand{display:flex;align-items:center;gap:10px}
.brand__logo{
  width:36px;height:36px;
  border-radius:12px;
  display:grid;place-items:center;
  background:linear-gradient(135deg,var(--accent),var(--accent-2));
  box-shadow:0 8px 20px -8px rgba(139,92,246,.95);
  font-weight:800;font-size:1rem;color:#fff;
}
.brand__name{
  font-size:1rem;font-weight:800;letter-spacing:-.01em;line-height:1.1;
}
.brand__name span{color:var(--accent-h)}
.brand__sub{
  margin-top:3px;
  font-size:.54rem;font-weight:600;
  letter-spacing:.24em;text-transform:uppercase;
  color:var(--muted);
}
.calc__tools{display:flex;gap:6px}
.tool{
  position:relative;
  width:32px;height:32px;
  border-radius:10px;
  display:grid;place-items:center;
  background:rgba(255,255,255,.04);
  border:1px solid var(--line);
  color:var(--muted);
  cursor:pointer;
  overflow:hidden;
  font-family:inherit;
  transition:background .2s,color .2s,border-color .2s,transform .12s;
}
.tool:hover{background:rgba(255,255,255,.09);color:var(--text)}
.tool:active{transform:scale(.9)}
.tool.active{
  background:var(--accent-soft);
  border-color:rgba(139,92,246,.45);
  color:var(--accent-h);
}
.tool svg{width:15px;height:15px}
.tool__text{font-size:.78rem;font-weight:800;letter-spacing:-.02em}
.tool .ico-off{display:none}
.tool.muted .ico-on{display:none}
.tool.muted .ico-off{display:block}

/* ---------- Display ---------- */
.display{
  position:relative;
  display:flex;
  flex-direction:column;
  justify-content:flex-end;
  gap:6px;
  min-height:106px;
  padding:14px 16px;
  border-radius:19px;
  background:linear-gradient(180deg,rgba(0,0,0,.45),rgba(0,0,0,.2));
  border:1px solid rgba(255,255,255,.05);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.04),
    inset 0 -24px 44px -24px rgba(139,92,246,.16);
  overflow:hidden;
  transition:border-color .3s;
}
.display__meta{
  display:flex;align-items:center;gap:8px;
  min-height:17px;
}
.mem{
  font-size:.56rem;font-weight:800;letter-spacing:.12em;
  padding:1px 6px;border-radius:5px;
  background:transparent;color:transparent;
  border:1px solid transparent;
  transition:all .25s ease;
}
.mem.on{
  background:var(--accent-soft);
  color:var(--accent-h);
  border-color:rgba(139,92,246,.4);
}
.display__expr{
  flex:1;
  text-align:right;
  font-size:.82rem;
  color:var(--muted);
  white-space:nowrap;
  overflow-x:auto;
  scrollbar-width:none;
  letter-spacing:.01em;
  min-height:1.2em;
}
.display__expr::-webkit-scrollbar{display:none}
.display__result{
  text-align:right;
  font-size:clamp(1.9rem,8vw,2.5rem);
  font-weight:700;
  letter-spacing:-.03em;
  line-height:1.12;
  font-variant-numeric:tabular-nums;
  white-space:nowrap;
  overflow-x:auto;
  scrollbar-width:none;
}
.display__result::-webkit-scrollbar{display:none}

.display.is-error{border-color:rgba(251,113,133,.45)}
.display.is-error .display__result{
  font-size:.95rem;
  font-weight:600;
  color:var(--danger);
  letter-spacing:0;
}

/* ---------- Memory Row ---------- */
.memrow{
  display:grid;
  grid-template-columns:repeat(5,1fr);
  gap:6px;
  margin:10px 0 9px;
}
.memkey{
  position:relative;
  height:30px;
  border-radius:9px;
  background:transparent;
  border:1px solid var(--line);
  color:var(--muted);
  font-family:inherit;
  font-size:.66rem;
  font-weight:700;
  letter-spacing:.05em;
  cursor:pointer;
  overflow:hidden;
  transition:background .18s,color .18s,border-color .18s,transform .1s;
}
.memkey:hover{
  background:rgba(255,255,255,.05);
  color:var(--text);
  border-color:var(--line-h);
}
.memkey:active{transform:scale(.93)}

/* ---------- Scientific Panel ---------- */
.sci{
  display:grid;
  grid-template-rows:0fr;
  margin-bottom:0;
  transition:grid-template-rows .4s cubic-bezier(.16,1,.3,1),margin-bottom .4s;
}
.sci.open{grid-template-rows:1fr;margin-bottom:8px}
.sci__inner{overflow:hidden;min-height:0}
.sci__grid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:6px;
  padding-top:2px;
}
.key--sci{
  height:38px;
  border-radius:11px;
  background:rgba(139,92,246,.07);
  border:1px solid rgba(139,92,246,.16);
  color:#c4b5fd;
  font-size:.78rem;
  font-weight:600;
  box-shadow:none;
}
.key--sci:hover{
  background:rgba(139,92,246,.17);
  border-color:rgba(139,92,246,.4);
  color:#ddd6fe;
}
.key--sci.span2{grid-column:span 2;font-size:1rem}

/* ---------- Main Keypad ---------- */
.keys{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:8px;
}
.key{
  position:relative;
  height:50px;
  border-radius:14px;
  border:1px solid var(--line);
  background:linear-gradient(180deg,#232330,#1a1a24);
  color:var(--text);
  font-family:inherit;
  font-size:1.15rem;
  font-weight:600;
  cursor:pointer;
  overflow:hidden;
  box-shadow:0 2px 0 rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.05);
  transition:
    transform .1s cubic-bezier(.34,1.56,.64,1),
    background .18s,border-color .18s,box-shadow .18s;
}
.key:hover{
  background:linear-gradient(180deg,#2b2b3a,#212130);
  border-color:var(--line-h);
}
.key:active,
.key.is-pressed{
  transform:scale(.92);
  box-shadow:0 0 0 rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.05);
}
.key:focus-visible{outline:2px solid var(--accent);outline-offset:2px}

.key--fn{
  background:linear-gradient(180deg,#2a2a38,#1e1e28);
  color:#b9b9cc;
  font-size:.95rem;
}
.key--op{
  background:linear-gradient(180deg,rgba(139,92,246,.22),rgba(139,92,246,.1));
  border-color:rgba(139,92,246,.3);
  color:var(--accent-h);
  font-size:1.3rem;
}
.key--op:hover{
  background:linear-gradient(180deg,rgba(139,92,246,.36),rgba(139,92,246,.18));
  border-color:rgba(139,92,246,.55);
}
.key--equals{
  background:linear-gradient(180deg,var(--accent-h),var(--accent));
  border-color:transparent;
  color:#fff;
  font-size:1.3rem;
  box-shadow:0 8px 24px -8px rgba(139,92,246,.95),inset 0 1px 0 rgba(255,255,255,.25);
}
.key--equals:hover{
  background:linear-gradient(180deg,#b8a4fd,#9d6ff8);
  box-shadow:0 10px 30px -8px rgba(139,92,246,1),inset 0 1px 0 rgba(255,255,255,.25);
}

/* ---------- Ripple ---------- */
.ripple{
  position:absolute;
  border-radius:50%;
  background:rgba(255,255,255,.32);
  transform:scale(0);
  opacity:.55;
  pointer-events:none;
  animation:rippleOut .55s ease-out forwards;
}
.key--equals .ripple{background:rgba(255,255,255,.5)}
@keyframes rippleOut{to{transform:scale(3);opacity:0}}

/* ---------- Result pop & error shake ---------- */
@keyframes pop{
  0%{transform:scale(.94);opacity:.5}
  60%{transform:scale(1.02)}
  100%{transform:scale(1);opacity:1}
}
.display__result.pop{animation:pop .3s cubic-bezier(.16,1,.3,1)}

@keyframes shake{
  10%,90%{transform:translateX(-2px)}
  20%,80%{transform:translateX(4px)}
  30%,50%,70%{transform:translateX(-6px)}
  40%,60%{transform:translateX(6px)}
}
.display.shake{animation:shake .45s cubic-bezier(.36,.07,.19,.97)}

/* ---------- History Panel ---------- */
.history{
  position:absolute;
  inset:0;
  z-index:30;
  display:flex;
  flex-direction:column;
  padding:16px;
  border-radius:inherit;
  background:linear-gradient(180deg,rgba(20,20,30,.99),rgba(9,9,14,.99));
  transform:translateY(101%);
  transition:transform .45s cubic-bezier(.16,1,.3,1);
  will-change:transform;
}
.history.open{transform:translateY(0)}
.history__head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding-bottom:12px;
  border-bottom:1px solid var(--line);
}
.history__head h2{
  font-size:.92rem;font-weight:700;letter-spacing:.02em;
}
.history__actions{display:flex;gap:6px}
.hbtn{
  position:relative;
  height:29px;
  padding:0 12px;
  border-radius:9px;
  background:rgba(255,255,255,.05);
  border:1px solid var(--line);
  color:var(--muted);
  font-family:inherit;
  font-size:.7rem;
  font-weight:600;
  cursor:pointer;
  overflow:hidden;
  transition:background .18s,color .18s;
}
.hbtn:hover{background:rgba(255,255,255,.1);color:var(--text)}
.history__list{
  list-style:none;
  flex:1;
  overflow-y:auto;
  padding-top:12px;
  display:flex;
  flex-direction:column;
  gap:8px;
  scrollbar-width:thin;
  scrollbar-color:rgba(255,255,255,.15) transparent;
}
.history__item{
  padding:10px 13px;
  border-radius:13px;
  background:rgba(255,255,255,.035);
  border:1px solid var(--line);
  cursor:pointer;
  transition:background .18s,border-color .18s,transform .18s;
  animation:slideUp .35s cubic-bezier(.16,1,.3,1) both;
}
.history__item:hover{
  background:rgba(139,92,246,.13);
  border-color:rgba(139,92,246,.35);
  transform:translateX(3px);
}
.history__expr{
  font-size:.7rem;
  color:var(--muted);
  margin-bottom:3px;
  word-break:break-all;
}
.history__res{
  font-size:.98rem;
  font-weight:700;
  word-break:break-all;
}
.history__empty{
  text-align:center;
  padding:44px 0;
  color:var(--muted);
  font-size:.8rem;
}
@keyframes slideUp{
  from{opacity:0;transform:translateY(10px)}
  to{opacity:1;transform:none}
}

/* ---------- Reduced motion ---------- */
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{
    animation-duration:.001ms !important;
    transition-duration:.001ms !important;
  }
}
</style>
</head>
<body>

<main class="calc" id="calc" role="application" aria-label="Kalkulator YorumiMD">

  <!-- ===== Header ===== -->
  <header class="calc__header">
    <div class="brand">
      <div class="brand__logo" aria-hidden="true">Y</div>
      <div>
        <h1 class="brand__name">Rahmad<span>TM</span></h1>
        <p class="brand__sub">Kalkulator Pro</p>
      </div>
    </div>

    <div class="calc__tools">
      <button class="tool active" id="soundBtn" aria-label="Aktifkan / matikan suara">
        <svg class="ico-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 5 6 9H2v6h4l5 4V5z"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
        </svg>
        <svg class="ico-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 5 6 9H2v6h4l5 4V5z"/>
          <line x1="23" y1="9" x2="17" y2="15"/>
          <line x1="17" y1="9" x2="23" y2="15"/>
        </svg>
      </button>

      <button class="tool" id="sciBtn" aria-label="Mode ilmiah">
        <span class="tool__text">ƒx</span>
      </button>

      <button class="tool" id="historyBtn" aria-label="Riwayat perhitungan">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="9"/>
          <polyline points="12 7 12 12 15 14"/>
        </svg>
      </button>
    </div>
  </header>

  <!-- ===== Display ===== -->
  <section class="display" id="display">
    <div class="display__meta">
      <span class="mem" id="memFlag">M</span>
      <span class="display__expr" id="expr">&nbsp;</span>
    </div>
    <output class="display__result" id="result" aria-live="polite">0</output>
  </section>

  <!-- ===== Memory ===== -->
  <div class="memrow">
    <button class="memkey" data-mem="mc">MC</button>
    <button class="memkey" data-mem="mr">MR</button>
    <button class="memkey" data-mem="m+">M+</button>
    <button class="memkey" data-mem="m-">M−</button>
    <button class="memkey" data-mem="ms">MS</button>
  </div>

  <!-- ===== Scientific Panel ===== -->
  <div class="sci" id="sci">
    <div class="sci__inner">
      <div class="sci__grid">
        <button class="key key--sci" data-func="sin">sin</button>
        <button class="key key--sci" data-func="cos">cos</button>
        <button class="key key--sci" data-func="tan">tan</button>
        <button class="key key--sci" data-constant="pi">π</button>

        <button class="key key--sci" data-func="sqrt">√</button>
        <button class="key key--sci" data-action="square">x²</button>
        <button class="key key--sci" data-action="power">xʸ</button>
        <button class="key key--sci" data-action="reciprocal">1/x</button>

        <button class="key key--sci" data-func="log">log</button>
        <button class="key key--sci" data-func="ln">ln</button>
        <button class="key key--sci" data-action="factorial">n!</button>
        <button class="key key--sci" data-constant="e">e</button>

        <button class="key key--sci span2" data-paren="(">(</button>
        <button class="key key--sci span2" data-paren=")">)</button>
      </div>
    </div>
  </div>

  <!-- ===== Keypad ===== -->
  <div class="keys" id="keys">
    <button class="key key--fn" data-action="clear">AC</button>
    <button class="key key--fn" data-action="backspace">⌫</button>
    <button class="key key--fn" data-action="percent">%</button>
    <button class="key key--op" data-operator="/">÷</button>

    <button class="key" data-digit="7">7</button>
    <button class="key" data-digit="8">8</button>
    <button class="key" data-digit="9">9</button>
    <button class="key key--op" data-operator="*">×</button>

    <button class="key" data-digit="4">4</button>
    <button class="key" data-digit="5">5</button>
    <button class="key" data-digit="6">6</button>
    <button class="key key--op" data-operator="-">−</button>

    <button class="key" data-digit="1">1</button>
    <button class="key" data-digit="2">2</button>
    <button class="key" data-digit="3">3</button>
    <button class="key key--op" data-operator="+">+</button>

    <button class="key key--fn" data-action="sign">±</button>
    <button class="key" data-digit="0">0</button>
    <button class="key" data-action="decimal">.</button>
    <button class="key key--equals" data-action="equals">=</button>
  </div>

  <!-- ===== History Panel ===== -->
  <div class="history" id="history">
    <div class="history__head">
      <h2>Riwayat</h2>
      <div class="history__actions">
        <button class="hbtn" id="clearHistory">Hapus</button>
        <button class="hbtn" id="closeHistory">Tutup</button>
      </div>
    </div>
    <ul class="history__list" id="historyList"></ul>
  </div>

</main>

<script>
/* ============================================================
   YORUMIMD — CALCULATOR ENGINE
   Arsitektur: Tokenizer → Parser → State → Renderer
   ============================================================ */
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const dom = {
    calc: $("calc"), display: $("display"), expr: $("expr"), result: $("result"),
    memFlag: $("memFlag"), sci: $("sci"), sciBtn: $("sciBtn"), soundBtn: $("soundBtn"),
    historyBtn: $("historyBtn"), history: $("history"), historyList: $("historyList"),
    closeHistory: $("closeHistory"), clearHistory: $("clearHistory"),
  };

  const NBSP = String.fromCharCode(160);
  const MAX_LEN = 60;
  const MAX_VALUE = 1e15;
  const FUNCS = ["sin", "cos", "tan", "sqrt", "log", "ln"];

  /* ---------- Sound ---------- */
  const Sound = (() => {
    let ctx = null, master = null, enabled = true;

    function init() {
      if (ctx) return ctx;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.45;
      master.connect(ctx.destination);
      return ctx;
    }

    function blip(freq, dur = 0.06, type = "sine", vol = 0.12, delay = 0, slideTo = null) {
      if (!enabled) return;
      try {
        const c = init();
        if (!c) return;
        if (c.state === "suspended") c.resume();
        const t = c.currentTime + delay;
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(vol, t + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        osc.connect(gain);
        gain.connect(master);
        osc.start(t);
        osc.stop(t + dur + 0.03);
      } catch (e) { /* suara opsional */ }
    }

    return {
      get enabled() { return enabled; },
      toggleSound() {
        enabled = !enabled;
        if (enabled) blip(720, 0.07, "sine", 0.12);
        return enabled;
      },
      digit()    { blip(880, 0.05, "triangle", 0.09); },
      operator() { blip(520, 0.07, "square", 0.06); },
      equals()   { blip(660, 0.08, "sine", 0.11); blip(990, 0.13, "sine", 0.11, 0.07); },
      clear()    { blip(420, 0.07, "sawtooth", 0.06); blip(260, 0.12, "sawtooth", 0.06, 0.06); },
      error()    { blip(190, 0.16, "sawtooth", 0.09); blip(120, 0.22, "sawtooth", 0.09, 0.12); },
      memory()   { blip(760, 0.05, "sine", 0.08); },
      func()     { blip(700, 0.06, "sine", 0.08, 0, 980); },
      back()     { blip(560, 0.05, "triangle", 0.07, 0, 380); },
      toggle()   { blip(620, 0.05, "triangle", 0.07); },
      history()  { blip(840, 0.06, "sine", 0.07); },
    };
  })();

  /* ---------- State ---------- */
  const state = {
    expression: "",      // ekspresi mentah (ASCII), contoh: "sin(30)+2*pi"
    history: "",         // baris atas setelah "="
    result: "0",
    error: "",
    justEvaluated: false,
    memory: 0,
    memoryOn: false,
    log: [],             // riwayat perhitungan
  };

  /* ---------- Tokenizer ---------- */
  function tokenize(src) {
    const tokens = [];
    let i = 0;
    while (i < src.length) {
      const ch = src[i];
      if (ch === " ") { i++; continue; }
      if (/[0-9.]/.test(ch)) {
        let num = "";
        while (i < src.length && /[0-9.]/.test(src[i])) num += src[i++];
        if ((num.match(/\\./g) || []).length > 1) throw new Error("Format angka salah");
        tokens.push({ t: "num", v: num });
        continue;
      }
      if (/[a-z]/.test(ch)) {
        let name = "";
        while (i < src.length && /[a-z]/.test(src[i])) name += src[i++];
        tokens.push({ t: "id", v: name });
        continue;
      }
      if ("+-*/^()!".includes(ch)) { tokens.push({ t: "op", v: ch }); i++; continue; }
      throw new Error("Karakter tidak dikenal");
    }
    return tokens;
  }

  /* ---------- Parser ---------- */
  const round12 = (v) => Math.round(v * 1e12) / 1e12;
  const DEG = Math.PI / 180;

  function factorial(n) {
    if (!Number.isInteger(n) || n < 0 || n > 170) throw new Error("Faktorial hanya untuk bilangan bulat 0-170");
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
  }

  function callFunc(name, x) {
    switch (name) {
      case "sin": return round12(Math.sin(x * DEG));
      case "cos": return round12(Math.cos(x * DEG));
      case "tan":
        if (Math.abs(Math.cos(x * DEG)) < 1e-12) throw new Error("Tan tidak terdefinisi");
        return round12(Math.tan(x * DEG));
      case "sqrt":
        if (x < 0) throw new Error("Akar bilangan negatif tidak valid");
        return Math.sqrt(x);
      case "log":
        if (x <= 0) throw new Error("Log hanya untuk bilangan positif");
        return round12(Math.log10(x));
      case "ln":
        if (x <= 0) throw new Error("Ln hanya untuk bilangan positif");
        return round12(Math.log(x));
      default: throw new Error("Fungsi tidak dikenal");
    }
  }

  function evaluate(src) {
    const tokens = tokenize(src);
    let pos = 0;
    const peek = () => tokens[pos];
    const isOp = (v) => peek() && peek().t === "op" && peek().v === v;

    function parseExpression() {
      let value = parseTerm();
      while (isOp("+") || isOp("-")) {
        const op = tokens[pos++].v;
        const right = parseTerm();
        value = op === "+" ? value + right : value - right;
      }
      return value;
    }

    function parseTerm() {
      let value = parseUnary();
      while (isOp("*") || isOp("/")) {
        const op = tokens[pos++].v;
        const right = parseUnary();
        if (op === "*") value *= right;
        else {
          if (right === 0) throw new Error("Tidak bisa dibagi nol");
          value /= right;
        }
      }
      return value;
    }

    function parseUnary() {
      if (isOp("-")) { pos++; return -parseUnary(); }
      if (isOp("+")) { pos++; return parseUnary(); }
      return parsePower();
    }

    function parsePower() {
      const base = parsePostfix();
      if (isOp("^")) {
        pos++;
        const exp = parseUnary();
        const out = Math.pow(base, exp);
        if (Number.isNaN(out)) throw new Error("Hasil pangkat tidak valid");
        return out;
      }
      return base;
    }

    function parsePostfix() {
      let value = parsePrimary();
      while (isOp("!")) { pos++; value = factorial(value); }
      return value;
    }

    function parsePrimary() {
      const tk = tokens[pos++];
      if (!tk) throw new Error("Ekspresi tidak lengkap");

      if (tk.t === "num") {
        const n = Number(tk.v);
        if (!Number.isFinite(n)) throw new Error("Ekspresi tidak valid");
        return n;
      }
      if (tk.t === "id") {
        if (tk.v === "pi") return Math.PI;
        if (tk.v === "e") return Math.E;
        if (FUNCS.includes(tk.v)) {
          if (!isOp("(")) throw new Error("Fungsi butuh tanda kurung");
          pos++;
          const arg = parseExpression();
          if (!isOp(")")) throw new Error("Tanda kurung tidak seimbang");
          pos++;
          return callFunc(tk.v, arg);
        }
        throw new Error("Fungsi tidak dikenal");
      }
      if (tk.v === "(") {
        const value = parseExpression();
        if (!isOp(")")) throw new Error("Tanda kurung tidak seimbang");
        pos++;
        return value;
      }
      throw new Error("Ekspresi tidak valid");
    }

    const out = parseExpression();
    if (pos !== tokens.length) throw new Error("Ekspresi tidak valid");
    if (!Number.isFinite(out)) throw new Error("Hasil tidak terdefinisi");
    return out;
  }

  /* ---------- Format ---------- */
  function formatExpression(src) {
    return src
      .replace(/\\*/g, "×").replace(/\\//g, "÷").replace(/-/g, "−")
      .replace(/sqrt/g, "√").replace(/pi/g, "π");
  }

  function formatNumber(v) {
    const abs = Math.abs(v);
    if (abs !== 0 && (abs >= MAX_VALUE || abs < 1e-9)) return v.toExponential(6);
    return String(parseFloat(v.toPrecision(12)));
  }

  function groupDigits(text) {
    if (text.includes("e")) return text;
    const parts = text.split(".");
    const grouped = parts[0].replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",");
    return parts[1] === undefined ? grouped : grouped + "." + parts[1];
  }

  /* ---------- Util ekspresi ---------- */
  const lastChar = () => state.expression.slice(-1);
  const endsValue = () => /[0-9.)!]$|pi$|e$/.test(state.expression);
  const currentNumber = () => (state.expression.match(/(\\d*\\.?\\d*)$/) || [""])[0];
  const count = (ch) => state.expression.split(ch).length - 1;
  const stripTrailing = (s) => s.replace(/[+\\-*/^.\\s]+$/, "");

  function evaluatePreview(src) {
    let s = stripTrailing(src);
    if (!s) return null;
    const open = (s.match(/\\(/g) || []).length;
    const close = (s.match(/\\)/g) || []).length;
    if (open > close) s += ")".repeat(open - close);
    try { return evaluate(s); } catch (e) { return null; }
  }

  const currentValue = () => {
    const v = evaluatePreview(state.expression);
    return v !== null ? v : (parseFloat(state.result) || 0);
  };

  /* ---------- Render ---------- */
  function popResult() {
    dom.result.classList.remove("pop");
    void dom.result.offsetWidth;
    dom.result.classList.add("pop");
  }

  function render() {
    const hasError = state.error !== "";
    dom.display.classList.toggle("is-error", hasError);
    dom.expr.textContent = state.history || formatExpression(state.expression) || NBSP;
    dom.result.textContent = hasError ? state.error : groupDigits(state.result);
    dom.memFlag.classList.toggle("on", state.memoryOn);
  }

  function update() {
    if (!state.expression) state.result = "0";
    else {
      const v = evaluatePreview(state.expression);
      if (v !== null) state.result = formatNumber(v);
    }
    render();
  }

  function fail(message) {
    state.error = message;
    Sound.error();
    dom.display.classList.remove("shake");
    void dom.display.offsetWidth;
    dom.display.classList.add("shake");
    render();
  }

  /* ---------- Aksi input ---------- */
  function startFresh() {
    state.error = "";
    if (state.justEvaluated) {
      state.expression = ""; state.history = ""; state.justEvaluated = false;
    }
  }

  function implicitMul() { if (endsValue()) state.expression += "*"; }
  const full = () => state.expression.length >= MAX_LEN;

  function inputDigit(d) {
    startFresh();
    if (full()) return;
    if (endsValue() && !/[0-9.]$/.test(state.expression)) state.expression += "*";
    if (currentNumber() === "0") state.expression = state.expression.slice(0, -1) + d;
    else state.expression += d;
    Sound.digit(); update();
  }

  function inputDecimal() {
    startFresh();
    if (full()) return;
    if (endsValue() && !/[0-9.]$/.test(state.expression)) state.expression += "*";
    const n = currentNumber();
    if (n.includes(".")) return;
    state.expression += n === "" ? "0." : ".";
    Sound.digit(); update();
  }

  function inputOperator(op) {
    state.error = "";
    if (state.justEvaluated) { state.justEvaluated = false; state.history = ""; }
    if (!state.expression) {
      if (op === "-") { state.expression = "-"; Sound.operator(); update(); }
      return;
    }
    const last = lastChar();
    if (/[+\\-*/^]/.test(last)) {
      if (state.expression.length === 1) return;
      if (op === "-" && /[*/^]/.test(last)) state.expression += "-";
      else {
        const base = state.expression.replace(/[+\\-*/^]+$/, "");
        if (!base) return;
        state.expression = base + op;
      }
    } else if (last === "(") {
      if (op !== "-") return;
      state.expression += "-";
    } else if (last === ".") {
      return;
    } else state.expression += op;
    Sound.operator(); update();
  }

  function inputParen(p) {
    startFresh();
    if (full()) return;
    if (p === "(") {
      implicitMul();
      state.expression += "(";
    } else {
      if (count("(") <= count(")") || !/[0-9.)!]$|pi$|e$/.test(state.expression)) return;
      state.expression += ")";
    }
    Sound.operator(); update();
  }

  function inputFunc(name) {
    startFresh();
    if (full()) return;
    implicitMul();
    state.expression += name + "(";
    Sound.func(); update();
  }

  function inputConstant(name) {
    startFresh();
    if (full()) return;
    implicitMul();
    state.expression += name;
    Sound.func(); update();
  }

  function applyAction(action) {
    state.error = "";
    if (state.justEvaluated && action !== "clear") { state.justEvaluated = false; state.history = ""; }

    if (action === "square") {
      if (!endsValue()) return;
      state.expression += "^2";
    } else if (action === "power") {
      if (!endsValue()) return;
      state.expression += "^";
    } else if (action === "reciprocal") {
      if (!state.expression || evaluatePreview(state.expression) === null) return;
      state.expression = "1/(" + stripTrailing(state.expression) + ")";
    } else if (action === "factorial") {
      if (!endsValue() || lastChar() === "!") return;
      state.expression += "!";
    } else if (action === "percent") {
      const m = state.expression.match(/(\\d*\\.?\\d+)$/);
      if (!m) return;
      state.expression = state.expression.slice(0, m.index) + String(parseFloat(m[1]) / 100);
    } else if (action === "sign") {
      const wrapped = state.expression.match(/\\(-(\\d*\\.?\\d+)\\)$/);
      const plain = state.expression.match(/(\\d*\\.?\\d+)$/);
      if (wrapped) state.expression = state.expression.slice(0, wrapped.index) + wrapped[1];
      else if (plain) state.expression = state.expression.slice(0, plain.index) + "(-" + plain[1] + ")";
      else return;
    }
    Sound.func(); update();
  }

  function backspace() {
    state.error = ""; state.history = ""; state.justEvaluated = false;
    const m = state.expression.match(/(sin|cos|tan|sqrt|log|ln)\\($/);
    if (m) state.expression = state.expression.slice(0, -m[0].length);
    else if (/pi$/.test(state.expression)) state.expression = state.expression.slice(0, -2);
    else state.expression = state.expression.slice(0, -1);
    Sound.back(); update();
  }

  function clearAll() {
    state.expression = ""; state.history = ""; state.result = "0";
    state.error = ""; state.justEvaluated = false;
    Sound.clear(); render();
  }

  function calculate() {
    let src = stripTrailing(state.expression);
    if (!src) return;
    const open = (src.match(/\\(/g) || []).length;
    const close = (src.match(/\\)/g) || []).length;
    if (open > close) src += ")".repeat(open - close);

    try {
      const value = evaluate(src);
      const formatted = formatNumber(value);
      const shown = formatExpression(src);

      state.history = shown + " =";
      state.result = formatted;
      state.expression = formatted.includes("e") ? "" : formatted;
      state.justEvaluated = !formatted.includes("e");
      state.error = "";

      state.log.unshift({ expr: shown, res: formatted });
      if (state.log.length > 50) state.log.pop();
      renderHistory();

      Sound.equals(); render(); popResult();
    } catch (e) {
      fail(e.message);
    }
  }

  /* ---------- Memory ---------- */
  function memory(kind) {
    state.error = "";
    if (kind === "mc") { state.memory = 0; state.memoryOn = false; }
    else if (kind === "mr") {
      if (!state.memoryOn) return;
      startFresh();
      implicitMul();
      state.expression += formatNumber(state.memory);
    } else {
      const v = currentValue();
      if (kind === "m+") state.memory += v;
      else if (kind === "m-") state.memory -= v;
      else if (kind === "ms") state.memory = v;
      state.memoryOn = true;
    }
    Sound.memory(); update();
  }

  /* ---------- Riwayat ---------- */
  function renderHistory() {
    dom.historyList.textContent = "";
    if (!state.log.length) {
      const empty = document.createElement("li");
      empty.className = "history__empty";
      empty.textContent = "Belum ada riwayat";
      dom.historyList.appendChild(empty);
      return;
    }
    state.log.forEach((item) => {
      const li = document.createElement("li");
      li.className = "history__item";
      const a = document.createElement("div");
      a.className = "history__expr";
      a.textContent = item.expr;
      const b = document.createElement("div");
      b.className = "history__res";
      b.textContent = groupDigits(item.res);
      li.appendChild(a);
      li.appendChild(b);
      li.addEventListener("click", () => {
        if (item.res.includes("e")) return;
        state.expression = item.res; state.history = ""; state.justEvaluated = true; state.error = "";
        dom.history.classList.remove("open");
        Sound.history(); update();
      });
      dom.historyList.appendChild(li);
    });
  }

  /* ---------- Dispatch ---------- */
  function handleButton(btn) {
    const d = btn.dataset;
    if (d.digit !== undefined) return inputDigit(d.digit);
    if (d.operator !== undefined) return inputOperator(d.operator);
    if (d.func !== undefined) return inputFunc(d.func);
    if (d.constant !== undefined) return inputConstant(d.constant);
    if (d.paren !== undefined) return inputParen(d.paren);
    if (d.mem !== undefined) return memory(d.mem);
    switch (d.action) {
      case "clear": return clearAll();
      case "backspace": return backspace();
      case "decimal": return inputDecimal();
      case "equals": return calculate();
      case "percent": case "sign": case "square": case "power":
      case "reciprocal": case "factorial": return applyAction(d.action);
      default: return undefined;
    }
  }

  dom.calc.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (btn && btn.dataset && Object.keys(btn.dataset).length) handleButton(btn);
  });

  dom.sciBtn.addEventListener("click", () => {
    dom.sciBtn.classList.toggle("active", dom.sci.classList.toggle("open"));
    Sound.toggle();
  });
  dom.soundBtn.addEventListener("click", () => {
    dom.soundBtn.classList.toggle("muted", !Sound.toggleSound());
  });
  dom.historyBtn.addEventListener("click", () => { dom.history.classList.add("open"); Sound.history(); });
  dom.closeHistory.addEventListener("click", () => { dom.history.classList.remove("open"); Sound.history(); });
  dom.clearHistory.addEventListener("click", () => { state.log = []; renderHistory(); Sound.clear(); });

  /* ---------- Ripple ---------- */
  dom.calc.addEventListener("pointerdown", (e) => {
    const btn = e.target.closest && e.target.closest("button");
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const dot = document.createElement("span");
    dot.className = "ripple";
    dot.style.width = dot.style.height = size + "px";
    dot.style.left = (e.clientX - rect.left - size / 2) + "px";
    dot.style.top = (e.clientY - rect.top - size / 2) + "px";
    btn.appendChild(dot);
    setTimeout(() => dot.remove(), 600);
  });

  /* ---------- Keyboard ---------- */
  const KEYMAP = {
    "+": () => inputOperator("+"), "-": () => inputOperator("-"),
    "*": () => inputOperator("*"), "x": () => inputOperator("*"), "X": () => inputOperator("*"),
    "/": () => inputOperator("/"), "^": () => applyAction("power"), "!": () => applyAction("factorial"),
    "Enter": calculate, "=": calculate, "Backspace": backspace,
    "Delete": clearAll, "Escape": clearAll, "%": () => applyAction("percent"),
    "(": () => inputParen("("), ")": () => inputParen(")"),
    ".": inputDecimal, ",": inputDecimal,
  };

  function flash(key) {
    let sel = null;
    if (/^[0-9]$/.test(key)) sel = '[data-digit="' + key + '"]';
    else if ("+-*/".includes(key)) sel = '[data-operator="' + key + '"]';
    else if (key === "x" || key === "X") sel = '[data-operator="*"]';
    else if (key === "Enter" || key === "=") sel = '[data-action="equals"]';
    else if (key === "Backspace") sel = '[data-action="backspace"]';
    else if (key === "Escape" || key === "Delete") sel = '[data-action="clear"]';
    else if (key === "%") sel = '[data-action="percent"]';
    else if (key === "." || key === ",") sel = '[data-action="decimal"]';
    if (!sel) return;
    const btn = dom.calc.querySelector(sel);
    if (!btn) return;
    btn.classList.add("is-pressed");
    setTimeout(() => btn.classList.remove("is-pressed"), 110);
  }

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const fn = KEYMAP[e.key] || (/^[0-9]$/.test(e.key) ? () => inputDigit(e.key) : null);
    if (!fn) return;
    e.preventDefault();
    fn();
    flash(e.key);
  });

  renderHistory();
  render();
})();
</script>
</body>
</html>
`

    const data = {
        response_id: 'PopiooNixelPopiooNixelPopiooNixel',
        sections: [{
            __typename: 'GenAIUnifiedResponseSection',
            view_model: {
                __typename: 'GenAISingleLayoutViewModel',
                primitive: {
                    __typename: 'GenAIBotProgressStatusPrimitive',
                    title: 'KLIK TEKS INI',
                    is_in_progress: true
                }
            }
        }],
        embedded_screens: [{
            title: 'Preview',
            content: [{
                __typename: 'FOAIDNixelButtonSheets',
                tabs: [{
                    id: 'tab_0',
                    tab_header: 'MCTamaaa',
                    sections: [{
                        __typename: 'GenAIUnifiedResponseSection',
                        view_model: {
                            __typename: 'GenAISingleLayoutViewModel',
                            primitive: {
                                __typename: 'GenAIaeacdsnwHtmlPrimitive',
                                payload: html,
                                url: 'https://example.com',
                                trusted_sources: ['example.com']
                            }
                        }
                    }],
                    step_entries: []
                }]
            }]
        }]
    }

    await conn.relayMessage(m.chat, {
        messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
            botMetadata: {
                messageDisclaimerText: '',
                richResponseSourcesMetadata: {}
            }
        },
        botForwardedMessage: {
            message: {
                richResponseMessage: {
                    messageType: 1,
                    unifiedResponse: {
                        data: Buffer.from(JSON.stringify(data)).toString('base64')
                    },
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedAiBotMessageInfo: { botJid: '0@bot' },
                        forwardOrigin: 4
                    }
                }
            }
        }
    }, {
        messageId: await conn.generateMessageTag()
    })
}

handler.help = ['kalkulator']
handler.tags = ['tools']
handler.command = /^(kalkulator|kalku|calc)$/i

export default handler
