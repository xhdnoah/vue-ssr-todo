const qiniu = require('qiniu')
const fs = require('fs')
const path = require('path')

const cdnConfig = require('../app.config').cdn

const {
  ak,
  sk,
  bucket
} = cdnConfig

const mac = new qiniu.auth.digest.Mac(ak, sk)

const config = new qiniu.conf.Config()
config.zone = qiniu.zone.Zone_z0

const doUpload = (key, file) => {
  const options = {
    scope: bucket + ':' + key
  }
  const formUploader = new qiniu.form_up.FormUploader(config)
  const putExtra = new qiniu.form_up.PutExtra()
  const putPolicy = new qiniu.rs.PutPolicy(options)
  const uploadToken = putPolicy.uploadToken(mac)
  return new Promise((resolve, reject) => {
    formUploader.putFile(uploadToken, key, file, putExtra, (err, body, info) => {
      if (err) {
        return reject(err)
      }
      if (info.statusCode === 200) {
        resolve(body)
      } else {
        reject(body)
      }
    })
  })
}
// 如果 public 里有嵌套的文件夹，做一个递推的方式做上传
const publicPath = path.join(__dirname, '../public')

// publicPath/resource/client/...
const uploadAll = (dir, prefix) => {
  // 先读出所有文件
  const files = fs.readdirSync(dir)
  files.forEach(file => {
    const filePath = path.join(dir, file)
    // key 作为一个完整的包含嵌套关系的路径名传入 doUpload
    const key = prefix ? `${prefix}/${file}` : file
    // 判断是否是文件夹
    if (fs.lstatSync(filePath).isDirectory()) {
      return uploadAll(filePath, key)
    }
    doUpload(key, filePath)
      .then(resp => console.log(resp))
      .catch(err => console.error(err))
  })
}

uploadAll(publicPath)
