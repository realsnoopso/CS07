const data = `<price unit="dallor" type="low">29.99</price>`;

// 단어="단어" 형식으로 되어 있는 글씨 가져오기
// >와< 사이에 있는 글씨 가져오기
// </와> 사이에 있는 글씨 가져오기

function parse(data) {
  const tag = data
    .match(new RegExp(`^<[^\/].*?>`))[0]
    .replace(/<|\/|>/g, '')
    .split(' ');
  const element = tag.shift(0);
  const attributes = getAttribute(tag);
  return { element, attributes };
}

function getAttribute(strs) {
  return strs.map((str) => {
    const name = str.match(new RegExp(`.+?(?==)`))[0];
    const value = str.match(new RegExp(`".+?"`))[0].replace(/"/g, '');
    return { name, value };
  });
}

console.log(parse(data));
console.log(
  JSON.stringify(parse(data)) ===
    JSON.stringify({
      element: 'price',
      attributes: [
        { name: 'unit', value: 'dallor' },
        { name: 'type', value: 'low' },
      ],
    })
);
