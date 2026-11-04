// Cambia estos datos por los tuyos
var EMAIL = "hello@mau.lol";
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
    whoNav: "/who",
    projsNav: "/projs",
    projs: "projs",
    wings: "a multifunctional discord bot with built-in artificial intelligence that moderates the server it’s in. it tracks argentine inflation in real time, has its own channel where it chats with anyone who talks to it, replies with up-to-date data, and collects and stores data only when the user authorizes it.",
    copied: "copied!",
    foot: 'meet <a href="#who">me</a>'
  },
  es: {
    who1: "soy mau, entusiasta del desarrollo backend. trabajo con java y kotlin, y tengo experiencia con bases de datos como mongodb, redis, mysql y postgresql, construyo apis, voy a meetups y conozco gente nueva.",
    who2: "también escribo notas y artículos sobre mis proyectos en este blog, puedes encontrarlos en sus secciones, y me gusta el código limpio.",
    address: "direcciones",
    whoNav: "/quien",
    projsNav: "/proyectos",
    projs: "proyectos",
    wings: "un bot de discord multifuncional con inteligencia artificial incorporada que modera el servidor en el que esté. trackea la inflación argentina en tiempo real, tiene su propio canal donde chatea con quien le hable, responde con datos actualizados y recopila y guarda datos solo si el usuario lo autoriza.",
    copied: "¡copiado!",
    foot: 'conóce<a href="#who">me</a>'
  }
};

function tr(s) {
  return s.replace(/\{\{(\w+)\}\}/g, function (_, k) { return I18N[lang][k]; });
}

var routes = {
  "": {
    title: "mau.lol",
    html: '<h1>root@mau:~#</h1><div class="cow"><pre>' + esc(COW) + '</pre></div>'
  },
  projs: {
    title: "/projs",
    html: '<h1>{{projs}}</h1><h2>wings</h2><p>{{wings}}</p>'
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