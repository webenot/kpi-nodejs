'use strict';

// Объявляем функцию для события таймера
const timerEvent = () => {
  console.log('From application timer event');
};

console.log('setTimeout', setTimeout);

// Вывод из глобального контекста модуля
const fileName = './README.md';
console.log('From application global context');
console.log(`Application going to read ${fileName}`);
fs.readFile(fileName, 'utf8', (err, src) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`File ${fileName} length: ${src.length}`);
});

// Устанавливаем функцию на таймер
setTimeout(timerEvent, 1000);
