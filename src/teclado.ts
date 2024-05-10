import {
  containerDiv,
  contentDiv,
  darkTheme,
  dotIndicatorDiv,
  headerDiv,
  keyButton,
  lightTheme,
  lineDiv,
  variantKeyButton,
  variantsContentDiv
} from './elements.js';
import {
  ALPHABET_KEY,
  NUMPAD_KEY,
  NUMERIC_KEY,
  SYMBOL_KEY,
  defaultPreset,
  numericPreset,
  numpadPreset,
  symbolPreset,
  findKey,
  emailPreset,
  DOTCOM_KEY
} from './presets.js';
import type { KeyboardTheme } from './elements.js';

export type KeyboardPreset = Array<Array<string | string[]>>;

export type KeyboardType = keyof typeof presets;

export type InputConfig = {
  keyboardType?: KeyboardType;
  onChange: (value?: string) => void;
  onSubmit?: () => void;
};

export type TecladoOptions = {
  contentClass?: string;
  keyClass?: string;
  keySymbols?: {
    Backspace?: string;
    Enter?: string;
    Shift?: string;
    Tab?: string;
  };
  preset?: KeyboardPreset;
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
  default: defaultPreset,
  numeric: numericPreset,
  numpad: numpadPreset,
  symbol: symbolPreset,
  email: emailPreset
};

let customOptions: TecladoOptions;
let inputConfig: Map<string, InputConfig> = new Map();
let keyboardType: KeyboardType = 'default';
let focusedInputId: string;
let keyClicked = false;
let shiftKey = false;
let headerText = '';
let isLongClick = false;
let longClickTimeout: number;
let keyVariants: string[] | undefined;
let keyboardTheme: KeyboardTheme = lightTheme;

export function teclado(options: TecladoOptions = {}) {
  if (!customOptions) {
    if (options.preset) {
      presets.default = options.preset
        .map(line => line.map(k => (k === 'Numeric' ? NUMERIC_KEY : k)))
        .map(line => line.map(findKey));
    }

    customOptions = options;

    if (customOptions.theme === 'dark') {
      keyboardTheme = darkTheme;
    }
  }

  const keyboard = document.getElementById(KEYBOARD_ID);

  if (keyboard) {
    keyboard.parentNode?.removeChild(keyboard);
  }

  // Container element
  const container = containerDiv(KEYBOARD_ID, keyboardTheme);

  container.appendChild(buildContent());

  document.body.appendChild(container);

  document.removeEventListener('click', onClickListener);
  document.addEventListener('click', onClickListener);

  document.removeEventListener('keydown', onKeyDownListener);
  document.addEventListener('keydown', onKeyDownListener);

  return {
    showKeyboard,
    hideKeyboard,
    on(inputId: string, config: InputConfig) {
      if (!inputId || !config || !config.onChange) {
        throw new Error('Element Id and changeCallback are required');
      }

      const inputElement = document.getElementById(inputId) as HTMLInputElement;

      if (!inputElement || !ALLOWED_INPUT_TYPES.includes(inputElement.type)) {
        throw new Error('Element not found or not supported, check if Id and type is correct');
      }

      const onChange = customOptions.withHeader
        ? (value?: string) => {
            const header = document.getElementById(`${KEYBOARD_ID}-header`);
            if (header) {
              headerText = value || '';
              header.innerText =
                inputElement.type === 'password' ? secureText(headerText) : headerText;
            }
            config.onChange(value);
          }
        : config.onChange;

      inputConfig.set(inputId, { ...config, onChange });

      const listener = () => {
        if (focusedInputId !== inputElement.id) {
          focusedInputId = inputElement.id;
          showKeyboard();
        }
      };

      inputElement.removeEventListener('focus', listener);
      inputElement.addEventListener('focus', listener);

      const unsubscribe = () => {
        inputElement.removeEventListener('focus', listener);
        inputConfig.delete(inputId);
      };

      return unsubscribe;
    }
  };
}

function showKeyboard() {
  const keyboard = document.getElementById(KEYBOARD_ID);
  if (keyboard) {
    keyboardType = inputConfig.get(focusedInputId)?.keyboardType || 'default';
    keyboard.appendChild(buildContent());
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
  focusedInputId = '';
  headerText = '';
  shiftKey = false;
  keyboardType = 'default';
  keyVariants = undefined;
}

function onClickListener(event: MouseEvent) {
  const keyboard = document.getElementById(KEYBOARD_ID);
  const input = document.getElementById(focusedInputId);

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

  const input = document.getElementById(focusedInputId) as HTMLInputElement;

  if (input) {
    switch (event.key) {
      case 'Backspace':
        inputConfig.get(focusedInputId)?.onChange(input.value.slice(0, -1));
        break;
      case 'Delete':
        inputConfig.get(focusedInputId)?.onChange('');
        break;
      case 'Enter':
        inputConfig.get(focusedInputId)?.onSubmit?.();
      case 'Escape':
        input.blur();
        hideKeyboard();
        break;
      case 'Shift':
        shiftKey = !shiftKey;
        const keyboard = document.getElementById(KEYBOARD_ID);
        if (keyboard) {
          keyboard.appendChild(buildContent());
        }
        break;
      default:
        const keyValue = shiftKey ? event.key.toUpperCase() : event.key;
        inputConfig.get(focusedInputId)?.onChange(input.value + keyValue);
        break;
    }
  }
  // Voltar para false para permitir entrada do teclado fśisico
  keyClicked = false;
}

function buildContent() {
  const contentId = `${KEYBOARD_ID}-content`;

  const existingContent = document.getElementById(contentId);

  if (existingContent) {
    existingContent?.parentElement?.removeChild(existingContent);
  }

  // Content element
  const content = contentDiv(contentId);

  if (customOptions?.contentClass) {
    content.className = customOptions.contentClass;
  }

  if (customOptions?.withHeader) {
    // Header
    const header = headerDiv(`${KEYBOARD_ID}-header`);

    const input = document.getElementById(focusedInputId) as HTMLInputElement;
    if (input) {
      headerText = input.value || '';
    }

    header.innerText = input?.type === 'password' ? secureText(headerText) : headerText;

    if (customOptions.theme === 'dark') {
      header.style.color = '#fff';
    } else {
      header.style.color = '#000';
    }

    content.appendChild(header);
  }

  if (!customOptions.preset && keyboardType === 'default') {
    if ((document.getElementById(focusedInputId) as HTMLInputElement)?.type === 'email') {
      keyboardType = 'email';
    }
  }

  const keyboardPreset = presets[keyboardType];

  for (const lineKeys of keyboardPreset) {
    // Line element
    const line = lineDiv();

    for (const [key, code, ...rest] of lineKeys) {
      // Button element
      const buttonId = `${KEYBOARD_ID}-button-${key}`;

      const button = keyButton(buttonId);

      let boxShadow: string;
      let boxShadowOnClick: string;

      if (customOptions.theme === 'dark') {
        boxShadow = '0 2px 4px rgba(255, 255, 255, 0.2)';
        boxShadowOnClick = '0 4px 8px rgba(255, 255, 255, 0.4)';
        button.style.background = '#333';
        button.style.color = '#fff';
        button.style.border = '1px solid #666';
        button.style.boxShadow = boxShadow;
        button.style.transition = 'box-shadow 0.3s ease';
      } else {
        boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        boxShadowOnClick = '0 4px 8px rgba(0, 0, 0, 0.4)';
        button.style.background = '#fff';
        button.style.color = '#000';
        button.style.border = '1px solid #ccc';
        button.style.boxShadow = boxShadow;
        button.style.transition = 'box-shadow 0.3s ease';
      }

      button.addEventListener('mousedown', () => {
        button.style.boxShadow = boxShadowOnClick;

        if (rest?.length) {
          longClickTimeout = setTimeout(() => {
            isLongClick = true;
            keyVariants = [...rest];

            // Variants container
            const variantsContainer = variantsContentDiv(keyboardTheme);

            for (const variant of keyVariants) {
              // Variant key button
              const variantButton = variantKeyButton(keyboardTheme);

              variantButton.innerText = shiftKey ? variant.toUpperCase() : variant;

              variantButton.addEventListener('click', e => {
                const input = document.getElementById(focusedInputId);
                input?.focus();

                const event = new KeyboardEvent('keydown', {
                  key: variant,
                  code: variant,
                  shiftKey
                });

                keyClicked = true;
                keyVariants = undefined;

                document.dispatchEvent(event);
                e.stopPropagation();

                variantsContainer.parentElement?.removeChild(variantsContainer);
              });

              variantsContainer.appendChild(variantButton);
            }

            button.appendChild(variantsContainer);
          }, 500);
        }
      });

      button.addEventListener('mouseup', e => {
        button.style.boxShadow = boxShadow;

        clearTimeout(longClickTimeout);
        if (isLongClick) {
          // Prevent the default action for the long click event
          e.preventDefault();
        }
        isLongClick = false;
      });

      let keyValue = key === NUMPAD_KEY ? key.slice(0, 2) + '</br>' + key.slice(2, 4) : key;

      if (customOptions?.keySymbols && ['Backspace', 'Enter', 'Shift'].includes(key)) {
        // @ts-ignore
        keyValue = customOptions.keySymbols[key] || key;
      }

      if (shiftKey && !['Backspace', 'Enter', 'Shift'].includes(key)) {
        keyValue = keyValue.toUpperCase();
      }

      button.innerHTML = keyValue;

      if (
        key === 'Backspace' ||
        key === 'Enter' ||
        key === 'Shift' ||
        [ALPHABET_KEY, NUMERIC_KEY, SYMBOL_KEY, NUMPAD_KEY, DOTCOM_KEY].includes(key)
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
        if (shiftKey) {
          button.style.position = 'relative';

          const dotIndicator = dotIndicatorDiv(keyboardTheme);

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
        if (keyVariants?.length) {
          e.stopPropagation();
          return;
        }

        if ([NUMERIC_KEY, NUMPAD_KEY, SYMBOL_KEY, ALPHABET_KEY].includes(key)) {
          keyboardType =
            key === NUMERIC_KEY
              ? 'numeric'
              : key === NUMPAD_KEY
              ? 'numpad'
              : key === SYMBOL_KEY
              ? 'symbol'
              : 'default';

          const keyboard = document.getElementById(KEYBOARD_ID);

          if (keyboard) {
            keyboard.appendChild(buildContent());
          }

          e.stopPropagation();
          return;
        }

        const input = document.getElementById(focusedInputId);
        input?.focus();

        const event = new KeyboardEvent('keydown', { key, code, shiftKey });

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

function secureText(text: string) {
  return Array.from({ length: text.length }, () => '*').join('');
}
