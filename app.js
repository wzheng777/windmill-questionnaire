(function () {
  "use strict";
  var app = document.getElementById("app");
  var INDUSTRIES = window.WINDMILL_INDUSTRIES || [];
  var SETS = window.WINDMILL_SETS || {};
  var ANSWERS = ["Yes", "No", "Maybe"], PRIORITIES = ["Low", "Medium", "High"];
  var BUSINESS = [
    { id: "company", label: "Company name", type: "text", required: true },
    { id: "contact", label: "Contact name", type: "text", required: true },
    { id: "email", label: "Email", type: "email", required: true },
    { id: "phone", label: "Phone", type: "tel" },
    { id: "employees", label: "Number of employees", type: "number" },
    { id: "software", label: "Software you use today", type: "text" },
    { id: "timewaster", label: "What's the biggest time-waster in your week?", type: "textarea" }
  ];
  var set, state, key;

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function save() { try { localStorage.setItem(key, JSON.stringify(state)); } catch (e) {} }
  function load(id) {
    key = "windmill:" + id;
    var s = null; try { s = JSON.parse(localStorage.getItem(key)); } catch (e) {}
    state = s && s.items ? s : { step: 0, items: {}, business: {} };
  }
  function getParam() { return new URLSearchParams(location.search).get("industry"); }

  function renderPicker(msg) {
    var h = '<h1>What can AI take off your plate?</h1><p class="muted">A short checklist for busy owners. Pick your type of business to start. Takes about 10 minutes.</p>';
    if (msg) h += '<div class="alert err">' + esc(msg) + "</div>";
    h += '<div class="grid">' + INDUSTRIES.map(function (i) {
      return i.active && SETS[i.id]
        ? '<a class="tile active" href="?industry=' + encodeURIComponent(i.id) + '">' + esc(i.name) + "<small>Start →</small></a>"
        : '<div class="tile soon" aria-disabled="true">' + esc(i.name) + "<small>Coming soon</small></div>";
    }).join("") + "</div>";
    app.innerHTML = h;
  }

  function totalSteps() { return set.groups.length + 2; } // groups + business + summary
  function progress() { return '<div class="progress"><div style="width:' + Math.round((state.step + 1) / totalSteps() * 100) + '%"></div></div><p class="muted">Step ' + (state.step + 1) + " of " + totalSteps() + "</p>"; }
  function seg(name, opts, val, label) {
    return '<div class="row"><span class="lbl">' + label + '</span><div class="seg" role="radiogroup" aria-label="' + label + '">' + opts.map(function (o) {
      return '<label><input type="radio" name="' + name + '" value="' + o + '"' + (val === o ? " checked" : "") + "><span>" + o + "</span></label>";
    }).join("") + "</div></div>";
  }
  function nav(nextLabel) {
    return '<div class="nav"><button type="button" class="secondary" data-act="back">← Back</button><button type="button" data-act="next">' + (nextLabel || "Next →") + "</button></div>";
  }

  function render() {
    var s = state.step, h = progress();
    if (s < set.groups.length) {
      var g = set.groups[s];
      if (s === 0) h += '<p class="muted">' + esc(set.intro) + "</p>";
      h += "<h1>" + esc(g.title) + '</h1><p class="muted">Would this help you? Pick Yes, No or Maybe, and how much it matters.</p>';
      g.items.forEach(function (it) {
        var a = state.items[it.id] || {};
        h += '<div class="item" data-item="' + it.id + '"><p>' + esc(it.label) + "</p>" +
          seg(it.id + "__answer", ANSWERS, a.answer, "Want it?") + seg(it.id + "__priority", PRIORITIES, a.priority, "Priority") +
          '<textarea name="' + it.id + '__notes" placeholder="Notes (optional)" rows="1">' + esc(a.notes) + "</textarea></div>";
      });
      h += nav();
    } else if (s === set.groups.length) {
      h += '<h1>About your business</h1><form id="biz" novalidate>' + BUSINESS.map(function (f) {
        var v = esc(state.business[f.id]), lab = '<label for="b_' + f.id + '">' + esc(f.label) + (f.required ? ' <span class="req">*</span>' : "") + "</label>";
        return '<div class="field">' + lab + (f.type === "textarea"
          ? '<textarea id="b_' + f.id + '" name="' + f.id + '" rows="3">' + v + "</textarea>"
          : '<input id="b_' + f.id + '" name="' + f.id + '" type="' + f.type + '" value="' + v + '"' + (f.required ? " required" : "") + (f.type === "number" ? ' min="0"' : "") + ">") + "</div>";
      }).join("") + '</form><div id="bizerr"></div>' + nav("Review →");
    } else {
      h += "<h1>Review your answers</h1>";
      set.groups.forEach(function (g) {
        var picks = g.items.filter(function (it) { return state.items[it.id] && state.items[it.id].answer; });
        h += "<h2>" + esc(g.title) + "</h2>" + (picks.length ? '<ul class="summary">' + picks.map(function (it) {
          var a = state.items[it.id];
          return "<li><strong>" + esc(a.answer) + "</strong>" + (a.priority ? " (" + esc(a.priority) + ")" : "") + " — " + esc(it.label) + (a.notes ? '<br><span class="muted">' + esc(a.notes) + "</span>" : "") + "</li>";
        }).join("") + "</ul>" : '<p class="muted">Nothing picked.</p>');
      });
      h += "<h2>Business</h2><ul class=\"summary\">" + BUSINESS.map(function (f) { return "<li><strong>" + esc(f.label) + ":</strong> " + (esc(state.business[f.id]) || '<span class="muted">—</span>') + "</li>"; }).join("") + "</ul>";
      h += '<div id="result"></div><div class="nav"><button type="button" class="secondary" data-act="back">← Edit</button><button type="button" data-act="submit">Send to Windmill</button></div>';
    }
    app.innerHTML = h;
    window.scrollTo(0, 0);
  }

  function flatten() {
    var p = { _subject: "Windmill needs assessment — " + (state.business.company || "Unknown company") + " (" + set.name + ")", industry: set.name };
    BUSINESS.forEach(function (f) { p[f.label] = state.business[f.id] || ""; });
    set.groups.forEach(function (g) {
      g.items.forEach(function (it) {
        var a = state.items[it.id] || {};
        p[g.title + " — " + it.label] = (a.answer || "No answer") + (a.priority ? " | Priority: " + a.priority : "") + (a.notes ? " | Notes: " + a.notes : "");
      });
    });
    if (state.business.email) p._replyto = state.business.email;
    return p;
  }

  function download(kind) {
    var p = flatten(), body, type;
    if (kind === "json") { body = JSON.stringify(p, null, 2); type = "application/json"; }
    else { body = Object.keys(p).map(function (k) { return k + ": " + p[k]; }).join("\n"); type = "text/plain"; }
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([body], { type: type }));
    a.download = "windmill-answers-" + (state.business.company || "answers").replace(/[^a-z0-9]+/gi, "-").toLowerCase() + "." + (kind === "json" ? "json" : "txt");
    document.body.appendChild(a); a.click(); a.remove();
  }

  function showError(msg) {
    document.getElementById("result").innerHTML = '<div class="alert err"><strong>Your answers were not sent.</strong> ' + esc(msg) +
      '<p>Your answers are still saved in this browser. You can try again, or download them and email the file to us.</p><div class="nav"><button type="button" class="secondary" data-act="dl-txt">Download my answers (text)</button><button type="button" class="secondary" data-act="dl-json">Download (JSON)</button></div></div>';
  }

  function submit(btn) {
    var endpoint = typeof FORMSPREE_ENDPOINT === "string" ? FORMSPREE_ENDPOINT.trim() : "";
    if (!endpoint) { showError("Online sending isn't set up yet (no form endpoint configured)."); return; }
    btn.disabled = true; btn.textContent = "Sending…";
    fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(flatten()) })
      .then(function (r) {
        if (!r.ok) return r.json().catch(function () { return {}; }).then(function (j) {
          throw new Error((j && j.errors && j.errors.map(function (e) { return e.message; }).join(", ")) || "The server replied with an error (" + r.status + ").");
        });
        state.submitted = new Date().toISOString(); save();
        app.innerHTML = '<div class="alert ok"><h1>Thank you!</h1><p>We got your answers and will be in touch soon.</p></div><button type="button" class="secondary" data-act="dl-txt">Download a copy</button> <button type="button" class="secondary" data-act="reset">Start over</button>';
      })
      .catch(function (e) { btn.disabled = false; btn.textContent = "Try again"; showError(e && e.message ? e.message : "Network error."); });
  }

  function validBiz() {
    var missing = BUSINESS.filter(function (f) { return f.required && !String(state.business[f.id] || "").trim(); });
    var em = state.business.email || "";
    var msg = missing.length ? "Please fill in: " + missing.map(function (f) { return f.label; }).join(", ") + "." : (!/^\S+@\S+\.\S+$/.test(em) ? "Please enter a valid email." : "");
    document.getElementById("bizerr").innerHTML = msg ? '<div class="alert err">' + esc(msg) + "</div>" : "";
    return !msg;
  }

  function onInput(e) {
    var t = e.target, n = t.name || "";
    if (!set || !n) return;
    if (t.closest("#biz")) state.business[n] = t.value;
    else { var parts = n.split("__"); if (parts.length === 2) { (state.items[parts[0]] = state.items[parts[0]] || {})[parts[1]] = t.value; } }
    save();
  }

  function onClick(e) {
    var b = e.target.closest("[data-act]"); if (!b) return;
    var act = b.getAttribute("data-act");
    if (act === "next") { if (state.step === set.groups.length && !validBiz()) return; state.step++; save(); render(); }
    else if (act === "back") { if (state.step === 0) { location.href = location.pathname; return; } state.step--; save(); render(); }
    else if (act === "submit") submit(b);
    else if (act === "dl-txt") download("txt");
    else if (act === "dl-json") download("json");
    else if (act === "reset") { localStorage.removeItem(key); load(set.id); render(); }
  }

  app.addEventListener("input", onInput);
  app.addEventListener("change", onInput);
  app.addEventListener("click", onClick);

  var id = getParam();
  if (!id) return renderPicker();
  var meta = INDUSTRIES.filter(function (i) { return i.id === id; })[0];
  if (!meta || !meta.active || !SETS[id]) return renderPicker(meta ? meta.name + " is coming soon." : "We don't have that industry yet.");
  set = SETS[id]; load(id);
  if (state.submitted) state.step = totalSteps() - 1;
  if (state.step >= totalSteps()) state.step = 0;
  render();
})();
