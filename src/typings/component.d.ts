/*
 * @Author: shen
 * @Date: 2025-06-05 09:13:21
 * @LastEditors: shen
 * @LastEditTime: 2025-08-23 17:28:03
 * @Description:
 */
import type { AppContext, EmitsOptions, Plugin, SetupContext, Component } from 'vue'

export type SFCWithInstall<T> = T & Plugin

export type SFCInstallWithContext<T> = SFCWithInstall<T> & {
  _context: AppContext | null
}

export type EmitFn<E extends EmitsOptions> = SetupContext<E>['emit']
export type ComponentRecordType = Record<string, () => Promise<Component>>
