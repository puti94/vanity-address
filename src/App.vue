<template>
  <div id="app">
    <van-action-sheet
        cancel-text="取消"
        v-model="showType"
        @cancel="showType=false"
        @select="onSelect"
        :actions="actions"/>
    <div class="form">
      <van-field
          v-model="match"
          required
          autofocus
          label="匹配名"
          placeholder=""
      />
      <van-field
          label="区分大小写"
      >
        <div slot="input" class="switch-container">
          <van-switch v-model="withCase"/>
        </div>
      </van-field>
      <van-field
          label="24位助记词"
      >
        <div slot="input" class="switch-container">
          <van-switch v-model="withHex"/>
        </div>
      </van-field>
      <van-field
          label="匹配结尾"
      >
        <div slot="input" class="switch-container">
          <van-switch v-model="withEnd"/>
        </div>
      </van-field>
      <van-field
          v-if="hasType"
          readonly
          clickable
          label="加密类型"
          :value="type"
          @click="showType = true"
      />
      <van-field
          v-if="hasSs59Format"
          v-model="ss58Format"
          label="地址前缀"
          placeholder=""
      />
      <van-button
          class="btn"
          size="small"
          :disabled="!isMatchValid"
          type="info"
          @click="toggleStart">
        {{!isRunning ? '开始':'停止'}}
      </van-button>
    </div>
    <div v-if="matches.length !== 0" class="items">
      <div v-if="keyCount" class="info">
        {{`已在${(elapsed / 1000).toFixed(2)} 秒内碰撞了 ${keyCount}个地址 (${(keyCount / (elapsed / 1000)).toFixed(3)}
        地址/秒)`}}
      </div>
      
      <Match v-for="item in matches" :key="item.address" v-bind="item"/>
    </div>
  </div>
</template>

<script>
import generator from './vanitygen';
import matchRegex from './vanitygen/regex';
import generatorSort from './vanitygen/sort';
import Match from './Match'
import {parseUrl} from 'query-string';

export default {
  name: 'app',
  components: {
    Match
  },
  data() {
    const {query = {}} = parseUrl(location.href);
    // eslint-disable-next-line no-console
    // console.log('query', query)
    const {type = 'sr25519', ss58Format = '40', match = 'some'} = query;
    return {
      hasSs59Format: !query.ss58Format,
      hasType: !query.type,
      results: [],
      matches: [],
      match,
      ss58Format,
      withCase: false,
      startAt: 0,
      elapsed: 0,
      type,
      isRunning: false,
      keyCount: 0,
      keyTime: 0,
      showType: false,
      withEnd: false,
      withHex: true,
      actions: [
        {name: 'sr25519', value: 'sr25519'},
        {name: 'ed25519', value: 'ed25519'},
      ],
      des: [{title: '', value: ''}],
    }
  },
  computed: {
    isMatchValid() {
      return matchRegex.test(this.match) &&
          (this.match.length !== 0) &&
          (this.match.length < 31)
    }
  },
  methods: {
    onSelect(item) {
      this.type = item.value
      this.showType = false
    },
    checkMatches() {
      const results = this.results;
      this.results = [];
      if (results.length === 0) {
        return;
      }
      let newKeyCount = this.keyCount;
      let newKeyTime = this.keyTime;
      const newMatches = results
          .reduce((result, {elapsed, found}) => {
            newKeyCount += found.length;
            newKeyTime += elapsed;
            
            return result.concat(found);
          }, this.matches)
          .sort((a, b) => generatorSort(a, b, this.withEnd))
          .slice(0, 15);
      const elapsed = Date.now() - this.startAt;
      this.elapsed = elapsed
      this.matches = newMatches
      this.keyCount = newKeyCount
      this.keyTime = newKeyTime
    },
    toggleStart() {
      const isRunning = !this.isRunning;
      this.isRunning = isRunning;
      this.keyCount = isRunning ? 0 : this.keyCount;
      this.keyTime = isRunning ? 0 : this.keyTime;
      this.startAt = isRunning ? Date.now() : this.startAt;
      this.matches = isRunning ? [] : this.matches;
      if (this.isRunning) {
        this.executeGeneration()
      }
    },
    executeGeneration() {
      if (!this.isRunning) {
        this.checkMatches();
        return;
      }
      setImmediate(() => {
        if (this.results.length === 25) {
          this.checkMatches();
        }
        
        const {match, type, withCase, withHex, ss58Format,withEnd} = this;
        
        this.results.push(
            generator({
              match,
              runs: 5,
              type,
              withCase,
              withHex,
              ss58Format,
              withEnd
            })
        );
        this.executeGeneration();
      })
    }
  },
}
</script>

<style>
  html {
    min-height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  
  body {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #FCFBF9;
    min-height: 100%;
    width: 375px;
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
  }
  
  .form {
    width: 360px;
    background-color: white;
    align-self: center;
    margin-top: 10px;
    padding: 20px 0px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
    margin-bottom: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
  }
  
  .items {
    align-self: center;
    background-color: white;
    width: 360px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
    padding: 10px;
    border-radius: 10px;
  }
  
  .items .info {
    font-size: 10px;
  }
  
  .btn {
    margin-top: 10px;
  }
  
  .switch-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
  
  .switch {
  
  }

</style>
