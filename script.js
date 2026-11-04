var EMAIL = "hello@mau.lol";
var INVITE = "https://discord.com/oauth2/authorize?client_id=1507540455749980230&permissions=32&integration_type=0&scope=bot";
var WALLETS = [
  { n: "usdt", a: "0x07640963d6ae5de7f785f865fdce4f2659cfbf52" },
  { n: "btc", a: "16gN1aaEVhTqr2njsYyD3nzmusBcypEc7h" }
];

function walletsHtml() {
  return '<ul>' + WALLETS.map(function (w) {
    return '<li><span class="addr">' + esc(w.a) + '</span></li>';
  }).join('') + '</ul>' +
  '<p class="links" style="margin-top:28px">' + WALLETS.map(function (w, i) {
    return '<a href="#p2p" class="cp" data-i="' + i + '">' + w.n + '</a>';
  }).join('') + '</p>';
}

function copyText(t) {
  function fallback() {
    var ta = document.createElement("textarea");
    ta.value = t; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    ta.remove();
  }
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).catch(fallback);
  else fallback();
}

var COW = [
  " -----------",
  "< meow meow >",
  " -----------",
  "       \\",
  "        \\",
  "         ╱|、",
  "         (˚ˎ 。7",
  "         |、˜〵",
  "         じしˍ,)ノ"
].join("\n");

var lang = "en";
try {
  var saved = localStorage.getItem("lang");
  if (saved === "es" || saved === "en") lang = saved;
} catch (e) {}

var I18N = {
  en: {
    who1: "i’m mau, a backend development enthusiast. i work with java and kotlin, and i have experience with databases like mongodb, redis, mysql and postgresql, i build apis, attend meetups and meet new people.",
    who2: "i also write notes and articles about my projects on this blog, you can find them in their respective sections, and i like clean code.",
    address: "address",
    welcome: "Welcome back!",
    whoNav: "/who",
    projsNav: "/projs",
    projs: "projs",
    invite: "invite",
    wings: "a multifunctional discord bot with built-in artificial intelligence that moderates the server it’s in. it tracks argentine inflation in real time, has its own channel where it chats with anyone who talks to it, replies with up-to-date data, and collects and stores data only when the user authorizes it.",
    copied: "copied!",
    foot: 'meet <a href="#who">me</a>'
  },
  es: {
    who1: "soy mau, entusiasta del desarrollo backend. trabajo con java y kotlin, y tengo experiencia con bases de datos como mongodb, redis, mysql y postgresql, construyo apis, voy a meetups y conozco gente nueva.",
    who2: "también escribo notas y artículos sobre mis proyectos en este blog, puedes encontrarlos en sus secciones, y me gusta el código limpio.",
    address: "direcciones",
    welcome: "Bienvenido de nuevo!",
    whoNav: "/quien",
    projsNav: "/proyectos",
    projs: "proyectos",
    invite: "invitar",
    wings: "un bot de discord multifuncional con inteligencia artificial incorporada que modera el servidor en el que esté. trackea la inflación argentina en tiempo real, tiene su propio canal donde chatea con quien le hable, responde con datos actualizados y recopila y guarda datos solo si el usuario lo autoriza.",
    copied: "¡copiado!",
    foot: 'conóce<a href="#who">me</a>'
  }
};

function tr(s) {
  return s.replace(/\{\{(\w+)\}\}/g, function (_, k) { return I18N[lang][k]; });
}

var PROMPT = "root@mau:~#";
var TZ = "America/Argentina/Buenos_Aires";
var D = 0.4, SP = 0.07, HOLD = 1.5, WAIT = 30; // segundos: pausa inicial, velocidad, pausa final, espera del clima
var T0 = Date.now(), wx = null, wStart = 0;
var REDUCED = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

// Descripciones del clima (códigos WMO de Open-Meteo): [inglés, español]
var WXD = {
  0: ["clear sky", "despejado"], 1: ["mainly clear", "mayormente despejado"],
  2: ["partly cloudy", "parcialmente nublado"], 3: ["overcast", "nublado"],
  45: ["fog", "niebla"], 48: ["fog", "niebla"],
  51: ["drizzle", "llovizna"], 53: ["drizzle", "llovizna"], 55: ["drizzle", "llovizna"],
  56: ["freezing drizzle", "llovizna helada"], 57: ["freezing drizzle", "llovizna helada"],
  61: ["rain", "lluvia"], 63: ["rain", "lluvia"], 65: ["rain", "lluvia"],
  66: ["freezing rain", "lluvia helada"], 67: ["freezing rain", "lluvia helada"],
  71: ["snow", "nieve"], 73: ["snow", "nieve"], 75: ["snow", "nieve"], 77: ["snow", "nieve"],
  80: ["rain showers", "chubascos"], 81: ["rain showers", "chubascos"], 82: ["rain showers", "chubascos"],
  85: ["snow showers", "chubascos de nieve"], 86: ["snow showers", "chubascos de nieve"],
  95: ["thunderstorm", "tormenta"], 96: ["thunderstorm", "tormenta"], 99: ["thunderstorm", "tormenta"]
};

function wxDesc(c) {
  var d = WXD[c];
  return d ? d[lang === "es" ? 1 : 0] : "";
}

function hhmm() {
  try {
    return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: TZ }).format(new Date());
  } catch (e) {
    var d = new Date();
    return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
  }
}

function fetchWx() {
  fetch("https://api.open-meteo.com/v1/forecast?latitude=-34.92&longitude=-57.95&current=temperature_2m,weather_code")
    .then(function (r) { return r.json(); })
    .then(function (j) {
      if (j && j.current) wx = { t: Math.round(j.current.temperature_2m), c: j.current.weather_code };
    })
    .catch(function () {});
}
if (window.fetch) {
  fetchWx();
  setInterval(fetchWx, 600000);
}

function partial(text, t) {
  var n = Math.floor((t - D) / SP);
  return n <= 0 ? "" : text.slice(0, n);
}

function paint() {
  var h = document.getElementById("hd");
  if (!h) return;
  if (!h.__n) {
    h.textContent = "";
    h.setAttribute("aria-label", PROMPT);
    h.__n = document.createTextNode(PROMPT + " ");
    h.__c = document.createElement("span");
    h.__c.className = "cursor";
    h.__c.textContent = "_";
    h.appendChild(h.__n);
    h.appendChild(h.__c);
  }
  var now = (Date.now() - T0) / 1000, txt = "", cur = false;
  var welcome = I18N[lang].welcome;
  var ew = REDUCED ? 0 : D + welcome.length * SP + HOLD; // fin de la bienvenida
  var place = "La Plata: " + hhmm();
  if (now < ew) {
    txt = partial(welcome, now);
    cur = true;
  } else if (!(now >= ew + WAIT && wx)) {
    txt = REDUCED ? place : partial(place, now - ew);
    cur = !REDUCED && txt.length < place.length;
  } else {
    if (!wStart) wStart = now;
    var w = "La Plata: " + wx.t + "\u00b0C, " + wxDesc(wx.c);
    txt = REDUCED ? w : partial(w, now - wStart);
    cur = !REDUCED && txt.length < w.length;
  }
  var v = PROMPT + " " + txt;
  if (h.__n.nodeValue !== v) h.__n.nodeValue = v;
  var disp = cur ? "" : "none";
  if (h.__c.style.display !== disp) h.__c.style.display = disp;
}

function typeHome(key) {
  if (key === "") paint();
}

setInterval(paint, 70);

var routes = {
  "": {
    title: "mau.lol",
    html: '<h1 id="hd">root@mau:~#</h1><div class="cow"><pre>' + esc(COW) + '</pre></div>'
  },
  projs: {
    title: "/projs",
    html: '<h1>{{projs}}</h1><h2>wings</h2><p>{{wings}}</p>' +
          '<p class="links"><a href="#projs" class="inv">{{invite}}</a></p>'
  },
  who: {
    title: "/who",
    html: '<h1>who</h1>' +
          '<p>{{who1}}</p>' +
          '<p>{{who2}}</p>' +
          '<p class="links">' +
          '<a href="https://x.com/" target="_blank" rel="noopener">x</a>' +
          '<a href="https://discord.com/" target="_blank" rel="noopener">discord</a>' +
          '<a href="https://github.com/" target="_blank" rel="noopener">github</a>' +
          '</p>'
  },
  p2p: {
    title: "/p2p",
    html: '<h1>p2p</h1>' +
          '<p>e-mail: <a href="mailto:' + EMAIL + '">' + EMAIL + '</a></p>' +
          '<h2>{{address}}</h2>' + walletsHtml()
  }
};

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function render() {
  var key = location.hash.replace(/^#/, "");
  if (!routes.hasOwnProperty(key)) key = "";
  var r = routes[key];
  document.getElementById("app").innerHTML = tr(r.html);
  document.getElementById("foot").innerHTML = I18N[lang].foot;
  document.documentElement.lang = lang;
  document.querySelectorAll("#nav [data-l]").forEach(function (a) {
    a.classList.toggle("on", a.dataset.l === lang);
  });
  document.querySelector('#nav [data-r="who"]').textContent = I18N[lang].whoNav;
  document.querySelector('#nav [data-r="projs"]').textContent = I18N[lang].projsNav;
  var label = key === "who" ? I18N[lang].whoNav : key === "projs" ? I18N[lang].projsNav : r.title;
  document.title = key === "" ? r.title : "mau.lol - " + label;
  document.querySelectorAll("#nav a").forEach(function (a) {
    if (a.dataset.r === key) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  document.querySelectorAll(".cp").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var w = WALLETS[a.dataset.i];
      copyText(w.a);
      a.textContent = I18N[lang].copied;
      setTimeout(function () { a.textContent = w.n; }, 1500);
    });
  });
  document.querySelectorAll(".inv").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      copyText(INVITE);
      a.textContent = I18N[lang].copied;
      setTimeout(function () { a.textContent = I18N[lang].invite; }, 1500);
    });
  });
  typeHome(key);
  window.scrollTo(0, 0);
}

document.querySelectorAll("[data-l]").forEach(function (a) {
  a.addEventListener("click", function (e) {
    e.preventDefault();
    lang = a.dataset.l;
    try { localStorage.setItem("lang", lang); } catch (err) {}
    render();
  });
});
window.addEventListener("hashchange", render);
render();

// Nieve suave dentro del cuadrante (.wrap)
(function () {
  var wrap = document.querySelector(".wrap");
  if (!wrap || !window.matchMedia) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var COUNT = 45; // cantidad de copos, bajalo o subilo a gusto
  var c = document.createElement("canvas");
  c.className = "snow";
  c.setAttribute("aria-hidden", "true");
  wrap.appendChild(c);
  var ctx = c.getContext("2d");
  if (!ctx) return;

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var w = 0, h = 0, flakes = [];

  function make(fromTop) {
    return {
      x: Math.random() * w,
      y: fromTop ? -4 : Math.random() * h,
      r: Math.random() * 1.3 + 0.6,
      v: Math.random() * 0.3 + 0.2,
      d: Math.random() * Math.PI * 2,
      s: Math.random() * 0.012 + 0.004,
      a: Math.random() * 0.3 + 0.2
    };
  }

  function size() {
    w = wrap.clientWidth;
    h = wrap.clientHeight;
    c.width = w * dpr;
    c.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!flakes.length) for (var i = 0; i < COUNT; i++) flakes.push(make(false));
    flakes.forEach(function (f) { if (f.x > w) f.x = Math.random() * w; });
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      f.y += f.v;
      f.d += f.s;
      f.x += Math.sin(f.d) * 0.25;
      if (f.y > h + 4) flakes[i] = f = make(true);
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255," + f.a + ")";
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }

  size();
  if (window.ResizeObserver) new ResizeObserver(size).observe(wrap);
  else window.addEventListener("resize", size);
  requestAnimationFrame(tick);
})();
