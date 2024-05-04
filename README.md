# teclado.js

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![PNPM](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

Simple virtual keyboard inspired by mobile keyboards.

[Documentation](https://eduhds.github.io/teclado.js)

## Install

```sh
npm i teclado.js
```

Or

```sh
yarn add teclado.js
```

Or

```sh
pnpm add teclado.js
```

## Usage

Default keyboard:

```html
<input type="text" id="inputId" />

<script type="module">
  import { teclado } from 'https://cdn.jsdelivr.net/npm/teclado.js/teclado.min.js';

  var kb = teclado();

  kb.on('inputId', {
    onChange: value => {
      document.getElementById('inputId').value = value;
    }
  });
</script>
```
