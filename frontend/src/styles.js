// Gemeinsame Styles aller Karten (reines CSS, ohne Logik). shared.js reicht sie weiter.

export const STYLES = `
  .boostbtn { all:unset; cursor:pointer; display:inline-flex; gap:5px; align-items:center; padding:5px 12px; border-radius:999px; font-weight:600; font-size:.84rem;
    background: color-mix(in srgb, var(--primary-text-color) 7%, transparent); color: var(--secondary-text-color); }
  .boostbtn ha-icon { --mdc-icon-size:16px; }
  .boostbtn.on { background: var(--rk-heat); color:#fff; }
  :host { --rk-heat:#ff7a45; --rk-ok:#2ec4a6; --rk-air:#4f9dff; --rk-warn:#ffb020; --rk-cold:#ff4d6d; --rk-off:#8a94a6; --rk-eco:#8b7cf6; }
  ha-card { display:block; position:relative; box-sizing:border-box; overflow:hidden; border-radius:28px; padding:20px; isolation:isolate;
    background: var(--ha-card-background, var(--card-background-color)); transition: box-shadow .3s; }
  ha-card::before { content:""; position:absolute; inset:-40% -20% auto auto; width:320px; height:320px; z-index:-1;
    background: radial-gradient(circle, var(--tone) 0%, transparent 65%); opacity:.18; transition: background .6s; }
  /* Kopfzeile: Name (kürzt bei Bedarf), Fenstersymbol und Boost bleiben an ihrem Platz.
     Der Status steht darunter in einer eigenen Zeile – so verschiebt sich nichts mehr. */
  .top { display:flex; align-items:center; gap:10px; flex-wrap:nowrap; min-width:0; }
  .chips { display:flex; flex-wrap:wrap; align-items:center; gap:6px; margin-top:7px; min-width:0; }
  .chips:empty { display:none; }
  /* Lange Statustexte dürfen im Chip umbrechen – lieber zwei Zeilen im Chip als abgeschnitten */
  .chips .chip { white-space:normal; align-items:center; line-height:1.25; }
  .name { font-size:1.15rem; font-weight:600; letter-spacing:-.01em; cursor:pointer; flex:1 1 auto; min-width:0;
    color:var(--primary-text-color); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .top > .wins, .top > .boostbtn { flex:none; }
  .chip { display:inline-flex; align-items:center; gap:6px; padding:6px 12px; border-radius:999px; font-size:.82rem; font-weight:600;
    color:var(--tone); background: color-mix(in srgb, var(--tone) 14%, transparent); white-space:nowrap;
    flex:0 1 auto; min-width:0; max-width:100%; overflow:hidden; text-overflow:ellipsis; }
  .chip ha-icon { flex:none; }
  /* Zusatzinfo (Gerätesollwert/Abgleich) bekommt eine eigene Zeile – sonst schiebt sie den Chip aus der Karte */
  .trvnote { display:flex; align-items:center; gap:6px; margin-top:6px; min-width:0;
    font-size:.8rem; color:var(--secondary-text-color); font-variant-numeric:tabular-nums; }
  .trvnote ha-icon { --mdc-icon-size:15px; flex:none; }
  .trvnote span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .chip ha-icon { --mdc-icon-size:16px; }
  .wins { display:flex; gap:4px; color:var(--secondary-text-color); }
  .wins ha-icon { --mdc-icon-size:20px; }
  .wins .open { color: var(--rk-air); }
  .since { display:flex; align-items:center; gap:6px; margin-top:6px; font-size:.85rem; font-weight:600; color:var(--rk-air); font-variant-numeric:tabular-nums; }
  .since ha-icon { --mdc-icon-size:16px; }
  .since.occ { color:var(--secondary-text-color); margin-top:2px; font-weight:500; }
  .since.occ.in { color:var(--rk-ok); }
  /* Raumfarbe: schmaler Rand oben und Hauch im Hintergrund, Status bleibt am Ring */
  .rcard { border-top: 4px solid var(--accent, transparent); }
  .rcard { background-image: linear-gradient(color-mix(in srgb, var(--accent, transparent) 7%, transparent), transparent 120px); }
  .dial { position:relative; display:grid; place-items:center; margin:8px auto 4px; width:min(240px,100%); aspect-ratio:1/0.82; container-type: inline-size; }
  .dial svg { position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
  .track { stroke: color-mix(in srgb, var(--primary-text-color) 9%, transparent); }
  .fill { stroke: var(--tone); transition: stroke-dasharray .6s ease, stroke .6s; filter: drop-shadow(0 0 6px color-mix(in srgb, var(--tone) 55%, transparent)); }
  .knob { fill: var(--ha-card-background, var(--card-background-color)); stroke: var(--tone); stroke-width:3; filter: drop-shadow(0 2px 4px rgba(0,0,0,.25)); }
  .fill.muted { stroke: var(--rk-off); filter:none; opacity:.5; }
  .scale { font-size:10px; fill: var(--secondary-text-color); }
  .tlabel { font-size:11px; font-weight:600; fill: var(--tone); }
  /* Text bleibt IM Ring: Breite begrenzen und umbrechen, sonst schneidet er den Bogen (iPad/Handy). */
  .center { text-align:center; z-index:1; margin-top:-6px; max-width:58%; min-width:0; }
  .now { font-size:2.9rem; font-size:clamp(2.1rem, 17cqw, 3.1rem); font-weight:300; letter-spacing:-.04em; line-height:1; font-variant-numeric: tabular-nums; color:var(--primary-text-color); }
  .now small { font-size:.42em; vertical-align: super; margin-left:2px; color:var(--secondary-text-color); }
  .target { margin-top:6px; font-size:.82rem; line-height:1.25; color:var(--secondary-text-color); font-variant-numeric: tabular-nums; text-wrap: balance; overflow-wrap:anywhere; }
  .target b { color:var(--primary-text-color); font-weight:600; }
  .ctrl { display:flex; justify-content:center; align-items:center; gap:18px; margin-top:4px; }
  button.round { all:unset; cursor:pointer; width:48px; height:48px; border-radius:50%; display:grid; place-items:center;
    background: color-mix(in srgb, var(--primary-text-color) 7%, transparent); color:var(--primary-text-color); transition: transform .15s, background .2s; }
  button.round:hover { background: color-mix(in srgb, var(--tone) 22%, transparent); }
  button.round:active { transform: scale(.92); }
  button.round[disabled] { opacity:.35; pointer-events:none; }
  .banner { margin-top:16px; border-radius:18px; padding:12px 14px; display:flex; align-items:center; gap:10px;
    color: var(--vt); background: color-mix(in srgb, var(--vt) 13%, transparent); font-weight:600; font-size:.9rem; }
  .banner .grow { flex:1; }
  .bar { height:6px; border-radius:6px; background: color-mix(in srgb, var(--vt) 18%, transparent); overflow:hidden; margin-top:8px; }
  .bar > i { display:block; height:100%; background: var(--vt); border-radius:6px; transition: width 1s linear; }
  .count { font-variant-numeric: tabular-nums; }
  .stats { display:grid; grid-template-columns: repeat(auto-fit, minmax(92px, 1fr)); gap:8px; margin-top:16px; }
  .stat { border-radius:16px; padding:10px 12px; background: color-mix(in srgb, var(--primary-text-color) 5%, transparent); }
  .stat .l { font-size:.72rem; text-transform:uppercase; letter-spacing:.06em; color:var(--secondary-text-color); display:flex; align-items:center; gap:4px; }
  .stat .l ha-icon { --mdc-icon-size:14px; }
  .stat .v { font-size:1.05rem; font-weight:600; margin-top:2px; font-variant-numeric: tabular-nums; color:var(--primary-text-color); }
  .stat .v.tone { color: var(--st); }
  .stat .v small { font-size:.75rem; font-weight:500; color:var(--secondary-text-color); margin-left:4px; }
  .actions { display:flex; gap:8px; margin-top:14px; flex-wrap:wrap; }
  .pill { all:unset; cursor:pointer; display:inline-flex; align-items:center; gap:6px; padding:8px 12px; border-radius:999px; font-size:.82rem; font-weight:600;
    background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); color:var(--secondary-text-color); transition: background .2s, color .2s; }
  .pill.on { background: color-mix(in srgb, var(--tone) 16%, transparent); color: var(--tone); }
  .pill ha-icon { --mdc-icon-size:16px; }
  .sync { margin-left:auto; display:inline-flex; align-items:center; gap:4px; font-size:.75rem; color:var(--secondary-text-color); }
  .sync ha-icon { --mdc-icon-size:14px; }
  .sync.pending { color: var(--rk-warn); } .sync.failed { color: var(--rk-cold); }
  .err { padding:16px; color: var(--rk-cold); }
`;

export const ISSUE_STYLES = `
  .issues { display:grid; gap:10px; }
  .issue { display:grid; grid-template-columns: 26px 1fr auto; gap:12px; align-items:center; padding:12px 14px; border-radius:16px;
    background: color-mix(in srgb, var(--c) 9%, var(--ha-card-background, var(--card-background-color))); border:1px solid color-mix(in srgb, var(--c) 22%, transparent); }
  .issue > ha-icon { color: var(--c); --mdc-icon-size:24px; }
  .issue b { display:block; font-size:1rem; color:var(--primary-text-color); }
  .issue small { display:block; font-size:.88rem; color:var(--secondary-text-color); margin-top:2px; line-height:1.35; }
  .issue .tag { font-size:.78rem; font-weight:700; padding:3px 9px; border-radius:999px; background: color-mix(in srgb, var(--c) 18%, transparent); color: color-mix(in srgb, var(--c) 70%, var(--primary-text-color)); }
  .hok { display:flex; align-items:center; gap:10px; font-size:.98rem; color:var(--primary-text-color); }
  .hok ha-icon { color: var(--rk-ok); }
`;

export const HISTORY_STYLES = `
  .hhead { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
  .htitle { font-size:1.15rem; font-weight:650; letter-spacing:-.01em; flex:1; color:var(--primary-text-color); display:flex; align-items:center; gap:8px; }
  .htitle ha-icon { color: var(--tone); --mdc-icon-size:22px; }
  .seg { display:inline-flex; padding:3px; border-radius:999px; background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); }
  .seg button { all:unset; cursor:pointer; padding:6px 12px; border-radius:999px; font-size:.8rem; font-weight:600; color:var(--secondary-text-color); }
  .seg button.on { background: var(--ha-card-background, var(--card-background-color)); color: var(--primary-text-color); box-shadow: 0 1px 4px rgba(0,0,0,.12); }
  .legend { display:flex; flex-wrap:wrap; gap:8px; margin:14px 0 6px; }
  .lchip { all:unset; cursor:pointer; display:inline-flex; align-items:center; gap:8px; padding:6px 12px 6px 8px; border-radius:999px; font-size:.82rem; font-weight:600;
    background: color-mix(in srgb, var(--c) 12%, transparent); color: var(--primary-text-color); transition: opacity .2s, background .2s; }
  .lchip i { width:10px; height:10px; border-radius:50%; background: var(--c); box-shadow: 0 0 0 3px color-mix(in srgb, var(--c) 25%, transparent); }
  .lchip b { font-variant-numeric: tabular-nums; color: var(--c); }
  .lchip.off { opacity:.4; background: color-mix(in srgb, var(--primary-text-color) 5%, transparent); }
  .chart { position:relative; height: var(--h, 240px); margin-top:6px; }
  .chart svg { width:100%; height:100%; overflow:visible; display:block; }
  .grid line { stroke: color-mix(in srgb, var(--primary-text-color) 8%, transparent); stroke-dasharray: 3 5; }
  .ylab, .xlab { font-size:10.5px; fill: var(--secondary-text-color); font-variant-numeric: tabular-nums; }
  .band { fill: color-mix(in srgb, var(--rk-ok) 10%, transparent); }
  .bandlab { font-size:10px; fill: color-mix(in srgb, var(--rk-ok) 80%, var(--secondary-text-color)); font-weight:600; }
  .line { fill:none; stroke-width:2.4; stroke-linecap:round; stroke-linejoin:round; transition: opacity .2s; }
  .hover-line { stroke: color-mix(in srgb, var(--primary-text-color) 35%, transparent); stroke-width:1; }
  .tip { position:absolute; top:6px; pointer-events:none; padding:10px 12px; border-radius:14px; font-size:.8rem; min-width:150px;
    background: color-mix(in srgb, var(--ha-card-background, var(--card-background-color)) 92%, transparent); backdrop-filter: blur(8px);
    box-shadow: 0 8px 28px rgba(0,0,0,.18); border:1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent); color:var(--primary-text-color); }
  .tip .t { font-weight:650; margin-bottom:6px; color: var(--secondary-text-color); }
  .tip .r { display:flex; align-items:center; gap:8px; justify-content:space-between; }
  .tip .r span { display:flex; align-items:center; gap:6px; }
  .tip .r i { width:8px; height:8px; border-radius:50%; background: var(--c); }
  .tip .r b { font-variant-numeric: tabular-nums; }
  .empty { padding:40px 0; text-align:center; color: var(--secondary-text-color); }
  .tl { display:grid; grid-template-columns: 110px 1fr; gap:10px 14px; align-items:center; margin-top:14px; }
  .tl .n { font-weight:600; font-size:.88rem; color:var(--primary-text-color); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .tl .bar { position:relative; height:22px; border-radius:8px; overflow:hidden; background: color-mix(in srgb, var(--primary-text-color) 5%, transparent); }
  .tl .bar > i { position:absolute; top:0; bottom:0; border-radius:0; }
  .tl .bar > em { position:absolute; top:-2px; bottom:-2px; border-radius:4px; outline: 2px solid var(--rk-air); outline-offset:-2px; background: repeating-linear-gradient(45deg, color-mix(in srgb, var(--rk-air) 22%, transparent) 0 4px, transparent 4px 8px); }
  .tlx { display:flex; justify-content:space-between; margin:6px 0 0 124px; font-size:10.5px; color: var(--secondary-text-color); }
  .tleg { display:flex; flex-wrap:wrap; gap:14px; margin-top:14px; font-size:.78rem; color: var(--secondary-text-color); }
  .tleg span { display:inline-flex; align-items:center; gap:6px; }
  .tleg i { width:14px; height:10px; border-radius:3px; background: var(--c); }
`;

export const SETTINGS_STYLES = `
  /* Dialog für Sichern/Diagnose/Fehler: echte Knöpfe statt Popup und Blob-Download
     direkt nach einem await – nur so akzeptieren iPad-Safari und die HA-App das. */
  .sheetwrap { position: fixed; inset: 0; z-index: 60; background: rgba(0, 0, 0, .55); backdrop-filter: blur(2px);
    display: flex; align-items: center; justify-content: center; padding: 14px; }
  .sheet { display: flex; flex-direction: column; gap: 10px; width: min(680px, 100%); max-height: 86vh;
    padding: 16px; border-radius: 18px; background: var(--card-background-color, #fff);
    box-shadow: 0 24px 70px rgba(0, 0, 0, .45); }
  .stitle { font-weight: 700; font-size: 1.05rem; }
  .sintro { font-size: .85rem; line-height: 1.35; color: var(--secondary-text-color); }
  .stext { flex: 1 1 auto; min-height: 160px; width: 100%; resize: vertical; padding: 10px; border-radius: 10px;
    border: 1px solid color-mix(in srgb, var(--primary-text-color) 18%, transparent);
    background: var(--secondary-background-color, #f5f5f5); color: var(--primary-text-color);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .78rem; line-height: 1.4; }
  .sbtns { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }

  details.adv { margin: 12px 0 2px; border-top: 1px solid color-mix(in srgb, var(--primary-text-color) 10%, transparent); }
  details.adv > summary { cursor: pointer; padding: 12px 2px 4px; font-size: .88rem; font-weight: 600; color: var(--secondary-text-color);
    list-style: none; display: flex; align-items: center; gap: 8px; }
  details.adv > summary::-webkit-details-marker { display: none; }
  details.adv > summary::before { content: "▸"; font-size: .8rem; }
  details.adv[open] > summary::before { content: "▾"; }
  details.more > summary .cnt { margin-left: 2px; padding: 1px 7px; border-radius: 999px; font-size: .72rem; font-weight: 600;
    background: color-mix(in srgb, var(--primary-text-color) 9%, transparent); color: var(--secondary-text-color); }
  details.more > summary .chg { width: 7px; height: 7px; border-radius: 50%; background: var(--rk-heat); }
  details.more[open] { padding-bottom: 6px; }
  .btn.on { background: color-mix(in srgb, var(--c, var(--rk-eco)) 30%, transparent); }
  .sched { display:flex; flex-wrap:wrap; gap:8px; align-items:center; }
  .sched .days { display:flex; gap:4px; }
  .sched .d { all:unset; cursor:pointer; width:32px; height:27px; line-height:27px; border-radius:8px; text-align:center; font-size:.78rem; font-weight:600;
    background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); color: var(--secondary-text-color); }
  .sched .d.on { background: var(--rk-heat); color:#fff; }
  .sched input.tm { font:inherit; padding:5px 8px; border-radius:8px; border:1px solid color-mix(in srgb, var(--primary-text-color) 14%, transparent);
    background: transparent; color: var(--primary-text-color); }
  /* HH:MM-Felder: der Browser würde <input type="time"> je nach Betriebssystem mit AM/PM zeichnen */
  .inp.hm, .sched input.tm { width: 76px; text-align: center; font-variant-numeric: tabular-nums; }
  .sched .temp { min-width:58px; text-align:right; font-variant-numeric: tabular-nums; }
  .sched .del { all:unset; cursor:pointer; padding:3px 7px; border-radius:8px; color: var(--rk-cold); }
  .sched .add { all:unset; cursor:pointer; display:inline-flex; gap:6px; align-items:center; margin-top:8px; padding:7px 14px; border-radius:10px;
    font-weight:600; background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); color: var(--primary-text-color); }
  /* Gleiche Breite und Innenabstände wie die Übersicht – Karten sollen bündig stehen. */
  ha-card.settings { container-type: inline-size; padding: 20px 22px; }
  @media (max-width: 600px) { ha-card.settings { padding: 16px 14px; } }
  ha-card.settings .htitle { font-size:1.45rem; }
  ha-card.settings .htitle ha-icon { --mdc-icon-size:28px; }
  .tabs { display:flex; gap:6px; overflow-x:auto; scrollbar-width:none; margin:14px -4px 4px; padding:2px 4px 6px; }
  .tabs::-webkit-scrollbar { display:none; }
  .tabs.homes { margin-bottom:0; } .tabs.homes .tab { font-size:1.02rem; }
  .tab { all:unset; cursor:pointer; white-space:nowrap; padding:10px 18px; border-radius:999px; font-size:.98rem; font-weight:600; color:var(--secondary-text-color);
    background: color-mix(in srgb, var(--primary-text-color) 5%, transparent); display:inline-flex; align-items:center; gap:6px; }
  .tab ha-icon { --mdc-icon-size:16px; }
  /* Kein Farbtausch: Hintergrund- und Textfarbe kommen aus derselben Quelle, sonst wird bei
     Themes mit transparentem Kartenhintergrund (Frosted Glass) die Schrift unsichtbar. */
  .tab.on { background: color-mix(in srgb, var(--primary-text-color) 16%, transparent); color: var(--primary-text-color); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 30%, transparent); }
  .tab .dot { width:7px; height:7px; border-radius:50%; background: var(--c, var(--rk-ok)); }
  /* Brotkrumen, Suche und Gruppenleiste (Einstellungen) */
  .crumb { margin:10px 4px 0; font-size:.82rem; color:var(--secondary-text-color); display:flex; gap:6px; align-items:center; flex-wrap:wrap; }
  .crumb b { color:var(--primary-text-color); font-weight:600; }
  .lrow { padding:12px 2px; border-top:1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent); display:flex; flex-direction:column; gap:8px; }
  .lrow:first-child { border-top:0; padding-top:4px; }
  .ltop { display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; }
  .lbot { display:flex; align-items:center; gap:10px; }
  .llab { font-size:.8rem; color:var(--secondary-text-color); min-width:46px; }
  .dots { display:flex; gap:8px; flex-wrap:wrap; }
  .dotbtn { all:unset; cursor:pointer; width:22px; height:22px; border-radius:50%; background:var(--c); border:2px solid transparent; }
  .dotbtn.on { border-color: var(--primary-text-color); }
  .lname { display:inline-flex; align-items:center; gap:4px; }
  .lname .mini { all:unset; cursor:pointer; padding:0 4px; color:var(--secondary-text-color); font-size:.8rem; }
  .lname .mini[disabled] { opacity:.25; cursor:default; }
  .resetbar { display:flex; gap:10px; align-items:center; justify-content:space-between; flex-wrap:wrap; margin:8px 4px 0; font-size:.82rem; color:var(--secondary-text-color); }
  .resetbar .btn { padding:6px 12px; font-size:.82rem; }
  .searchrow { display:flex; gap:8px; align-items:center; margin:10px 4px 0; }
  .searchrow input { flex:1; min-width:0; padding:10px 14px; border-radius:12px; border:1px solid color-mix(in srgb, var(--primary-text-color) 12%, transparent);
    background: color-mix(in srgb, var(--primary-text-color) 4%, transparent); color:var(--primary-text-color); font-size:.95rem; }
  .searchrow input:focus { outline:2px solid color-mix(in srgb, var(--rk-heat) 40%, transparent); }
  .rail { display:flex; gap:6px; overflow-x:auto; scrollbar-width:none; margin:10px -4px 2px; padding:2px 4px 6px; }
  .rail::-webkit-scrollbar { display:none; }
  .railbtn { all:unset; cursor:pointer; white-space:nowrap; padding:8px 14px; border-radius:10px; font-size:.9rem; font-weight:600; color:var(--secondary-text-color);
    background: color-mix(in srgb, var(--primary-text-color) 4%, transparent); display:inline-flex; align-items:center; gap:6px; }
  .railbtn ha-icon { --mdc-icon-size:16px; }
  .railbtn.on { background: color-mix(in srgb, var(--rk-heat) 16%, transparent); color:var(--primary-text-color); }
  .railbtn.empty { display:none; }
  .nosearch { padding:24px 8px; text-align:center; color:var(--secondary-text-color); font-size:.95rem; }
  /* Ein Dokument: alle Gruppen untereinander als Abschnitte, keine Einzelkarten. */
  .groups { display:block; margin-top:10px; }
  /* Farbe als Abgrenzung: Trennlinie und Titel tragen den Ton der Gruppe. */
  .grp { min-width:0; padding:16px 2px 6px; border-top:1px solid color-mix(in srgb, var(--g, var(--primary-text-color)) 30%, transparent); }
  .grp > .gh b { color: color-mix(in srgb, var(--g, var(--primary-text-color)) 55%, var(--primary-text-color)); }
  .grp:first-child { border-top:0; padding-top:6px; }
  .grp.span { column-span:none; }
  @container (min-width: 1100px) { .grp.cols .rws { columns:2; column-gap:64px; } .grp.cols .row { break-inside:avoid; } }
  .gh { display:flex; align-items:center; gap:10px; margin:0 0 8px; flex-wrap:wrap; }
  .gh .ic { width:34px; height:34px; border-radius:10px; display:grid; place-items:center; background: color-mix(in srgb, var(--g) 16%, transparent); color: var(--g); flex:none; }
  .gh .ic ha-icon { --mdc-icon-size:19px; }
  .gh b { font-size:1.02rem; font-weight:600; letter-spacing:.01em; color:var(--primary-text-color); flex:1; }

  /* Tabellenzeile: Beschriftung links, Wert und Bedienung rechts auf einer Kante. */
  .row { display:grid; grid-template-columns:minmax(0,1fr) minmax(190px, max-content); align-items:center;
         column-gap:28px; row-gap:4px; min-height:52px; padding:11px 6px; margin:0 -6px; border-radius:10px;
         border-top:1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent); }
  .rws > .row:first-child, .row:first-of-type { border-top:0; }
  .row:hover { background: color-mix(in srgb, var(--primary-text-color) 4%, transparent); }
  .row > :not(.l) { justify-self:end; }
  .row .v { font-variant-numeric:tabular-nums; text-align:right; }
  .row > .stepper { width:190px; }
  .row .l { font-size:.98rem; color:var(--primary-text-color); min-width:0; }
  .row .l small { display:block; margin-top:2px; font-size:.8rem; line-height:1.3; color:var(--secondary-text-color); }
  .row .lbl { display:inline-flex; align-items:center; gap:6px; }
  .row .stepper:not(.ro) span { cursor:pointer; border-radius:8px; padding:2px 6px; margin:0 2px; }
  .row .stepper:not(.ro) span:hover { background: color-mix(in srgb, var(--primary-text-color) 8%, transparent); }
  .stepper input.numedit { width:70px; text-align:center; font:inherit; padding:3px 4px; border-radius:8px;
    border:1px solid color-mix(in srgb, var(--rk-heat) 55%, transparent); background:var(--card-background-color); color:var(--primary-text-color); }
  /* Dezente Zebra-Streifen, damit das Auge in langen Gruppen die Zeile hält. */
  .rws > .row:nth-of-type(even) { background: color-mix(in srgb, var(--primary-text-color) 2.5%, transparent); }
  @container (min-width: 1100px) {
    .grp.pair .rws { display:grid; grid-template-columns:1fr 1fr; column-gap:56px; }
    .grp.pair .rws > .row { border-top:1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent); }
    .grp.pair .rws > .row:nth-of-type(-n+2) { border-top:0; }
  }
  .qm { all:unset; cursor:pointer; flex:none; width:18px; height:18px; border-radius:50%; display:inline-grid; place-items:center; font-size:.72rem; font-weight:700;
    color: var(--secondary-text-color); border:1.5px solid color-mix(in srgb, var(--secondary-text-color) 55%, transparent); }
  .qm:hover, .qm.on { color:#fff; background: var(--g, var(--rk-air)); border-color: var(--g, var(--rk-air)); }
  .qm:focus-visible { outline:2px solid var(--g, var(--rk-air)); outline-offset:2px; }
  .mailbox { margin:4px 0 10px; border-radius:14px; background: color-mix(in srgb, var(--g, var(--rk-air)) 7%, transparent); padding:4px 12px; }
  .mailbox > summary, .adv > summary { cursor:pointer; padding:10px 0; font-weight:600; display:flex; align-items:center; gap:8px; color: var(--primary-text-color); }
  .mailbox > summary .ok { color: var(--rk-ok); font-weight:500; font-size:.85rem; } .mailbox > summary .no { color: var(--secondary-text-color); font-weight:500; font-size:.85rem; }
  .adv > summary { font-weight:500; font-size:.9rem; color: var(--secondary-text-color); }
  .mailform { display:flex; flex-direction:column; gap:10px; padding-bottom:12px; }
  .mf { display:flex; flex-direction:column; align-items:stretch; gap:4px; }
  .mf > span { color: var(--primary-text-color); } .mf small { display:block; color: var(--secondary-text-color); font-size:.8rem; }
  .mf .inp, .mf .sel { width:100%; box-sizing:border-box; text-align:left; }
  .mf .segs { align-self:flex-start; }
  .mailact { display:flex; justify-content:flex-end; gap:8px; flex-wrap:wrap; }
  .msteps { display:flex; flex-direction:column; gap:6px; }
  .mstep { display:flex; gap:10px; align-items:flex-start; padding:8px 10px; border-radius:10px; font-size:.88rem; line-height:1.35; color: var(--primary-text-color); }
  .mstep > b { flex:none; width:20px; height:20px; border-radius:50%; display:grid; place-items:center; color:#fff; font-size:.75rem; }
  .mstep.ok { background: color-mix(in srgb, var(--rk-ok) 10%, transparent); } .mstep.ok > b { background: var(--rk-ok); }
  .mstep.bad { background: color-mix(in srgb, var(--rk-cold, #e5484d) 10%, transparent); } .mstep.bad > b { background: var(--rk-cold, #e5484d); }
  .hint.warn { color: var(--rk-warn); font-weight:600; } .hint.okmsg { color: var(--rk-ok); font-weight:600; } .hint.errmsg { color: var(--rk-cold, #e5484d); font-weight:600; }
  .helpbox { margin:-4px 0 10px; padding:10px 12px; border-radius:12px; font-size:.88rem; line-height:1.45; color: var(--primary-text-color);
    background: color-mix(in srgb, var(--g, var(--rk-air)) 10%, var(--card-background-color, #fff)); border-left:3px solid var(--g, var(--rk-air)); }
  .row .l small { display:block; color:var(--secondary-text-color); font-size:.84rem; margin-top:1px; }
  .row .v { font-size:1rem; font-weight:600; color:var(--primary-text-color); text-align:right; font-variant-numeric:tabular-nums; }
  .row .v.mute { color:var(--secondary-text-color); font-weight:500; }
  .stepper.mv button { font-size:.7rem; padding:2px 5px; }
  .stepper.mv button[disabled] { opacity:.3; cursor:default; }
  .stepper { display:inline-flex; align-items:center; gap:4px; background: var(--ha-card-background, var(--card-background-color)); border-radius:999px; padding:3px; box-shadow: 0 1px 3px rgba(0,0,0,.08); flex:none; }
  .stepper button { all:unset; cursor:pointer; width:34px; height:34px; border-radius:50%; display:grid; place-items:center; font-size:1.2rem; font-weight:700; color:var(--g); background: color-mix(in srgb, var(--g) 12%, transparent); }
  .stepper button:active { transform: scale(.92); }
  .stepper span { min-width:70px; text-align:center; font-weight:650; font-variant-numeric:tabular-nums; font-size:1.05rem; color:var(--primary-text-color); }
  .stepper.ro button { display:none; }
  .tgl { all:unset; cursor:pointer; width:52px; height:30px; border-radius:999px; position:relative; background: color-mix(in srgb, var(--primary-text-color) 18%, transparent); transition: background .2s; flex:none; }
  .tgl::after { content:""; position:absolute; top:3px; left:3px; width:24px; height:24px; border-radius:50%; background:#fff; box-shadow:0 1px 3px rgba(0,0,0,.25); transition: transform .2s; }
  .tgl.on { background: var(--g, var(--rk-ok)); }
  .tgl.on::after { transform: translateX(22px); }
  .tgl[disabled] { opacity:.5; cursor:default; }
  .segs { display:inline-flex; flex-wrap:wrap; gap:4px; padding:3px; border-radius:16px; background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); }
  .segs button { all:unset; cursor:pointer; padding:8px 12px; border-radius:13px; font-size:.88rem; font-weight:600; color:var(--secondary-text-color); }
  .segs button.on { background: var(--ha-card-background, var(--card-background-color)); color: var(--primary-text-color); box-shadow: 0 1px 4px rgba(0,0,0,.12); }
  .chips { display:flex; flex-wrap:wrap; gap:6px; justify-content:flex-end; }
  .chip2 { all:unset; display:inline-flex; align-items:center; gap:6px; padding:6px 12px; border-radius:999px; font-size:.9rem; font-weight:600; background: color-mix(in srgb, var(--c, var(--rk-air)) 14%, transparent); color: var(--primary-text-color); }
  button.chip2 { cursor:pointer; }
  .chip2 .kb { font-size:.68rem; font-weight:700; padding:1px 6px; border-radius:6px; background: color-mix(in srgb, var(--primary-text-color) 10%, transparent); color: var(--secondary-text-color); }
  .chip2 i { width:7px; height:7px; border-radius:50%; background: var(--c, var(--rk-air)); }
  .chip2.off { opacity:.45; }
  .chip2.strike { opacity:.45; text-decoration: line-through; }
  .sel, .inp { font: inherit; font-size:.95rem; font-weight:600; padding:8px 12px; border-radius:12px; border:1px solid color-mix(in srgb, var(--primary-text-color) 14%, transparent);
    background: var(--ha-card-background, var(--card-background-color)); color: var(--primary-text-color); max-width: 260px; }
  .inp.short { width: 86px; text-align:center; }
  .people { display:grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 520px), 1fr)); gap:14px; }
  @container (max-width: 560px) {
    .row { flex-wrap: wrap; row-gap: 8px; }
    .row .l { flex: 1 1 100%; }
    .row > :last-child { margin-left: auto; }
    .row .chips { justify-content: flex-start; margin-left: 0; }
    .segs { width: 100%; }
    .segs button { flex: 1; text-align: center; }
    .person { padding: 12px; }
  }
  .person { display:flex; gap:14px; align-items:flex-start; padding:16px; border-radius:18px; background: var(--ha-card-background, var(--card-background-color)); box-shadow: 0 1px 4px rgba(0,0,0,.06); }
  .av { width:48px; height:48px; border-radius:14px; flex:none; display:grid; place-items:center; font-weight:700; font-size:1.2rem; color:#fff; background: linear-gradient(135deg, var(--c), color-mix(in srgb, var(--c) 60%, #000)); }
  .av ha-icon { --mdc-icon-size:22px; }
  .person .pb { flex:1; min-width:0; }
  .person .ph { display:flex; align-items:center; gap:8px; }
  .person .ph b { flex:1; font-size:1.08rem; color:var(--primary-text-color); }
  .person small { display:block; font-size:.86rem; color:var(--secondary-text-color); margin:1px 0 9px; }
  .person .chips { justify-content:flex-start; }
  .mini { all:unset; cursor:pointer; padding:5px 10px; border-radius:10px; font-size:.8rem; font-weight:650; color: var(--secondary-text-color); background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); }
  .mini.x { padding:5px 9px; }
  .addrow { display:flex; flex-wrap:wrap; gap:10px; align-items:center; margin-top:14px; }
  /* Unterreiter im Lernbereich */
  .ltabs { display:flex; gap:8px; flex-wrap:wrap; margin:2px 0 12px; }
  .ltab { border:0; cursor:pointer; font:inherit; font-size:.85rem; padding:8px 14px; border-radius:12px;
          color:var(--secondary-text-color); background:color-mix(in srgb, var(--primary-text-color) 5%, transparent); }
  .ltab.on { color:#fff; background:color-mix(in srgb, var(--g, var(--rk-eco)) 88%, #000); }
  .dbar { display:flex; align-items:center; gap:12px; padding:8px 2px; flex-wrap:wrap;
          border-top:1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent); }
  .dbar .dlab { min-width:74px; font-size:.78rem; color:var(--secondary-text-color); }
  .dkpis { display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:10px; margin:10px 0 6px; }
  .dkpi { padding:10px 12px; border-radius:12px; background:color-mix(in srgb, var(--primary-text-color) 4%, transparent); }
  .dkpi b { display:block; font-size:1.35rem; font-weight:600; font-variant-numeric:tabular-nums; }
  .dkpi span { font-size:.78rem; color:var(--secondary-text-color); }
  .decs { margin-top:4px; }
  .dec { border-top:1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent); }
  .dec:first-of-type { border-top:0; }
  .dec summary { display:grid; grid-template-columns:104px minmax(0,1fr); column-gap:18px; padding:10px 2px; cursor:pointer; list-style:none; }
  .dec summary::-webkit-details-marker { display:none; }
  .dec .dl b { font-size:.92rem; font-weight:600; display:block; }
  .dec .dl small { display:block; margin-top:2px; font-size:.8rem; color:var(--secondary-text-color); }
  .dec .dfull { padding:2px 2px 12px 122px; }
  .dec .dfull p { margin:0 0 4px; font-size:.82rem; }
  .dec .dfull .ddata { color:var(--secondary-text-color); font-variant-numeric:tabular-nums; }
  /* „Warum?" – Zeit links, Entscheidung und Begründung rechts. */
  .why { margin-top:4px; }
  .whyhead { border-top:1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent); }
  .whyrow { display:grid; grid-template-columns:104px minmax(0,1fr); column-gap:18px;
            padding:9px 2px; border-top:1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent); }
  .whyrow:first-of-type { border-top:0; }
  .whyrow .wtime { font-size:.8rem; color:var(--secondary-text-color); font-variant-numeric:tabular-nums; }
  .whyrow .wl b { font-size:.9rem; font-weight:600; }
  /* Zeitwähler (iOS-artig): zwei Räder, die einrasten */
  .timebtn { min-height:36px; padding:7px 14px; border-radius:12px; font:inherit; font-size:.88rem;
             font-variant-numeric:tabular-nums; cursor:pointer; color:inherit;
             background:color-mix(in srgb, var(--primary-text-color) 6%, transparent);
             border:1px solid color-mix(in srgb, var(--primary-text-color) 12%, transparent); }
  .tpick { position:fixed; left:50%; bottom:24px; transform:translateX(-50%); z-index:60;
           width:min(300px, 92vw); padding:14px 16px 16px; border-radius:20px;
           background:var(--card-background-color, #fff); color:var(--primary-text-color);
           box-shadow:0 18px 50px rgba(0,0,0,.28); }
  .tpickhead { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
  .tpickbody { display:flex; align-items:center; justify-content:center; gap:6px; }
  .twheel { height:120px; overflow-y:auto; scroll-snap-type:y mandatory; padding:40px 0; width:74px;
            text-align:center; scrollbar-width:none; }
  .twheel::-webkit-scrollbar { display:none; }
  .twheel button { display:block; width:100%; height:40px; scroll-snap-align:center; border:0; background:none;
                   font:inherit; font-size:1.25rem; color:var(--secondary-text-color); cursor:pointer;
                   font-variant-numeric:tabular-nums; }
  .twheel button.on { color:var(--primary-text-color); font-weight:600; font-size:1.45rem; }
  .twheel.small { width:64px; }
  .tcolon { font-size:1.3rem; color:var(--secondary-text-color); }
  .tpickunit { font-size:.8rem; color:var(--secondary-text-color); }
  .tpickfoot { display:flex; gap:8px; margin-top:10px; }
  .tpickfoot .inp { flex:1; }

  /* Anwesenheitsprofil: 96 Viertelstunden als Balken */
  .pbars { display:flex; align-items:flex-end; gap:1px; height:46px; width:min(420px, 44vw); }
  .pbars i { flex:1; min-width:1px; border-radius:1px 1px 0 0; background:var(--g, var(--rk-eco)); display:block; }

  /* Raumkacheln (Alle Räume auf einen Blick) */
  .roomgrid { display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:12px; }
  .rtile { display:flex; flex-direction:column; gap:2px; text-align:left; cursor:pointer;
           padding:14px 16px 12px; border-radius:16px; font:inherit; color:inherit;
           border:1px solid color-mix(in srgb, var(--primary-text-color) 9%, transparent);
           box-shadow: inset 3px 0 0 var(--c, var(--rk-off)); }
  .rtile:hover { border-color: color-mix(in srgb, var(--c, var(--primary-text-color)) 45%, transparent); }
  .rtile .rtop { display:flex; align-items:baseline; justify-content:space-between; gap:8px; }
  .rtile .rname { font-weight:600; font-size:.95rem; }
  .rtile .rtyp { font-size:.75rem; color:var(--secondary-text-color); white-space:nowrap; }
  .rtile .rbig { font-size:1.9rem; font-weight:600; line-height:1.1; font-variant-numeric:tabular-nums; }
  .rtile .rbig i { font-size:1.1rem; font-style:normal; color:var(--secondary-text-color); }
  .rtile .rsub { font-size:.8rem; color:var(--secondary-text-color); font-variant-numeric:tabular-nums; }
  .rtile .rflags { display:flex; gap:8px; margin-top:4px; color:var(--secondary-text-color); }
  .rtile .rflags ha-icon { --mdc-icon-size:17px; }
  .whyrow .wl small { display:block; margin-top:2px; font-size:.8rem; color:var(--secondary-text-color); line-height:1.35; }
  .msgs { display:grid; gap:10px; }
  .msg { display:grid; grid-template-columns: 40px 1fr auto; gap:14px; align-items:center; padding:14px 16px; border-radius:16px; background: var(--ha-card-background, var(--card-background-color)); box-shadow: 0 1px 4px rgba(0,0,0,.06); }
  .msg .e { font-size:1.5rem; text-align:center; }
  .msg b { font-size:1.02rem; color:var(--primary-text-color); display:block; }
  .msg small { font-size:.88rem; color:var(--secondary-text-color); }
  .msg .tag { font-size:.8rem; font-weight:700; padding:3px 8px; border-radius:999px; background: color-mix(in srgb, var(--c) 16%, transparent); color: color-mix(in srgb, var(--c) 75%, var(--primary-text-color)); white-space:nowrap; }
  .status { display:flex; flex-wrap:wrap; gap:8px; margin: 2px 0 8px; }
  .tbl { width:100%; border-collapse:separate; border-spacing:0 8px; font-size:1rem; }
  .tblwrap { overflow-x:auto; margin: 0 -4px; padding: 0 4px; }
  .tbl th { text-align:left; font-weight:600; font-size:.8rem; text-transform:uppercase; letter-spacing:.04em; color:var(--secondary-text-color); padding:0 10px 2px; white-space:nowrap; }
  .tbl td { padding:14px 12px; background: var(--ha-card-background, var(--card-background-color)); white-space:nowrap; font-variant-numeric:tabular-nums; color:var(--primary-text-color); }
  .tbl tr td:first-child { border-radius:14px 0 0 14px; font-weight:650; }
  .tbl tr td:last-child { border-radius:0 14px 14px 0; }
  .tbl tbody tr { cursor:pointer; }
  .tbl .rn { display:flex; align-items:center; gap:8px; }
  .tbl .rn i { width:9px; height:9px; border-radius:50%; background: var(--c); }
  .ok { color: var(--rk-ok); } .no { color: var(--secondary-text-color); }
  .tbl.sm td { padding:10px 12px; } .tbl.sm tbody tr { cursor:default; }
  .lt { font-size:.72rem; font-weight:700; padding:1px 6px; border-radius:999px; background: color-mix(in srgb, var(--rk-eco) 18%, transparent); color: color-mix(in srgb, var(--rk-eco) 75%, var(--primary-text-color)); vertical-align:1px; }
  .foot { display:flex; flex-wrap:wrap; gap:10px; margin-top:16px; }
  .btn { all:unset; cursor:pointer; display:inline-flex; align-items:center; gap:8px; padding:12px 20px; border-radius:16px; font-weight:600; font-size:1rem;
    background: color-mix(in srgb, var(--c, var(--primary-text-color)) 9%, transparent); color: var(--primary-text-color); }
  .btn ha-icon { --mdc-icon-size:18px; color: var(--c, var(--primary-text-color)); }
  .btn.primary { background: var(--rk-air); color: #fff; }
  .btn.primary ha-icon { color: inherit; }
  .hint { font-size:.9rem; color:var(--secondary-text-color); margin-top:12px; line-height:1.45; }
  .toast { position:sticky; bottom:8px; margin-top:12px; padding:10px 14px; border-radius:14px; font-size:.9rem; font-weight:600; background: var(--rk-eco); color: #fff; width:max-content; max-width:100%; }
`;

export const REPORT_STYLES = `
  .pdfmk { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px; }
  .pdflist { display:flex; flex-direction:column; gap:6px; }
  .pdfrow { display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:12px; background: color-mix(in srgb, var(--primary-text-color) 4%, transparent); }
  .pdfrow > ha-icon { color: var(--rk-cold, #e5484d); --mdc-icon-size:26px; }
  .pdfi { flex:1; display:flex; flex-direction:column; min-width:0; }
  .pdfi b { font-weight:600; color: var(--primary-text-color); }
  .pdfi small { color: var(--secondary-text-color); font-size:.8rem; }
  .pdfi .no { font-weight:500; color: var(--secondary-text-color); font-size:.8rem; }
  ha-card.report { container-type: inline-size; padding: 24px 26px; }
  @media (max-width: 600px) { ha-card.report { padding: 18px 16px; } }
  .rsub { font-size:.9rem; color:var(--secondary-text-color); margin-top:2px; }
  .tiles { display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap:12px; margin-top:18px; }
  @container (min-width: 640px) { .tiles { grid-template-columns: repeat(3, minmax(0,1fr)); } }
  @container (min-width: 980px) { .tiles { grid-template-columns: repeat(6, minmax(0,1fr)); } }
  .tile { border-radius:20px; padding:16px; background: color-mix(in srgb, var(--c) 9%, transparent); border:1px solid color-mix(in srgb, var(--c) 16%, transparent); min-width:0; }
  .tile .k { font-size:.82rem; font-weight:600; color:var(--secondary-text-color); display:flex; align-items:center; gap:6px; }
  .tile .k ha-icon { --mdc-icon-size:16px; color: var(--c); }
  .tile .n { font-size:1.9rem; font-weight:700; letter-spacing:-.02em; color:var(--primary-text-color); margin-top:6px; font-variant-numeric:tabular-nums; line-height:1.1; }
  .tile .n small { font-size:.95rem; font-weight:600; color:var(--secondary-text-color); margin-left:2px; }
  .tile .d { font-size:.82rem; color:var(--secondary-text-color); margin-top:4px; }
  .tile .d.good { color: var(--rk-ok); font-weight:650; } .tile .d.bad { color: var(--rk-cold); font-weight:650; }
  .rsec { margin-top:26px; }
  .rsec h3 { margin:0 0 12px; font-size:1.05rem; font-weight:650; color:var(--primary-text-color); display:flex; align-items:center; gap:8px; }
  .rsec h3 ha-icon { --mdc-icon-size:20px; color:var(--secondary-text-color); }
  .days { display:flex; align-items:flex-end; gap:3px; height:150px; padding-top:8px; }
  .day { flex:1; min-width:0; display:flex; flex-direction:column; justify-content:flex-end; height:100%; position:relative; }
  .day .stk { display:flex; flex-direction:column-reverse; border-radius:5px 5px 2px 2px; overflow:hidden; min-height:2px; background: color-mix(in srgb, var(--rk-off) 15%, transparent); }
  .day .stk i { display:block; background: var(--c); }
  .day.today .stk { outline:2px solid var(--primary-text-color); outline-offset:1px; }
  .day .hdd { position:absolute; left:50%; width:6px; height:6px; margin-left:-3px; border-radius:50%; background: var(--rk-air); box-shadow:0 0 0 2px var(--ha-card-background, var(--card-background-color)); }
  .daylab { display:flex; gap:3px; margin-top:6px; }
  .daylab span { flex:1; min-width:0; text-align:center; font-size:.7rem; color:var(--secondary-text-color); overflow:hidden; }
  .lg { display:flex; flex-wrap:wrap; gap:6px 14px; margin-top:10px; font-size:.84rem; color:var(--secondary-text-color); }
  .lg span { display:inline-flex; align-items:center; gap:6px; }
  .lg i { width:10px; height:10px; border-radius:3px; background: var(--c); }
  .lg i.dot { border-radius:50%; }
  .rrows { display:grid; gap:10px; }
  .rrow { display:grid; grid-template-columns: minmax(90px, 160px) 1fr; gap:14px; align-items:center; padding:12px 14px; border-radius:16px; background: color-mix(in srgb, var(--primary-text-color) 3.5%, transparent); }
  .rrow .nm { font-weight:650; color:var(--primary-text-color); display:flex; align-items:center; gap:8px; min-width:0; }
  .rrow .nm i { width:10px; height:10px; border-radius:50%; background: var(--c); flex:none; }
  .rrow .nm span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .rbar { height:12px; border-radius:999px; background: color-mix(in srgb, var(--rk-off) 14%, transparent); overflow:hidden; display:flex; }
  .rbar i { display:block; height:100%; }
  .facts { display:flex; flex-wrap:wrap; gap:6px 14px; margin-top:8px; font-size:.84rem; color:var(--secondary-text-color); font-variant-numeric:tabular-nums; }
  .facts b { color:var(--primary-text-color); font-weight:650; }
  .facts .w { color: var(--rk-warn); font-weight:650; }
  @container (max-width: 520px) { .rrow { grid-template-columns: 1fr; gap:8px; } }
  .empty { padding:24px 0 8px; color:var(--secondary-text-color); line-height:1.5; }
`;

export const MODERN_STYLES = `
  .modern { border-radius: 26px; }
  /* Panel hinter dem Raster – gibt der Fläche Halt, ohne das Markup zu ändern */
  .modern .rooms { gap: 12px; padding: 10px; border-radius: 24px;
    background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
    border: 1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent); }
  .modern .room { container-type: inline-size; min-height: 140px; padding: 15px 16px; border-radius: 20px;
    border: 1px solid color-mix(in srgb, var(--tone) 30%, transparent);
    background:
      radial-gradient(120% 110% at 18% 0%, color-mix(in srgb, var(--tone) 32%, transparent), transparent 68%),
      color-mix(in srgb, var(--primary-text-color) 4%, var(--ha-card-background, var(--card-background-color))); }
  .modern .room:hover { transform: translateY(-3px);
    box-shadow: 0 12px 26px -14px color-mix(in srgb, var(--tone) 70%, transparent);
    background:
      radial-gradient(120% 110% at 18% 0%, color-mix(in srgb, var(--tone) 42%, transparent), transparent 72%),
      color-mix(in srgb, var(--primary-text-color) 5%, var(--ha-card-background, var(--card-background-color))); }
  .modern .dot { border-radius: 14px; background: color-mix(in srgb, var(--tone) 18%, transparent);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--tone) 22%, transparent); }
  .modern .rn { font-size: 1.03rem; letter-spacing: -.015em; }
  .modern .rt { font-size: clamp(1.9rem, 22cqw, 3rem); letter-spacing: -.05em; }
  .modern .rmeta { font-size: .76rem; }
  /* Raumkarte: gleiche Sprache, ohne die Aufteilung anzufassen */
  .modern .name { font-size: 1.22rem; letter-spacing: -.02em; }
  .modern .stat { border-radius: 16px; background: color-mix(in srgb, var(--primary-text-color) 4%, transparent); }
  .modern .stat .v { font-weight: 300; letter-spacing: -.03em; }
  /* Auf dunklem Grund verschluckt die Fläche die Tönung – dort kräftiger mischen.
     Die Klasse setzt die Karte (Theme + Wohnungs-Einstellung), nicht die Systemabfrage. */
  .modern.dark .room,
  .modern.dark .room:hover { background:
      radial-gradient(120% 110% at 18% 0%, color-mix(in srgb, var(--tone) 46%, transparent), transparent 70%),
      color-mix(in srgb, var(--primary-text-color) 6%, var(--ha-card-background, var(--card-background-color)));
      border-color: color-mix(in srgb, var(--tone) 40%, transparent); }
  .modern.dark .rooms { background: color-mix(in srgb, var(--primary-text-color) 7%, transparent); }
`;

// ---------------------------------------------------------------- Look „glass"
// Glas-Optik (iOS): halbtransparente Flächen, Weichzeichner dahinter, feine helle Kanten.
// Braucht etwas Hintergrund zum Durchscheinen – im Theme `lovelace-background` setzen,
// sonst wirkt es nur flau. Markup bleibt identisch, es ist wieder nur CSS.
export const GLASS_STYLES = `
  .glass { border-radius: 28px; border: 1px solid color-mix(in srgb, #fff 26%, transparent);
    background: color-mix(in srgb, var(--ha-card-background, #fff) 42%, transparent);
    -webkit-backdrop-filter: blur(20px) saturate(1.4); backdrop-filter: blur(20px) saturate(1.4);
    box-shadow: 0 18px 40px -28px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.28); }
  .glass .rooms { gap: 12px; padding: 10px; border-radius: 24px;
    background: color-mix(in srgb, #fff 10%, transparent); border: 1px solid color-mix(in srgb, #fff 18%, transparent); }
  .glass .room { container-type: inline-size; min-height: 140px; padding: 15px 16px; border-radius: 22px;
    border: 1px solid color-mix(in srgb, #fff 30%, transparent);
    background: linear-gradient(155deg, color-mix(in srgb, var(--tone) 34%, transparent), color-mix(in srgb, #fff 10%, transparent) 62%);
    -webkit-backdrop-filter: blur(16px) saturate(1.5); backdrop-filter: blur(16px) saturate(1.5);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.35); }
  .glass .room:hover { transform: translateY(-3px);
    box-shadow: 0 20px 38px -26px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.4); }
  .glass .dot { border-radius: 14px; background: color-mix(in srgb, #fff 22%, transparent);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, #fff 30%, transparent); }
  .glass .rn { font-size: 1.03rem; letter-spacing: -.015em; }
  .glass .rt { font-size: clamp(1.9rem, 22cqw, 3rem); letter-spacing: -.05em; }
  .glass .chip, .glass .hm { background: color-mix(in srgb, #fff 18%, transparent); }
  .glass .name { font-size: 1.22rem; letter-spacing: -.02em; }
  .glass .stat { border-radius: 18px; background: color-mix(in srgb, #fff 12%, transparent);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.22); }
  .glass .stat .v { font-weight: 300; letter-spacing: -.03em; }
  .glass.dark { background: color-mix(in srgb, #14181f 55%, transparent); border-color: color-mix(in srgb, #fff 16%, transparent); }
  .glass.dark .room { background: linear-gradient(155deg, color-mix(in srgb, var(--tone) 40%, transparent), color-mix(in srgb, #fff 6%, transparent) 62%);
    border-color: color-mix(in srgb, #fff 20%, transparent); }
  .glass.dark .rooms { background: color-mix(in srgb, #fff 6%, transparent); }
`;
