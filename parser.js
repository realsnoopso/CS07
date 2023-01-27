import { LexerAnalyer } from './tokenizer.js';
import { TOKENS } from './constants.js';

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
      if (v.element === element) result = true;
    });
    return result;
  }
}

const Position = {
  start: 1,
  end: 2,
};

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

class Tag {
  constructor() {
    this.position = null;
    this.element = null;
    this.attributes = null;
    this.isOpened = false;
    this.type = null;
  }
}

export class Parser {
  constructor() {
    this.stack = new Stack();
    this.tree = new Tree();
    this.currentTag = null;
  }

  parse(lexemeContiner) {
    let segmentContainer = [];
    let segment = [];
    lexemeContiner.forEach((lexeme, i) => {
      const nextLexeme = lexemeContiner[i + 1];
      if (nextLexeme === 'LeftArrowBracker') {
        segment.push(lexeme);
        segmentContainer.push(segment);
        segment = [];
        return;
      }
      return segment.push(lexeme);
    });
    if (!this.tagFactory(segmentContainer)) return 'Error: Invalid tag';
    console.log(this.stack);
  }

  tagFactory(segmentContainer) {
    let tag = new Tag();
    segmentContainer.forEach((segment, i) => {
      const position = segment.includes(TOKENS.get('/'))
        ? Position.end
        : Position.start;
      tag.position = position;

      const startTag = segment[0];
      const endTagIndex = this.findCloseTagIndex(segment);
      const endTag = segment[endTagIndex];
      const isTagValid = this.checkTagType(startTag, endTag);
      if (!isTagValid) return false;
      tag.type = startTag;

      if (tag.position === Position.end) {
        this.stack.push(tag);
        tag = new Tag();
        return true;
      }

      const element = segment[1];
      tag.element = element;

      if (endTagIndex !== segment.length - 1) {
        const text = segment.slice(endTagIndex + 1, segment.length);
        tag.text = text;
      }

      const remains = segment.slice(2, endTagIndex);
      const attributes = [];
      remains.forEach((lexeme, i) => {
        if (lexeme === TOKENS.get('=')) {
          const key = remains[i - 1];
          const value = remains[i + 1];
          attributes.push({ key, value });
        }
      });
      if (attributes.length) tag.attributes = attributes;

      this.stack.push(tag);
      tag = new Tag();
    });
    return true;
  }

  findCloseTagIndex(segment) {
    let result = null;
    segment.forEach((lexeme, i) => {
      if (lexeme === TOKENS.get('>') || lexeme === TOKENS.get(']'))
        return (result = i);
    });
    return result;
  }

  checkTagType(startTag, endTag) {
    const [startTagType, endTagType] = [startTag, endTag].map((lexeme) => {
      if (lexeme === TOKENS.get('<') || lexeme === TOKENS.get('>')) {
        return TAG_TYPE.arrowBracker;
      }
      if (lexeme === TOKENS.get('[') || lexeme === TOKENS.get(']')) {
        return TAG_TYPE.squareBarcker;
      }
    });
    return startTagType === endTagType;
  }
}

const TAG_TYPE = {
  arrowBracker: 1,
  squareBarcker: 2,
};

const data1 = `<price unit="dallor" type="low"><test>ddd</test><body>29.99</body></price>`;
const data2 = `<price unit="dallor" type="low">/<test>ddd/</test><body>29.99</body></price>`;

const lexemeContiner = new LexerAnalyer().input(data1);
const parser = new Parser();
parser.parse(lexemeContiner);
