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

class Tree {
  constructor() {
    this.root = null;
    this.current = null;
  }

  addChild(node) {
    if (!this.root) {
      this.root = node;
      this.current = node;
      return;
    }

    this.current.children = node;
    console.log('ddd', this.current.children);
    this.current.children = this.current;
  }

  get() {
    console.log(this.root.children);
    return 'tess';
  }
}

class Node {
  constructor() {
    this.element = null;
    this.attributes = null;
    this.text = null;
    this.children = null;
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
      if (!nextLexeme) {
        segment.push(lexeme);
        segmentContainer.push(segment);
        segment = [];
        return;
      }
      if (nextLexeme === 'LeftArrowBracker') {
        segment.push(lexeme);
        segmentContainer.push(segment);
        segment = [];
        return;
      }
      return segment.push(lexeme);
    });

    if (!this.tagFactory(segmentContainer)) return 'Error: Invalid tag';

    this.generateTree(this.stack);

    console.log('-------------');
    console.log(this.tree.get());
    // console.log(this.tree.root.children);
    // console.log(this.tree.root.children.children);
  }

  generateTree(stack) {
    let node = null;
    let length = stack.arr.length;

    let i = 0;
    while (i <= length) {
      let tag = stack.get(i);
      let compare = stack.pop();

      if (!tag || !tag.element || tag.element !== compare.element) {
        return;
      }

      node = new Node();
      const { element, attributes, text } = tag;
      node.element = element;
      if (attributes) node.attributes = attributes;
      if (text) node.text = text;

      console.log(node);
      this.tree.addChild(node);
      node = null;
      i++;
    }
    return true;
  }

  tagFactory(segmentContainer) {
    let tag = new Tag();
    segmentContainer.forEach((segment, i) => {
      // console.log(segment);
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
        const element = segment[2];
        tag.element = element;
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

const data1 = `<price unit="dallor" type="low"><body><test>ddd</test></body></price>`;

const lexemeContiner = new LexerAnalyer().input(data1);
const parser = new Parser();
parser.parse(lexemeContiner);
