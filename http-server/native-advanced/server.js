'use strict';

const http = require('http');

const user = {
  name: 'jura',
  age: 22,
};

const routing = {
  '/': 'welcome to homepage',
  '/user': user,
  '/user/name': () => user.name,
  '/user/age': () => user.age,
  '/user/*': (client, par) => 'parameter=' + par[0],
};

const types = {
  object: JSON.stringify,
  string: s => s,
  number: n => n.toString(),
  undefined: () => 'not found',
  function: (fn, par, client) => types[typeof fn(client, par)],
};

const matching = [];
for (const key in routing) {
  if (key.includes('*')) {
    const rx = new RegExp(key.replace('*', '(.*)'));
    const route = routing[key];
    matching.push([ rx, route ]);
    delete routing[key];
  }
}

const router = client => {
  let par;
  let url = client.req.url;
  if (url.charAt(url.length - 1) === '/' && url.length !== 1) {
    url = url.substring(0, url.length - 1);
  }
  let route = routing[url];
  if (!route) {
    for (let i = 0; i < matching.length; i++) {
      const rx = matching[i];
      par = url.match(rx[0]);
      if (par) {
        par.shift();
        route = rx[1];
        break;
      }
    }
  }
  const type = typeof route;
  const renderer = types[type];
  return renderer(route, par, client);
};

http.createServer((req, res) => {
  res.end(router({
    req,
    res,
  }).toString());
}).listen(8000);
