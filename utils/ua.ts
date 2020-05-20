export const getBrowserType = (ua: string) => {
  const explorer = ua
  //判断是否为IE浏览器
  if (explorer.indexOf('MSIE') >= 0) {
    return 'ie'
  }
  //判断是否为Firefox浏览器
  else if (explorer.indexOf('Firefox') >= 0) {
    return 'Firefox'
  }
  //判断是否为Chrome浏览器
  else if (explorer.indexOf('Chrome') >= 0) {
    return 'Chrome'
  }
  //判断是否为Opera浏览器
  else if (explorer.indexOf('Opera') >= 0) {
    return 'Opera'
  }
  //判断是否为Safari浏览器
  else if (explorer.indexOf('Safari') >= 0) {
    return 'Safari'
  }
}
