function checkType(lexeme, lastToken) {
  let currentType = null;
  const isLiteral = new RegExp(/token\(.+?\)/).test(lexeme);

  switch (lexeme) {
    case 'LeftArrowBracker':
      currentType = !lastToken ? 'startTagOpen' : 'endTagOpen';
      break;
    case 'RightArrowBracker':
      currentType = this.currnetTag?.isStartTagOpened
        ? 'startTagClose'
        : 'endTagClose';
      break;
    case 'RightArrowBracker':
      currentType = 'tagClose';
      break;
    case 'Equal':
      currentType = 'equal';
      break;
    case 'Div':
      currentType = 'div';
      break;
    default:
      if (isLiteral) {
        currentType = 'text';
        break;
      }
      currentType = 'error';
      break;
  }
  return currentType;
}

console.log('checkType', checkType(`LeftArrowBracker`, null));
console.log('checkType', checkType(`token('dfadfa')`, null));
