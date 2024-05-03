import { ALPHABET_KEY, NUMPAD_KEY, NUMERIC_KEY, SYMBOL_KEY, defaultPreset, numericPreset, numpadPreset, symbolPreset, findKey, emailPreset, DOTCOM_KEY } from './presets.js';
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
let customOptions;
let inputConfig = new Map();
let keyboardType = 'default';
let focusedInputId;
let keyClicked = false;
let shiftKey = false;
let headerText = '';
let isLongClick = false;
let longClickTimeout;
let keyVariants;
export function teclado(options = {}) {
    var _a;
    if (!customOptions) {
        if (typeof options.preset === 'object') {
            presets.default = options.preset
                .map(line => line.map(k => (k === 'Numeric' ? NUMERIC_KEY : k)))
                .map(line => line.map(k => (typeof k === 'string' ? findKey(k) : [k[0], k[0], ...k.slice(1)])));
        }
        customOptions = options;
    }
    const keyboard = document.getElementById(KEYBOARD_ID);
    if (keyboard) {
        (_a = keyboard.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(keyboard);
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
    }
    else {
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
        on(inputId, config) {
            if (!inputId || !config || !config.onChange) {
                throw new Error('Element Id and changeCallback are required');
            }
            const inputElement = document.getElementById(inputId);
            if (!inputElement || !ALLOWED_INPUT_TYPES.includes(inputElement.type)) {
                throw new Error('Element not found or not supported, check if Id and type is correct');
            }
            const onChange = customOptions.withHeader
                ? (value) => {
                    const header = document.getElementById(`${KEYBOARD_ID}-header`);
                    if (header) {
                        headerText = value || '';
                        header.innerText =
                            inputElement.type === 'password' ? secureText(headerText) : headerText;
                    }
                    config.onChange(value);
                }
                : config.onChange;
            inputConfig.set(inputId, Object.assign(Object.assign({}, config), { onChange }));
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
    var _a;
    const keyboard = document.getElementById(KEYBOARD_ID);
    if (keyboard) {
        keyboardType = ((_a = inputConfig.get(focusedInputId)) === null || _a === void 0 ? void 0 : _a.keyboardType) || 'default';
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
function onClickListener(event) {
    const keyboard = document.getElementById(KEYBOARD_ID);
    const input = document.getElementById(focusedInputId);
    if (keyboard && input) {
        const isClickInsideInput = input === null || input === void 0 ? void 0 : input.contains(event.target);
        const isClickedInsideKeyboard = keyboard === null || keyboard === void 0 ? void 0 : keyboard.contains(event.target);
        if (!isClickInsideInput && !isClickedInsideKeyboard) {
            input.blur();
            hideKeyboard();
        }
    }
    else {
        hideKeyboard();
    }
}
function onKeyDownListener(event) {
    var _a, _b, _c, _d, _e;
    if (!keyClicked) {
        if (customOptions.disablePhisicalKeyboard) {
            event.preventDefault();
        }
        return;
    }
    const input = document.getElementById(focusedInputId);
    if (input) {
        switch (event.key) {
            case 'Backspace':
                (_a = inputConfig.get(focusedInputId)) === null || _a === void 0 ? void 0 : _a.onChange(input.value.slice(0, -1));
                break;
            case 'Delete':
                (_b = inputConfig.get(focusedInputId)) === null || _b === void 0 ? void 0 : _b.onChange('');
                break;
            case 'Enter':
                (_d = (_c = inputConfig.get(focusedInputId)) === null || _c === void 0 ? void 0 : _c.onSubmit) === null || _d === void 0 ? void 0 : _d.call(_c);
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
                (_e = inputConfig.get(focusedInputId)) === null || _e === void 0 ? void 0 : _e.onChange(input.value + keyValue);
                break;
        }
    }
    // Voltar para false para permitir entrada do teclado fśisico
    keyClicked = false;
}
function buildContent() {
    var _a, _b, _c;
    const contentId = `${KEYBOARD_ID}-content`;
    const existingContent = document.getElementById(contentId);
    if (existingContent) {
        (_a = existingContent === null || existingContent === void 0 ? void 0 : existingContent.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(existingContent);
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
    if (customOptions === null || customOptions === void 0 ? void 0 : customOptions.contentClass) {
        content.className = customOptions.contentClass;
    }
    if (customOptions === null || customOptions === void 0 ? void 0 : customOptions.withHeader) {
        // Header
        const input = document.getElementById(focusedInputId);
        if (input) {
            headerText = input.value || '';
        }
        const header = document.createElement('div');
        header.id = `${KEYBOARD_ID}-header`;
        header.style.display = 'flex';
        header.style.paddingLeft = '10px';
        header.style.paddingRight = '10px';
        header.style.justifyContent = 'center';
        header.style.alignItems = 'center';
        header.style.fontSize = '1rem';
        header.style.height = '1.5rem';
        header.innerText = (input === null || input === void 0 ? void 0 : input.type) === 'password' ? secureText(headerText) : headerText;
        if (customOptions.theme === 'dark') {
            header.style.color = '#fff';
        }
        else {
            header.style.color = '#000';
        }
        content.appendChild(header);
    }
    if (!customOptions.preset && keyboardType === 'default') {
        if (((_b = document.getElementById(focusedInputId)) === null || _b === void 0 ? void 0 : _b.type) === 'email') {
            keyboardType = 'email';
        }
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
        for (const [key, code, ...rest] of lineKeys) {
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
            let boxShadow;
            let boxShadowOnClick;
            if (customOptions.theme === 'dark') {
                boxShadow = '0 2px 4px rgba(255, 255, 255, 0.2)';
                boxShadowOnClick = '0 4px 8px rgba(255, 255, 255, 0.4)';
                button.style.background = '#333';
                button.style.color = '#fff';
                button.style.border = '1px solid #666';
                button.style.boxShadow = boxShadow;
                button.style.transition = 'box-shadow 0.3s ease';
            }
            else {
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
                if (rest === null || rest === void 0 ? void 0 : rest.length) {
                    longClickTimeout = setTimeout(() => {
                        isLongClick = true;
                        keyVariants = [...rest];
                        // Variants container
                        const variantsContainer = document.createElement('div');
                        variantsContainer.style.position = 'absolute';
                        variantsContainer.style.top = '0';
                        variantsContainer.style.left = '0';
                        variantsContainer.style.width = '100%';
                        variantsContainer.style.height = '100%';
                        variantsContainer.style.zIndex = '9999';
                        variantsContainer.style.display = 'flex';
                        variantsContainer.style.justifyContent = 'center';
                        variantsContainer.style.alignItems = 'center';
                        variantsContainer.style.flexWrap = 'wrap';
                        variantsContainer.style.gap = '10px';
                        if (customOptions.theme === 'dark') {
                            variantsContainer.style.backgroundColor = 'rgba(51, 51, 51, 0.8)';
                        }
                        else {
                            variantsContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                        }
                        for (const variant of keyVariants) {
                            // Variant key button
                            const variantButton = document.createElement('button');
                            variantButton.innerText = shiftKey ? variant.toUpperCase() : variant;
                            variantButton.style.width = '3rem';
                            variantButton.style.height = '3rem';
                            variantButton.style.fontSize = '1.5rem';
                            variantButton.style.borderRadius = '5px';
                            variantButton.style.display = 'flex';
                            variantButton.style.alignItems = 'center';
                            variantButton.style.justifyContent = 'center';
                            variantButton.style.cursor = 'pointer';
                            if (customOptions.theme === 'dark') {
                                variantButton.style.background = '#333';
                                variantButton.style.color = '#fff';
                                variantButton.style.border = '1px solid #666';
                            }
                            else {
                                variantButton.style.background = '#fff';
                                variantButton.style.color = '#000';
                                variantButton.style.border = '1px solid #ccc';
                            }
                            variantButton.addEventListener('click', e => {
                                var _a;
                                const input = document.getElementById(focusedInputId);
                                input === null || input === void 0 ? void 0 : input.focus();
                                const event = new KeyboardEvent('keydown', {
                                    key: variant,
                                    code: variant,
                                    shiftKey
                                });
                                keyClicked = true;
                                keyVariants = undefined;
                                document.dispatchEvent(event);
                                e.stopPropagation();
                                (_a = variantsContainer.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(variantsContainer);
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
            if ((customOptions === null || customOptions === void 0 ? void 0 : customOptions.keySymbols) && ['Backspace', 'Enter', 'Shift'].includes(key)) {
                // @ts-ignore
                keyValue = customOptions.keySymbols[key] || key;
            }
            if (shiftKey) {
                keyValue = keyValue.toUpperCase();
            }
            button.innerHTML = keyValue;
            if (key === 'Backspace' ||
                key === 'Enter' ||
                key === 'Shift' ||
                [ALPHABET_KEY, NUMERIC_KEY, SYMBOL_KEY, NUMPAD_KEY, DOTCOM_KEY].includes(key)) {
                button.style.width = '6rem';
                // @ts-ignore
                if (!((_c = customOptions === null || customOptions === void 0 ? void 0 : customOptions.keySymbols) === null || _c === void 0 ? void 0 : _c[key])) {
                    button.style.fontSize = '1rem';
                }
            }
            if (key === ' ') {
                button.style.width = '14rem';
            }
            if (key === 'Shift') {
                if (shiftKey) {
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
                }
                else {
                    const dotIndicator = button.querySelector('#dot-indicator');
                    if (dotIndicator) {
                        button.removeChild(dotIndicator);
                    }
                }
            }
            if (customOptions === null || customOptions === void 0 ? void 0 : customOptions.keyClass) {
                button.className = customOptions.keyClass;
            }
            button.addEventListener('click', e => {
                if (keyVariants === null || keyVariants === void 0 ? void 0 : keyVariants.length) {
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
                input === null || input === void 0 ? void 0 : input.focus();
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
function secureText(text) {
    return Array.from({ length: text.length }, () => '*').join('');
}
