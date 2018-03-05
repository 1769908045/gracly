const for_ = (list, fun) => {
  for (let i = 0, len = list.length; i < len; i++) fun(list[i], i)
}
const currying_ = (fun, initFun) => {
  return (...initArgs) => {
    let result = typeof initFun === "function" ? initFun(initArgs[0]) : initArgs[0]
    initArgs.length > 1 && for_(initArgs.slice(1), i => result = fun(result, i))
    return back = (...args) => {
      if (args.length > 0) {
        for_(args, i => result = fun(result, i))
        return back
      } else {
        return result
      }
    }
  }
}
const getIndex = str => {
  let indexStr = str.match(/\[\d+]/)
  return indexStr ? parseInt(indexStr[0].match(/\d+/)[0]) : 0
}
const elFun = (a, b) => {
  if (b.substr(0, 1) === "#") {
    return document.getElementById(b.substr(1))
  } else if (b.substr(0, 1) === ".") {
    return a.getElementsByClassName(b.substr(1).replace(/\[\d+]/g, ''))[getIndex(b)]
  } else {
    return a.getElementsByTagName(b.replace(/\[\d+]/g, ''))[getIndex(b)]
  }
}
const elInit = a => {
  if (a.substr(0, 1) === "#") {
    return document.getElementById(a.substr(1))
  } else if (a.substr(0, 1) === ".") {
    return document.getElementsByClassName(a.substr(1).replace(/\[\d+]/g, ''))[getIndex(a)]
  } else {
    return document.getElementsByTagName(a.replace(/\[\d+]/g, ''))[getIndex(a)]
  }
}
const getElement = currying_(elFun, elInit)
const query = queryStr => {
  const args = queryStr.split(' ')
  let get = null
  for_(args, (i, k) => k === 0 && (get = getElement(i)) || get(i))
  return get()
}
const querys = queryStr => {
  if (queryStr.substr(0, 1) === "#") {
    return document.getElementById(queryStr.substr(1))
  } else if (queryStr.substr(0, 1) === ".") {
    return document.getElementsByClassName(queryStr.substr(1))
  } else {
    return document.getElementsByTagName(queryStr)
  }
}
const jsonToUrl = obj => {
  let data = ""
  for (let k in obj) {
    data += k + "=" + obj[k] + "&"
  }
  return data.substr(0, data.length - 1)
}
const ajax = o => {
  const method = o.method.toUpperCase()
  const url = o.url
  const async = o.async === false ? o.async : true
  const xhr = new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP")
  xhr.onreadystatechange = e => (xhr.readyState === 4 && xhr.status === 200) && (typeof o.success === "function") && (o.success(xhr.response))
  typeof o.process === "function" && (xhr.upload.onprogress = e => e.lengthComputable && o.process(Math.floor(e.loaded / e.total * 100), e.loaded))
  method === "GET" && ((o.data === undefined ? xhr.open(method, url, async) : xhr.open(method, url + "?" + jsonToUrl(o.data), async)) || xhr.send())
  method === "POST" && (() => {
    if (o.formData && o.formData === true) {
      xhr.open(method, url, async) || o.data === undefined ? xhr.send() : xhr.send(o.data)
    } else {
      xhr.open(method, url, async) || xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded") || o.data === undefined ? xhr.send() : xhr.send(jsonToUrl(o.data))
    }
  })()
}
const checkDevice = () => navigator.userAgent.match(/iPhone|Android|Mobile|iPad|Firefox|opr|chrome|safari|trident/i)[0]
const mobileDevice = /Android|iPhone|Mobile|iPad/i.test(checkDevice())
const mobileInput = () => mobileDevice && for_(getElements("input"), i => i.onfocus = e => window.scrollTo(0, e.target.offsetTop - (document.documentElement.clientHeight / 3) + 50))
const cookie = {
  set: (name, value, expires) => {
    if (typeof expires !== "number") {
      document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value)
    } else {
      let time = new Date()
      time.setTime(time.getTime() + expires)
      document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + "expires=" + time.toUTCString()
    }
  },
  get: (name) => {
    const cookies = document.cookie.split(' ')
    let result = null
    for (let i = 0, len = cookies.length; i < len; i++) {
      const obj = cookies[i].split("=")
      if (decodeURIComponent(obj[0]) === name) {
        result = decodeURIComponent(obj[1])
        break
      }
    }
    return result.substr(result.length - 1) === ";" ? result.substr(0, result.length - 1) : result
  },
  delete: (name) => {
    cookie.set(name, "", -1)
  }
}
const scrollEvent = (obj, endback) => {
  let endTop = document.documentElement.scrollTop || document.body.scrollTop
  for_(obj, i => {
    if (endTop >= i['top']) {
      i['fun']()
      i.tag = false
    } else
      i.tag = true
  })
  if (mobileDevice) {
    document.body.addEventListener("touchmove", e => {
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
    document.body.addEventListener("touchend", e => {
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
      if (scrollTop >= endTop) {
        for_(obj, k => {
          if (scrollTop >= k.top && k.tag) {
            k['fun']()
            k.tag = false
          }
        })
        endTop = scrollTop
      }
      typeof endback === 'function' && scrollTop >= document.body.clientHeight - document.documentElement.clientHeight && endback()
    }
  }
}
const checkWebp = (callback) => {
  const webp = new Image()
  webp.src = "data:image/webp;base64,UklGRiYAAABXRUJQVlA4IBoAAAAwAQCdASoBAAEAAIAMJaQAA3AA/v89WAAAAA=="
  webp.onload = () => webp.width && callback()
}