// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.


const  generate  = require('./generate');

module.exports = function generator (options) {
  const { match, runs = 10, withCase = false } = options;
  const test = (withCase ? match : match.toLowerCase()).split(',').map((c) => c.split(''));
  const startAt = Date.now();
  const found = [];

  while (found.length !== runs) {
    let items = generate(test, options);
    if(items){
      found.push(items);
    }
  }

  return {
    elapsed: Date.now() - startAt,
    found
  };
}
