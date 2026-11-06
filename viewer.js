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
.root{--bg:#f3f4f7;--card:#fff;--text:#1f2328;--sub:#667085;--line:#e0e3e8;--accent:#2457b8;--on:#fff;--chip:#eceff4;min-height:100%;background:var(--bg);color:var(--text);font-family:-apple-system,"Hiragino Sans",sans-serif}
@media (prefers-color-scheme:dark){.root{--bg:#15171b;--card:#1f2228;--text:#e8eaed;--sub:#9aa3b0;--line:#323741;--accent:#7aa7ff;--on:#10131a;--chip:#2a2e36}}
.top{position:sticky;top:0;z-index:3;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;background:var(--card);border-bottom:1px solid var(--line)}
.top h1{margin:0;font-size:18px}
#close{min-height:48px;padding:0 22px;font-size:18px;font-weight:700;border:0;border-radius:10px;background:var(--accent);color:var(--on)}
.wrap{max-width:820px;margin:0 auto;padding:0 12px 40px}
.bar{position:sticky;top:69px;z-index:2;background:var(--bg);padding:10px 0 8px}
#q{width:100%;height:46px;padding:0 14px;font-size:16px;border:1px solid var(--line);border-radius:10px;background:var(--card);color:var(--text)}
.filters{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
.filters select{height:38px;font-size:14px;padding:0 8px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--text)}
.chip{display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 12px;font-size:14px;border:1px solid var(--line);border-radius:19px;background:var(--card)}
#count{font-size:13px;color:var(--sub);margin:6px 2px 10px}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin-bottom:10px}
.card h2{font-size:16px;line-height:1.4;margin:0 0 8px}
.card h2 a{color:var(--accent);text-decoration:none}
.meta{display:flex;flex-wrap:wrap;gap:6px}
.tag{font-size:12px;padding:2px 8px;border-radius:999px;background:var(--chip);color:var(--sub)}
.tag.star{color:#b7791f;font-weight:700}
.tag.ok{background:#d9f2e1;color:#14663a}
.tag.ng{background:#fde0e0;color:#a12a2a}
.tag.priv{background:#e4e0f5;color:#4b3a9a}
.tag.spoil{background:#ffe9cc;color:#9a5a00}
.review{white-space:pre-wrap;margin:10px 0 0;font-size:15px;line-height:1.6;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}
.card.open .review{display:block;-webkit-line-clamp:unset}
.card.long{cursor:pointer}
.card.long::after{content:"タップで全文を表示";display:block;margin-top:6px;font-size:12px;color:var(--sub)}
.card.long.open::after{content:"タップで折りたたむ"}
.head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
button,select,.chip{cursor:pointer}
button:hover{filter:brightness(.93)}
button:disabled,select:disabled{cursor:wait;opacity:.6}
.save.busy::before{content:"";display:inline-block;width:14px;height:14px;margin-right:8px;border:2px solid currentColor;border-top-color:transparent;border-radius:50%;animation:s 1s linear infinite;vertical-align:-2px}
.card.editing{position:relative}
.saving{position:absolute;inset:0;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;border-radius:12px;background:rgba(255,255,255,.85);background:color-mix(in srgb,var(--card) 82%,transparent);font-size:16px;font-weight:700}
.saving[hidden]{display:none}
.saving .spin{margin:0}
.head h2{flex:1}
.edit-btn{flex:none;height:36px;padding:0 14px;font-size:14px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--accent)}
.edit{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px}
.edit label{display:flex;flex-direction:column;gap:4px;font-size:12px;color:var(--sub)}
.edit input[type=date],.edit select,.edit textarea{font-size:16px;padding:8px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--text)}
.edit label.chk{flex-direction:row;align-items:center;gap:8px;font-size:15px;color:var(--text)}
.edit .wide{grid-column:1/-1}
.edit textarea{min-height:160px;line-height:1.5}
.edit .actions{grid-column:1/-1;display:flex;gap:10px}
.edit .actions button{flex:1;height:46px;font-size:16px;border-radius:10px;border:1px solid var(--line);background:var(--card);color:var(--text)}
.edit .actions .save{background:var(--accent);color:var(--on);border:0;font-weight:700}
#toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);max-width:90%;padding:10px 16px;border-radius:10px;background:#222;color:#fff;font-size:14px;z-index:9}
mark{background:#ffe96b;color:#222;border-radius:2px}
.loading{text-align:center;margin-top:30vh;font-size:16px;color:var(--sub)}
.spin{width:40px;height:40px;margin:0 auto 14px;border:4px solid var(--line);border-top-color:var(--accent);border-radius:50%;animation:s 1s linear infinite}
@keyframes s{to{transform:rotate(360deg)}}
</style>
<div class="root">
<div class="top"><h1>自分のナゾ活</h1><button id="close">✕ 閉じる</button></div>
<div id="main"><div class="loading"><div class="spin"></div>ナゾ活を取得中…</div></div>
<div id="toast" hidden></div>
</div>`;
  const $ = (id) => root.getElementById(id);
  const close = () => {
    host.remove();
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKey);
  };
  const onKey = (e) => e.key === "Escape" && close();
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
  const toItem = (r) => ({
    id: r.id,
    mysteryId: r.mysteryId ?? "",
    title: r.mysteryTitle ?? "",
    playDate: (r.playDate ?? "").slice(0, 10),
    satisfaction: r.satisfactionRating ?? "",
    difficulty: r.difficultyRating ?? "",
    minutes: r.actualPlayTimeMinutes ?? "",
    result: r.isSuccess === true ? "成功" : r.isSuccess === false ? "失敗" : "",
    isPrivate: r.isPrivate === true,
    spoiler: r.containsSpoiler === true,
    review: (r.review ?? "").replaceAll("\r\n", "\n"),
  });
  const fetchAll = async (auth) => {
    const all = [];
    for (let page = 1; ; page++) {
      const res = await fetch(`/api/v2/reviews/my?uid=${encodeURIComponent(auth.uid)}&page=${page}&pageSize=200`, {
        headers: auth.headers,
      });
      if (!res.ok) throw new Error(`取得に失敗しました（${res.status}）`);
      const j = await res.json();
      all.push(...j.reviews);
      if (all.length >= j.count || j.reviews.length === 0) return all.map(toItem);
    }
  };
  let data;
  try {
    data = await fetchAll(await getAuth());
  } catch (e) {
    return fail(e.message);
  }
  if (!host.isConnected) return;

  $("main").innerHTML = `<div class="wrap">
<div class="bar">
  <input id="q" type="search" placeholder="作品名・感想を検索（スペースでAND）">
  <div class="filters">
    <select id="sort">
      <option value="date-desc">参加日 新しい順</option>
      <option value="date-asc">参加日 古い順</option>
      <option value="sat-desc">満足度 高い順</option>
      <option value="sat-asc">満足度 低い順</option>
      <option value="title">作品名順</option>
    </select>
    <select id="result">
      <option value="">成功/失敗: すべて</option>
      <option value="成功">成功</option>
      <option value="失敗">失敗</option>
      <option value="-">未設定</option>
    </select>
    <label class="chip"><input id="priv" type="checkbox">非公開のみ</label>
    <label class="chip"><input id="withReview" type="checkbox">感想ありのみ</label>
  </div>
</div>
<div id="count"></div>
<div id="list"></div>
</div>`;
  const num = (s) => (s === "" ? -1 : Number(s));
  const sorters = {
    "date-desc": (a, b) => b.playDate.localeCompare(a.playDate),
    "date-asc": (a, b) => a.playDate.localeCompare(b.playDate),
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
    if (!next.playDate) return alert("参加日は空にできません");
    const lines = changes.map(([k, label]) => `${label}: ${show(r[k])} → ${show(next[k])}`);
    const warn = changes.some(([k]) => k === "isPrivate") ? "\n※公開範囲が変わります" : "";
    if (!confirm(`「${r.title}」のナゾ活を更新します\n\n${lines.join("\n")}${warn}\n\nよろしいですか？`)) return;
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
    if (bad.length) alert(`更新後の値が期待と違います: ${bad.map(([, l]) => l).join("、")}`);
    else toast(`更新しました（${changes.map(([, l]) => l).join("、")}）`);
  };
  const options = (list, current) => {
    const items = current !== "" && !list.some(([v]) => String(v) === String(current)) ? [...list, [current, current]] : list;
    return items.map(([v, l]) => `<option value="${v}">${l}</option>`).join("");
  };
  const minuteLabel = (m) => (m < 60 ? `${m}分` : `${Math.floor(m / 60)}時間${m % 60 ? `${m % 60}分` : ""}`);
  const editCard = (r) => {
    const el = document.createElement("article");
    el.className = "card editing";
    const h = document.createElement("h2");
    h.textContent = `編集: ${r.title}`;
    const form = document.createElement("form");
    form.className = "edit";
    const unset = ["", "未設定"];
    form.innerHTML = `
<label>参加日<input name="playDate" type="date" required></label>
<label>満足度<select name="satisfaction">${options([unset, ...Array.from({ length: 9 }, (_, i) => [1 + i * 0.5, 1 + i * 0.5])], r.satisfaction)}</select></label>
<label>難易度<select name="difficulty">${options([unset, ...[1, 2, 3, 4, 5].map((n) => [n, n])], r.difficulty)}</select></label>
<label>プレイ時間<select name="minutes">${options([unset, ...Array.from({ length: 48 }, (_, i) => [15 * (i + 1), minuteLabel(15 * (i + 1))])], r.minutes)}</select></label>
<label>成功/失敗<select name="result"><option value="">未設定</option><option>成功</option><option>失敗</option></select></label>
<label class="chk"><input name="isPrivate" type="checkbox">非公開</label>
<label class="chk"><input name="spoiler" type="checkbox">ネタバレあり</label>
<label class="wide">感想（5000字まで）<textarea name="review" maxlength="5000"></textarea></label>
<div class="actions"><button type="submit" class="save">保存</button><button type="button" class="cancel">キャンセル</button></div>
<div class="saving" hidden><div class="spin"></div><span></span></div>`;
    const f = form.elements;
    f.playDate.value = r.playDate;
    f.satisfaction.value = String(r.satisfaction);
    f.difficulty.value = String(r.difficulty);
    f.minutes.value = String(r.minutes);
    f.result.value = r.result;
    f.isPrivate.checked = r.isPrivate;
    f.spoiler.checked = r.spoiler;
    f.review.value = r.review;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const saveBtn = form.querySelector(".save");
      const overlay = form.querySelector(".saving");
      const setBusy = (on, text = "") => {
        for (const c of form.querySelectorAll("input,select,textarea,button")) c.disabled = on;
        saveBtn.classList.toggle("busy", on);
        saveBtn.textContent = on ? "保存中…" : "保存";
        overlay.hidden = !on;
        overlay.querySelector("span").textContent = text;
      };
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
        alert(err.message);
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
  const card = (r, words) => {
    if (r.id === editingId) return editCard(r);
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
      render();
      $("list").querySelector(".editing")?.scrollIntoView({ block: "nearest" });
    });
    head.append(h, editBtn);
    const meta = document.createElement("div");
    meta.className = "meta";
    const tag = (text, cls = "") => {
      const s = document.createElement("span");
      s.className = `tag ${cls}`;
      s.textContent = text;
      meta.append(s);
    };
    if (r.playDate) tag(r.playDate);
    if (r.satisfaction !== "") tag(`★ ${r.satisfaction}`, "star");
    if (r.difficulty !== "") tag(`難易度 ${r.difficulty}`);
    if (r.minutes !== "") tag(`${r.minutes}分`);
    if (r.result) tag(r.result, r.result === "成功" ? "ok" : "ng");
    if (r.isPrivate) tag("非公開", "priv");
    if (r.spoiler) tag("ネタバレ", "spoil");
    el.append(head, meta);
    if (r.review) {
      const p = document.createElement("p");
      p.className = "review";
      highlight(p, r.review, words);
      el.append(p);
      if (r.review.length > 90 || r.review.includes("\n")) {
        el.classList.add("long");
        // 検索中はヒット箇所が隠れないよう最初から全文を開く
        if (words.length) el.classList.add("open");
        el.addEventListener("click", (e) => {
          if (!e.target.closest("a, button")) el.classList.toggle("open");
        });
      }
    }
    return el;
  };
  const render = () => {
    const words = $("q").value.trim().split(/\s+/).filter(Boolean);
    const lower = words.map((w) => w.toLowerCase());
    const result = $("result").value;
    const rows = data
      .filter((r) => {
        const hay = `${r.title}\n${r.review}`.toLowerCase();
        if (!lower.every((w) => hay.includes(w))) return false;
        if (result === "-" ? r.result !== "" : result && r.result !== result) return false;
        if ($("priv").checked && !r.isPrivate) return false;
        if ($("withReview").checked && !r.review) return false;
        return true;
      })
      .sort(sorters[$("sort").value]);
    $("count").textContent = `${rows.length} / ${data.length} 件（取得 ${new Date().toLocaleTimeString("ja-JP")}）`;
    $("list").replaceChildren(...rows.map((r) => card(r, words)));
  };
  for (const id of ["q", "sort", "result", "priv", "withReview"]) $(id).addEventListener("input", render);
  render();
})().catch((e) => alert("エラー: " + e.message));
