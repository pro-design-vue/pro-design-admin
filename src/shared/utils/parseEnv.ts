/*
 * @Author: shen
 * @Date: 2023-10-21 17:11:34
 * @LastEditors: shen
 * @LastEditTime: 2023-10-21 17:11:51
 * @Description:
 */
export function parseEnv(envConf: Recordable): ViteEnv {
  const ret: any = {}

  for (const envName of Object.keys(envConf).filter((key) => key.includes('VITE_'))) {
    let realName = envConf[envName]
    if (typeof realName === 'string') {
      realName = realName.replace(/\\n/g, '\n')
    }
    realName = realName === 'true' ? true : realName === 'false' ? false : realName
    ret[envName] = realName
    if (typeof realName === 'string') {
      ret[envName] = realName
    } else if (typeof realName === 'object') {
      ret[envName] = JSON.stringify(realName)
    }
  }
  return ret as ViteEnv
}
