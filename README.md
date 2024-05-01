# teclado.js

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![PNPM](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

Simple virtual keyboard inspired by mobile keyboards.

[Documentação](https://eduhds.github.io/teclado.js)

## Instalação

```sh
npm i eduhds/teclado.js
yarn add eduhds/teclado.js
pnpm add eduhds/teclado.js
```

## Usage

Default keyboard:

```html
<input type="text" id="inputId" />

<script type="module">
  import { teclado } from 'teclado.js';

  var kb = teclado();

  kb.on('inputId', value => {
    document.getElementById('inputId').value = val;
  });
</script>
```

Custom layout with options:

```html
<input type="text" id="inputId" />

<script type="module">
  import { teclado } from 'teclado.js';

  var kb = teclado({
    keySymbols: {
      Backspace: '⌫',
      Enter: '⏎',
      Shift: '⇧'
    },
    preset: [
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ç'],
      ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'],
      ['Numeric', ',', ' ', '.', 'Enter']
    ],
    withHeader: true,
    theme: 'dark'
  });

  kb.on('inputId', val => {
    document.getElementById('inputId').value = val;
  });
</script>
```

## Desenvolvimento

```sh
# Limpar outputs
pnpm run clean

# Compilar lib
pnpm run tsc

# Executar testes
pnpm run test

# Gerar documentação
pnpm run docs
```
