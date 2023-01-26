# 배경 지식

## Lexical Analysis

- 글자들에서 lexical tokens(특정한 의미를 가진 string)로 변경하는 프로세스
- 분석 과정은 다음과 같다.
  - Input preprocessing: 코멘트, 공백 등 불필요한 요소를 제거함
  - Tokenization: input 텍스트를 토큰으로 전환하는 과정. 패턴 또는 정규식을 이용해 진행됨
  - Token classification: 각 토큰의 타입을 지정함. (e.g. keywords, identifiers, operators, and punctuation symbols)
  - Token validation: 각 토큰이 valid한지 체크한다. 예를 들어 varibale의 이름이 valid한지 혹은 operater가 올바른 구문을 갖고 있는지 등
  - Output generation: 토큰의 리스트를 출력. 이후 컴파일러의 다음 과정으로 이동

## Parser

파서란 input 데이터(주로 텍스트)를 이용해 data structure를 만드는 소프트웨어 컴포넌트이다.

# 진행 과정

0. 구조도

```

```

1. LexLexical Analyser 만들기

- [ ] tokenize 함수 만들기

- 토큰(token)이라 불리는 단위로 나누는 작업을 토큰화(tokenization) 라고 한다.
- 이 코드에서 토큰은 다음과 같이 정의했다.

```javascript
const IDENTIFIER = {
  HtmlIdentifier: 'HTML',
  BodyIdentifier: 'BODY',
};

const SEPARATORS = {
  LeftArrowBracker: `<`,
  RightArrowBracker: `>`,
  LeftSquareBracker: `[`,
  RightSquareBracker: `]`,
  Comma: `,`,
};

const OPERATORS = {
  Equal: '=',
  Add: '+',
  Sub: '-',
  Mul: '*',
  Div: '/',
};
```

- 입력된 구문을 글자 단위로 쪼갠 뒤, 해당 글자들을 반복문을 순회하며 토큰 단위로 묶어주어 출력하도록 했다.
- 결과는 다음과 같다.

```javascript
// 입력
`<price unit="dallor" type="low"><BODY>29.99</BODY></price>`;
// 출력
[
  '<',
  'price',
  'unit',
  '=',
  '"dallor"',
  'type',
  '=',
  '"low"',
  '>',
  '<',
  'BODY',
  '>',
  '29.99',
  '<',
  '/',
  'BODY',
  '>',
  '<',
  '/',
  'price',
  '>',
];
```

- [ ] classify 함수 만들기
- 토큰이 해당하는 타입을 각각 지정해주는 함수 classify 를 만들었다.

```javascript
// result
[
  'LeftArrowBracker',
  'token(price)',
  'token(unit)',
  'Equal',
  'token("dallor")',
  'token(type)',
  'Equal',
  'token("low")',
  'RightArrowBracker',
  'LeftArrowBracker',
  'BodyIdentifier',
  'RightArrowBracker',
  'token(29.99)',
  'LeftArrowBracker',
  'Div',
  'BodyIdentifier',
  'RightArrowBracker',
  'LeftArrowBracker',
  'Div',
  'token(price)',
  'RightArrowBracker',
];
```

3. Parser 만들기
