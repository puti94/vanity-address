// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.


const {encodeAddress, mnemonicGenerate, naclKeypairFromSeed, randomAsU8a, schnorrkelKeypairFromSeed, mnemonicToMiniSecret} = require('@polkadot/util-crypto');


const calculate = require('./calculate');

module.exports = function generator (test, options) {
  const mnemonic = options.withHex
      ? mnemonicGenerate(12) : undefined;
  const seed = mnemonic
      ? mnemonicToMiniSecret(mnemonic)
      : randomAsU8a();
  const pair = options.type === 'sr25519'
      ? schnorrkelKeypairFromSeed(seed)
      : naclKeypairFromSeed(seed);
  const address = encodeAddress(pair.publicKey,options.ss58Format);
  const { count, offset } = calculate(test, address, options);
  
  return {
    address,
    count,
    mnemonic,
    offset,
    seed
  };
}
