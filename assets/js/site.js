(function () {
  "use strict";

  var doc = document;
  var calmo = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Ano do rodape ------------------------------------------- */
  var ano = doc.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();

  /* --- Menu no celular ------------------------------------------ */
  var topo = doc.getElementById("topo");
  var botaoMenu = doc.querySelector(".menu-btn");

  if (botaoMenu && topo) {
    botaoMenu.addEventListener("click", function () {
      var aberto = topo.classList.toggle("aberto");
      botaoMenu.setAttribute("aria-expanded", String(aberto));
      botaoMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    });

    topo.querySelectorAll(".nav a").forEach(function (link) {
      link.addEventListener("click", function () {
        topo.classList.remove("aberto");
        botaoMenu.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* --- Cabecalho ganha borda depois do topo --------------------- */
  var zap = doc.getElementById("zap");

  function aoRolar() {
    var y = window.scrollY;
    if (topo) topo.classList.toggle("encolhido", y > 12);
    if (zap) zap.classList.toggle("visivel", y > 520);
  }

  var agendado = false;
  window.addEventListener(
    "scroll",
    function () {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(function () {
        aoRolar();
        agendado = false;
      });
    },
    { passive: true }
  );
  aoRolar();

  /* --- Entrada das secoes por scroll ---------------------------- */
  var candidatos = doc.querySelectorAll(".sobe");

  if (calmo || !("IntersectionObserver" in window)) {
    candidatos.forEach(function (el) {
      el.classList.add("dentro");
    });
  } else {
    var olho = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add("dentro");
          olho.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );
    candidatos.forEach(function (el) {
      olho.observe(el);
    });
  }

  /* --- Mapa de especialidades ----------------------------------- */
  var pinos = Array.prototype.slice.call(doc.querySelectorAll(".pino"));
  var alvos = Array.prototype.slice.call(doc.querySelectorAll(".alvo"));
  var medicos = Array.prototype.slice.call(doc.querySelectorAll(".medico"));
  var aviso = doc.getElementById("filtro-aviso");
  var limpar = doc.getElementById("limpar");
  var fios = doc.getElementById("fios");
  var mapa = doc.querySelector(".mapa");
  var areaAtiva = null;

  /* --- Fios entre cada nome e a regiao do corpo ------------------ */
  var NS = "http://www.w3.org/2000/svg";

  function centro(el, base) {
    var r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2 - base.left, y: r.top + r.height / 2 - base.top };
  }

  function desenharFios() {
    if (!fios || !mapa) return;
    fios.textContent = "";

    /* Abaixo de 900px os nomes viram uma grade sob a figura: sem fios. */
    if (window.innerWidth <= 900) return;

    var base = mapa.getBoundingClientRect();
    fios.setAttribute("viewBox", "0 0 " + base.width + " " + base.height);

    pinos.forEach(function (pino) {
      var alvo = alvos.find(function (a) {
        return a.dataset.area === pino.dataset.area;
      });
      if (!alvo) return;

      var ponto = pino.querySelector(".pino__ponto") || pino;
      var de = centro(ponto, base);
      var para = centro(alvo, base);
      var esquerda = pino.closest(".mapa__coluna--esq");
      var saida = esquerda ? 18 : -18;
      var meio = de.x + saida;

      /* Sai reto do nome, depois uma curva simetrica ate o ponto. */
      var vao = para.x - meio;
      var d =
        "M" + de.x.toFixed(1) + " " + de.y.toFixed(1) +
        "L" + meio.toFixed(1) + " " + de.y.toFixed(1) +
        "C" + (meio + vao * 0.5).toFixed(1) + " " + de.y.toFixed(1) +
        " " + (meio + vao * 0.5).toFixed(1) + " " + para.y.toFixed(1) +
        " " + para.x.toFixed(1) + " " + para.y.toFixed(1);

      var traco = doc.createElementNS(NS, "path");
      traco.setAttribute("d", d);
      traco.setAttribute("class", "fio");
      traco.dataset.area = pino.dataset.area;

      var comprimento = Math.hypot(para.x - de.x, para.y - de.y) + 40;
      traco.style.setProperty("--traco", comprimento.toFixed(0));
      if (calmo) traco.style.animation = "none";

      fios.appendChild(traco);
    });
  }

  function acenderFio(area) {
    if (!fios) return;
    Array.prototype.forEach.call(fios.children, function (f) {
      f.classList.toggle("aceso", !!area && f.dataset.area === area);
    });
  }

  function nomeDaArea(area) {
    var pino = pinos.find(function (p) {
      return p.dataset.area === area;
    });
    return pino ? pino.textContent.trim() : area;
  }

  function aplicar(area) {
    areaAtiva = area;

    pinos.forEach(function (p) {
      p.setAttribute("aria-pressed", String(p.dataset.area === area));
    });

    alvos.forEach(function (a) {
      a.classList.toggle("aceso", a.dataset.area === area);
    });
    acenderFio(area);

    medicos.forEach(function (m) {
      var areas = (m.dataset.areas || "").split(" ");
      var serve = !area || areas.indexOf(area) !== -1;
      m.classList.toggle("apagado", !serve);
    });

    if (!area) {
      if (aviso) aviso.textContent = "Mostrando todo o corpo clínico.";
      if (limpar) limpar.hidden = true;
      return;
    }

    var quantos = medicos.filter(function (m) {
      return !m.classList.contains("apagado");
    }).length;

    if (aviso) {
      aviso.textContent =
        quantos === 1
          ? "1 médico em " + nomeDaArea(area) + "."
          : quantos + " médicos em " + nomeDaArea(area) + ".";
    }
    if (limpar) limpar.hidden = false;
  }

  /* O primeiro alvo so acende no hover quando ninguem escolheu area. */
  pinos.forEach(function (pino) {
    var area = pino.dataset.area;

    pino.addEventListener("click", function () {
      if (areaAtiva === area) {
        aplicar(null);
        return;
      }
      aplicar(area);

      var equipe = doc.getElementById("equipe");
      if (equipe) {
        equipe.scrollIntoView({
          behavior: calmo ? "auto" : "smooth",
          block: "start"
        });
      }
    });

    pino.addEventListener("mouseenter", function () {
      if (areaAtiva) return;
      alvos.forEach(function (a) {
        a.classList.toggle("aceso", a.dataset.area === area);
      });
      acenderFio(area);
    });

    pino.addEventListener("mouseleave", function () {
      if (areaAtiva) return;
      alvos.forEach(function (a) {
        a.classList.remove("aceso");
      });
      acenderFio(null);
    });
  });

  /* Os fios so podem ser medidos depois que a fonte assenta, senao os
     pinos ainda estao na largura da fonte de fallback. */
  if (fios) {
    var redesenhar = function () {
      desenharFios();
      acenderFio(areaAtiva);
    };

    if (doc.fonts && doc.fonts.ready) {
      doc.fonts.ready.then(redesenhar);
    } else {
      window.addEventListener("load", redesenhar);
    }

    var espera;
    window.addEventListener("resize", function () {
      clearTimeout(espera);
      espera = setTimeout(redesenhar, 160);
    });
  }

  if (limpar) {
    limpar.addEventListener("click", function () {
      aplicar(null);
      var secao = doc.getElementById("especialidades");
      if (secao) {
        secao.scrollIntoView({ behavior: calmo ? "auto" : "smooth", block: "start" });
      }
    });
  }

  /* --- Carrossel infinito dos convenios -------------------------- */
  var trilho = doc.getElementById("marquise-trilho");

  if (trilho && !calmo) {
    var originais = Array.prototype.slice.call(trilho.children);

    /* A copia e o que fecha o laço: quando a trilha anda metade da
       propria largura, a copia ja esta exatamente onde o original comecou. */
    originais.forEach(function (item) {
      var copia = item.cloneNode(true);
      copia.setAttribute("aria-hidden", "true");
      trilho.appendChild(copia);
    });

    /* Velocidade constante: quanto mais itens, mais longa a volta. */
    var largura = trilho.scrollWidth / 2;
    trilho.style.setProperty("--duracao", Math.round(largura / 55) + "s");
  }

})();
