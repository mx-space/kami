/*
 * @Author: Innei
 * @Date: 2020-06-13 11:09:49
 * @LastEditTime: 2020-06-13 11:09:49
 * @LastEditors: Innei
 * @FilePath: /mx-web/configs/jest/cssTransform.js
 * @Coding with Love
 */
module.exports = {
  process() {
    return 'module.exports = {};'
  },
  getCacheKey() {
    return 'cssTransform'
  },
}
