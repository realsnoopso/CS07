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

const Type = {
  startTagOpen: 1,
  endTagOpen: 2,
  startTagElement: 3,
  endTagElement: 4,
  startTagClose: 5,
  endTagClose: 6,
  attributeKey: 7,
  attributeValue: 8,
  text: 9,
};

const Position = {
  start: 1,
  end: 2,
};

class Tag {
  constructor() {
    this.position = null;
    this.element = null;
    this.attributes = [];
    this.isOpened = false;
  }
}

class Text {
  constructor(lexeme) {
    this.text = lexeme;
  }
}

class Parser {
  constructor() {
    this.stack = new Stack();
    this.currentTag = null;
  }

  checkType({ lastLexeme, lexeme, nextLexeme }) {
    const currentTag = this.currentTag;
    switch (lexeme) {
      case 'LeftArrowBracker':
        return nextLexeme !== 'Div' ? Type.startTagOpen : Type.endTagOpen;

      case 'RightArrowBracker':
        if (currentTag.position === Position.start && currentTag.isOpened) {
          return Type.startTagClose;
        }
        if (currentTag.position === Position.end && currentTag.isOpened) {
          return Type.endTagClose;
        }
      case 'Div':
        return;
      case 'Equal':
        return;
      default:
        switch (lastLexeme) {
          case 'Div':
            return Type.endTagElement;
          case 'LeftArrowBracker':
            return Type.startTagElement;
          case 'RightArrowBracker':
            if (nextLexeme === 'LeftArrowBracker') {
              return Type.text;
            }
          case 'Equal':
            return Type.attributeValue;
          default:
            switch (nextLexeme) {
              case 'Equal':
                return Type.attributeKey;
            }
        }
    }
    return null;
  }

  tagFactory(type, { lastLexeme, lexeme }) {
    if (this.currentTag === null) {
      this.currentTag = new Tag();
    }

    switch (type) {
      case Type.startTagOpen:
        this.currentTag.isOpened = true;
        this.currentTag.position = Position.start;
        break;
      case Type.endTagOpen:
        this.currentTag.isOpened = true;
        this.currentTag.position = Position.end;
        break;
      case Type.startTagElement:
        this.currentTag.element = lexeme;
        break;
      case Type.endTagElement:
        this.currentTag.element = lexeme;
        break;
      case Type.startTagClose:
        this.currentTag.isOpened = false;
        this.stack.push(this.currentTag);
        this.currentTag = null;
        break;
      case Type.endTagClose:
        this.currentTag.isOpened = false;
        this.stack.push(this.currentTag);
        this.currentTag = null;
        break;
      case Type.attributeKey:
        const attribute = {
          key: lastLexeme,
          value: null,
          isOpened: true,
        };
        this.currentTag.attributes.push(attribute);
        break;
      case Type.attributeValue:
        Object.values(this.currentTag.attributes).forEach((attribute, i) => {
          if (attribute.isOpened) {
            this.currentTag.attributes[i].value = lexeme;
            this.currentTag.attributes[i].isOpened = false;
          }
        });
        break;
      case Type.text:
        this.stack.push(new Text(lexeme));
        break;
      default:
        console.error('Error', lexeme);
        break;
    }
  }

  parse(lexemeContiner) {
    lexemeContiner.forEach((lexeme, i) => {
      const lastLexeme = i !== 0 ? lexemeContiner[i - 1] : null;
      const nextLexeme = lexeme.length !== i + 1 ? lexemeContiner[i + 1] : null;
      const type = this.checkType({ lastLexeme, lexeme, nextLexeme });
      // console.log(Object.keys(Type).find((v) => Type[v] === type));
      if (type) {
        this.tagFactory(type, { lastLexeme, lexeme, nextLexeme });
      }
    });
    // console.log({ stack: this.stack.arr });
    return this.stack;
  }
}

const data1Types = `startTagOpen
startTagElement
attributeKey
attributeValue
attributeKey
attributeValue
startTagClose
startTagOpen
startTagElement
startTagClose
text
endTagOpen
endTagElement
endTagClose
endTagOpen
endTagElement
endTagClose`;

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

const lexemeContiner = new LexerAnalyer().input(data1);

new Parser().parse(lexemeContiner);

// 코드 정리
// text가 다음 tag로 가는 문제 발생하긴 함
// [, ] 이거도 대응해야 함
// error 대응해야 함
