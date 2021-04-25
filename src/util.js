/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list数组
 * @param {Function} f 函数
 * @return {*}
 */
// 找到数组中第一个符合条件的元素
export function find (list, f) {
  return list.filter(f)[0]
}

/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */
// 深拷贝
// 整体思路-递归
// 顺便思考下里面存在的问题
export function deepCopy (obj, cache = []) {
  // just return if obj is immutable value
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // if obj is hit, it is in circular structure
  // 这里其实是通过下面的cache缓存当前嵌套的对象
  // 然后通过find(文件第一个方法)方法判断是否存在循环引用，
  const hit = find(cache, c => c.original === obj)
  if (hit) {
    return hit.copy
  }

  const copy = Array.isArray(obj) ? [] : {}
  // put the copy into cache at first
  // because we want to refer it in recursive deepCopy
  // 缓存副本
  cache.push({
    original: obj,
    copy
  })

  // 递归调用深拷贝函数
  Object.keys(obj).forEach(key => {
    copy[key] = deepCopy(obj[key], cache)
  })
  return copy
}

/**
 * forEach for object
 */
// 遍历对象的属性和值
export function forEachValue (obj, fn) {
  Object.keys(obj).forEach(key => fn(obj[key], key))
}

// 判断是否为除了null之外的对象
export function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

// 判断promise对象
export function isPromise (val) {
  return val && typeof val.then === 'function'
}

// assert node中的断言
// 断言抛出异常
export function assert (condition, msg) {
  if (!condition) throw new Error(`[vuex] ${msg}`)
}

// 保留原始参数的闭包函数
export function partial (fn, arg) {
  return function () {
    return fn(arg)
  }
}


// 补充一个改进版的深拷贝
export function deepClone (obj, cache = []) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  // 手动处理Date和正则类型会返回空对象的问题
  // 这里我们直接自己返回一个new的实例
  if (obj.constructor === Date) return new Date(obj)
  if (obj.constructor === RegExp) return new RegExp(obj)

  // 循环引用这里还是保留之前的处理方式
  // find(上面代码第一个方法)
  const hit = find(cache, c => c.original === obj)
  if (hit) {
    return hit.copy
  }
  const copy = Array.isArray(obj) ? [] : {}
  cache.push({
    original: obj,
    copy
  })

  // 递归调用深拷贝函数
  // Reflect.ownKeys除了可枚举属性还可以返回不可枚举的属性和es6的symbol属性
  Reflect.ownKeys(obj).forEach(key => {
    copy[key] = deepClone(obj[key], cache)
  })
  return copy
}
