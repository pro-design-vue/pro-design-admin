// 非对称加密 RSA
import JSEncrypt from 'jsencrypt'

// 公钥加密
export const rsaEncrypt = (data: any, key: string) => {
  const encryptor = new JSEncrypt() // 创建加密对象实例
  // 设置公钥
  encryptor.setPublicKey(key)
  // 加密
  const rsaCipher = encryptor.encrypt(data)
  return rsaCipher
}

// 公钥解密
export const rsaDecrypt = (ciphertext: any, key: string) => {
  const decrypt = new JSEncrypt() // 创建解密对象实例
  // 设置私钥
  decrypt.setPublicKey(key)
  const oriData = decrypt.decrypt(ciphertext)
  return oriData
}
