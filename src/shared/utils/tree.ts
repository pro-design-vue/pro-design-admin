import { omit } from './omit'

interface TreeConfigOptions {
  // 子属性的名称，默认为'children'
  childProps: string
}

/**
 * @zh_CN 遍历树形结构，并返回所有节点中指定的值。
 * @param tree 树形结构数组
 * @param getValue 获取节点值的函数
 * @param options 作为子节点数组的可选属性名称。
 * @returns 所有节点中指定的值的数组
 */
function traverseTreeValues<T, V>(
  tree: T[],
  getValue: (node: T) => V,
  options?: TreeConfigOptions,
): V[] {
  const result: V[] = []
  const { childProps } = options || {
    childProps: 'children',
  }

  const dfs = (treeNode: T) => {
    const value = getValue(treeNode)
    result.push(value)
    const children = (treeNode as Record<string, any>)?.[childProps]
    if (!children) {
      return
    }
    if (children.length > 0) {
      for (const child of children) {
        dfs(child)
      }
    }
  }

  for (const treeNode of tree) {
    dfs(treeNode)
  }
  return result.filter(Boolean)
}

/**
 * 根据条件过滤给定树结构的节点，并以原有顺序返回所有匹配节点的数组。
 * @param tree 要过滤的树结构的根节点数组。
 * @param filter 用于匹配每个节点的条件。
 * @param options 作为子节点数组的可选属性名称。
 * @returns 包含所有匹配节点的数组。
 */
function filterTree<T extends Record<string, any>>(
  tree: T[],
  filter: (node: T) => boolean,
  options?: TreeConfigOptions,
): T[] {
  const { childProps } = options || {
    childProps: 'children',
  }

  const _filterTree = (nodes: T[]): T[] => {
    return nodes.filter((node: Record<string, any>) => {
      if (filter(node as T)) {
        if (node[childProps]) {
          node[childProps] = _filterTree(node[childProps])
        }
        return true
      }
      return false
    })
  }

  return _filterTree(tree)
}

/**
 * 根据条件重新映射给定树结构的节
 * @param tree 要过滤的树结构的根节点数组。
 * @param mapper 用于map每个节点的条件。
 * @param options 作为子节点数组的可选属性名称。
 */
function mapTree<T, V extends Record<string, any>>(
  tree: T[],
  mapper: (node: T) => V,
  options?: TreeConfigOptions,
): V[] {
  const { childProps } = options || {
    childProps: 'children',
  }
  return tree.map((node) => {
    const mapperNode: Record<string, any> = mapper(node)
    if (mapperNode[childProps]) {
      mapperNode[childProps] = mapTree(mapperNode[childProps], mapper, options)
    }
    return mapperNode as V
  })
}

/**
 * 普通数组转换为树形结构
 * @param data 普通数组，需要有能转换为树形的条件。
 */
function toTree<T extends Record<string, any>, V extends Record<string, any>>(
  data: T[],
  parentValue = '0',
  mapper?: (node: T) => V,
): V[] {
  const items: V[] = []
  for (const item of data) {
    if (item.parentId == parentValue) {
      const children = toTree(data, item.id, mapper) || []
      const mapperNode: Record<string, any> = mapper ? mapper(item) : item
      if (children.length > 0) {
        mapperNode.children = children
      }
      items.push(mapperNode as V)
    }
  }
  return items
}

/**
 * 映射给定树结构的节
 * @param tree 要过滤的树结构的根节点数组。
 * @param handler 用于for每个节点的条件。
 * @param options 作为子节点数组的可选属性名称。
 */
function forTree<T>(tree: T[], handler: (node: T) => void, options?: TreeConfigOptions) {
  const { childProps } = options || {
    childProps: 'children',
  }
  tree.forEach((node) => {
    handler(node)
    if (node[childProps]) {
      forTree(node[childProps], handler, options)
    }
  })
}

/**
 * 树结构扁平化
 * @param tree 树结构。
 * @param handler 用于map每个节点的条件。
 */
function treeToArray<
  T extends {
    children: T[]
  },
  V extends Record<string, any>,
>(tree: T[], mapper?: (node: T) => V) {
  const flatData: V[] = []
  const queue = [...tree]
  while (queue.length > 0) {
    const node = queue.shift()!
    const mapperNode: Record<string, any> = mapper ? mapper(node) : node
    flatData.push(omit(mapperNode, ['children']) as V)
    if (node.children?.length) {
      queue.push(...node.children)
    }
  }
  return flatData
}

export { filterTree, mapTree, toTree, forTree, treeToArray, traverseTreeValues }
