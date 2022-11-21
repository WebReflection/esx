var _templateReference = {},
  _templateReference2 = {};
function Paragraph({
  content
}) {
  return ESXToken.template(_templateReference, ESXToken.element("p", null, ESXToken.create(ESXToken.RUNTIME_TYPE, content)));
}
const div = ESXToken.template(_templateReference2, ESXToken.element("div", ESXToken.create(ESXToken.MIXED_TYPE, [ESXToken.property(ESXToken.RUNTIME_TYPE, "class", 'some class'), ESXToken.property(ESXToken.RUNTIME_TYPE, "onclick", () => ignored)]), ESXToken.create(ESXToken.STATIC_TYPE, ESXToken.component(Paragraph, ESXToken.create(ESXToken.STATIC_TYPE, [ESXToken.property(ESXToken.STATIC_TYPE, "content", "some content")])))));
console.log(basicHTML(div));

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import ESXToken from '@ungap/esxtoken';
import { escape } from 'html-escaper';
function basicHTML(esx, output = []) {
  switch (esx.type) {
    case ESXToken.TEMPLATE_TYPE:
      return basicHTML(esx.value, output);
    case ESXToken.COMPONENT_TYPE:
      let properties = null;
      if (esx.properties) {
        properties = {};
        for (const {
          type,
          name,
          value
        } of esx.properties.value) {
          if (type === ESXToken.STATIC_TYPE || name.length) properties[name] = value;else Object.assign(properties, value);
        }
      }
      return basicHTML(esx.value(properties, ...esx.children), output);
    case ESXToken.FRAGMENT_TYPE:
      addChildren(output, esx);
      break;
    case ESXToken.ELEMENT_TYPE:
      output.push('<', esx.value);
      if (esx.properties) {
        switch (esx.properties.type) {
          case ESXToken.STATIC_TYPE:
            for (const {
              name,
              value
            } of esx.properties.value) addAttribute(output, name, value);
            break;
          case ESXToken.MIXED_TYPE:
            for (const {
              type,
              name,
              value
            } of esx.properties.value) {
              if (type === ESXToken.RUNTIME_TYPE && typeof value === 'function') continue;
              addAttribute(output, name, value);
            }
            break;
          case ESXToken.RUNTIME_TYPE:
            const attributes = new Map();
            for (const {
              type,
              name,
              value
            } of esx.properties.value) {
              if (type === ESXToken.STATIC_TYPE || name.length && typeof value !== 'function') attributes.set(name, value);else if (name.length === 0) {
                for (const [name, v] of Object.entries(value)) {
                  if (typeof v === 'function') continue;
                  attributes.set(name, v);
                }
              }
            }
            for (const [name, value] of attributes) addAttribute(output, name, value);
            break;
        }
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
  for (const {
    value
  } of children) {
    if (value instanceof ESXToken) basicHTML(value, output);else if (typeof value !== 'function') output.push(escape(value));
  }
}
