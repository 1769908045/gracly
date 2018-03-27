export const for_ = (list, fun) => {
  for (let i = 0, len = list.length; i < len; i++) fun(list[i], i)
}
export const currying_ = (fun, initFun) => {
  return (...initArgs) => {
    let result = typeof initFun === "function" ? initFun(initArgs[0]) : initArgs[0]
    initArgs.length > 1 && for_(initArgs.slice(1), i => result = fun(result, i))
    const back = (...args) => {
      if (args.length > 0) {
        for_(args, i => result = fun(result, i))
        return back
      } else {
        return result
      }
    }
    return back
  }
}
export const getIndex = str => {
  let indexStr = str.match(/\[\d+]/)
  return indexStr ? parseInt(indexStr[0].match(/\d+/)[0]) : 0
}
export const elFun = (a, b) => {
  if (b.substr(0, 1) === "#") {
    return document.getElementById(b.substr(1))
  } else if (b.substr(0, 1) === ".") {
    return a.getElementsByClassName(b.substr(1).replace(/\[\d+]/g, ''))[getIndex(b)]
  } else {
    return a.getElementsByTagName(b.replace(/\[\d+]/g, ''))[getIndex(b)]
  }
}
export const elInit = a => {
  if (a.substr(0, 1) === "#") {
    return document.getElementById(a.substr(1))
  } else if (a.substr(0, 1) === ".") {
    return document.getElementsByClassName(a.substr(1).replace(/\[\d+]/g, ''))[getIndex(a)]
  } else {
    return document.getElementsByTagName(a.replace(/\[\d+]/g, ''))[getIndex(a)]
  }
}
export const getElement = currying_(elFun, elInit)
export const query = queryStr => {
  const args = queryStr.split(' ')
  let get = null
  for_(args, (i, k) => k === 0 && (get = getElement(i)) || get(i))
  return get()
}
export const querys = queryStr => {
  if (queryStr.substr(0, 1) === "#") {
    return document.getElementById(queryStr.substr(1))
  } else if (queryStr.substr(0, 1) === ".") {
    return document.getElementsByClassName(queryStr.substr(1))
  } else {
    return document.getElementsByTagName(queryStr)
  }
}
export const jsonToUrl = obj => {
  let data = ""
  for (let k in obj) {
    data += k + "=" + obj[k] + "&"
  }
  return data.substr(0, data.length - 1)
}
export const ajax = o => {
  const method = o.method.toUpperCase()
  const url = o.url
  const async = o.async === false ? o.async : true
  const xhr = new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP")
  xhr.onreadystatechange = e => (xhr.readyState === 4 && xhr.status === 200) && (typeof o.success === "function") && (o.success(xhr.response))
  typeof o.process === "function" && (xhr.upload.onprogress = e => e.lengthComputable && o.process(Math.floor(e.loaded / e.total * 100), e.loaded))
  method === "GET" && ((o.data === undefined ? xhr.open(method, url, async) : xhr.open(method, url + "?" + jsonToUrl(o.data), async)) || xhr.send())
  if (method === "POST") {
    if (!o.formData) {
      xhr.open(method, url, async) || xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded") || o.data ? xhr.send(jsonToUrl(o.data)) : xhr.send()
    } else {
      xhr.open(method, url, async) || xhr.send(o.formData)
    }
  }
}
export const createHash = input => {
  const base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');
  let hash = 5381
  let i = input.length - 1
  if (typeof input === 'string') {
    for (; i > -1; i--)
      hash += (hash << 5) + input.charCodeAt(i)
  }
  else {
    for (; i > -1; i--)
      hash += (hash << 5) + input[i];
  }
  let value = hash & 0x7FFFFFFF
  let retValue = ''
  do {
    retValue += base64[value & 0x3F]
  }
  while (value >>= 6)

  return retValue
}
export const matchHtml = (tagName, html) => {
  const regStr = "<" + tagName + ">[\\s\\S]*<\/" + tagName + ">";
  let targetStr = html.match(new RegExp(regStr))[0];
  const start = targetStr.search(">");
  const end = targetStr.search("</" + tagName + ">");
  return targetStr.substring(start + 1, end);
}
export const checkDevice = () => navigator.userAgent.match(/iPhone|Android|Mobile|iPad|Firefox|opr|chrome|safari|trident/i)[0]
export const mobileDevice = /Android|iPhone|Mobile|iPad/i.test(checkDevice())
export const mobileInput = () => mobileDevice && for_(querys("input"), i => i.onfocus = e => window.scrollTo(0, e.target.offsetTop - (document.documentElement.clientHeight / 3) + 50))
export const cookie = {
  set: (name, value, expires, path = '/') => {
    if (typeof expires !== 'number') {
      document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)};path=${path}`
    } else {
      let time = new Date()
      time.setTime(time.getTime() + expires)
      document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)};expires=${time.toUTCString()};path=${path}`
    }
  },
  get: (name) => {
    const cookie = document.cookie
    const rex = new RegExp(`${encodeURIComponent(name)}=[^ ;]+`)
    if (rex.test(cookie)) {
      return cookie.match(rex)[0].split('=')[1]
    } else {
      return false
    }
  },
  delete: (name) => {
    cookie.set(name, '', -1)
  }
}
export const scrollEvent = (obj, endback) => {
  let endTop = document.documentElement.scrollTop || document.body.scrollTop
  const isDown = top => top > endTop
  for_(obj, i => {
    if (typeof i.top === 'number') {
      if (i.down.callback && typeof i.down.callback === 'function') {
        if (endTop >= i.top) {
          i.down.callback()
          i.down.tag = false
        } else
          i.down.tag = true
      }
      if (i.up.callback && typeof i.up.callback === 'function') {
        if (endTop <= i.top) {
          i.up.callback()
          i.up.tag = false
        } else
          i.up.tag = true
      }
    }
  })
  if (mobileDevice) {
    document.body.addEventListener('touchmove', e => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > endTop) {
        for_(obj, k => {
          if (scrollTop >= k.top && k.tag) {
            k['fun']()
            k.tag = false
          }
        })
        endTop = scrollTop
      }
      typeof endback === 'function' && scrollTop >= document.body.clientHeight - document.documentElement.clientHeight && endback()
    })
    document.body.addEventListener('touchend', e => {
      const observe = () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        if (scrollTop > endTop) {
          for_(obj, k => {
            if (scrollTop >= k.top && k.tag) {
              k['fun']()
              k.tag = false
            }
          })
          endTop = scrollTop
          setTimeout(observe, 300)
        }
        typeof endback === 'function' && scrollTop >= document.body.clientHeight - document.documentElement.clientHeight && endback()
      }
      setTimeout(observe, 300)
    })
  } else {
    document.body.onscroll = e => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      for_(obj, k => {
        if (isDown(scrollTop)) {
          if (typeof k.top === 'number' && k.down.callback && typeof k.down.callback === 'function' && k.down.tag && scrollTop >= k.top) {
            k.down.callback()
            k.down.tag = false
            k.up.repeat && (k.up.tag = true)
          }
        } else {
          if (typeof k.top === 'number' && k.up.callback && typeof k.up.callback === 'function' && k.up.tag && scrollTop <= k.top) {
            k.up.callback()
            k.up.tag = false
            k.down.repeat && (k.down.tag = true)
          }
        }
      })
      typeof endback === 'function' && scrollTop >= document.body.clientHeight - document.documentElement.clientHeight && endback()
      endTop = scrollTop
    }
  }
}
export const checkWebp = (callback) => {
  const webp = new Image()
  webp.src = "data:image/webp;base64,UklGRiYAAABXRUJQVlA4IBoAAAAwAQCdASoBAAEAAIAMJaQAA3AA/v89WAAAAA=="
  webp.onload = () => webp.width && callback()
}