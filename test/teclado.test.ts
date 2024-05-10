/**
 * @jest-environment jsdom
 */

import { teclado } from '../lib/esm/index';

beforeAll(() => {
  document.body.innerHTML = `
<input type="text" id="inputText" />
<input type="email" id="inputEmail" />
`;
});

test('Should input "Hello"', () => {
  const tcld = teclado();

  const input = document.getElementById('inputText') as HTMLInputElement;

  tcld.on('inputText', {
    onChange: value => {
      input.value = value || '';
    }
  });

  input.focus();

  (document.getElementById('tecladojs-keyboard-button-Shift') as HTMLButtonElement).click();
  (document.getElementById('tecladojs-keyboard-button-h') as HTMLButtonElement).click();
  (document.getElementById('tecladojs-keyboard-button-Shift') as HTMLButtonElement).click();

  for (const i of 'ello'.split('')) {
    (document.querySelector(`#tecladojs-keyboard-button-${i}`) as HTMLButtonElement).click();
  }

  expect(input.value).toBe('Hello');
});

test('Should input "@"', () => {
  const tcld = teclado();

  const input = document.getElementById('inputEmail') as HTMLInputElement;

  tcld.on('inputEmail', {
    onChange: value => {
      input.value = value || '';
    }
  });

  input.focus();

  (document.getElementById('tecladojs-keyboard-button-@') as HTMLButtonElement).click();

  expect(input.value).toBe('@');
});
