var _templateReference = {},
  _templateReference2 = {};
function Paragraph({
  content
}) {
  return ESXToken.e(_templateReference, "p", ESXToken._, [ESXToken.i(content)]);
}
const div = ESXToken.e(_templateReference2, "div", [ESXToken.a(true, "class", 'some class'), ESXToken.a(true, "onclick", () => ignored)], [ESXToken.c(null, Paragraph, [ESXToken.a(false, "content", "some content")])]);
console.log(basicHTML(div));

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import ESXToken from '@ungap/esxtoken';
import { escape } from 'html-escaper';
function basicHTML(esx, output = []) {
  switch (esx.type) {
    case ESXToken.COMPONENT:
      return basicHTML(esx.value(esx.properties, ...esx.children), output);
    case ESXToken.FRAGMENT:
      addChildren(output, esx);
      break;
    case ESXToken.ELEMENT:
      output.push('<', esx.value);
      for (const [name, value] of Object.entries(esx.properties || {})) {
        if (typeof value !== 'function') addAttribute(output, name, value);
      }
      output.push('>');
      addChildren(output, esx);
      output.push(`</${esx.value}>`);
      break;
  }
  return output.join('');
}
function addAttribute(output, name, value) {
  output.push(` ${name}="${escape(String(value))}"`);
}
function addChildren(output, {
  children
}) {
  for (const child of children) {
    const {
      type,
      value
    } = child;
    switch (type) {
      case ESXToken.STATIC:
        output.push(escape(value));
        break;
      case ESXToken.INTERPOLATION:
        if (value instanceof ESXToken) basicHTML(value, output);else output.push(escape(value));
        break;
      default:
        basicHTML(child, output);
        break;
    }
  }
}
