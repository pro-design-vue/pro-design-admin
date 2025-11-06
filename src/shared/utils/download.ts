import { VITE_API_URL_PREFIX } from '../constants'

/*
 * @Author: shen
 * @Date: 2025-03-31 10:25:58
 * @LastEditors: shen
 * @LastEditTime: 2025-10-31 17:23:24
 * @Description:
 */
export function downloadBase64Image(base64Data, fileName = 'image.png') {
  // 1. 分离 MIME 类型和 Base64 数据
  const parts = base64Data.split(';base64,')
  const mimeType = parts[0].split(':')[1] // 例如 "image/png"
  const rawData = window.atob(parts[1]) // 解码 Base64 字符串

  // 2. 将数据转为二进制 Blob
  const blob = new Blob([new Uint8Array(rawData.length).map((_, i) => rawData.charCodeAt(i))], {
    type: mimeType,
  })

  // 3. 创建下载链接
  const url = URL.createObjectURL(blob)

  // 4. 触发下载
  const link = document.createElement('a')
  link.href = url
  link.download = fileName // 设置下载文件名
  document.body.appendChild(link)
  link.click()

  // 5. 清理资源
  setTimeout(() => {
    URL.revokeObjectURL(url)
    document.body.removeChild(link)
  }, 100)
}

export function download(response) {
  const disposition = response.headers['content-disposition']
  const fileName = decodeURIComponent(disposition.split('filename=')[1])
  const blob = new Blob([response.data])
  const url = window.URL.createObjectURL(blob)
  const dom = document.createElement('a')
  dom.style.display = 'none'
  dom.href = url
  dom.setAttribute('download', fileName)
  document.body.appendChild(dom)
  dom.click()
  document.body.removeChild(dom)
  window.URL.revokeObjectURL(url)
}

export function downloadUrl(url: string, fileName: string = '') {
  const dom = document.createElement('a')
  dom.style.display = 'none'
  dom.href = VITE_API_URL_PREFIX + url
  dom.setAttribute('download', fileName)
  document.body.appendChild(dom)
  dom.click()
  document.body.removeChild(dom)
}
