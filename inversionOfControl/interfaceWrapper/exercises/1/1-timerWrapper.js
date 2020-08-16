'use strict';

global.api = {};
api.fs = require('fs');
api.vm = require('vm');
api.timers = require('timers');

const statistic = {
  functionCalls: new Map(),
  callbacksCalls: new Map(),
  functionExecuteTime: 0,
  callbackReturnTime: 0,
  bytesRead: 0,
  bytesWrite: 0,
  readWriteSpeed: 0,
};

const wrapFunction = (fnName, fn) => (...args) => {
  const argsLength = args.length;
  if (argsLength > 0) {
    for (let i = 0; i < argsLength; i++) {
      let callback = args[i];
      if (typeof callback === 'function') {
        args[i] = (...pars) => {
          console.log(`Callback: ${fnName}`);
          const callbackCallsCount = statistic.callbacksCalls.get(fnName);
          if (callbackCallsCount) {
            statistic.callbacksCalls.set(fnName, callbackCallsCount + 1);
          } else {
            statistic.callbacksCalls.set(fnName, 1);
          }
          const startCallback = Date.now();
          callback(...pars);
          const endCallback = Date.now();
          if (fnName === 'readFile' || fnName === 'writeFile') {
            if (statistic.readWriteSpeed) {
              statistic.readWriteSpeed =
                (statistic.readWriteSpeed + (endCallback - startCallback)) / 2;
            } else {
              statistic.readWriteSpeed = (endCallback - startCallback);
            }
          }
          if (statistic.callbackReturnTime) {
            statistic.callbackReturnTime =
              (statistic.callbackReturnTime + (endCallback - start)) / 2;
          } else {
            statistic.callbackReturnTime = (endCallback - start);
          }
          if (fnName === 'readFile') {
            statistic.bytesRead += pars[pars.length - 1].length;
          }
          if (fnName === 'writeFile') {
            statistic.bytesWrite += pars[pars.length - 1].length;
          }
        };
      } else {
        callback = null;
      }
    }
  }
  console.log(`Call: ${fnName}`);
  console.dir(args);
  const start = Date.now();
  fn(...args);
  const end = Date.now();
  if (statistic.functionExecuteTime) {
    statistic.functionExecuteTime =
      (statistic.functionExecuteTime + (end - start)) / 2;
  } else {
    statistic.functionExecuteTime = (end - start);
  }
  const funcCallsCount = statistic.functionCalls.get(fnName);
  if (funcCallsCount) {
    statistic.functionCalls.set(fnName, funcCallsCount + 1);
  } else {
    statistic.functionCalls.set(fnName, 1);
  }
};

const cloneInterface = anInterface => {
  const clone = {};
  for (const key in anInterface) {
    if (anInterface.hasOwnProperty(key)) {
      const fn = anInterface[key];
      clone[key] = wrapFunction(key, fn);
    }
  }
  return clone;
};

const context = {
  module: {},
  console,
  fs: cloneInterface(api.fs),
  setTimeout: wrapFunction('setTimeout', api.timers.setTimeout),
  setInterval: wrapFunction('setInterval', api.timers.setInterval),
  clearInterval: wrapFunction('clearInterval', api.timers.clearInterval),
};

console.dir({ timers: api.timers.setTimeout });

context.global = context;
const sandbox = api.vm.createContext(context);

const fileName = './application.js';
api.fs.readFile(fileName, 'utf8', (err, src) => {
  const script = api.vm.createScript(src, fileName);
  script.runInNewContext(sandbox);
});

const interval = setInterval(() => {
  console.dir({
    statistic,
    callbackCount: statistic.callbacksCalls.size,
  });
}, 30 * 1000);

setTimeout(() => {
  if (interval) {
    clearInterval(interval);
  }
}, 60 * 60 * 1000);
