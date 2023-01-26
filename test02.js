const data1 = `<price unit="dallor" type="low"><BODY>29.99</BODY></price>`;
const data2 = `<price><BODY>29.99</BODY></price>`;
const error2 = `<HTML lang="ko"></BODY>`;

function parse(data) {
  const result = {};

  // process(data);
  // if (process(data).hasChildren) {
  //   result.children = data;
  //   return parse(data);
  // }

  return process(data);

  // parse 완료된 tag는 삭제하기 위해 startTag와 endTag 사이의 문자열 가져오기.
}

function process(data) {
  const startTag = getStartTag(data);
  const endTag = getEndTag(data);

  const element = getElement(startTag);
  if (!verify(getElement(startTag), getElement(endTag)))
    return console.error('ERROR: "올바른 XML 형식이 아닙니다."');

  const result = { element };
  const attributes = getAttributes(startTag);
  if (attributes) result.attributes = attributes;

  const children = data.replace(startTag, '').replace(endTag, '');
  if (children.includes('<')) return {};
}

function verify(startTagName, endTagName) {
  return startTagName === endTagName;
}

function getStartTag(str) {
  const isStartTag = new RegExp(`^<[^\/].*?>`);
  const startTag = str.match(isStartTag)?.[0];
  return startTag;
}

function getEndTag(str) {
  const isEndTag = new RegExp(`<\/[a-zA-Z\-\_]+?>$`);
  const endTag = str.match(isEndTag)?.[0];
  return endTag;
}

function getElement(str) {
  const isTagName = new RegExp(`[a-zA-Z\-\-]+`);
  return str.match(isTagName)?.[0];
}

function getAttributes(str) {
  const result = [];
  str.split(' ').forEach((str) => {
    const name = str.match(new RegExp(`.+?(?==)`))?.[0];
    const value = str.match(new RegExp(`".+?"`))?.[0].replace(/"/g, '');
    if (name && value) result.push({ name, value });
  });
  if (result.length === 0) return null;
  else return result;
}

function getText(str) {}

function parseChildren(str) {}

console.log(parse(data1));
console.log(parse(data2));
console.log(parse(error2));
