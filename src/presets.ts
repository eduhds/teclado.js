const KEYBOARD_KEYS = [
  // key, code
  ['Backspace', 'Backspace'],
  ['Tab', 'Tab'],
  ['Enter', 'Enter'],
  ['Shift', 'ShiftLeft'],
  ['Shift', 'ShiftRight'],
  ['Control', 'ControlLeft'],
  ['Control', 'ControlRight'],
  ['Alt', 'AltLeft'],
  ['Alt', 'AltRight'],
  ['CapsLock', 'CapsLock'],
  ['Escape', 'Escape'],
  [' ', 'Space'],
  ['Delete', 'Delete'],
  ['0', 'Digit0'],
  ['1', 'Digit1'],
  ['2', 'Digit2'],
  ['3', 'Digit3'],
  ['4', 'Digit4'],
  ['5', 'Digit5'],
  ['6', 'Digit6'],
  ['7', 'Digit7'],
  ['8', 'Digit8'],
  ['9', 'Digit9'],
  ['a', 'KeyA'],
  ['b', 'KeyB'],
  ['c', 'KeyC'],
  ['ç', 'KeyC'],
  ['d', 'KeyD'],
  ['e', 'KeyE'],
  ['f', 'KeyF'],
  ['g', 'KeyG'],
  ['h', 'KeyH'],
  ['i', 'KeyI'],
  ['j', 'KeyJ'],
  ['k', 'KeyK'],
  ['l', 'KeyL'],
  ['m', 'KeyM'],
  ['n', 'KeyN'],
  ['o', 'KeyO'],
  ['p', 'KeyP'],
  ['q', 'KeyQ'],
  ['r', 'KeyR'],
  ['s', 'KeyS'],
  ['t', 'KeyT'],
  ['u', 'KeyU'],
  ['v', 'KeyV'],
  ['w', 'KeyW'],
  ['x', 'KeyX'],
  ['y', 'KeyY'],
  ['z', 'KeyZ'],
  ['0', 'Numpad0'],
  ['1', 'Numpad1'],
  ['2', 'Numpad2'],
  ['3', 'Numpad3'],
  ['4', 'Numpad4'],
  ['5', 'Numpad5'],
  ['6', 'Numpad6'],
  ['7', 'Numpad7'],
  ['8', 'Numpad8'],
  ['9', 'Numpad9'],
  ['*', 'NumpadMultiply'],
  ['+', 'NumpadAdd'],
  ['-', 'NumpadSubtract'],
  ['.', 'NumpadDecimal'],
  ['/', 'NumpadDivide'],
  ['F1', 'F1'],
  ['F2', 'F2'],
  ['F3', 'F3'],
  ['F4', 'F4'],
  ['F5', 'F5'],
  ['F6', 'F6'],
  ['F7', 'F7'],
  ['F8', 'F8'],
  ['F9', 'F9'],
  ['F10', 'F10'],
  ['F11', 'F11'],
  ['F12', 'F12'],
  [';', 'Semicolon'],
  ['=', 'Equal'],
  [',', 'Comma'],
  ['-', 'Minus'],
  ['.', 'Period'],
  ['/', 'Slash'],
  ['\\', 'Backslash'],
  ['|', 'Bar'],
  ['`', 'Backquote'],
  ['[', 'BracketLeft'],
  [']', 'BracketRight'],
  ['{', 'BraceLeft'],
  ['}', 'BraceRight'],
  ['>', 'ArrowRight'],
  ['<', 'ArrowLeft'],
  ['(', 'ParenthesisLeft'],
  [')', 'ParenthesisRight'],
  ["'", 'Quote'],
  ['"', 'DoubleQuote'],
  ['?', 'Question'],
  [':', 'Colon'],
  ['!', 'Exclamation'],
  ['~', 'Tilde'],
  ['&', 'Ampersand'],
  ['$', 'Dollar'],
  ['%', 'Percent'],
  ['^', 'Caret'],
  ['#', 'Hash'],
  ['@', 'At'],
  ['_', 'Underscore']
];

export const ALPHABET_KEY = 'ABC';
export const NUMERIC_KEY = '?123';
export const NUMPAD_KEY = '1234';
export const SYMBOL_KEY = '=/<';
export const DOTCOM_KEY = '.com';
export const SPACE_KEY = ' ';

export const findKey = (n: string) => KEYBOARD_KEYS.find(k => k[1] === n.toLowerCase()) || [n, n];

export const defaultPreset = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'],
  [NUMERIC_KEY, ',', SPACE_KEY, '.', 'Enter']
].map(line => line.map(findKey));

export const numericPreset = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['@', '#', '$', '_', '&', '-', '+', '(', ')', '/'],
  [SYMBOL_KEY, '*', '"', "'", ':', ';', '!', '?', 'Backspace'],
  [ALPHABET_KEY, NUMPAD_KEY, ',', SPACE_KEY, '.', 'Enter']
].map(line => line.map(findKey));

export const numpadPreset = [
  //['/', '*', '-', '+'],
  ['1', '2', '3', ALPHABET_KEY],
  ['4', '5', '6', SYMBOL_KEY],
  ['7', '8', '9', 'Backspace'],
  ['.', '0', ',', 'Enter']
].map(line => line.map(findKey));

export const symbolPreset = [
  ['~', '`', '|', '•', '√', 'π', '÷', '×', '§', '∆'],
  ['£', '¢', '€', '¥', '^', '°', '=', '{', '}', '\\'],
  [NUMERIC_KEY, '%', '©', '®', '™', '✓', '[', ']', 'Backspace'],
  [ALPHABET_KEY, NUMPAD_KEY, '<', SPACE_KEY, '>', 'Enter']
].map(line => line.map(findKey));

export const emailPreset = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'],
  [NUMERIC_KEY, '@', DOTCOM_KEY, SPACE_KEY, '.', 'Enter']
].map(line => line.map(findKey));
