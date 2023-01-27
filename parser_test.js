import { LexerAnalyer } from './tokenizer.js';
import { Parser } from './parser.js';

const data1 = `<price unit="dallor" type="low"><test>ddd</test><body>29.99</body></price>`;

const lexemeContiner = new LexerAnalyer().input(data1);
const parser = new Parser();
// parser.parse(lexemeContiner);

let types = [];
lexemeContiner.map((lexeme, i) => {
  const lastLexeme = i !== 0 ? lexemeContiner[i - 1] : null;
  const nextLexeme = lexeme.length !== i + 1 ? lexemeContiner[i + 1] : null;
  const type = parser.checkType({ lastLexeme, lexeme, nextLexeme });
  if (type) {
    types.push(type);
  }
});
console.log(types);

// [, ] 이거도 대응해야 함
// error 대응해야 함

console.log(
  'isTypesValid',
  JSON.stringify(types) ===
    JSON.stringify([
      'startTagOpen',
      'startTagElement',
      'attributeKey',
      'attributeValue',
      'attributeKey',
      'attributeValue',
      'tagClose',
      'startTagOpen',
      'startTagElement',
      'tagClose',
      'text',
      'endTagOpen',
      'endTagElement',
      'tagClose',
      'startTagOpen',
      'startTagElement',
      'tagClose',
      'text',
      'endTagOpen',
      'endTagElement',
      'tagClose',
      'endTagOpen',
      'endTagElement',
      'tagClose',
    ])
);
