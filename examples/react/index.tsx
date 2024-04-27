import React from 'react';
import teclado from 'teclado.js';

const keyboard = teclado();

export function App() {
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    keyboard.addEventListeners('myElement', val => {
      setValue(val);
    });
  }, []);

  return (
    <>
      <input type='text' id='myElement' value={value} onChange={e => setValue(e.target.value)} />
      <button className='btn btn-primary' onClick={() => console.log('testando', testando)}>
        show value
      </button>
    </>
  );
}
