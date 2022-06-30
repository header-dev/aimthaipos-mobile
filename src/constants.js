export const TXT_DOUBLE = '\x1b\x21\x30';
export const TXT_DOUBLE_OFF = '\x1b\x21\x00';
export const TXT_2WIDTH = '\x1b\x21\x20';
export const TXT_2WIDTH_OFF = '\x1b\x21\x00';
export const TXT_2HEIGHT = '\x1b\x21\x10';
export const TXT_2HEIGHT_OFF = '\x1b\x21\x00';
export const TXT_ALIGN_CT = '\x1b\x61\x01';
export const TXT_ALIGN_CT_OFF = '\x1b\x61\x00';
export const TXT_ALIGN_RT = '\x1b\x61\x02';
export const TXT_ALIGN_RT_OFF = '\x1b\x61\x00';
export const TXT_ALIGN_LT = '\x1b\x61\x00';
export const TXT_ALIGN_LT_OFF = '\x1b\x61\x00';
export const BOLD_ON = '\x1b\x45\x01';
export const BOLD_OFF = '\x1b\x45\x00';

export const dividerLine58mm = '------------------------------';
export const dividerLine80mm = '----------------------------------------------';

export const TXT_CUSTOM_SIZE = (width, height) => {
  // other sizes
  var widthDec = (width - 1) * 16;
  var heightDec = height - 1;
  var sizeDec = widthDec + heightDec;
  return '\x1d\x21' + String.fromCharCode(sizeDec);
};

export const primaryColor = '#2E7C31';
