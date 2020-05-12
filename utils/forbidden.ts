/**
 * 兼容异步函数的返回值
 * @param res 返回值
 * @param callback 同步/异步结果的回调函数
 * @typeparam T 处理参数的类型，如果是 Promise 类型，则取出其泛型类型
 * @typeparam Param 处理参数具体的类型，如果是 Promise 类型，则指定为原类型
 * @typeparam R 返回值具体的类型，如果是 Promise 类型，则指定为 Promise 类型，否则为原类型
 * @returns 处理后的结果，如果是同步的，则返回结果是同步的，否则为异步的
 */
export function compatibleAsync<T = any, Param = T | Promise<T>, R = T>(
  res: Param,
  callback: (r: T) => R,
): Param extends Promise<T> ? Promise<R> : R {
  return (res instanceof Promise
    ? res.then(callback)
    : callback(res as any)) as any
}

/**
 * 测试函数的执行时间
 * 注：如果函数返回 Promise，则该函数也会返回 Promise，否则直接返回执行时间
 * @param fn 需要测试的函数
 * @returns 执行的毫秒数
 */
export function timing<R>(
  fn: (...args: any[]) => R,
  // 函数返回类型是 Promise 的话，则返回 Promise<number>，否则返回 number
): R extends Promise<any> ? Promise<number> : number {
  const begin = performance.now()
  const res = fn()
  return compatibleAsync(res, () => performance.now() - begin)
}
/**
 * 禁止他人调试网站相关方法的集合对象
 */
export class AntiDebug {
  /**
   * 不停循环 debugger 防止有人调试代码
   * @returns 取消函数
   */
  public static cyclingDebugger(): Function {
    const res = setInterval(() => {
      debugger
    }, 100)
    return () => clearInterval(res)
  }
  /**
   * 检查是否正在 debugger 并调用回调函数
   * @param fn 回调函数，默认为重载页面
   * @returns 取消函数
   */
  public static checkDebug(
    fn: Function = () => window.location.reload(),
  ): Function {
    const res = setInterval(() => {
      const diff = timing(() => {
        debugger
      })
      if (diff > 500) {
        console.log(diff)
        fn()
      }
    }, 1000)
    return () => clearInterval(res)
  }
}
