// ナゾヒロバの謎のページ（/mysteries/<作品ID>）を開いたとき、自分用メモがあれば右下に「自分用メモ」の目印を出し、押すと中身を見せる（読むだけ）。
// スマホの Firefox のユーザースクリプト（nazokatsu-button.user.js）から読み込む。配信は viewer.js と同じ GitHub Pages。
// メモとトークンはビューア（bookmarklet-reviews.mjs）と共通: 非公開リポジトリの memos.json と、localStorage の nazokatsuMemoToken。
// トークンが無い端末では何もしない。ナゾヒロバには何も送らない
(() => {
  if (window.__nazokatsuMemoBadge) return;
  window.__nazokatsuMemoBadge = true;
  const MEMO_API = "https://api.github.com/repos/hideo0sdmelt/nazokatsu-memos/contents/memos.json";
  const TOKEN_KEY = "nazokatsuMemoToken";
  const WORK_PATH = /^\/mysteries\/([A-Za-z0-9]{15,})\/?$/;
  // 謎のページを渡り歩くたびに取りに行かないよう、しばらくは読んだものを使う
  const CACHE_MS = 60 * 1000;
  const token = () => {
    try {
      return localStorage.getItem(TOKEN_KEY) ?? "";
    } catch {
      return "";
    }
  };
  let cache = null;
  let cachedAt = 0;
  const loadMemos = async () => {
    if (cache && Date.now() - cachedAt < CACHE_MS) return cache;
    const res = await fetch(MEMO_API, {
      cache: "no-store",
      headers: { authorization: `Bearer ${token()}`, accept: "application/vnd.github+json" },
    });
    if (res.status === 404) cache = {};
    else if (!res.ok) throw new Error(`メモの取得に失敗しました（${res.status}）`);
    else {
      const j = await res.json();
      const bytes = Uint8Array.from(atob((j.content ?? "").replace(/\s/g, "")), (c) => c.charCodeAt(0));
      cache = JSON.parse(new TextDecoder().decode(bytes) || "{}");
    }
    cachedAt = Date.now();
    return cache;
  };

  const host = document.createElement("div");
  host.id = "nazokatsu-memo-badge";
  const root = host.attachShadow({ mode: "open" });
  root.innerHTML = `<style>
*{box-sizing:border-box}
#badge{position:fixed;right:12px;bottom:136px;z-index:2147483646;padding:10px 14px;border-radius:22px;border:0;background:#4b3a9a;color:#fff;font-size:14px;font-family:-apple-system,"Hiragino Sans",sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.25)}
#panel{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:flex-end;justify-content:center;background:rgba(0,0,0,.45);font-family:-apple-system,"Hiragino Sans",sans-serif}
#panel[hidden],#badge[hidden]{display:none}
.sheet{width:100%;max-width:640px;max-height:80vh;overflow:auto;padding:14px 16px 20px;border-radius:14px 14px 0 0;background:#fff;color:#1f2328}
@media (prefers-color-scheme:dark){.sheet{background:#1f2228;color:#e8eaed}}
.head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
.head h2{margin:0;font-size:15px;line-height:1.4}
.label{font-size:12px;font-weight:700;color:#4b3a9a;margin-bottom:2px}
@media (prefers-color-scheme:dark){.label{color:#a99cf0}}
#close{flex:none;height:36px;padding:0 14px;font-size:14px;border:0;border-radius:8px;background:#2457b8;color:#fff}
#text{white-space:pre-wrap;margin:12px 0 0;font-size:15px;line-height:1.6}
</style>
<button id="badge" type="button" hidden>自分用メモ</button>
<div id="panel" hidden><div class="sheet"><div class="head"><div><div class="label">自分用メモ</div><h2 id="title"></h2></div><button id="close" type="button">閉じる</button></div><p id="text"></p></div></div>`;
  const $ = (id) => root.getElementById(id);
  let current = null;
  $("badge").addEventListener("click", () => {
    if (!current) return;
    $("title").textContent = current.title ?? "";
    $("text").textContent = current.text ?? "";
    $("panel").hidden = false;
  });
  $("close").addEventListener("click", () => ($("panel").hidden = true));
  $("panel").addEventListener("click", (e) => {
    if (e.target === $("panel")) $("panel").hidden = true;
  });

  // ナゾヒロバはページを読み直さずに画面を切り替えるため、URL の変化を見て出し直す
  let lastPath = null;
  const check = async () => {
    if (location.pathname === lastPath) return;
    lastPath = location.pathname;
    const id = WORK_PATH.exec(location.pathname)?.[1];
    current = null;
    $("badge").hidden = true;
    $("panel").hidden = true;
    if (!id || !token()) return;
    try {
      const memo = (await loadMemos())[id];
      // 取得中に別のページへ移っていたら出さない
      if (memo?.text && lastPath === location.pathname) {
        current = memo;
        $("badge").hidden = false;
      }
    } catch (e) {
      console.warn(e);
    }
  };
  document.body.append(host);
  check();
  setInterval(check, 1000);
})();
