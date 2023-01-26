class Tree {
  constructor(value) {
    this.value = value;
    this.children = [];
  }

  addChild(node) {
    this.children.push(node);
  }

  removeChild(node) {
    this.children = this.children.filter((child) => child !== node);
  }

  traverseBF(fn) {
    const arr = [this];
    while (arr.length) {
      const node = arr.shift();
      arr.push(...node.children);
      fn(node);
    }
  }

  traverseDF(fn) {
    const arr = [this];
    while (arr.length) {
      const node = arr.shift();
      arr.unshift(...node.children);
      fn(node);
    }
  }

  print() {
    // if (!this.root) {
    //   return console.log('No root node found');
    // }
    let newline = new Node('|');
    let queue = [this.root, newline];
    let string = '';
    while (queue.length) {
      let node = queue.shift();
      string += node.data.toString() + ' ';
      if (node === newline && queue.length) {
        queue.push(newline);
      }
      for (let i = 0; i < node.children.length; i++) {
        queue.push(node.children[i]);
      }
    }
    console.log(string.slice(0, -2).trim());
  }
}

class Node {
  constructor(data) {
    this.data = data;
    this.children = [];
  }
}

const tree = new Tree();

tree.addChild('2');
tree.addChild('3');
tree.print();
