/**
 * 自动刷新CDN的脚本
 * User: puti.
 * Time: 2020-04-01 15:28.
 */
const tencentcloud = require('tencentcloud-sdk-nodejs')
const fs = require('fs');
const path = require('path');

const CndClient = tencentcloud.cdn.v20180606.Client;
const models = tencentcloud.cdn.v20180606.Models;
const Credential = tencentcloud.common.Credential;

const file = path.resolve(__dirname,'..','.env_temp');

if (!fs.existsSync(file)) return;
const str = fs.readFileSync(file).toString();
const {SecretId, SecretKey, token} = JSON.parse(str);
const cred = new Credential(SecretId, SecretKey, token);
const client = new CndClient(cred);
const req = new models.PurgeUrlsCacheRequest();
req.deserialize({Urls: ['https://va.substrate.top']});
client.PurgeUrlsCache(req, function (err, response) {
  if (err) {
    // eslint-disable-next-line no-console
    console.log('CDN刷新失败', err);
    return;
  }
  // 请求正常返回，打印response对象
  // eslint-disable-next-line no-console
  console.log('CDN刷新成功', response.to_json_string());
});
