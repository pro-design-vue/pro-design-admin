/**
 *
 * @param fileName 文件名 - 不需要加扩展名
 * @param sheetName 第一个sheet名称
 * @param titleArr 标题行数组
 * @param dataArr 数据行二维数组（二维数组中每个一维数组都是一行数据）
 */
export const exportExcel = async (
  fileName: string,
  sheetName: string,
  titleArr: string[],
  dataArr: Array<Array<any>>,
) => {
  const { utils, writeFile } = await import('xlsx')
  const filename = fileName + '.xlsx'
  const data = [titleArr, ...dataArr]
  const wb = utils.book_new()
  const ws = utils.aoa_to_sheet(data)
  utils.book_append_sheet(wb, ws, sheetName)
  writeFile(wb, filename)
}

interface ColumnMap {
  [key: string]: string[]
}

/**
 * 智能匹配Excel列名到目标字段
 * @param headerRow Excel的表头行
 * @param columnMap 字段映射配置
 * @returns 匹配后的字段映射
 */
function matchColumns(headerRow: string[], columnMap?: ColumnMap): { [key: string]: number } {
  const mapping: { [key: string]: number } = {}
  headerRow.forEach((header, index) => {
    const normalizedHeader = header.trim().toLowerCase()
    if (columnMap) {
      for (const [field, possibleNames] of Object.entries(columnMap)) {
        if (possibleNames.map((name) => name.toLowerCase()).includes(normalizedHeader)) {
          mapping[field] = index
          break
        }
      }
    } else {
      mapping[header] = index
    }
  })
  return mapping
}

interface ImportConfig {
  columnMap?: ColumnMap // 列映射配置
  dataHandler?: (item: any) => any // 数据处理函数
  requiredFields?: string[] // 必填字段
  dateFields?: string[] // 日期字段
  booleanFields?: {
    // 布尔值字段配置
    [key: string]: {
      trueValues: any[] // 视为true的值
      falseValues?: any[] // 视为false的值
      defaultValue?: any // 默认值
    }
  }
}

/**
 * 通用的Excel导入函数
 * @param file Excel文件
 * @param config 导入配置
 * @returns 解析后的数据数组
 */
export const importExcel = async (file: File, config?: ImportConfig): Promise<any[]> => {
  const {
    columnMap,
    dataHandler,
    requiredFields = [],
    dateFields = [],
    booleanFields = {},
  } = config || {}
  const { utils, read } = await import('xlsx')
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = read(data, { type: 'array' })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows = utils.sheet_to_json(firstSheet, { header: 1 })

        if (rows.length < 2) {
          throw new Error('Excel文件必须包含表头和数据')
        }

        const headerRow = rows[0] as string[]
        const mapping = matchColumns(headerRow, columnMap)

        // 检查必填字段
        requiredFields.forEach((field) => {
          if (mapping[field] === undefined) {
            throw new Error(`缺少必填字段: ${field}`)
          }
        })

        const dataRows = rows.slice(1)
        const parsedData = dataRows
          .map((row: any) => {
            const item: any = {}

            // 基础字段映射
            for (const [field, index] of Object.entries(mapping)) {
              if (index !== undefined) {
                let value = row[index]

                // 处理日期字段
                if (dateFields.includes(field) && value) {
                  const date = new Date(value)
                  if (!isNaN(date.getTime())) {
                    value = date.toISOString().split('T')[0]
                  }
                }

                // 处理布尔值字段
                if (field in booleanFields) {
                  const boolConfig = booleanFields[field]
                  if (value === undefined || value === '') {
                    value = boolConfig.defaultValue
                  } else {
                    const strValue = String(value).toLowerCase()
                    if (
                      boolConfig.trueValues.map((v) => String(v).toLowerCase()).includes(strValue)
                    ) {
                      value = true
                    } else if (
                      boolConfig.falseValues?.map((v) => String(v).toLowerCase()).includes(strValue)
                    ) {
                      value = false
                    } else {
                      value = boolConfig.defaultValue
                    }
                  }
                }

                item[field] = value
              }
            }

            // 应用自定义数据处理函数
            return dataHandler ? dataHandler(item) : item
          })
          .filter((item) => Object.keys(item)?.length)

        resolve(parsedData)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }

    reader.readAsArrayBuffer(file)
  })
}
