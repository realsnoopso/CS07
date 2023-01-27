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
    this.attributes = [];
    this.isOpened = false;
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

    lexemeContiner.forEach((lexeme) => {
      if (lexeme === 'LeftArrowBracker') {
        segment.push(lexeme);
        return (isOpen = true);
      }
      if (lexeme === 'RightArrowBracker') {
        segment.push(lexeme);
        segmentContainer.push(segment);
        segment = [];
        return (isOpen = false);
      }
      if (isOpen) {
        return segment.push(lexeme);
      }
      return segment.push(lexeme);
    });

    this.generateTree(segmentContainer);
  }

  generateTree(segmentContainer) {
    segmentContainer.forEach((segment, i) => {
      const position = !segment.includes(TOKENS.get('/'))
        ? Position.start
        : Position.end;
      const startTag = segment[0];
      const endTag = segment[segment.length - 1];
      const isTagValid = this.checkTagType(startTag, endTag);
      if (!isTagValid) return console.log('invalid tag');

      const element = segment[1];
      const remains = segment.splice(2, segment.length);
      const keyValues = [];
      remains.forEach((lexeme, i) => {
        if (lexeme === TOKENS.get('=')) {
          const key = remains[i - 1];
          const value = remains[i + 1];
          keyValues.push({ key, value });
        }
      });
      // console.log({ position, startTag, endTag, element, keyValues });
    });
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
const data2 = `<price unit="dallor" type="low">,<test>,ddd,</test>,<body>,29.99,</body>,</price>`;

const lexemeContiner = new LexerAnalyer().input(data1);
const parser = new Parser();
parser.parse(lexemeContiner);
