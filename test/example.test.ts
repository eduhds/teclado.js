import { sayHello } from '../src';

test('Should return "Hello World!"', () => {
  expect(sayHello()).toEqual('Hello World!');
});
