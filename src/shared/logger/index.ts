/*
 * @Author: shen
 * @Date: 2023-03-26 16:03:35
 * @LastEditors: shen
 * @LastEditTime: 2025-06-16 11:28:32
 * @Description:
 */

import { upperFirst } from '@/shared/utils'
import {
  Logger,
  LogLevel,
  setLogLevel,
  setLogName,
  setLogSubName,
  type LogLevelString,
} from './logger'
import type { App } from 'vue'
export * from './logger'

type LoggerOptions = {
  level: LogLevelString | LogLevel
  name: string
  subName?: string
}

const logger: Logger = new Logger()

const setupLogger = (app: App, options: LoggerOptions) => {
  setLogLevel(options.level)
  setLogSubName(upperFirst(options.subName))
  setLogName(upperFirst(options.name))
  app.config.globalProperties.$logger = logger
}

export { setupLogger }
export type { LoggerOptions }
export default logger
