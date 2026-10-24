
(function () {
  var DARK = {
    darkMode: true,
    background: "#1a1c23",
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    textColor: "#e6e8ee",
    primaryColor: "#1a1c23",
    primaryTextColor: "#e6e8ee",
    primaryBorderColor: "#00ff66",
    secondaryColor: "#262936",
    secondaryTextColor: "#e6e8ee",
    secondaryBorderColor: "#00ff66",
    tertiaryColor: "#14151c",
    tertiaryTextColor: "#e6e8ee",
    tertiaryBorderColor: "#3f51b5",
    lineColor: "#00f0ff",
    noteBkgColor: "#262936",
    noteTextColor: "#e6e8ee",
    noteBorderColor: "#00ff66",
    actorBkg: "#1a1c23",
    actorBorder: "#00ff66",
    actorTextColor: "#e6e8ee",
    actorLineColor: "#3f51b5",
    signalColor: "#00f0ff",
    signalTextColor: "#e6e8ee",
    labelBoxBkgColor: "#262936",
    labelBoxBorderColor: "#00ff66",
    labelTextColor: "#e6e8ee",
    loopTextColor: "#e6e8ee",
    activationBkgColor: "#262936",
    activationBorderColor: "#00ff66",
    sequenceNumberColor: "#0d0e15",
    classText: "#e6e8ee",
    edgeLabelBackground: "#1a1c23"
  };

  var LIGHT = {
    darkMode: false,
    background: "#ffffff",
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    textColor: "#1f1f2e",
    primaryColor: "#ede7f6",
    primaryTextColor: "#1f1f2e",
    primaryBorderColor: "#673ab7",
    secondaryColor: "#fff3e0",
    secondaryTextColor: "#1f1f2e",
    secondaryBorderColor: "#ff5722",
    tertiaryColor: "#f5f5fa",
    tertiaryTextColor: "#1f1f2e",
    tertiaryBorderColor: "#9575cd",
    lineColor: "#5e35b1",
    noteBkgColor: "#fff3e0",
    noteTextColor: "#1f1f2e",
    noteBorderColor: "#ff5722",
    actorBkg: "#ede7f6",
    actorBorder: "#673ab7",
    actorTextColor: "#1f1f2e",
    actorLineColor: "#9575cd",
    signalColor: "#5e35b1",
    signalTextColor: "#1f1f2e",
    labelBoxBkgColor: "#ede7f6",
    labelBoxBorderColor: "#673ab7",
    labelTextColor: "#1f1f2e",
    loopTextColor: "#1f1f2e",
    activationBkgColor: "#ede7f6",
    activationBorderColor: "#673ab7",
    sequenceNumberColor: "#ffffff",
    classText: "#1f1f2e",
    edgeLabelBackground: "#ffffff"
  };

  var busy = Promise.resolve();

  function mode() {
    return document.body.getAttribute("data-md-color-scheme") === "slate" ? "dark" : "light";
  }

  function render() {
    if (typeof mermaid === "undefined") { return; }
    var current = mode();
    var nodes = Array.prototype.filter.call(
      document.querySelectorAll(".neon-mermaid"),
      function (el) { return el.getAttribute("data-mode") !== current; }
    );
    if (!nodes.length) { return; }

    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      themeVariables: current === "dark" ? DARK : LIGHT
    });

    nodes.forEach(function (el) {
      busy = busy.then(function () {
        if (!el.hasAttribute("data-src")) {
          el.setAttribute("data-src", el.textContent);   // исходный код диаграммы
        }
        el.removeAttribute("data-processed");
        el.textContent = el.getAttribute("data-src");
        el.setAttribute("data-mode", current);
        return mermaid.run({ nodes: [el] });
      }).catch(function (e) { console.error("Mermaid:", e); });
    });
  }

  function start() {
    render();
    new MutationObserver(render).observe(document.body, {
      attributes: true,
      attributeFilter: ["data-md-color-scheme"]
    });
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(render);        // страницы без перезагрузки
    if (document.readyState !== "loading") { start(); } else { document.addEventListener("DOMContentLoaded", start); }
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();