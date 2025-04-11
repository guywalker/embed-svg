import './style.css'
import './components/inline-svg'
import hljs from 'highlight.js';

import xml from 'highlight.js/lib/languages/xml';

// Then register the languages you need
hljs.registerLanguage('xml', xml);

function copyDisplayExamples() {
  const examples = document.querySelectorAll('.example');
  examples.forEach(example => {
    // find sibling with class example-code
    const code = example.nextElementSibling as HTMLElement;
    if (code.classList.contains('example-code')) {
      // add example html into pre block
      const pre = document.createElement('pre');
      const highlightedCode = hljs.highlight(
        example.innerHTML,
        { language: 'xml' }
      ).value;
      // escape html
      // const escaped = example.innerHTML.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      pre.innerHTML = highlightedCode;
      // insert pre block into example-code
      code.innerHTML = '';
      code.appendChild(pre);
    }
  })
}

// on document ready
document.addEventListener('DOMContentLoaded', () => {
  copyDisplayExamples();
});