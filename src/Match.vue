<template>
  <div class="item">
    <div class="info">
      <p class="address">
        <span>地址:</span>
        <span>
          <span>{{address.slice(0, offset)}}</span>
          <span class="match">{{address.slice(offset, count + offset)}}</span>
          <span>{{address.slice(count + offset)}}</span>
        </span>
        <van-icon class="copy" name="description" @click="setText(address)"/>
      </p>
      <van-icon :name="show ? 'cross':'plus'" @click="show = !show"/>
    </div>
    <div v-if="show">
      <p class="address seed">私钥:<span>{{hexSeed}}</span>
        <van-icon class="copy" name="description" @click="setText(hexSeed)"/>
      </p>
      <p class="address seed">助记词:<span>{{mnemonic}}</span>
        <van-icon class="copy" name="description" @click="setText(mnemonic)"/>
      </p>
    </div>
  </div>
</template>

<script>

import {u8aToHex} from '@polkadot/util';
import {entropyToMnemonic} from 'bip39';
import Clipboard from 'clipboard'

export default {
  name: 'Match',
  props: {
    address: String,
    seed: Uint8Array,
    count: Number,
    offset: Number,
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    hexSeed() {
      return u8aToHex(this.seed)
    },
    mnemonic() {
      return entropyToMnemonic(this.seed)
    },
  },
  methods: {
    setText(text) {
      let clipboard = new Clipboard('.address', {text: () => text});
      clipboard.on('success', () => {
        this.$toast('复制成功')
      })
      clipboard.on('error', () => {
        this.$toast('复制失败')
      })
    }
  }
}
</script>

<style scoped>
  .item {
    border-bottom: #ddd 1PX solid;
    margin: 10px;
  }
  
  .item button {
    color: #e6007a;
    font-size: 12px;
  }
  
  .info {
    display: flex;
    align-items: center;
  }
  
  .address {
    word-break: break-all;
    width: 100%;
    flex: 1;
    font-size: 14px;
    color: #323233;
    height: auto;
  }
  
  .match {
    color: red;
  }
  
  .van-icon {
    font-size: 20px;
    margin-left: 5px;
  }
  
  .copy {
    font-size: 14px;
  }
</style>
