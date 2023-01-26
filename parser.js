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
  getLast() {
    return this.arr[this.index - 1];
  }
}

class Tree {
  constructor() {
    this.root = null;
  }
}

class Tag {
  constructor() {
    this.startToken = null;
    this.isStartTagOpened = false;
    this.isCloseTagOpened = false;

    this.element = null;
    this.attributes = [];
    this.text = null;
  }
}

class Parser {
  constructor() {
    this.stack = new Stack();
  }

  parse(lexemeContiner) {
    let lastToken = null;
    const stack = this.stack;
    let currentTag = null;
    lexemeContiner.forEach((lexeme) => {
      if (!lastToken) return (lastToken = lexeme);
      const isElement = lastToken === 'LeftArrowBracker';
      if (isElement) {
        if (lexeme !== 'Div') {
          const tag = new Tag();
          tag.isStartTagOpened = true;
          tag.element = lexeme;
          stack.push(tag);
          currentTag = stack.getLast();
          lastToken = lexeme;
          return;
        }
        const tag = stack.getLast();
        if (tag.isCloseTagOpened) tag.isCloseTagOpened = false;
        return;
      }
      switch (lexeme) {
        case 'LeftArrowBracker':
          lastToken = lexeme;
          break;
        case 'RightArrowBracker':
          if (currentTag.isStartTagOpened) {
            currentTag.isStartTagOpened = false;
            break;
          }
          if (currentTag.isCloseTagOpened) {
            currentTag.isCloseTagOpened = false;
            break;
          }
        case 'Equal':
          const attribute = {
            key: lastToken,
            value: null,
            isOpened: true,
          };
          currentTag.attributes.push(attribute);
          break;
        case 'Div':
          if (lastToken === 'LeftArrowBracker')
            currentTag.isCloseTagOpened = true;
          break;
        default:
          const isAttributeValue = currentTag.isStartTagOpened;
          const isText = !currentTag.isStartTagOpened;
          const isCloseElement = lastToken === 'Div';

          if (isAttributeValue) {
            Object.values(currentTag.attributes).forEach((attribute) => {
              if (attribute.isOpened) attribute.value = lexeme;
              attribute.isOpened = false;
            });
          }
          if (isText) {
            currentTag.text = lexeme;
          }
      }
      lastToken = lexeme;
    });
    console.log({ stack: this.stack.arr });
    return this.stack;
  }
}

// - '<': `lastToken`으로 저장
// - 'price': 이전 token이 '<' 확인, 새로운 태그 생성, '<'을 'startToken'로 지정, `isOpened.startTag = true`속성도 추가. 'price'는 'element'로 tree에 저장
// - 'unit': 이전 token이 '<'가 아님을 확인, 'lastToken' 으로 저장
// - '=': 이전 token을 'key' 로 지정, 'currentTag' - 'attributes' 에 `{key: unit, value: null, isClosed: false}`로 지정.
// - 'dollar': 'attributes' 중 isOpened 가 true 인 항목을 찾아 value로 지정
// - 'type': 이전 token이 '<'가 아님을 확인, 'lastToken' 으로 저장
// - '>': `isOpened.start = false`
// - '29.9': text로 저장
// - '<': 'lastToken'으로 저장
// - '/': 'lastToken'이 '<'임을 확인, isOpened.closedTag = true로 변경
// - 'price': 'lastToken'이 '/'임을 확인, 'isOpened.closedTag = true' 임을 확인 후 'element'를 대조
// - '>': 'isOpened.closedTag = false'

const data1 = `<price unit="dallor" type="low">29.99</price>`;
// const data2 = `<price><BODY>29.99</BODY></price>`;
// const data3 = `[1, [2,[3]],'hello', 'world', null]`;
// const data4 = `[ 23, “JK”, false ]`;
// const error1 = `<HTML lang="ko"></BODY>`;

const lexemeContiner = new LexerAnalyer().input(data1);
new Parser().parse(lexemeContiner);
