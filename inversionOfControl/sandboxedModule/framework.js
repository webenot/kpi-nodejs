'use strict';

// Файл, демонстрирующий то, как фреймворк создает среду (песочницу) для
// исполнения приложения, загружает приложение, передает ему песочницу в
// качестве глобального контекста и получает ссылу на экспортируемый
// приложением интерфейс. Читайте README.md в нем задания.

// Фреймворк может явно зависеть от библиотек через dependency lookup
global.api = {};
api.fs = require('fs');
api.vm = require('vm');
api.timers = require('timers');
api.util = require('util');

const fileName = `./${process.argv[2]}` || './application.js';

const consoleLog = (...args) => {
  const loggedMessage = `${fileName} ${new Date().toISOString()}`;
  args = [ loggedMessage, ...args ];
  console.log(args.join(' '));
};

const consoleDir = (args, options = {}) => {
  console.dir(args, options);
};

const wrapFunction = (fnName, fn) => (...args) => {
  const argsLength = args.length;
  for (let i = 0; i < argsLength; i++) {
    let callback = args[i];
    if (typeof callback === 'function') {
      args[i] = (...pars) => {
        console.log(`Callback: ${fnName}`);
        callback(...pars);
      };
    } else {
      callback = null;
    }
  }
  console.log(`Call: ${fnName}`);
  console.dir(args);
  fn(...args);
};

const cloneInterface = anInterface => {
  const clone = {};
  for (const key in anInterface) {
    const fn = anInterface[key];
    clone[key] = wrapFunction(key, fn);
  }
  return clone;
};

const wrapRequire = name => {
  console.log(`${new Date().toISOString()} ${name}`);
  return require(name);
};

// Создаем контекст-песочницу, которая станет глобальным контекстом приложения
const context = {
  module: {},
  console: { log: consoleLog, dir: consoleDir },
  require: wrapRequire,
  setTimeout: wrapFunction('setTimeout', api.timers.setTimeout),
  setInterval: wrapFunction('setInterval', api.timers.setInterval),
  clearInterval: wrapFunction('clearInterval', api.timers.clearInterval),
  util: cloneInterface(api.util),
}; // module: {}, /*console: console*/ };
context.global = context;
const sandbox = api.vm.createContext(context);

// Читаем исходный код приложения из файла
api.fs.readFile(fileName, 'utf8', (err, src) => {
  // Тут нужно обработать ошибки

  // Запускаем код приложения в песочнице
  const script = api.vm.createScript(src, fileName);
  script.runInNewContext(sandbox);

  // Забираем ссылку из sandbox.module.exports, можем ее исполнить,
  // сохранить в кеш, вывести на экран исходный код приложения и т.д.
});
