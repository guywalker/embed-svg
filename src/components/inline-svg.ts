import { loadSVG } from "../services/svg-loader";

export class InlineSVG extends HTMLElement {
  private shadow: ShadowRoot;
  
  static get observedAttributes() {
    return ['src'];
  }
  
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }
  
  connectedCallback() {
    this.loadSVG();
  }
  
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'src' && oldValue !== newValue) {
      this.loadSVG();
    }
  }
  
  private async loadSVG() {
    const src = this.getAttribute('src');
    if (!src) {
      console.error('Missing src attribute');
      return;
    }
    
    try {
      const svgElement = await loadSVG(src!);
      
      if (!svgElement) {
        throw new Error('No SVG element found in the response');
      }
      
      this.attachSVG(svgElement);
    } catch (error) {
      console.error(error);
    }
  }

  private attachSVG(svg: string) {
    // create the SVG element
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.applyReplacements(svg);
    const svgElement = tempDiv.querySelector('svg')!;
    
    // Transfer all attributes from the component to the SVG
    this.transferAttributes(svgElement);
      
    // Clear the shadow DOM and append the SVG
    this.shadow.innerHTML = '';
    this.shadow.appendChild(svgElement);
  }
  
  private transferAttributes(svgElement: SVGElement) {
    Array.from(this.attributes).forEach(attr => {
      if (attr.name !== 'src') {
        svgElement.setAttribute(attr.name, attr.value);
      }
    });
  }

  private applyReplacements(svgStr: string): string {
    const replacements = this.querySelectorAll(`inline-svg-replace`);
    replacements.forEach(replacement => {
      const pattern = replacement.getAttribute('pattern');
      const value = replacement.getAttribute('value');
      if (pattern && value) {
        svgStr = svgStr.replace(new RegExp(pattern, 'g'), value);
      }
    });

    return svgStr;
  }

}

customElements.define('inline-svg', InlineSVG);
