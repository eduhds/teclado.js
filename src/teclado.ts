const KEYBOARD_ID = 'keyboard-xyz';

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

const ALPHABET_KEY = 'ABC';
const NUMERIC_KEY = '?123';
const NUMBERPAD_KEY = '1234';
const SYMBOL_KEY = '=/<';

const findKey = (n: string) => KEYBOARD_KEYS.find(k => k[1] === n) || [n, n];

const alphabetPreset = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'],
  [NUMERIC_KEY, ',', ' ', '.', 'Enter']
].map(line => line.map(findKey));

const numericPreset = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['@', '#', '$', '_', '&', '-', '+', '(', ')', '/'],
  [SYMBOL_KEY, '*', '"', "'", ':', ';', '!', '?', 'Backspace'],
  [ALPHABET_KEY, ',', NUMBERPAD_KEY, ' ', '.', 'Enter']
].map(line => line.map(findKey));

const numpadPreset = [
  //['/', '*', '-', '+'],
  ['1', '2', '3', ALPHABET_KEY],
  ['4', '5', '6', SYMBOL_KEY],
  ['7', '8', '9', 'Backspace'],
  ['.', '0', ',', 'Enter']
].map(line => line.map(findKey));

const symbolPreset = [
  ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')'],
  ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')'],
  [NUMERIC_KEY, '!', '@', '#', '$', '%', '^', '&', '*', '(', ')'],
  [ALPHABET_KEY, '!', '@', '#', '$', '%', '^', '&', '*', '(', ')']
].map(line => line.map(findKey));

let focusedElementId: string;
let changeHandlers: Record<string, (value?: string) => void> = {};
let keyClicked = false;
let shiftKeyOn = false;
let customOptions: TecladoOptions;

type TecladoOptions = {
  contentClass?: string;
  keyClass?: string;
  keySymbols?: {
    backspace?: string;
    enter?: string;
    shift?: string;
    tab?: string;
  };
  preset?: 'alphabet' | 'numeric' | 'numpad' | 'symbol';
};

function buildContent(preset: any) {
  const ctn = document.getElementById('teclado-content');
  if (ctn) {
    ctn.parentElement?.removeChild(ctn);
  }

  // Content element
  const content = document.createElement('div');
  content.id = 'teclado-content';
  content.style.display = 'flex';
  content.style.flexDirection = 'column';
  content.style.justifyContent = 'center';
  content.style.gap = '10px';

  const buttonsIds = [];
  const presets = { alphabetPreset, numericPreset, numpadPreset, symbolPreset };
  // @ts-ignore
  const keyboardPreset = presets[preset ? `${preset}Preset` : 'alphabetPreset'];

  for (const lineKeys of keyboardPreset) {
    // Line element
    const line = document.createElement('div');
    line.style.display = 'flex';
    line.style.gap = '6px';
    line.style.justifyContent = 'center';

    for (const [key, code] of lineKeys) {
      const buttonId = `keyboard-button-${key}`;

      const button = document.createElement('button');
      //button.className = 'keyboard-button';
      button.id = buttonId;
      button.innerHTML = key;
      button.style.width = '4rem';
      button.style.height = '3rem';
      button.style.fontSize = '1.5rem';
      button.style.color = 'white';
      button.style.backgroundColor = 'black';
      button.style.borderRadius = '5px';
      button.style.display = 'flex';
      button.style.alignItems = 'center';
      button.style.justifyContent = 'center';
      button.style.cursor = 'pointer';

      if (
        key === 'Backspace' ||
        key === 'Enter' ||
        key === 'Shift' ||
        [ALPHABET_KEY, NUMERIC_KEY, SYMBOL_KEY, NUMBERPAD_KEY].includes(key)
      ) {
        button.style.width = '6rem';
        button.style.fontSize = '1rem';
      }

      if (key === ' ') {
        button.style.width = '14rem';
      }

      button.addEventListener('click', e => {
        if ([NUMERIC_KEY, NUMBERPAD_KEY, SYMBOL_KEY, ALPHABET_KEY].includes(key)) {
          const ctn = buildContent(
            key === NUMERIC_KEY
              ? 'numeric'
              : key === NUMBERPAD_KEY
              ? 'numpad'
              : key === SYMBOL_KEY
              ? 'symbol'
              : 'alphabet'
          );
          const keyboard = document.getElementById(KEYBOARD_ID);
          if (keyboard) {
            keyboard.appendChild(ctn);
          }
          e.stopPropagation();
          return;
        }

        const input = document.getElementById(focusedElementId);
        //input.value += key;
        input?.focus();
        const event = new KeyboardEvent('keydown', {
          key,
          code,
          shiftKey: shiftKeyOn
        });

        keyClicked = true;
        document.dispatchEvent(event);
        e.stopPropagation();
      });

      line.appendChild(button);

      buttonsIds.push(buttonId);
    }

    content.appendChild(line);
  }

  return content;
}

export function teclado(options: TecladoOptions = {}) {
  if (!customOptions) {
    customOptions = options;
  }

  const keyboard = document.getElementById(KEYBOARD_ID);

  if (keyboard) {
    keyboard.parentNode?.removeChild(keyboard);
  }

  // Container element
  const container = document.createElement('div');
  container.id = KEYBOARD_ID;
  container.style.position = 'fixed';
  container.style.bottom = '0px';
  container.style.left = '0px';
  container.style.right = '0px';
  container.style.display = 'none';
  container.style.zIndex = '9999';
  container.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
  container.style.padding = '10px';

  const content = buildContent(options.preset);

  container.appendChild(content);

  document.body.appendChild(container);

  document.addEventListener('click', function (event) {
    const keyboard = document.getElementById(KEYBOARD_ID);
    const input = document.getElementById(focusedElementId);

    if (keyboard && input) {
      const isClickInsideInput = input?.contains(event.target as HTMLElement);
      const isClickedInsideKeyboard = keyboard?.contains(event.target as HTMLElement);

      if (!isClickInsideInput && !isClickedInsideKeyboard) {
        input.blur();
        hideKeyboard();
        focusedElementId = '';
      }
    } else {
      hideKeyboard();
      focusedElementId = '';
    }
  });

  document.addEventListener('keydown', function (event) {
    if (!keyClicked) {
      //event.preventDefault();
      return;
    }

    const input = document.getElementById(focusedElementId);

    if (input) {
      switch (event.key) {
        case 'Backspace':
          // @ts-ignore
          changeHandlers[focusedElementId]?.(input.value.slice(0, -1));
          break;
        case 'Delete':
          changeHandlers[focusedElementId]?.('');
          break;
        case 'Enter':
        case 'Escape':
          input.blur();
          hideKeyboard();
          focusedElementId = '';
          break;
        case 'Shift':
          shiftKeyOn = true;
          break;
        default:
          const keyValue = shiftKeyOn ? event.key.toUpperCase() : event.key;
          // @ts-ignore
          changeHandlers[focusedElementId]?.(input.value + keyValue);
          shiftKeyOn = false;
          break;
      }
    }
    keyClicked = false;
  });

  function showKeyboard() {
    const keyboard = document.getElementById(KEYBOARD_ID);
    if (keyboard) keyboard.style.display = 'block';
  }

  function hideKeyboard() {
    const keyboard = document.getElementById(KEYBOARD_ID);
    if (keyboard) keyboard.style.display = 'none';
  }

  return {
    addEventListeners(elmentId: string, onChangeCallback: (value?: string) => void) {
      const inputElement = document.getElementById(elmentId);
      if (!inputElement) return;

      changeHandlers[elmentId] = onChangeCallback;

      const listener = () => {
        focusedElementId = inputElement.id;
        showKeyboard();
      };

      //const inputElements = document.querySelectorAll('input');
      //inputElements.forEach(inputElement => {
      // @ts-ignore
      if (['text', 'password', 'number', 'tel', 'email', 'date'].includes(inputElement.type)) {
        inputElement.removeEventListener('focus', listener);
        inputElement.addEventListener('focus', listener);

        /* inputElement.addEventListener('blur', _ => {
        hideKeyboard();
      }); */
      }
      //});
    }
  };
}
