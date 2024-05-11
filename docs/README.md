# teclado.js

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![PNPM](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

## 📦 Install

```sh
npm i teclado.js

# Or with yarn
yarn add teclado.js

# Or with pnpm
pnpm add teclado.js
```

## ⌨️ Basic Usage

```html
<input type="text" id="inputId" />
```

```javascript
import { teclado } from 'teclado.js';

var tcld = teclado();

tcld.on('inputId', {
  onChange: value => {
    document.getElementById('inputId').value = value;
  }
});
```

## 📚 API

### Options

TODO

### Examples

#### Frameworks

##### React

```javascript
import React from 'react';
import {teclado} from 'teclado.js';

const tcld = teclado();

export function App() {
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    tcld.on('inputId', {
      onChange: val => setValue(val || '');
    });
  }, []);

  return (
    <input type='text' id='inputId' value={value} onChange={e => setValue(e.target.value)} />
  );
}
```

#### Recipes

##### Custom symbols

```javascript
var tcld = teclado({
  keySymbols: {
    Backspace: '⌫',
    Enter: '⏎',
    Shift: '⇧'
  }
});
```

##### Change theme

```javascript
var tcld = teclado({
  theme: 'dark' // or light
});
```
