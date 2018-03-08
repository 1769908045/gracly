class GraPage {
  constructor(element, data, event) {
    this.container = element
    this.data = data
    this.event = event
    this.pageNum = ~~(data.total / data.show) + 1
    this.create()
  }

  create() {
    const container = this.container
    container.innerHTML = "";
    const data = this.data
    const first = data.first ? data['first'] : '首页'
    const last = data.last ? data['last'] : '末页'
    const previous = data.previous ? data['previous'] : '上一页'
    const next = data.next ? data['next'] : '下一页'
    let html = `<button>${first}</button><button>${previous}</button>`

    html += `<button>${next}</button><button>${last}</button>`
  }

  addNum() {
    const container = this.container;
    const addElement = (count) => {
      for (let i = 0; i < count; i++) {
        const button = document.createElement("button");
        i === 0 ? button.setAttribute("class", "num select") : button.setAttribute("class", "num");
        button.innerText = i + 1;
        container.insertBefore(button, container.getElementsByClassName("next")[0]);
      }
    };
    this.pageNum > 6 ? addElement(6) : addElement(this.pageNum);
    this.addEvent();
  }

  addEvent() {
    const pageNum = this.pageNum;
    const first = this.container.getElementsByClassName("first")[0];
    const last = this.container.getElementsByClassName("last")[0];
    const previous = this.container.getElementsByClassName("previous")[0];
    const next = this.container.getElementsByClassName("next")[0];
    const nums = this.container.getElementsByClassName("num");
    first.onclick = e => {
      let num = 1;
      [].map.call(nums, i => {
        i.innerText = num++;
        i.setAttribute("class", "num");
      });
      nums[0].setAttribute("class", "num select");
    };
    last.onclick = e => {
      let num = pageNum;
      let len = nums.length;
      for (let i = 0; i < len; i++) {
        nums[i].setAttribute("class", "num");
        nums[len - i - 1].innerText = num--;
      }
      nums[len - 1].setAttribute("class", "num select");
    };
    previous.onclick = e => {
      let tag = 0;
      if (nums[0].getAttribute("class") === "num select") {
        parseInt(nums[0].innerText) > 1 ? [].map.call(nums, i => i.innerText = parseInt(i.innerText) - 1) : null;
      } else {
        [].map.call(nums, i => {
          if (i.getAttribute("class") === "num select" && tag === 0) {
            i.setAttribute("class", "num");
            i.previousElementSibling.setAttribute("class", "num select");
            tag = 1;
          }
        })
      }
    };
    next.onclick = e => {
      let tag = 0;
      let len = nums.length;
      if (nums[len - 1].getAttribute("class") === "num select") {
        parseInt(nums[len - 1].innerText) < pageNum ? [].map.call(nums, i => i.innerText = parseInt(i.innerText) + 1) : null;

      } else {
        [].map.call(nums, i => {
          if (i.getAttribute("class") === "num select" && tag === 0) {
            i.setAttribute("class", "num");
            i.nextElementSibling.setAttribute("class", "num select");
            tag = 1;
          }
        })
      }
    };
    [].map.call(nums, i => {
      i.onclick = e => {
        [].map.call(nums, i => i.setAttribute("class", "num"));
        e.target.setAttribute("class", "num select");
      }
    });
    this.callBack();
  }

  callBack() {
    const fun = this.event;
    const nums = this.container.getElementsByClassName("num");
    typeof fun === "function" ? this.container.onclick = e => e.target.tagName.toLocaleLowerCase() === "button" ? [].map.call(nums, i => i.getAttribute("class") === "num select" ? fun(i.innerText) : null) : null : null;
  }
}