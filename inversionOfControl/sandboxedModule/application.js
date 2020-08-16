'use strict';

// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.

// Вывод из глобального контекста модуля
console.log('From application global context');

util.debuglog('hello from foo [%d]', 123);

module.exports = () => {
  // Вывод из контекста экспортируемой функции
  console.log('From application exported function');
};
