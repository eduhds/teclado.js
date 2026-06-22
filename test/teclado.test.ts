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

test('Email keyboard should not have KeyQ variant on "q" key', () => {
  jest.useFakeTimers();
  const tcld = teclado();

  const input = document.getElementById('inputEmail') as HTMLInputElement;

  tcld.on('inputEmail', {
    onChange: value => {
      input.value = value || '';
    }
  });

  input.focus();

  const qButton = document.getElementById('tecladojs-keyboard-button-q') as HTMLButtonElement;
  expect(qButton).toBeTruthy();

  // Trigger mousedown to start long click timeout
  qButton.dispatchEvent(new MouseEvent('mousedown'));

  // Fast-forward time
  jest.advanceTimersByTime(500);

  // Check if variants container was created
  const variants = qButton.querySelector('div');
  expect(variants).toBeNull();

  jest.useRealTimers();
});

test('Physical keyboard input should update the preview panel', () => {
  const tcld = teclado();
  const input = document.getElementById('inputText') as HTMLInputElement;

  tcld.on('inputText', {
    onChange: value => {
      input.value = value || '';
    }
  });

  input.value = '';
  input.focus();

  const panel = document.getElementById('tecladojs-keyboard-panel') as HTMLDivElement;
  expect(panel).toBeTruthy();
  expect(panel.querySelector('span')?.innerText).toBe('');

  // Simulate physical input typing "Abc"
  input.value = 'Abc';
  input.dispatchEvent(new Event('input'));

  // The panel span should update to "Abc"
  expect(panel.querySelector('span')?.innerText).toBe('Abc');
});


