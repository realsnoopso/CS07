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
    this.lastToken = null;
  }

  generateTag(lexeme) {
    const tag = new Tag();
    tag.isStartTagOpened = true;
    tag.element = lexeme;
    this.stack.push(tag);
  }

  parse(lexemeContiner) {
    const stack = this.stack;
    let currentTag = null;
    lexemeContiner.forEach((lexeme) => {
      if (!this.lastToken) return (this.lastToken = lexeme);

      const isFirstElement =
        this.lastToken === 'LeftArrowBracker' && lexeme !== 'Div';
      if (isFirstElement) {
        this.generateTag(lexeme);
        currentTag = stack.getLast();
        currentTag.startToken = this.lastToken;
        this.lastToken = lexeme;
        return;
      }

      const isLastElement = this.lastToken === 'Div';
      if (isLastElement) {
        const tag = stack.getLast();
        if (tag.isCloseTagOpened) tag.isCloseTagOpened = false;
        this.lastToken = lexeme;
        return;
      }

      switch (lexeme) {
        case 'LeftArrowBracker':
          this.lastToken = lexeme;
          break;
        case 'RightArrowBracker':
          const isStartTag = currentTag.isStartTagOpened;
          if (isStartTag) {
            currentTag.isStartTagOpened = false;
            this.lastToken = lexeme;
            break;
          }
          const isCloseTag = currentTag.isCloseTagOpened;
          if (isCloseTag) {
            currentTag.isCloseTagOpened = false;
            this.lastToken = null;
            break;
          }
        case 'Equal':
          const attribute = {
            key: this.lastToken,
            value: null,
            isOpened: true,
          };
          currentTag.attributes.push(attribute);
          this.lastToken = lexeme;
          break;
        case 'Div':
          if (this.lastToken === 'LeftArrowBracker')
            currentTag.isCloseTagOpened = true;
          this.lastToken = lexeme;
          break;
        default:
          const isAttributeValue = currentTag.isStartTagOpened;
          if (isAttributeValue) {
            Object.values(currentTag.attributes).forEach((attribute) => {
              if (attribute.isOpened) attribute.value = lexeme;
              attribute.isOpened = false;
              this.lastToken = lexeme;
            });
          }

          const isText = !currentTag.isStartTagOpened;
          if (isText) {
            currentTag.text = lexeme;
            this.lastToken = lexeme;
          }
      }
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

const data1 = `<price unit="dallor" type="low"><body>29.99</body></price>`;
const data2 = `<price><BODY>29.99</BODY></price>`;
const data3 = `[1, [2,[3]],'hello', 'world', null]`;
const data4 = `[ 23, “JK”, false ]`;
const error1 = `<HTML lang="ko"></BODY>`;

const lexemeContiner = new LexerAnalyer().input(data3);
// new Parser().parse(lexemeContiner);

// 코드 정리
// text가 다음 tag로 가는 문제 발생하긴 함
// [, ] 이거도 대응해야 함
// error 대응해야 함
