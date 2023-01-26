const data = `<priceunit="dallor" type="low">29.99</price>`;
const error1 = `<unit="dallor" type="low">29.99`;
const erro2 = `<HTML lang="ko"><BODY>`;

// 단어="단어" 형식으로 되어 있는 글씨 가져오기
// >와< 사이에 있는 글씨 가져오기
// </와> 사이에 있는 글씨 가져오기

function parse(data) {
  const tag = data
    .match(new RegExp(`^<[^\/].*?>`))?.[0]
    .replace(/<|\/|>/g, '')
    .split(' ');

  const element = tag.shift(0).match(new RegExp(`a-zA-Z\-\_`));
  const attributes = getAttribute(tag) ?? null;
  const text = data.match(new RegExp(`>.+?<`))?.[0].replace(/<|>/g, '');
  const result = { element };
  if (!element) return console.error('ERROR: "올바른 XML 형식이 아닙니다."');
  if (attributes) result.attributes = attributes;
  if (text) result.text = text;
  return result;
}

function getElement() {}

function getAttribute(strs) {
  const result = [];
  strs.forEach((str) => {
    const name = str.match(new RegExp(`.+?(?==)`))?.[0];
    const value = str.match(new RegExp(`".+?"`))?.[0].replace(/"/g, '');
    if (name && value) result.push({ name, value });
  });
  if (result.length === 0) return null;
  else return result;
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
      text: '29.99',
    })
);
