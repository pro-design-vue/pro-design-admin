/*
 * @Author: shen
 * @Date: 2023-10-14 14:55:46
 * @LastEditors: shen
 * @LastEditTime: 2025-06-21 17:05:45
 * @Description:
 */
import { randomString } from './random'
import CryptoJS from 'crypto-js'

// AES/CBC/PKCS7Padding 算法/模式/补码方式
// 字符集 utf-8
// mode 支持 CBC CFB CTR ECB OFB 默认CBC
// padding 支持 Pkcs7 ZeroPadding NoPadding ... 默认 Pkcs7 即 Pkcs5

// 前端 AES/CBC/Pkcs7 + iv
// 后端 AES/CBC/Pkcs5 + iv

const aesKey = randomString()
// const aesIV = randomString()
// const iv = CryptoJS.enc.Utf8.parse(aesIV) //十六位十六进制数作为密钥偏移量

// 加密方法
export const aesEncrypt = (data: any, k: string) => {
  const key = CryptoJS.enc.Utf8.parse(k || aesKey)
  const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), key, {
    // iv: iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  // 转换为字符串
  return encrypted.toString()
}

//解密方法
export const aesDecrypt = (data: any, k: string) => {
  const key = CryptoJS.enc.Utf8.parse(k || aesKey)
  const decrypted = CryptoJS.AES.decrypt(data, key, {
    // iv: iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return CryptoJS.enc.Utf8.stringify(decrypted).toString()
}
