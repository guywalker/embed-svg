import './style.css'
import './components/embed-svg'
import hljs from 'highlight.js';

import xml from 'highlight.js/lib/languages/xml';

// Then register the languages you need
hljs.registerLanguage('xml', xml);

function copyDisplayExamples() {
  const examples = document.querySelectorAll('[data-example]');
  examples.forEach(example => {
    // find sibling with class example-code
    const code = document.querySelector(`#${example.getAttribute('data-example')}`);
    if (code) {
      // add example html into pre block
      const pre = document.createElement('pre');
      const highlightedCode = hljs.highlight(
        code.innerHTML.trim(),
        { language: 'xml' }
      ).value;
      // escape html
      pre.innerHTML = highlightedCode;
      // insert pre block into example-code
      example.innerHTML = '';
      example.appendChild(pre);
    }
  })
}

document.querySelectorAll('.language-js').forEach((block) => {
  hljs.highlightBlock(block as HTMLElement);
});

// on document ready
document.addEventListener('DOMContentLoaded', () => {
  copyDisplayExamples();
});