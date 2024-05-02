import {
  ALPHABET_KEY,
  NUMPAD_KEY,
  NUMERIC_KEY,
  SYMBOL_KEY,
  alphabetPreset,
  numericPreset,
  numpadPreset,
  symbolPreset,
  findKey
} from './presets.js';

type Preset = Array<Array<string>>;

type KeyboardType = keyof typeof presets;

type ChangeHandlers = { onChange: (value?: string) => void; onSubmit?: () => void };

type TecladoOptions = {
  contentClass?: string;
  keyClass?: string;
  keySymbols?: {
    Backspace?: string;
    Enter?: string;
    Shift?: string;
    Tab?: string;
  };
  preset?: Preset;
  disablePhisicalKeyboard?: boolean;
  theme?: 'light' | 'dark';
  withHeader?: boolean;
};

const KEYBOARD_ID = 'tecladojs-keyboard';

const ALLOWED_INPUT_TYPES = [
  'text',
  'date',
  'datetime-local',
  'email',
  'month',
  'number',
  'password',
  'search',
  'tel',
  'text',
  'time',
  'url',
  'week'
];

let presets = {
  alphabet: alphabetPreset,
  numeric: numericPreset,
  numpad: numpadPreset,
  symbol: symbolPreset
};

let focusedElementId: string;
let changeHandlers: Map<string, ChangeHandlers> = new Map();
let keyClicked = false;
let shiftKeyOn = false;
let customOptions: TecladoOptions;
let headerText = '';
let keyboardType: KeyboardType = 'alphabet';

export function teclado(options: TecladoOptions = {}) {
  if (!customOptions) {
    if (typeof options.preset === 'object') {
      presets.alphabet = options.preset
        .map(line => line.map(k => (k === 'Numeric' ? NUMERIC_KEY : k)))
        .map(line => line.map(findKey));
    }

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
  container.style.width = '100%';
  container.style.userSelect = 'none';

  if (customOptions.theme === 'dark') {
    container.style.background = '#333';
    container.style.color = '#fff';
    container.style.border = '1px solid #666';
  } else {
    container.style.background = '#fff';
    container.style.color = '#000';
    container.style.border = '1px solid #ccc';
  }

  container.appendChild(buildContent());

  document.body.appendChild(container);

  document.removeEventListener('click', onClickListener);
  document.addEventListener('click', onClickListener);

  document.removeEventListener('keydown', onKeyDownListener);
  document.addEventListener('keydown', onKeyDownListener);

  return {
    showKeyboard,
    hideKeyboard,
    setKeyboardType,
    on(elmentId: string, changeCallback: (value?: string) => void, submitCallback?: () => void) {
      const inputElement = document.getElementById(elmentId) as HTMLInputElement;

      if (!elmentId || !changeCallback) {
        throw new Error('Element Id and changeCallback are required');
      }

      if (!inputElement || !ALLOWED_INPUT_TYPES.includes(inputElement.type)) {
        throw new Error('Element not found or not supported, check if Id and type is correct');
      }

      const onChange = customOptions.withHeader
        ? (value?: string) => {
            const header = document.getElementById(`${KEYBOARD_ID}-header`);
            if (header) {
              headerText = value || '';
              header.innerText = headerText;
            }
            changeCallback(value);
          }
        : changeCallback;

      const onSubmit = submitCallback;

      changeHandlers.set(elmentId, { onSubmit, onChange });

      const listener = () => {
        focusedElementId = inputElement.id;
        showKeyboard();
      };

      inputElement.removeEventListener('focus', listener);
      inputElement.addEventListener('focus', listener);

      const unsubscribe = () => {
        inputElement.removeEventListener('focus', listener);
        changeHandlers.delete(elmentId);
      };

      return unsubscribe;
    }
  };
}

function showKeyboard() {
  const keyboard = document.getElementById(KEYBOARD_ID);
  if (keyboard) {
    keyboard.style.display = 'block';
    keyboard.style.transform = 'translateY(0)';
  }
}

function hideKeyboard() {
  const keyboard = document.getElementById(KEYBOARD_ID);
  if (keyboard) {
    keyboard.style.transform = 'translateY(100%)';
    setTimeout(() => {
      keyboard.style.display = 'none';
    }, 300);
  }
  focusedElementId = '';
  headerText = '';
  shiftKeyOn = false;
  keyboardType = 'alphabet';
}

function setKeyboardType(type: KeyboardType) {
  if (type in presets) {
    keyboardType = type;
    return;
  }
  throw new Error('Invalid keyboard type');
}

function onClickListener(event: MouseEvent) {
  const keyboard = document.getElementById(KEYBOARD_ID);
  const input = document.getElementById(focusedElementId);

  if (keyboard && input) {
    const isClickInsideInput = input?.contains(event.target as HTMLElement);
    const isClickedInsideKeyboard = keyboard?.contains(event.target as HTMLElement);

    if (!isClickInsideInput && !isClickedInsideKeyboard) {
      input.blur();
      hideKeyboard();
    }
  } else {
    hideKeyboard();
  }
}

function onKeyDownListener(event: KeyboardEvent) {
  if (!keyClicked) {
    if (customOptions.disablePhisicalKeyboard) {
      event.preventDefault();
    }
    return;
  }

  const input = document.getElementById(focusedElementId) as HTMLInputElement;

  if (input) {
    switch (event.key) {
      case 'Backspace':
        changeHandlers.get(focusedElementId)?.onChange(input.value.slice(0, -1));
        break;
      case 'Delete':
        changeHandlers.get(focusedElementId)?.onChange('');
        break;
      case 'Enter':
        changeHandlers.get(focusedElementId)?.onSubmit?.();
      case 'Escape':
        input.blur();
        hideKeyboard();
        break;
      case 'Shift':
        shiftKeyOn = !shiftKeyOn;
        const keyboard = document.getElementById(KEYBOARD_ID);
        if (keyboard) {
          keyboard.appendChild(buildContent());
        }
        break;
      default:
        const keyValue = shiftKeyOn ? event.key.toUpperCase() : event.key;
        changeHandlers.get(focusedElementId)?.onChange(input.value + keyValue);
        break;
    }
  }
  keyClicked = false;
}

function buildContent() {
  const contentId = `${KEYBOARD_ID}-content`;

  const existingContent = document.getElementById(contentId);

  if (existingContent) {
    existingContent?.parentElement?.removeChild(existingContent);
  }

  // Content element
  const content = document.createElement('div');
  content.id = contentId;
  content.style.display = 'flex';
  content.style.flexDirection = 'column';
  content.style.justifyContent = 'center';
  content.style.gap = '10px';
  content.style.paddingTop = '10px';
  content.style.paddingBottom = '10px';
  content.style.width = '100%';

  if (customOptions?.contentClass) {
    content.className = customOptions.contentClass;
  }

  if (customOptions?.withHeader) {
    // Header
    const header = document.createElement('div');
    header.id = `${KEYBOARD_ID}-header`;
    header.style.display = 'flex';
    header.style.paddingLeft = '10px';
    header.style.paddingRight = '10px';
    header.style.justifyContent = 'center';
    header.style.alignItems = 'center';
    header.style.fontSize = '1rem';
    header.style.height = '1.5rem';
    header.innerText = headerText;

    if (customOptions.theme === 'dark') {
      header.style.color = '#fff';
    } else {
      header.style.color = '#000';
    }

    content.appendChild(header);
  }

  const keyboardPreset = presets[keyboardType];

  for (const lineKeys of keyboardPreset) {
    // Line element
    const line = document.createElement('div');
    line.style.display = 'flex';
    line.style.gap = '6px';
    line.style.justifyContent = 'center';
    line.style.paddingLeft = '10px';
    line.style.paddingRight = '10px';

    for (const [key, code] of lineKeys) {
      // Button element
      const buttonId = `${KEYBOARD_ID}-button-${key}`;

      const button = document.createElement('button');
      button.id = buttonId;
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

      if (customOptions.theme === 'dark') {
        button.style.background = '#333';
        button.style.color = '#fff';
        button.style.border = '1px solid #666';

        button.style.boxShadow = '0 2px 4px rgba(255, 255, 255, 0.2)';
        button.style.transition = 'box-shadow 0.3s ease';
        button.addEventListener('mousedown', () => {
          button.style.boxShadow = '0 4px 8px rgba(255, 255, 255, 0.4)';
        });
        button.addEventListener('mouseup', () => {
          button.style.boxShadow = '0 2px 4px rgba(255, 255, 255, 0.2)';
        });
      } else {
        button.style.background = '#fff';
        button.style.color = '#000';
        button.style.border = '1px solid #ccc';

        button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        button.style.transition = 'box-shadow 0.3s ease';
        button.addEventListener('mousedown', () => {
          button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.4)';
        });
        button.addEventListener('mouseup', () => {
          button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        });
      }

      let keyValue = key === NUMPAD_KEY ? key.slice(0, 2) + '</br>' + key.slice(2, 4) : key;

      if (customOptions?.keySymbols && ['Backspace', 'Enter', 'Shift'].includes(key)) {
        // @ts-ignore
        keyValue = customOptions.keySymbols[key] || key;
      }

      if (shiftKeyOn) {
        keyValue = keyValue.toUpperCase();
      }

      button.innerHTML = keyValue;

      if (
        key === 'Backspace' ||
        key === 'Enter' ||
        key === 'Shift' ||
        [ALPHABET_KEY, NUMERIC_KEY, SYMBOL_KEY, NUMPAD_KEY].includes(key)
      ) {
        button.style.width = '6rem';
        // @ts-ignore
        if (!customOptions?.keySymbols?.[key]) {
          button.style.fontSize = '1rem';
        }
      }

      if (key === ' ') {
        button.style.width = '14rem';
      }

      if (key === 'Shift') {
        if (shiftKeyOn) {
          button.style.position = 'relative';
          const dotIndicator = document.createElement('div');

          dotIndicator.id = 'dot-indicator';
          dotIndicator.style.width = '0.5rem';
          dotIndicator.style.height = '0.5rem';
          dotIndicator.style.borderRadius = '50%';
          dotIndicator.style.backgroundColor = customOptions.theme === 'dark' ? '#fff' : '#000';
          dotIndicator.style.position = 'absolute';
          dotIndicator.style.top = '0.25rem';
          dotIndicator.style.right = '0.25rem';

          button.appendChild(dotIndicator);
        } else {
          const dotIndicator = button.querySelector('#dot-indicator');
          if (dotIndicator) {
            button.removeChild(dotIndicator);
          }
        }
      }

      if (customOptions?.keyClass) {
        button.className = customOptions.keyClass;
      }

      button.addEventListener('click', e => {
        if ([NUMERIC_KEY, NUMPAD_KEY, SYMBOL_KEY, ALPHABET_KEY].includes(key)) {
          keyboardType =
            key === NUMERIC_KEY
              ? 'numeric'
              : key === NUMPAD_KEY
              ? 'numpad'
              : key === SYMBOL_KEY
              ? 'symbol'
              : 'alphabet';

          const content = buildContent();

          const keyboard = document.getElementById(KEYBOARD_ID);

          if (keyboard) {
            keyboard.appendChild(content);
          }

          e.stopPropagation();
          return;
        }

        const input = document.getElementById(focusedElementId);
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
    }

    content.appendChild(line);
  }

  return content;
}
