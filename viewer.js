(async function client() {
  const ROOT_ID = "nazokatsu-viewer";
  document.getElementById(ROOT_ID)?.remove();
  if (location.hostname !== "nazohiroba.com") {
    alert("ナゾヒロバ（nazohiroba.com）を開いてから実行してください");
    return;
  }
  // 押した直後に重ね表示し、取得中や閉じるボタンを常に見せる
  const host = document.createElement("div");
  host.id = ROOT_ID;
  host.style.cssText = "position:fixed;inset:0;z-index:2147483647;overflow:auto";
  const root = host.attachShadow({ mode: "open" });
  root.innerHTML = `<style>
*{box-sizing:border-box}
.root{--bg:#f3f4f7;--card:#fff;--text:#1f2328;--sub:#667085;--line:#e0e3e8;--accent:#2457b8;--on:#fff;--chip:#eceff4;--check:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M3.8 8.4l2.8 2.8 5.6-6.2' fill='none' stroke='white' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");min-height:100%;background:var(--bg);color:var(--text);font-family:-apple-system,"Hiragino Sans",sans-serif}
@media (prefers-color-scheme:dark){.root{--bg:#15171b;--card:#1f2228;--text:#e8eaed;--sub:#9aa3b0;--line:#323741;--accent:#7aa7ff;--on:#10131a;--chip:#2a2e36;--check:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M3.8 8.4l2.8 2.8 5.6-6.2' fill='none' stroke='%2310131a' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")}}
.top{position:sticky;top:0;z-index:3;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;background:var(--card);border-bottom:1px solid var(--line)}
.top h1{margin:0;font-size:18px}
.topbtns{display:flex;align-items:center;gap:4px}
/* 上のバーのボタンは控えめなアイコンにし、青は保存などの操作だけに使う */
.icon{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;padding:0;font-size:20px;line-height:1;border:0;border-radius:50%;background:transparent;color:var(--text)}
.icon[aria-expanded=true]{background:var(--chip)}
@media (hover:hover){.icon:hover{background:var(--chip);filter:none}}
.menuwrap{position:relative}
.menu{position:absolute;right:0;top:calc(100% + 6px);z-index:5;min-width:230px;padding:6px;background:var(--card);border:1px solid var(--line);border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.18)}
.menu[hidden]{display:none}
.menu-info{padding:6px 12px 8px;margin-bottom:4px;font-size:12px;color:var(--sub);border-bottom:1px solid var(--line)}
.menu button{display:block;width:100%;padding:10px 12px;font-size:15px;text-align:left;border:0;border-radius:8px;background:none;color:var(--text)}
@media (hover:hover){.menu button:hover{background:var(--chip);filter:none}}
.wrap{max-width:820px;margin:0 auto;padding:0 12px 40px}
.bar{position:sticky;top:61px;z-index:2;background:var(--bg);padding:10px 0 8px}
.search{position:relative;display:flex;gap:8px}
#qhint{position:absolute;left:0;top:calc(100% + 6px);z-index:4;max-width:100%;padding:6px 10px;border-radius:8px;background:#2b2f3a;color:#fff;font-size:12px;line-height:1.5;box-shadow:0 2px 8px rgba(0,0,0,.25);pointer-events:none}
#qhint[hidden]{display:none}
#q{flex:1;min-width:0;width:100%;height:46px;padding:0 14px;font-size:16px;border:1px solid var(--line);border-radius:10px;background:var(--card);color:var(--text)}
#toggle{display:none;flex:none;height:46px;padding:0 14px;font-size:15px;border:1px solid var(--line);border-radius:10px;background:var(--card);color:var(--text)}
#toggle.on{border-color:var(--accent);color:var(--accent);font-weight:700}
#toggle::after{content:"▼";margin-left:6px;font-size:11px;vertical-align:1px}
#toggle[aria-expanded=true]{background:var(--chip)}
#toggle[aria-expanded=true]::after{content:"▲"}
/* 絞り込みは枠で囲み、「レーベル」「条件」の段に分ける。並び替えは絞り込みではないので件数の行に置く */
.filters{display:flex;flex-direction:column;gap:8px;margin-top:8px;padding:10px 12px;border:1px solid var(--line);border-radius:12px;background:var(--card)}
.fgroup{display:flex;flex-wrap:wrap;align-items:center;gap:6px}
.flabel{flex:none;width:4.5em;font-size:12px;font-weight:600;color:var(--sub)}
@media (max-width:640px){
.top{padding:4px 12px}
.top h1{font-size:15px}
.icon{width:32px;height:32px;font-size:17px}
.bar{top:41px;padding:6px 0}
#q,#toggle{height:40px}
#toggle{display:block}
.filters{display:none}
.bar.show .filters{display:flex}
.flabel{width:100%}
}
.filters select{height:38px;font-size:14px;padding:0 8px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--text)}
.countrow .left{display:flex;align-items:center;gap:8px;min-width:0}
.sortbox{flex:none;display:flex;align-items:center;gap:2px;font-size:12px;color:var(--sub)}
.sortbox select{height:30px;padding:0 4px;font-size:13px;font-weight:600;border:0;border-radius:6px;background:transparent;color:var(--text)}
@media (hover:hover){.sortbox select:hover{background:var(--chip)}}
.seg{display:flex;flex-wrap:wrap;gap:6px}
.seg[hidden]{display:none}
.seg button{height:38px;padding:0 12px;font-size:14px;border:1px solid var(--line);border-radius:19px;background:var(--card);color:var(--text)}
.seg button[aria-pressed=true]{background:var(--accent);border-color:var(--accent);color:var(--on)}
.seg button span{margin-left:4px;font-size:12px;opacity:.75}
/* 絞り込みのチェックは、オンでチップ全体がレーベルのボタンと同じ色になるトグルにする（input は残して見た目だけ変える） */
.chip{display:inline-flex;align-items:center;gap:7px;height:38px;padding:0 14px 0 10px;font-size:14px;border:1px solid var(--line);border-radius:19px;background:var(--card);color:var(--text);user-select:none;transition:background-color .15s,border-color .15s,color .15s}
.chip input{appearance:none;-webkit-appearance:none;flex:none;width:18px;height:18px;margin:0;border:1.5px solid var(--sub);border-radius:50%;background:transparent center/14px 14px no-repeat;cursor:pointer;transition:border-color .15s}
.chip:has(input:checked){background:var(--accent);border-color:var(--accent);color:var(--on)}
.chip input:checked{border-color:var(--on);background-image:var(--check)}
.chip:has(input:focus-visible){outline:2px solid var(--accent);outline-offset:2px}
.chip input:focus-visible{outline:none}
.chip:has(input:disabled){opacity:.45;cursor:not-allowed}
.chip input:disabled{cursor:not-allowed}
.chip[hidden]{display:none}
.countrow{display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:28px;margin:6px 2px 10px}
#count{font-size:13px;color:var(--sub)}
.clear{flex:none;height:28px;padding:0 12px;font-size:13px;font-weight:600;border:0;border-radius:14px;background:var(--chip);color:var(--accent)}
.clear[hidden]{display:none}
.empty{padding:40px 16px;text-align:center;color:var(--sub);font-size:15px}
.empty p{margin:0 0 14px}
.empty .clear{height:36px;padding:0 16px;font-size:14px;border-radius:18px;margin:0 4px}
.card{position:relative;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin-bottom:10px}
.card h2{font-size:16px;line-height:1.4;margin:0 0 8px}
.card h2 a{color:var(--accent);text-decoration:none}
.meta{display:flex;flex-wrap:wrap;gap:6px}
.tag{font-size:12px;padding:2px 8px;border-radius:999px;background:var(--chip);color:var(--sub)}
/* 日付と評価類は1行の薄い文字にまとめ、色付きの札は状態（成功・失敗・非公開・ネタバレ）とレーベルだけにする */
.info{display:inline-flex;align-items:center;flex-wrap:wrap;gap:0 6px;font-size:13px;color:var(--sub)}
.info .star{color:#b7791f;font-weight:700}
.info .sep{opacity:.5}
.tag.maker{background:none;border:1px solid var(--line);color:var(--text)}
.tag.ok{background:#d9f2e1;color:#14663a}
.tag.ng{background:#fde0e0;color:#a12a2a}
.tag.priv{background:#e4e0f5;color:#4b3a9a}
.tag.spoil{background:#ffe9cc;color:#9a5a00}
.review{white-space:pre-wrap;margin:10px 0 0;font-size:15px;line-height:1.6;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
.card.open .review{display:block;-webkit-line-clamp:unset}
.memo{margin:10px 0 0;padding:6px 10px;border-left:3px solid #4b3a9a;border-radius:4px;background:var(--chip)}
.memo-label{font-size:12px;font-weight:700;color:#4b3a9a}
@media (prefers-color-scheme:dark){.memo{border-left-color:#a99cf0}.memo-label{color:#a99cf0}}
.memo-text{white-space:pre-wrap;margin:2px 0 0;font-size:15px;line-height:1.6;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
.card.open .memo-text{display:block;-webkit-line-clamp:unset}
.btns{flex:none;display:flex;gap:6px}
.memo-edit{display:flex;flex-direction:column;gap:8px;margin-top:8px}
.memo-edit textarea{min-height:160px;font-size:16px;line-height:1.5;padding:8px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--text)}
.memo-edit .note{font-size:12px;color:var(--sub)}
.memo-edit .actions{display:flex;gap:10px}
.memo-edit .actions button{flex:1;height:46px;font-size:16px;border-radius:10px;border:1px solid var(--line);background:var(--card);color:var(--text)}
.memo-edit .actions .save{background:var(--accent);color:var(--on);border:0;font-weight:700}
.card.long{cursor:pointer}
.card.long::after{content:"…続き ▾";position:absolute;right:14px;bottom:12px;padding-left:36px;font-size:12px;line-height:24px;color:var(--sub);background:linear-gradient(to right,transparent,var(--card) 32px)}
.card.long.open::after{content:"たたむ ▴";position:static;display:block;padding:0;text-align:right;line-height:1.6;background:none}
.head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
@media (max-width:640px){
.card{padding:8px 10px;margin-bottom:6px}
.card h2{font-size:15px;line-height:1.35;margin:0 0 5px}
.meta{gap:4px}
.tag{font-size:11px;padding:1px 6px}
.info{font-size:12px;gap:0 5px}
.review{margin-top:5px;font-size:14px;line-height:1.5}
.card.long::after{right:10px;bottom:8px;line-height:21px}
.edit-btn{height:26px;margin:-3px 0;padding:0 8px}
.countrow{margin:4px 2px 6px}
}
button,select,.chip{cursor:pointer}
@media (hover:hover){button:hover{filter:brightness(.93)}}
button:disabled,select:disabled{cursor:wait;opacity:.6}
.save.busy::before{content:"";display:inline-block;width:14px;height:14px;margin-right:8px;border:2px solid currentColor;border-top-color:transparent;border-radius:50%;animation:s 1s linear infinite;vertical-align:-2px}
.card.editing{position:relative}
.saving{position:absolute;inset:0;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;border-radius:12px;background:rgba(255,255,255,.85);background:color-mix(in srgb,var(--card) 82%,transparent);font-size:16px;font-weight:700}
.saving[hidden]{display:none}
.saving .spin{margin:0}
.head h2{flex:1}
.edit-btn{flex:none;height:30px;padding:0 10px;font-size:13px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--accent)}
.edit{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px}
.edit label{display:flex;flex-direction:column;gap:4px;font-size:12px;color:var(--sub)}
/* 参加日: 表示は自前の「2026/11/01(日)」にし、上に透明な日付欄を重ねて押すと日付の選択を開く */
.datebox{position:relative;display:flex;align-items:center;gap:6px;padding:8px;font-size:16px;line-height:1.2;color:var(--text);border:1px solid var(--line);border-radius:8px;background:var(--bg);cursor:pointer}
.datebox:focus-within{outline:2px solid var(--accent);outline-offset:1px}
.datebox .dicon{margin-left:auto;font-size:12px;color:var(--sub)}
.edit .datebox input{position:absolute;inset:0;width:100%;height:100%;margin:0;padding:0;border:0;opacity:0;cursor:pointer}
.edit input[type=date],.edit select,.edit textarea{font-size:16px;padding:8px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--text)}
/* 編集フォームの非公開・ネタバレはスイッチにする */
.edit label.chk{flex-direction:row;align-items:center;gap:10px;font-size:15px;color:var(--text);cursor:pointer;user-select:none}
.edit label.chk input{appearance:none;-webkit-appearance:none;flex:none;width:42px;height:24px;margin:0;border-radius:12px;background:radial-gradient(circle,#fff 0 8.5px,transparent 9px) 2px 50%/20px 20px no-repeat var(--line);box-shadow:inset 0 0 0 1px rgba(0,0,0,.06);cursor:pointer;transition:background-position .18s,background-color .18s}
.edit label.chk input:checked{background-color:var(--accent);background-position:20px 50%}
.edit label.chk input:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.edit .wide{grid-column:1/-1}
/* 満足度は★、難易度と成功/失敗はボタンを並べ、1回のタップで選べるようにする */
.edit .pick{grid-column:1/-1;display:flex;flex-direction:column;gap:4px;font-size:12px;color:var(--sub)}
.edit .pick .pv{margin-left:6px;font-weight:700;color:var(--text)}
.edit .pick .hint{margin-left:6px}
.prow{display:flex;align-items:center;flex-wrap:wrap;gap:6px}
/* 満足度のスライダー。1〜5 を 0.5 刻み。未設定のときは灰色にし、触ると値が入る */
.slider{flex-wrap:nowrap;align-items:flex-start;gap:10px}
.rwrap{flex:1;min-width:0}
.rwrap input[type=range]{-webkit-appearance:none;appearance:none;display:block;width:100%;height:30px;margin:0;background:transparent;cursor:pointer}
.rwrap input[type=range]::-webkit-slider-runnable-track{height:8px;border-radius:4px;background:linear-gradient(90deg,#f5a623 var(--p),var(--line) var(--p))}
.rwrap input[type=range]::-moz-range-track{height:8px;border-radius:4px;background:linear-gradient(90deg,#f5a623 var(--p),var(--line) var(--p))}
.rwrap input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:26px;height:26px;margin-top:-9px;border:3px solid #f5a623;border-radius:50%;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.25)}
.rwrap input[type=range]::-moz-range-thumb{width:20px;height:20px;border:3px solid #f5a623;border-radius:50%;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.25)}
.rwrap.unset input[type=range]::-webkit-slider-runnable-track{background:var(--line)}
.rwrap.unset input[type=range]::-moz-range-track{background:var(--line)}
.rwrap.unset input[type=range]::-webkit-slider-thumb{border-color:var(--sub);opacity:.55}
.rwrap.unset input[type=range]::-moz-range-thumb{border-color:var(--sub);opacity:.55}
.scale{display:flex;justify-content:space-between;padding:0 13px;font-size:12px;color:var(--sub)}
.scale span{display:flex;justify-content:center;width:0}
.edit [data-pick=satisfaction] .pv{color:#b7791f;font-size:15px}
.edit [data-pick=satisfaction] .unset .pv{color:var(--sub);font-size:12px}
.edit .pick > div:first-child{display:flex;align-items:center;min-height:30px}
.edit .pick .x{flex:none;white-space:nowrap;height:26px;padding:0 10px;margin-left:auto;font-size:12px;border:1px solid var(--line);border-radius:13px;background:var(--card);color:var(--sub)}
.edit .pick .x[hidden]{display:none}
.segs button{min-width:44px;height:38px;padding:0 12px;font-size:15px;border:1px solid var(--line);border-radius:19px;background:var(--card);color:var(--text)}
.segs button[aria-pressed=true]{background:var(--accent);border-color:var(--accent);color:var(--on);font-weight:700}
.edit .chks{grid-column:1/-1;display:flex;gap:24px}
.edit textarea{min-height:160px;line-height:1.5}
.edit .actions{grid-column:1/-1;display:flex;gap:10px}
.edit .actions button{flex:1;height:46px;font-size:16px;border-radius:10px;border:1px solid var(--line);background:var(--card);color:var(--text)}
.edit .actions .save{background:var(--accent);color:var(--on);border:0;font-weight:700}
.edit .actions .del{flex:none;padding:0 16px;color:#c0392b;border-color:#c0392b}
/* 確認・お知らせ・入力のシート。PCは中央、スマホは下から出す */
.dlg-back{position:fixed;inset:0;z-index:20;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(15,18,25,.45);animation:fade .15s}
.dlg-back[hidden]{display:none}
.dlg{width:min(460px,100%);max-height:calc(100% - 32px);overflow:auto;padding:20px;border-radius:16px;background:var(--card);color:var(--text);box-shadow:0 12px 40px rgba(0,0,0,.25);animation:pop .18s ease-out}
.dlg h3{margin:0 0 10px;font-size:17px;line-height:1.4}
.dlg .msg{margin:0;font-size:15px;line-height:1.6;white-space:pre-wrap}
.dlg .rows{margin-top:6px}
.dlg .row{display:grid;grid-template-columns:6.5em 1fr;gap:8px;padding:8px 0;font-size:14px;line-height:1.5;border-top:1px solid var(--line)}
.dlg .row:last-child{border-bottom:1px solid var(--line)}
.dlg .k{color:var(--sub)}
.dlg .v{min-width:0;overflow-wrap:anywhere}
.dlg .old{color:var(--sub);text-decoration:line-through}
.dlg .new{font-weight:700}
.dlg .warn{margin-top:12px;padding:8px 10px;border-radius:8px;background:#fff1dc;color:#8a5300;font-size:13px;line-height:1.5;white-space:pre-wrap}
@media (prefers-color-scheme:dark){.dlg .warn{background:#3a2c14;color:#ffcf85}}
.dlg input{width:100%;height:46px;margin-top:12px;padding:0 12px;font-size:16px;border:1px solid var(--line);border-radius:10px;background:var(--bg);color:var(--text)}
.dlg .acts{display:flex;gap:10px;margin-top:18px}
.dlg .acts button{flex:1;height:46px;font-size:16px;border-radius:10px;border:1px solid var(--line);background:var(--card);color:var(--text)}
.dlg .acts .ok{border:0;background:var(--accent);color:var(--on);font-weight:700}
.dlg .acts .ok.danger{background:#d93025;color:#fff}
@media (max-width:640px){
.dlg-back{align-items:flex-end;padding:0}
.dlg{width:100%;max-height:85%;padding:18px 16px calc(16px + env(safe-area-inset-bottom));border-radius:16px 16px 0 0;animation:up .2s ease-out}
}
@keyframes fade{from{opacity:0}}
@keyframes pop{from{opacity:0;transform:scale(.96)}}
@keyframes up{from{transform:translateY(100%)}}
#toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);max-width:90%;padding:10px 16px;border-radius:10px;background:#222;color:#fff;font-size:14px;z-index:30}
mark{background:#ffe96b;color:#222;border-radius:2px}
.loading{text-align:center;margin-top:30vh;font-size:16px;color:var(--sub)}
.spin{width:40px;height:40px;margin:0 auto 14px;border:4px solid var(--line);border-top-color:var(--accent);border-radius:50%;animation:s 1s linear infinite}
@keyframes s{to{transform:rotate(360deg)}}
</style>
<div class="root">
<div class="top"><h1>自分のナゾ活</h1><div class="topbtns"><div class="menuwrap"><button id="menuBtn" class="icon" type="button" aria-label="メニュー" aria-haspopup="true" aria-expanded="false">⋯</button><div id="menu" class="menu" hidden><div id="fetchedAt" class="menu-info">取得中…</div><button id="memoSet" type="button">メモの設定（トークン）</button></div></div><button id="close" class="icon" type="button" aria-label="閉じる" title="閉じる（Esc）">✕</button></div></div>
<div id="main"><div class="loading"><div class="spin"></div>ナゾ活を取得中…</div></div>
<div id="dlg" class="dlg-back" hidden></div>
<div id="toast" hidden></div>
</div>`;
  const $ = (id) => root.getElementById(id);
  const close = () => {
    host.remove();
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKey);
  };
  // Esc は、開いているシート → メニュー → ビューアの順に1つずつ閉じる
  const onKey = (e) => {
    if (e.key !== "Escape") return;
    if (closeDialog) return closeDialog();
    if (!$("menu").hidden) return setMenu(false);
    close();
  };
  const setMenu = (open) => {
    $("menu").hidden = !open;
    $("menuBtn").setAttribute("aria-expanded", String(open));
  };
  $("menuBtn").addEventListener("click", () => setMenu($("menu").hidden));
  root.addEventListener("click", (e) => {
    if (!$("menu").hidden && !e.target.closest(".menuwrap")) setMenu(false);
  });
  // 確認・お知らせ・入力は、ブラウザ標準のダイアログ（スマホでは「ダイアログを止める」を押すと保存できなくなる）ではなく画面内のシートで出す。
  // 戻り値: 確認は true/false、入力は文字列/null。changes は [[項目名, 前, 後]]
  let closeDialog = null;
  const dialog = ({ title, message = "", changes = [], warn = "", ok = "OK", cancel = "キャンセル", danger = false, input = null }) =>
    new Promise((resolve) => {
      const back = $("dlg");
      const prevFocus = root.activeElement;
      const el = (tag, cls, text) => {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (text != null) e.textContent = text;
        return e;
      };
      const box = el("div", "dlg");
      box.setAttribute("role", "dialog");
      box.setAttribute("aria-modal", "true");
      if (title) box.append(el("h3", "", title));
      if (message) box.append(el("p", "msg", message));
      if (changes.length) {
        const rows = el("div", "rows");
        for (const [k, before, after] of changes) {
          const v = el("div", "v");
          v.append(el("span", "old", before), " → ", el("span", "new", after));
          const row = el("div", "row");
          row.append(el("span", "k", k), v);
          rows.append(row);
        }
        box.append(rows);
      }
      if (warn) box.append(el("div", "warn", warn));
      let field = null;
      if (input) {
        field = el("input");
        Object.assign(field, { type: input.type ?? "text", placeholder: input.placeholder ?? "", autocomplete: "off", spellcheck: false });
        box.append(field);
      }
      const acts = el("div", "acts");
      const cancelBtn = cancel ? el("button", "cancel", cancel) : null;
      const okBtn = el("button", danger ? "ok danger" : "ok", ok);
      for (const b of [cancelBtn, okBtn]) {
        if (!b) continue;
        b.type = "button";
        acts.append(b);
      }
      box.append(acts);
      const done = (v) => {
        back.hidden = true;
        back.replaceChildren();
        closeDialog = null;
        prevFocus?.focus?.();
        resolve(v);
      };
      closeDialog = () => done(input ? null : false);
      okBtn.addEventListener("click", () => done(input ? field.value : true));
      cancelBtn?.addEventListener("click", closeDialog);
      back.onclick = (e) => e.target === back && closeDialog();
      field?.addEventListener("keydown", (e) => e.key === "Enter" && !e.isComposing && okBtn.click());
      back.replaceChildren(box);
      back.hidden = false;
      // 取り返しのつかない操作では、Enter で進まないよう「キャンセル」に合わせておく
      (field ?? (danger ? cancelBtn : okBtn))?.focus();
    });
  const notify = (message, title = "") => dialog({ title, message, cancel: null });
  const fail = (msg) => {
    close();
    alert(msg);
  };
  $("close").addEventListener("click", close);
  document.addEventListener("keydown", onKey);
  document.body.append(host);
  document.body.style.overflow = "hidden";

  const idb = (fn) =>
    new Promise((resolve, reject) => {
      const open = indexedDB.open("firebaseLocalStorageDb");
      open.onerror = () => reject(open.error);
      open.onsuccess = () => {
        const req = fn(open.result.transaction("firebaseLocalStorage").objectStore("firebaseLocalStorage"));
        req.onerror = () => reject(req.error);
        req.onsuccess = () => resolve(req.result);
      };
    });
  const getAuth = async () => {
    const user = (await idb((s) => s.getAll())).map((r) => r.value).find((v) => v?.stsTokenManager?.accessToken);
    if (!user) throw new Error("ログインしていません。ログインしてから実行してください");
    if (user.stsTokenManager.expirationTime < Date.now()) {
      throw new Error("ログインの有効期限が切れています。ページを再読み込みしてから実行してください");
    }
    return { uid: user.uid, headers: { authorization: `Bearer ${user.stsTokenManager.accessToken}` } };
  };
  // 作品ID → レーベル（ナゾヒロバの作品の maker 欄）。編集後に取り直したときも使えるよう取得結果を残しておく
  const makers = new Map();
  // 作品ID → 公演型か。はっきり WEB・アプリ・持ち帰り・本と分かるものだけ false、迷うものは true（緩めに残す）
  const onsiteOf = new Map();
  const toItem = (r) => ({
    id: r.id,
    mysteryId: r.mysteryId ?? "",
    title: r.mysteryTitle ?? "",
    maker: makers.get(r.mysteryId) ?? "",
    onsite: onsiteOf.get(r.mysteryId),
    playDate: (r.playDate ?? "").slice(0, 10),
    satisfaction: r.satisfactionRating ?? "",
    difficulty: r.difficultyRating ?? "",
    minutes: r.actualPlayTimeMinutes ?? "",
    result: r.isSuccess === true ? "成功" : r.isSuccess === false ? "失敗" : "",
    isPrivate: r.isPrivate === true,
    spoiler: r.containsSpoiler === true,
    review: (r.review ?? "").replaceAll("\r\n", "\n"),
    photos: (r.allPhotoUrls ?? []).filter((u) => u?.includes("supabase.co/storage")),
  });
  let fetchedAt = null;
  const fetchAll = async (auth) => {
    const all = [];
    for (let page = 1; ; page++) {
      const res = await fetch(`/api/v2/reviews/my?uid=${encodeURIComponent(auth.uid)}&page=${page}&pageSize=200`, {
        headers: auth.headers,
      });
      if (!res.ok) throw new Error(`取得に失敗しました（${res.status}）`);
      const j = await res.json();
      all.push(...j.reviews);
      // APIは投稿日時の新しい順で返すため、取得順を投稿日順として使う
      if (all.length >= j.count || j.reviews.length === 0) {
        fetchedAt = new Date();
        return all.map((r, seq) => ({ ...toItem(r), seq }));
      }
    }
  };
  // ナゾ活のAPIはレーベルを返さないため、作品のレーベルをナゾヒロバと同じ公開データ（Supabase）から引く。
  // 取れなくても一覧は出す（レーベルの絞り込みが「不明」だけになる）
  const SUPABASE_URL = "https://prtwipndhcaxbuumlzgg.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBydHdpcG5kaGNheGJ1dW1semdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ3NzE0MDAsImV4cCI6MjAyMDM0NzQwMH0.HomCCnxEoeL6r7E2U3k2vp3hy3PNAuqsGsTMdNHEtqM";
  // ナゾヒロバの作品の分類（categories 欄）のうち、出向いて遊ぶもの。
  // 01・02 周遊型、03 ルーム型、04・05 公演・イベント型、06 テーマパーク等、07 カフェ・バー、10 宝探し、14 マダミス、18 イマーシブ。
  // 08 オンライン・LINE、09 アプリ、11 持ち帰り、13 本は家で遊ぶもの。16・17 はどちらにも付くので判定に使わない。
  // 除くのは家で遊ぶ分類だけが付いた作品だけ。両方付く作品（オンライン＋公演など）、分類が空か 16・17 だけの作品は公演型に残す
  const ONSITE_CODES = new Set(["01", "02", "03", "04", "05", "06", "07", "10", "14", "18"]);
  const HOME_CODES = new Set(["08", "09", "11", "13"]);
  const loadMakers = async (items) => {
    const ids = [...new Set(items.map((r) => r.mysteryId).filter((id) => id && !makers.has(id)))];
    for (let i = 0; i < ids.length; i += 100) {
      const params = new URLSearchParams({ select: "id,maker,categories", id: `in.(${ids.slice(i, i + 100).map((id) => `"${id}"`).join(",")})` });
      const res = await fetch(`${SUPABASE_URL}/rest/v1/mysteries?${params}`, {
        headers: { apikey: SUPABASE_ANON_KEY, authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      });
      if (!res.ok) throw new Error(`レーベルの取得に失敗しました（${res.status}）`);
      for (const m of await res.json()) {
        makers.set(m.id, (m.maker ?? "").trim());
        const codes = (m.categories ?? "").split(",").filter(Boolean);
        onsiteOf.set(m.id, codes.some((c) => ONSITE_CODES.has(c)) || !codes.some((c) => HOME_CODES.has(c)));
      }
    }
    for (const r of items) {
      r.maker = makers.get(r.mysteryId) ?? "";
      r.onsite = onsiteOf.get(r.mysteryId);
    }
  };
  // 解読した暗号などの自分用メモ。ナゾヒロバには送らず、非公開リポジトリの memos.json（作品ID → { title, text, updatedAt }）に置いて
  // PCとスマホで共有する。トークンはそのリポジトリだけを読み書きできる fine-grained PAT にし、端末ごとに localStorage に置く
  // （ナゾヒロバのページ上の他のスクリプトからも読めるため、権限は必ずメモ用リポジトリだけに絞る）
  const MEMO_API = "https://api.github.com/repos/hideo0sdmelt/nazokatsu-memos/contents/memos.json";
  const MEMO_TOKEN_KEY = "nazokatsuMemoToken";
  const memoToken = () => {
    try {
      return localStorage.getItem(MEMO_TOKEN_KEY) ?? "";
    } catch {
      return "";
    }
  };
  let memos = {};
  // off: トークン未設定 / ok: 読めた / error: 読めなかった（メモ欄は出さない）
  let memoState = "off";
  let memoProblem = "";
  const b64decode = (s) => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\s/g, "")), (c) => c.charCodeAt(0)));
  const b64encode = (s) => {
    const bytes = new TextEncoder().encode(s);
    let bin = "";
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  };
  const memoFetch = (method, body) =>
    fetch(MEMO_API, {
      method,
      cache: "no-store",
      headers: {
        authorization: `Bearer ${memoToken()}`,
        accept: "application/vnd.github+json",
        ...(body ? { "content-type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  const memoError = (res, what) =>
    new Error(
      res.status === 401
        ? "メモのトークンが無効か期限切れです。「メモ設定」で入れ直してください"
        : res.status === 403 || res.status === 404
          ? `メモの${what}に失敗しました（${res.status}）。トークンの対象リポジトリと権限（Contents: Read and write）を確かめてください`
          : `メモの${what}に失敗しました（${res.status}）`,
    );
  // 保存の直前にも読み直し、他の端末で書いた別の作品のメモを消さないようにする（sha で衝突を検出する）
  const readMemos = async () => {
    const res = await memoFetch("GET");
    // ファイルがまだ無いとき。トークンがリポジトリを見られないときも404になるが、保存時のエラーで気づける
    if (res.status === 404) return { memos: {}, sha: null };
    if (!res.ok) throw memoError(res, "取得");
    const j = await res.json();
    // 1MBを超えるファイルは content が空（encoding: "none"）で返る。空のメモとして扱うと、保存で全部のメモを上書きしてしまうので止める
    if (j.encoding !== "base64") throw new Error("memos.json が大きすぎて読めません（1MB超）。保存すると他のメモを消してしまうため、メモは使えません");
    return { memos: JSON.parse(b64decode(j.content ?? "") || "{}"), sha: j.sha };
  };
  const loadMemos = async () => {
    memos = {};
    memoProblem = "";
    if (!memoToken()) return (memoState = "off");
    try {
      memos = (await readMemos()).memos;
      memoState = "ok";
    } catch (e) {
      memoState = "error";
      memoProblem = e.message;
    }
  };
  const saveMemo = async (r, before, text) => {
    for (let attempt = 0; attempt < 3; attempt++) {
      const cur = await readMemos();
      if ((cur.memos[r.mysteryId]?.text ?? "") !== before && attempt === 0) {
        const go = await dialog({
          title: "他の端末で更新されています",
          message: "このメモは、開いた後に他の端末で書き換えられています。今の内容で上書きしますか？",
          ok: "上書きする",
        });
        if (!go) return false;
      }
      const next = { ...cur.memos };
      if (text.trim()) next[r.mysteryId] = { title: r.title, text, updatedAt: new Date().toISOString() };
      else delete next[r.mysteryId];
      const res = await memoFetch("PUT", {
        message: `${text.trim() ? "メモを更新" : "メモを削除"}: ${r.title}`,
        content: b64encode(`${JSON.stringify(next, null, 2)}\n`),
        ...(cur.sha ? { sha: cur.sha } : {}),
      });
      if (res.ok) {
        memos = next;
        return true;
      }
      // 409/422: 読んでから書くまでの間に他の端末が保存した。読み直してやり直す
      if (res.status !== 409 && res.status !== 422) throw memoError(res, "保存");
    }
    throw new Error("他の端末の保存と重なりました。もう一度保存してください");
  };

  let data;
  try {
    data = await fetchAll(await getAuth());
  } catch (e) {
    return fail(e.message);
  }
  try {
    await loadMakers(data);
  } catch (e) {
    console.warn(e);
  }
  await loadMemos();
  if (!host.isConnected) return;

  $("main").innerHTML = `<div class="wrap">
<div class="bar">
  <div class="search">
    <input id="q" type="search" placeholder="作品名・感想を検索">
    <button id="toggle" type="button" aria-expanded="false">絞り込み</button>
    <div id="qhint" hidden>スペースで区切ると、すべての言葉を含むものに絞り込みます</div>
  </div>
  <div class="filters">
    <div class="fgroup"><span class="flabel">レーベル</span>
      <div id="mainMakers" class="seg"></div>
      <select id="maker"></select>
    </div>
    <div class="fgroup"><span class="flabel">条件</span>
      <select id="result">
        <option value="">成功/失敗: すべて</option>
        <option value="成功">成功</option>
        <option value="失敗">失敗</option>
        <option value="-">成功/失敗: 未設定</option>
      </select>
      <label class="chip"><input id="onsite" type="checkbox">公演型のみ</label>
      <label class="chip"><input id="priv" type="checkbox">非公開のみ</label>
      <label class="chip"><input id="withReview" type="checkbox">感想ありのみ</label>
      <label class="chip"><input id="noDate" type="checkbox">参加日なしのみ</label>
      <label class="chip" title="満足度・難易度・プレイ時間のどれかが空"><input id="noRating" type="checkbox">未入力あり</label>
      <label class="chip" id="memoOnlyChip" hidden><input id="memoOnly" type="checkbox">メモありのみ</label>
    </div>
  </div>
</div>
<div class="countrow"><div class="left"><div id="count"></div><button id="clear" class="clear" type="button" hidden>条件をクリア</button></div>
  <label class="sortbox">並び順<select id="sort">
    <option value="date-desc">参加日 新しい順</option>
    <option value="date-asc">参加日 古い順</option>
    <option value="posted-desc">投稿日 新しい順</option>
    <option value="posted-asc">投稿日 古い順</option>
    <option value="sat-desc">満足度 高い順</option>
    <option value="sat-asc">満足度 低い順</option>
    <option value="title">作品名順</option>
  </select></label>
</div>
<div id="list"></div>
</div>`;
  const num = (s) => (s === "" ? -1 : Number(s));
  const sorters = {
    "date-desc": (a, b) => b.playDate.localeCompare(a.playDate),
    "date-asc": (a, b) => a.playDate.localeCompare(b.playDate),
    "posted-desc": (a, b) => a.seq - b.seq,
    "posted-asc": (a, b) => b.seq - a.seq,
    "sat-desc": (a, b) => num(b.satisfaction) - num(a.satisfaction),
    "sat-asc": (a, b) => num(a.satisfaction) - num(b.satisfaction),
    title: (a, b) => a.title.localeCompare(b.title, "ja"),
  };
  const highlight = (parent, text, words) => {
    if (!words.length) return parent.append(text);
    const re = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
    text.split(re).forEach((part, i) => {
      if (i % 2) {
        const m = document.createElement("mark");
        m.textContent = part;
        parent.append(m);
      } else parent.append(part);
    });
  };
  // [表示用キー, ラベル, APIのキー, APIに送る値への変換]
  const FIELDS = [
    ["playDate", "参加日", "playDate", (v) => v],
    ["satisfaction", "満足度", "satisfactionRating", (v) => (v === "" ? null : Number(v))],
    ["difficulty", "難易度", "difficultyRating", (v) => (v === "" ? null : Number(v))],
    ["minutes", "プレイ時間", "actualPlayTimeMinutes", (v) => (v === "" ? null : Number(v))],
    ["result", "成功/失敗", "isSuccess", (v) => (v === "" ? null : v === "成功")],
    ["isPrivate", "非公開", "isPrivate", (v) => v],
    ["spoiler", "ネタバレ", "containsSpoiler", (v) => v],
    ["review", "感想", "review", (v) => v],
  ];
  const show = (v) => {
    if (v === true) return "ON";
    if (v === false) return "OFF";
    const s = String(v).replaceAll("\n", "⏎");
    return s === "" ? "（空）" : s.length > 40 ? `${s.slice(0, 40)}…` : s;
  };
  // プレイ時間は確認でもカードと同じ 1h30m の形で見せる
  const showField = (k, v) => (k === "minutes" && v !== "" ? minuteLabel(Number(v)) : show(v));
  let editingId = null;
  const toast = (msg) => {
    $("toast").textContent = msg;
    $("toast").hidden = false;
    setTimeout(() => ($("toast").hidden = true), 3500);
  };
  // 変更点だけを確認してPATCHし、取得し直して反映を検証する
  const save = async (r, next, setBusy) => {
    const changes = FIELDS.filter(([k]) => String(next[k]) !== String(r[k]));
    if (!changes.length) {
      editingId = null;
      render();
      return toast("変更点がないため、何も更新していません");
    }
    if (!next.playDate) return notify("参加日は空にできません");
    const go = await dialog({
      title: `「${r.title}」を更新します`,
      changes: changes.map(([k, label]) => [label, showField(k, r[k]), showField(k, next[k])]),
      warn: [
        changes.some(([k]) => k === "isPrivate") && (next.isPrivate ? "非公開になります" : "公開されます（他の人から見えるようになります）"),
        r.spoiler && !next.spoiler && `ネタバレなしにします${next.isPrivate ? "" : "（ネタバレ注意の表示なしで、他の人に感想が見えるようになります）"}`,
      ]
        .filter(Boolean)
        .join("\n"),
      ok: "保存する",
    });
    if (!go) return;
    setBusy(true, "保存中…");
    const startedAt = Date.now();
    const auth = await getAuth();
    const payload = Object.fromEntries(changes.map(([k, , api, conv]) => [api, conv(next[k])]));
    const res = await fetch(`/api/v2/reviews/${encodeURIComponent(r.id)}`, {
      method: "PATCH",
      headers: { ...auth.headers, "content-type": "application/json" },
      body: JSON.stringify({ uid: auth.uid, ...payload }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || body.success !== true) throw new Error(`更新に失敗しました: ${res.status} ${JSON.stringify(body).slice(0, 200)}`);
    setBusy(true, "反映を確認中…");
    data = await fetchAll(auth);
    const after = data.find((x) => x.id === r.id);
    const bad = changes.filter(([k]) => String(after?.[k]) !== String(next[k]));
    // 通信が速いと表示が一瞬で消えるため、最低0.8秒は保存中を見せる
    await new Promise((resolve) => setTimeout(resolve, Math.max(0, 800 - (Date.now() - startedAt))));
    editingId = null;
    render();
    if (bad.length) notify(`更新後の値が期待と違います: ${bad.map(([, l]) => l).join("、")}`, "確認してください");
    else toast(`更新しました（${changes.map(([, l]) => l).join("、")}）`);
  };
  // サイト本体と同じ DELETE /api/v2/reviews/{id}。成功後に取得し直して消えたことを確かめる
  const remove = async (r, setBusy) => {
    const notes = [!r.isPrivate && "公開中のナゾ活です", r.photos.length && `添付写真${r.photos.length}枚も削除されます`, "元に戻せません"];
    const go = await dialog({
      title: `「${r.title}」を削除しますか？`,
      message: r.playDate ? `参加日: ${r.playDate}` : "",
      warn: notes.filter(Boolean).join("\n"),
      ok: "削除する",
      danger: true,
    });
    if (!go) return;
    setBusy(true, "削除中…");
    const startedAt = Date.now();
    const auth = await getAuth();
    const res = await fetch(`/api/v2/reviews/${encodeURIComponent(r.id)}`, {
      method: "DELETE",
      headers: { ...auth.headers, "content-type": "application/json" },
      body: JSON.stringify({ uid: auth.uid, isPrivate: r.isPrivate }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || body.success !== true) throw new Error(`削除に失敗しました: ${res.status} ${JSON.stringify(body).slice(0, 200)}`);
    // ナゾ活は削除済みのため、写真の削除に失敗しても続行する
    let photoFailed = 0;
    for (const imageUrl of r.photos) {
      const pr = await fetch("/api/v2/reviews/delete-image", {
        method: "POST",
        headers: { ...auth.headers, "content-type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      }).catch(() => null);
      if (!pr?.ok) photoFailed++;
    }
    setBusy(true, "反映を確認中…");
    data = await fetchAll(auth);
    await new Promise((resolve) => setTimeout(resolve, Math.max(0, 800 - (Date.now() - startedAt))));
    editingId = null;
    render();
    if (data.some((x) => x.id === r.id)) notify("削除後も一覧に残っています。ページを再読み込みして確認してください", "確認してください");
    else if (photoFailed) notify(`ナゾ活は削除しましたが、写真${photoFailed}枚の削除に失敗しました`, "確認してください");
    else toast(`「${r.title}」を削除しました`);
  };
  const options = (list, current) => {
    const items = current !== "" && !list.some(([v]) => String(v) === String(current)) ? [...list, [current, current]] : list;
    return items.map(([v, l]) => `<option value="${v}">${l}</option>`).join("");
  };
  const minuteLabel = (m) => (m < 60 ? `${m}m` : `${Math.floor(m / 60)}h${m % 60 ? `${m % 60}m` : ""}`);
  const editCard = (r) => {
    const el = document.createElement("article");
    el.className = "card editing";
    const h = document.createElement("h2");
    h.textContent = `編集: ${r.title}`;
    const form = document.createElement("form");
    form.className = "edit";
    const unset = ["", "未設定"];
    form.innerHTML = `
<label>参加日<span class="datebox"><span class="dtext"></span><span class="dicon" aria-hidden="true">▾</span><input name="playDate" type="date" required></span></label>
<label>プレイ時間<select name="minutes">${options([unset, ...Array.from({ length: 48 }, (_, i) => [15 * (i + 1), minuteLabel(15 * (i + 1))])], r.minutes)}</select></label>
<div class="pick" data-pick="satisfaction"></div>
<div class="pick" data-pick="difficulty"></div>
<div class="pick" data-pick="result"></div>
<div class="chks"><label class="chk"><input name="isPrivate" type="checkbox">非公開</label><label class="chk"><input name="spoiler" type="checkbox">ネタバレあり</label></div>
<label class="wide">感想（5000字まで）<textarea name="review" maxlength="5000"></textarea></label>
<div class="actions"><button type="submit" class="save">保存</button><button type="button" class="cancel">キャンセル</button><button type="button" class="del">削除</button></div>
<div class="saving" hidden><div class="spin"></div><span></span></div>`;
    // 選んだ値は隠し入力に持ち、ボタンの見た目はそこから描く（触らなければ元の値のまま送らない）
    const picker = (name, label, build) => {
      const box = form.querySelector(`[data-pick="${name}"]`);
      const hidden = document.createElement("input");
      hidden.type = "hidden";
      hidden.name = name;
      hidden.value = String(r[name]);
      const title = document.createElement("div");
      const pv = document.createElement("span");
      pv.className = "pv";
      title.append(label, pv);
      const row = document.createElement("div");
      row.className = "prow";
      box.append(title, row, hidden);
      const set = build(row, hidden, title, () => set());
      set();
      return { hidden, pv };
    };
    const btn = (row, text, cls = "") => {
      const b = document.createElement("button");
      b.type = "button";
      if (cls) b.className = cls;
      b.textContent = text;
      row.append(b);
      return b;
    };
    // 満足度: 1〜5 を 0.5 刻みのスライダーで選ぶ。未設定のときは灰色で、動かすか押すと値が入る。「未設定にする」で空に戻す
    picker("satisfaction", "満足度", (row, hidden, title, refresh) => {
      row.classList.add("slider");
      const wrap = document.createElement("div");
      wrap.className = "rwrap";
      const range = document.createElement("input");
      Object.assign(range, { type: "range", min: "1", max: "5", step: "0.5" });
      range.setAttribute("aria-label", "満足度");
      const scale = document.createElement("div");
      scale.className = "scale";
      for (const n of [1, 2, 3, 4, 5]) {
        const t = document.createElement("span");
        t.textContent = n;
        scale.append(t);
      }
      wrap.append(range, scale);
      row.append(wrap);
      const take = () => {
        hidden.value = range.value;
        refresh();
      };
      range.addEventListener("input", take);
      // 未設定のまま、つまみの位置（3）をそのまま押したときも値を入れる
      range.addEventListener("pointerup", () => hidden.value === "" && take());
      // スライダーの横に置くと、出し入れで幅が変わって目盛りがずれるので、見出しの行に置く
      const x = btn(title, "未設定にする", "x");
      x.addEventListener("click", () => {
        hidden.value = "";
        refresh();
      });
      return () => {
        const unset = hidden.value === "";
        if (!unset) range.value = hidden.value;
        else range.value = "3";
        wrap.classList.toggle("unset", unset);
        wrap.style.setProperty("--p", `${((Number(range.value) - 1) / 4) * 100}%`);
        title.querySelector(".pv").textContent = unset ? "未設定" : `★${hidden.value}`;
        title.classList.toggle("unset", unset);
        x.hidden = unset;
      };
    });
    // 難易度・成功/失敗: ボタンを並べ、押しているものをもう一度押すと未設定に戻す
    const segPicker = (name, label, values) =>
      picker(name, label, (row, hidden, title, refresh) => {
        row.classList.add("segs");
        const bs = values.map((v) => {
          const b = btn(row, String(v));
          b.dataset.v = v;
          b.addEventListener("click", () => {
            hidden.value = hidden.value === String(v) ? "" : String(v);
            refresh();
          });
          return b;
        });
        return () => {
          for (const b of bs) b.setAttribute("aria-pressed", String(b.dataset.v === hidden.value));
          row.parentElement.querySelector(".pv").textContent = hidden.value === "" ? "未設定" : "";
        };
      });
    segPicker("difficulty", "難易度", [1, 2, 3, 4, 5]);
    segPicker("result", "成功/失敗", ["成功", "失敗"]);
    const f = form.elements;
    f.playDate.value = r.playDate;
    const syncDate = () => {
      const v = f.playDate.value;
      form.querySelector(".dtext").textContent = v ? `${v.replaceAll("-", "/")}(${"日月火水木金土"[new Date(`${v}T00:00:00`).getDay()]})` : "未設定";
    };
    syncDate();
    f.playDate.addEventListener("input", syncDate);
    f.playDate.addEventListener("change", syncDate);
    // PCでは日付欄の文字の部分を押しても選択が開かないので、押したら開く
    f.playDate.addEventListener("click", () => {
      try {
        f.playDate.showPicker();
      } catch {}
    });
    f.minutes.value = String(r.minutes);
    f.isPrivate.checked = r.isPrivate;
    f.spoiler.checked = r.spoiler;
    f.review.value = r.review;
    const saveBtn = form.querySelector(".save");
    const overlay = form.querySelector(".saving");
    const setBusy = (on, text = "", spinSave = true) => {
      for (const c of form.querySelectorAll("input,select,textarea,button")) c.disabled = on;
      saveBtn.classList.toggle("busy", on && spinSave);
      saveBtn.textContent = on && spinSave ? "保存中…" : "保存";
      overlay.hidden = !on;
      overlay.querySelector("span").textContent = text;
    };
    form.querySelector(".del").addEventListener("click", async () => {
      try {
        await remove(r, (on, text) => setBusy(on, text, false));
      } catch (err) {
        notify(err.message, "エラー");
      } finally {
        setBusy(false);
      }
    });
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        await save(r, {
          playDate: f.playDate.value,
          satisfaction: f.satisfaction.value,
          difficulty: f.difficulty.value,
          minutes: f.minutes.value,
          result: f.result.value,
          isPrivate: f.isPrivate.checked,
          spoiler: f.spoiler.checked,
          review: f.review.value.replaceAll("\r\n", "\n"),
        }, setBusy);
      } catch (err) {
        notify(err.message, "エラー");
      } finally {
        setBusy(false);
      }
    });
    form.querySelector(".cancel").addEventListener("click", () => {
      editingId = null;
      render();
    });
    el.append(h, form);
    return el;
  };
  let memoEditingId = null;
  const memoOf = (r) => (memoState === "ok" ? memos[r.mysteryId]?.text ?? "" : "");
  const memoCard = (r) => {
    const el = document.createElement("article");
    el.className = "card editing";
    const h = document.createElement("h2");
    h.textContent = `メモ: ${r.title}`;
    const form = document.createElement("form");
    form.className = "memo-edit";
    form.innerHTML = `<textarea name="memo" placeholder="解読した暗号など。自分だけが見られます"></textarea>
<div class="note">ナゾヒロバには送られません。空にして保存するとメモを消します</div>
<div class="actions"><button type="submit" class="save">保存</button><button type="button" class="cancel">キャンセル</button></div>
<div class="saving" hidden><div class="spin"></div><span>保存中…</span></div>`;
    const before = memoOf(r);
    form.elements.memo.value = before;
    const overlay = form.querySelector(".saving");
    const setBusy = (on) => {
      for (const c of form.querySelectorAll("textarea,button")) c.disabled = on;
      overlay.hidden = !on;
    };
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = form.elements.memo.value.replaceAll("\r\n", "\n");
      if (text === before) {
        memoEditingId = null;
        render();
        return toast("変更点がないため、何も保存していません");
      }
      setBusy(true);
      try {
        if (!(await saveMemo(r, before, text))) return;
        memoEditingId = null;
        render();
        toast(text.trim() ? "メモを保存しました" : "メモを消しました");
      } catch (err) {
        notify(err.message, "エラー");
      } finally {
        setBusy(false);
      }
    });
    form.querySelector(".cancel").addEventListener("click", () => {
      memoEditingId = null;
      render();
    });
    el.append(h, form);
    return el;
  };
  const card = (r, words) => {
    if (r.id === editingId) return editCard(r);
    if (r.id === memoEditingId) return memoCard(r);
    const el = document.createElement("article");
    el.className = "card";
    const head = document.createElement("div");
    head.className = "head";
    const h = document.createElement("h2");
    const a = document.createElement("a");
    a.href = `/mysteries/reviews/${encodeURIComponent(r.id)}`;
    a.target = "_blank";
    a.rel = "noopener";
    highlight(a, r.title, words);
    h.append(a);
    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "edit-btn";
    editBtn.textContent = "編集";
    editBtn.addEventListener("click", () => {
      editingId = r.id;
      memoEditingId = null;
      render();
      $("list").querySelector(".editing")?.scrollIntoView({ block: "nearest" });
    });
    const btns = document.createElement("div");
    btns.className = "btns";
    if (memoState === "ok" && r.mysteryId) {
      const memoBtn = document.createElement("button");
      memoBtn.type = "button";
      memoBtn.className = "edit-btn memo-btn";
      memoBtn.textContent = "メモ";
      memoBtn.addEventListener("click", () => {
        memoEditingId = r.id;
        editingId = null;
        render();
        $("list").querySelector(".editing")?.scrollIntoView({ block: "nearest" });
      });
      btns.append(memoBtn);
    }
    btns.append(editBtn);
    head.append(h, btns);
    const meta = document.createElement("div");
    meta.className = "meta";
    const tag = (text, cls = "") => {
      const s = document.createElement("span");
      s.className = `tag ${cls}`;
      s.textContent = text;
      meta.append(s);
    };
    if (r.maker) tag(r.maker, "maker");
    const parts = [];
    const part = (text, cls = "") => {
      const s = document.createElement("span");
      if (cls) s.className = cls;
      s.textContent = text;
      parts.push(s);
    };
    if (r.playDate) part(r.playDate);
    if (r.satisfaction !== "") part(`★${r.satisfaction}`, "star");
    if (r.difficulty !== "") part(`難易度${r.difficulty}`);
    if (r.minutes !== "") part(minuteLabel(Number(r.minutes)));
    if (parts.length) {
      const info = document.createElement("span");
      info.className = "info";
      parts.forEach((s, i) => {
        if (i) {
          const sep = document.createElement("span");
          sep.className = "sep";
          sep.textContent = "·";
          info.append(sep);
        }
        info.append(s);
      });
      meta.append(info);
    }
    if (r.result) tag(r.result, r.result === "成功" ? "ok" : "ng");
    if (r.isPrivate) tag("非公開", "priv");
    if (r.spoiler) tag("ネタバレ", "spoil");
    el.append(head, meta);
    if (r.review) {
      const p = document.createElement("p");
      p.className = "review";
      highlight(p, r.review, words);
      el.append(p);
    }
    const memo = memoOf(r);
    if (memo) {
      const box = document.createElement("div");
      box.className = "memo";
      const label = document.createElement("div");
      label.className = "memo-label";
      label.textContent = "自分用メモ";
      const p = document.createElement("p");
      p.className = "memo-text";
      highlight(p, memo, words);
      box.append(label, p);
      el.append(box);
    }
    // 長いかどうか（.long）は表示後に markLong で実際に2行に収まらないかを測って決める
    if (r.review || memo) {
      el.addEventListener("click", (e) => {
        if (el.classList.contains("long") && !e.target.closest("a, button")) el.classList.toggle("open");
      });
    }
    return el;
  };
  // 文字数や改行の有無ではなく、折りたたんだ状態で実際に切れているカードだけに「タップで全文を表示」を付ける。
  // openAll（検索中）はヒット箇所が隠れないよう、切れるカードを最初から開く
  const markLong = (openAll) => {
    for (const el of $("list").querySelectorAll(".card")) {
      const ps = [...el.querySelectorAll(".review, .memo-text")];
      if (!ps.length) continue;
      const wasOpen = el.classList.contains("open");
      el.classList.remove("open");
      const long = ps.some((p) => p.scrollHeight > p.clientHeight + 1);
      el.classList.toggle("long", long);
      if (long && (wasOpen || openAll)) el.classList.add("open");
    }
  };
  // 画面の向きや幅が変わると切れる行数も変わるので測り直す
  let resizeTimer;
  addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => host.isConnected && markLong(false), 150);
  });
  // コラボ（「Tumbleweed,よだかのレコード」など）を、含まれる各レーベルに属させる。
  // maker 欄を区切りで語に分け、自分のナゾ活に単独で出てくるレーベルの語の並びを含んでいれば、そのレーベルにも入れる。
  // 「NAZO×NAZO劇団」「Toy×ボーズ」のような名前があるので、× は両側に空白があるときだけ区切りとみなす。
  // 比べるときは全角半角・大文字小文字・末尾の「！」の違いを無視し、カタカナ表記は ALIASES で揃える
  // 文字コードの指定なしで配信されても構文が壊れないよう、キーは引用符で囲み、正規表現の全角文字はエスケープで書く
  // （NFKC で「！，／」は半角になる。× は ×、、 は 、）
  const ALIASES = { "タンブルウィード": "tumbleweed" };
  const labelWords = (s) =>
    s
      .normalize("NFKC")
      .toLowerCase()
      .split(/\s+×\s+|[,、/]|\s+/)
      .map((w) => w.replace(/!+$/, "").trim())
      .filter(Boolean)
      .map((w) => ALIASES[w] ?? w);
  const indexOfSeq = (hay, needle) => {
    for (let i = 0; i + needle.length <= hay.length; i++) if (needle.every((w, j) => hay[i + j] === w)) return i;
    return -1;
  };
  // 生の maker 欄 → 属するレーベル（表示名）の一覧
  let labelsOf = new Map();
  const buildLabels = () => {
    // 同じ語の並びになる表記はまとめ、件数の多い書き方を表示名にする
    const byKey = new Map();
    for (const r of data) {
      if (!r.maker) continue;
      const key = labelWords(r.maker).join(" ");
      const g = byKey.get(key) ?? { words: labelWords(r.maker), names: new Map() };
      g.names.set(r.maker, (g.names.get(r.maker) ?? 0) + 1);
      byKey.set(key, g);
    }
    // 語の少ない表記から順に、それより前に決まったレーベルだけで説明しきれるか（＝コラボか）を見る。
    // 説明しきれない表記は、それ自体を1つのレーベルとして後の表記の判定に使う
    const atoms = [];
    labelsOf = new Map();
    for (const g of [...byKey.values()].sort((a, b) => a.words.length - b.words.length)) {
      const name = [...g.names].sort((a, b) => b[1] - a[1])[0][0];
      const covered = new Array(g.words.length).fill(false);
      const parts = [];
      for (const k of atoms) {
        const at = indexOfSeq(g.words, k.words);
        if (at < 0) continue;
        parts.push(k.name);
        for (let j = at; j < at + k.words.length; j++) covered[j] = true;
      }
      let labels = parts;
      // 一部しか既知のレーベルで説明できないときは、コラボの表記そのものも選択肢に残す
      if (!parts.length || !covered.every(Boolean)) {
        atoms.push({ words: g.words, name });
        labels = [name, ...parts];
      }
      for (const raw of g.names.keys()) labelsOf.set(raw, labels);
    }
  };
  const labelsOfItem = (r) => labelsOf.get(r.maker) ?? [];
  // レーベルの選択肢は件数の多い順で「不明」は最後。編集・削除で件数が変わるので描画のたびに作り直し、選択は保つ
  // 件数の多い4つのレーベルはボタンで選べるようにし、残りをセレクトボックスに入れる。
  // ボタンの顔ぶれは開いたときに決めて固定する（編集で件数が入れ替わってもボタンが動かないように）
  let mainMakers = null;
  let pickedMain = "";
  // 前回のレーベルの選択。セレクトボックスの選択肢は初回の描画で作るので、そのときに戻す
  let restoreMaker = null;
  const fillMakers = () => {
    buildLabels();
    const sel = $("maker");
    const current = restoreMaker ?? sel.value;
    restoreMaker = null;
    const counts = new Map();
    for (const r of data) for (const m of r.maker ? labelsOfItem(r) : [""]) counts.set(m, (counts.get(m) ?? 0) + 1);
    const sorted = [...counts].sort((a, b) => !a[0] - !b[0] || b[1] - a[1] || a[0].localeCompare(b[0], "ja"));
    mainMakers ??= sorted.filter(([m]) => m).slice(0, 4).map(([m]) => m);
    // 前回選んだボタンが今回の上位4つに無ければ外す
    if (pickedMain && !mainMakers.includes(pickedMain)) pickedMain = "";
    $("mainMakers").replaceChildren(
      ...mainMakers.map((m) => {
        const b = document.createElement("button");
        b.type = "button";
        b.dataset.maker = m;
        b.setAttribute("aria-pressed", String(pickedMain === m));
        b.append(m);
        const n = document.createElement("span");
        n.textContent = counts.get(m) ?? 0;
        b.append(n);
        return b;
      }),
    );
    $("mainMakers").hidden = mainMakers.length === 0;
    // 分類を取れなかったとき（Supabase の失敗など）は、全部消えてしまうので公演型の絞り込みを使えなくする
    $("onsite").disabled = onsiteOf.size === 0;
    if ($("onsite").disabled) $("onsite").checked = false;
    const opts = sorted
      .filter(([m]) => !mainMakers.includes(m))
      .map(([m, n]) => new Option(`${m || "不明"}（${n}）`, m || "-"));
    sel.replaceChildren(new Option(mainMakers.length ? "その他のレーベル" : "レーベル: すべて", ""), ...opts);
    sel.value = [...sel.options].some((o) => o.value === current) ? current : "";
  };
  // 2語以上で検索したことがあるか。ナゾヒロバのページの localStorage に1件だけ残す（使えなければ毎回出す）
  const AND_USED_KEY = "nazokatsuViewerAndUsed";
  const andUsed = () => {
    try {
      return localStorage.getItem(AND_USED_KEY) === "1";
    } catch {
      return false;
    }
  };
  const rememberAndUsed = () => {
    try {
      localStorage.setItem(AND_USED_KEY, "1");
    } catch {}
  };
  // 並び替えと絞り込みは、次に開いたときに戻せるようナゾヒロバのページの localStorage に残す（検索語は残さない）
  const PREFS_KEY = "nazokatsuViewerPrefs";
  const loadPrefs = () => {
    try {
      return JSON.parse(localStorage.getItem(PREFS_KEY) ?? "null") ?? {};
    } catch {
      return {};
    }
  };
  const savePrefs = () => {
    try {
      const checks = Object.fromEntries(FILTER_CHECKS.filter((id) => $(id).checked).map((id) => [id, true]));
      localStorage.setItem(PREFS_KEY, JSON.stringify({ sort: $("sort").value, result: $("result").value, maker: $("maker").value, pickedMain, checks }));
    } catch {}
  };
  // 「条件をクリア」で戻すもの。並び替えと検索欄はそのまま
  const FILTER_CHECKS = ["onsite", "priv", "withReview", "noDate", "noRating", "memoOnly"];
  const activeChecks = () => FILTER_CHECKS.filter((id) => $(id).checked && (id !== "memoOnly" || memoState === "ok"));
  const clearFilters = () => {
    $("result").value = "";
    $("maker").value = "";
    pickedMain = "";
    for (const id of FILTER_CHECKS) $(id).checked = false;
    render();
  };
  const render = () => {
    fillMakers();
    const words = $("q").value.trim().split(/\s+/).filter(Boolean);
    const lower = words.map((w) => w.toLowerCase());
    const result = $("result").value;
    const maker = pickedMain || $("maker").value;
    const onsiteOnly = $("onsite").checked;
    const rows = data
      .filter((r) => {
        const hay = `${r.title}\n${r.maker}\n${labelsOfItem(r).join("\n")}\n${r.review}\n${memoOf(r)}`.toLowerCase();
        if (!lower.every((w) => hay.includes(w))) return false;
        if (result === "-" ? r.result !== "" : result && r.result !== result) return false;
        if (maker && (maker === "-" ? r.maker !== "" : !labelsOfItem(r).includes(maker))) return false;
        if (onsiteOnly && r.onsite === false) return false;
        if ($("priv").checked && !r.isPrivate) return false;
        if ($("withReview").checked && !r.review) return false;
        if ($("noDate").checked && r.playDate) return false;
        if ($("noRating").checked && r.satisfaction !== "" && r.difficulty !== "" && r.minutes !== "") return false;
        if (memoState === "ok" && $("memoOnly").checked && !memoOf(r)) return false;
        return true;
      })
      .sort(sorters[$("sort").value]);
    // 2語以上のときは、すべての語を含むもの（AND）に絞っていることを件数の行で言葉にする。
    // スマホで2行に折り返さないよう、その間は取得時刻を省く
    $("count").textContent =
      words.length > 1
        ? `${words.map((w) => `「${w}」`).join("")}をすべて含む ${rows.length} / ${data.length} 件`
        : `${rows.length} / ${data.length} 件`;
    $("fetchedAt").textContent = fetchedAt ? `${fetchedAt.toLocaleTimeString("ja-JP")} に取得（${data.length}件）` : "";
    if (words.length > 1) rememberAndUsed();
    // スマホで絞り込みを畳んでいても、効いている条件の数が分かるようにする
    $("memoOnlyChip").hidden = memoState !== "ok";
    const active = [result !== "", maker !== ""].filter(Boolean).length + activeChecks().length;
    $("clear").hidden = active === 0;
    savePrefs();
    $("toggle").textContent = active ? `絞り込み(${active})` : "絞り込み";
    $("toggle").classList.toggle("on", active > 0);
    if (rows.length) $("list").replaceChildren(...rows.map((r) => card(r, words)));
    else {
      // 0件のときは、何も出ないのではなく理由と戻し方を出す
      const box = document.createElement("div");
      box.className = "empty";
      const p = document.createElement("p");
      p.textContent = data.length ? "条件に合うナゾ活はありません" : "ナゾ活がまだありません";
      box.append(p);
      const btn = (text, onClick) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "clear";
        b.textContent = text;
        b.addEventListener("click", onClick);
        box.append(b);
      };
      if (active) btn("条件をクリア", clearFilters);
      if (words.length) {
        btn("検索を消す", () => {
          $("q").value = "";
          render();
        });
      }
      $("list").replaceChildren(box);
    }
    markLong(words.length > 0);
  };
  for (const id of ["q", "sort", "result", ...FILTER_CHECKS]) $(id).addEventListener("input", render);
  $("clear").addEventListener("click", clearFilters);
  {
    const prefs = loadPrefs();
    if (prefs.sort && sorters[prefs.sort]) $("sort").value = prefs.sort;
    if ([...$("result").options].some((o) => o.value === prefs.result)) $("result").value = prefs.result;
    restoreMaker = typeof prefs.maker === "string" ? prefs.maker : null;
    pickedMain = typeof prefs.pickedMain === "string" ? prefs.pickedMain : "";
    for (const id of FILTER_CHECKS) $(id).checked = prefs.checks?.[id] === true;
  }
  // メモ用のトークンを端末ごとに入れる。空にすると消す。入れたら読み直して一覧に反映する
  $("memoSet").addEventListener("click", async () => {
    setMenu(false);
    const has = !!memoToken();
    const input = await dialog({
      title: "メモの設定",
      message: has
        ? "トークンは設定済みです。入れ直すときは貼ってください。空のまま保存すると、この端末から消します。"
        : "nazokatsu-memos だけを読み書きできる GitHub の fine-grained トークンを貼ってください。",
      input: { type: "password", placeholder: "github_pat_…" },
      ok: "保存",
    });
    if (input === null) return;
    try {
      if (input.trim()) localStorage.setItem(MEMO_TOKEN_KEY, input.trim());
      else localStorage.removeItem(MEMO_TOKEN_KEY);
    } catch {
      return notify("この端末ではトークンを保存できません（ブラウザの保存が無効になっています）");
    }
    memoEditingId = null;
    await loadMemos();
    render();
    if (memoProblem) notify(memoProblem, "メモを読み込めません");
    else toast(memoState === "ok" ? `メモを読み込みました（${Object.keys(memos).length}件）` : "この端末からトークンを消しました");
  });
  // ボタンとセレクトボックスはどちらか一方だけ効かせる。押し中のボタンをもう一度押すと解除
  $("maker").addEventListener("input", () => {
    pickedMain = "";
    render();
  });
  $("mainMakers").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    pickedMain = pickedMain === b.dataset.maker ? "" : b.dataset.maker;
    $("maker").value = "";
    render();
  });
  // 検索欄が空のまま選ばれているときだけ、スペース区切りで絞り込めることを吹き出しで出す。
  // 打ち始めるか欄から離れると消える。一度2語以上で検索したら、知っているとみなして出さない
  const syncHint = () => {
    $("qhint").hidden = !(root.activeElement === $("q") && !$("q").value && !andUsed());
  };
  for (const type of ["focus", "blur", "input"]) $("q").addEventListener(type, syncHint);
  // 幅640px以下（スマホ）では絞り込み条件を畳み、一覧を広く見せる。PCでは常に表示（ボタンも出ない）
  $("toggle").addEventListener("click", () => {
    const bar = root.querySelector(".bar");
    bar.classList.toggle("show");
    $("toggle").setAttribute("aria-expanded", String(bar.classList.contains("show")));
  });
  render();
  if (memoProblem) toast(memoProblem);
})().catch((e) => alert("エラー: " + e.message));
