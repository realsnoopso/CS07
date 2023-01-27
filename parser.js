import { LexerAnalyer } from './tokenizer.js';

class Stack {
  constructor() {
    this.arr = [];
    this.index = 0;
  }

  getLength() {
    return this.arr.length;
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

  get(index) {
    return this.arr[index];
  }

  searchCloseTag(element) {
    let result = false;
    this.arr.forEach((v) => {
      // console.log(v);
      if (v.element === element) result = true;
    });
    return result;
  }
}

const Type = {
  startTagOpen: 'startTagOpen',
  endTagOpen: 'endTagOpen',
  startTagElement: 'startTagElement',
  endTagElement: 'endTagElement',
  tagClose: 'tagClose',
  attributeKey: 'attributeKey',
  attributeValue: 'attributeValue',
  text: 'text',
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

class Tree {
  constructor() {
    this.root = null;
    this.depth = 0;
  }

  addChild(node, depth) {
    if (!this.root) {
      this.root = node;
      this.depth = depth;
      return;
    }

    this.root.children = node;
    this.depth = depth;
  }
}

class Node {
  constructor({ element, attributes, depth }) {
    this.element = element;
    this.attributes = attributes;
    this.children = [];
    this.depth = depth;
  }
}

export class Parser {
  constructor() {
    this.stack = new Stack();
    this.tree = new Tree();
    this.currentTag = null;
  }

  checkType({ lastLexeme, lexeme, nextLexeme }) {
    let type = null;
    switch (lexeme) {
      case 'LeftArrowBracker':
        type = nextLexeme !== 'Div' ? Type.startTagOpen : Type.endTagOpen;
        break;
      case 'RightArrowBracker':
        type = Type.tagClose;
        break;
      case 'Div':
        break;
      case 'Equal':
        break;
      default:
        switch (lastLexeme) {
          case 'Div':
            type = Type.endTagElement;
            break;
          case 'LeftArrowBracker':
            type = Type.startTagElement;
            break;
          case 'RightArrowBracker':
            if (nextLexeme === 'LeftArrowBracker') {
              type = Type.text;
              break;
            }
          case 'Equal':
            type = Type.attributeValue;
            break;
          default:
            switch (nextLexeme) {
              case 'Equal':
                type = Type.attributeKey;
                break;
            }
        }
    }
    return type;
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
      case Type.tagClose:
        if (
          this.currentTag.position === Position.start &&
          this.currentTag.isOpened
        ) {
          this.currentTag.isOpened = false;
          this.stack.push(this.currentTag);
          this.currentTag = null;
          break;
        }
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

  addNodeToTree() {
    let depth = 0;
    let i = this.stack.getLength();

    while (i > 0) {
      const tag = this.stack.pop();
      const node = new Node({
        element: tag.element,
        attributes: tag.attributes,
        children: null,
        depth: depth,
      });

      const isStartTag = tag.position === Position.start;

      if (isStartTag) {
        if (this.stack.searchCloseTag(tag.element)) {
          this.tree.addChild(node, depth);
          depth++;
          return true;
        }
        return false;
      }
    }
    i--;
  }

  parse(lexemeContiner) {
    lexemeContiner.forEach((lexeme, i) => {
      const lastLexeme = i !== 0 ? lexemeContiner[i - 1] : null;
      const nextLexeme = lexeme.length !== i + 1 ? lexemeContiner[i + 1] : null;
      const type = this.checkType({ lastLexeme, lexeme, nextLexeme });
      if (type) {
        // console.log(Object.keys(Type).find((v) => Type[v] === type));
        this.tagFactory(type, { lastLexeme, lexeme, nextLexeme });
      }
      // console.log(this.stack);
    });

    if (!this.addNodeToTree()) return "Error: Can't find the close tag";

    console.log(this.tree);
    return this.tree;
  }
}

const data1 = `<price unit="dallor" type="low"><test>ddd</test><body>29.99</body></price>`;
const data2 = `<price><BODY>29.99</BODY></price>`;
const data3 = `[1, [2,[3]],'hello', 'world', null]`;
const data4 = `[ 23, “JK”, false ]`;
const error1 = `<HTML lang="ko"></BODY>`;

const lexemeContiner = new LexerAnalyer().input(data1);
const parser = new Parser();
parser.parse(lexemeContiner);
