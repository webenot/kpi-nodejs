'use strict';

// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.

const test = require('util');
console.dir({ test });

// Вывод из глобального контекста модуля
console.log('From test global context');

module.exports = () => {
  // Вывод из контекста экспортируемой функции
  console.log('From test exported function');
};

console.dir({ global });
