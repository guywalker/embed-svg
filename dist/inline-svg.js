var l = Object.defineProperty;
var h = (r, o, e) => o in r ? l(r, o, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[o] = e;
var c = (r, o, e) => h(r, typeof o != "symbol" ? o + "" : o, e);
let a = {};
function u(r) {
  return new Promise((o, e) => {
    if (console.log(`Loading SVG from ${r}`), a[r]) {
      console.log(`SVG from ${r} found in cache`), o(a[r]);
      return;
    }
    const t = fetch(r).then((n) => n.text()).then((n) => {
      const s = document.createElement("div");
      return s.innerHTML = n.trim(), a[r] = n, o(n), n;
    }).catch((n) => (e(n), null));
    a[r] = t;
  });
}
class d extends HTMLElement {
  constructor() {
    super();
    c(this, "shadow");
    this.shadow = this.attachShadow({ mode: "open" });
  }
  static get observedAttributes() {
    return ["src"];
  }
  connectedCallback() {
    this.loadSVG();
  }
  attributeChangedCallback(e, t, n) {
    e === "src" && t !== n && this.loadSVG();
  }
  async loadSVG() {
    const e = this.getAttribute("src");
    if (!e) {
      console.error("Missing src attribute");
      return;
    }
    try {
      const t = await u(e);
      if (!t)
        throw new Error("No SVG element found in the response");
      this.attachSVG(t);
    } catch (t) {
      console.error(t);
    }
  }
  attachSVG(e) {
    const t = document.createElement("div");
    t.innerHTML = this.applyReplacements(e);
    const n = t.querySelector("svg");
    this.transferAttributes(n), this.shadow.innerHTML = "", this.shadow.appendChild(n);
  }
  transferAttributes(e) {
    Array.from(this.attributes).forEach((t) => {
      t.name !== "src" && e.setAttribute(t.name, t.value);
    });
  }
  applyReplacements(e) {
    return this.querySelectorAll("inline-svg-replace").forEach((n) => {
      const s = n.getAttribute("pattern"), i = n.getAttribute("value");
      s && i && (e = e.replace(new RegExp(s, "g"), i));
    }), e;
  }
}
customElements.define("inline-svg", d);
export {
  d as InlineSVG
};
