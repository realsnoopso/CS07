import { LexerAnalyer } from './tokenizer.js';

class Stack {
  constructor() {
    this.arr = [];
    this.index = 0;
  }
  push(item) {
    this.arr[this.index++] = item;
  }
  pop() {
    if (this.index <= 0) return null;
    const result = this.arr[--this.index];
    return result;
  }
}

class Tree {
  constructor() {
    this.root = null;
  }
}

class Parser {
  constructor() {
    this.stack = new Stack();
  }

  parse(lexemeContiner) {
    let tagStart = false;
    lexemeContiner.forEach((lexeme) => {
      lexeme.forEach((lex) => {
        if (lex === 'LeftArrowBracker') {
          tagStart = true;
          this.stack.push(lex);
          return;
        }
        if (lex === 'RightArrowBracker') {
          tagStart = false;
          this.stack.pop(lex);
          return;
        }
      });
    });
  }
}

const data1 = `<price unit="dallor" type="low"><BODY>29.99</BODY></price>`;
const data2 = `<price><BODY>29.99</BODY></price>`;
const data3 = `[1, [2,[3]],'hello', 'world', null]`;
const data4 = `[ 23, “JK”, false ]`;
const error1 = `<HTML lang="ko"></BODY>`;

const lexemeContiner = new LexerAnalyer().input(data1);
new Parser().input();
