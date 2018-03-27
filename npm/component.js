export class GraPage {
    constructor(element, data, callBack) {
        this.container = element
        this.data = data
        this.callBack = callBack
        this.pageNum = Math.ceil(data.total / data.show)
        this.create()
    }

    create() {
        const container = this.container
        const data = this.data
        const pageNum = this.pageNum
        container.innerHTML = "";
        const first = data.first ? data.first : '首页'
        const last = data.last ? data.last : '末页'
        const previous = data.previous ? data.previous : '上一页'
        const next = data.next ? data.next : '下一页'
        const showPage = data.showPage ? data.showPage : pageNum > 8 ? 8 : pageNum
        const className = `class="page-button"`
        let html = `<button ${className}>${first}</button><button ${className}>${previous}</button>`
        for (let i = 0; i < showPage; i++) {
            html += `<button>${i + 1}</button>`
        }
        html += `<button ${className}>${next}</button><button ${className}>${last}</button>`
        container.innerHTML = html
        this.addEvent()
    }

    addEvent() {
        const callBack = this.callBack
        const pageNum = this.pageNum
        const container = this.container
        const buttons = container.getElementsByTagName('button')
        const length = buttons.length
        const first = buttons[0]
        const previous = buttons[1]
        const next = buttons[length - 2]
        const last = buttons[length - 1]
        let num = 0
        container.classList.add('gra-page')
        const reset = (target) => {
            const select = container.getElementsByClassName('select')[0]
            select && select.classList.remove('select')
            target.classList.add('select')
            callBack(target.innerText)
        }
        reset(buttons[2])
        first.onclick = e => {
            num = 1
            for (let i = 2; i < length - 2; i++) {
                buttons[i].innerText = num++
            }
            reset(buttons[2])
        }
        last.onclick = e => {
            num = pageNum
            for (let i = length - 3; i > 1; i--) {
                buttons[i].innerText = num--
            }
            reset(buttons[length - 3])
        }
        previous.onclick = e => {
            const select = container.getElementsByClassName('select')[0]
            const move = () => {
                if (select.previousElementSibling.classList.contains('page-button')) {
                    let index = +select.innerText
                    if (index > 1) {
                        index--
                        for (let i = 2; i < length - 2; i++) {
                            buttons[i].innerText = index++
                        }
                    }
                    reset(select)
                } else {
                    reset(select.previousElementSibling)
                }
            }
            select.innerText === '1' ? callBack('1') : move()
        }
        next.onclick = e => {
            const select = container.getElementsByClassName('select')[0]
            const move = () => {
                if (select.nextElementSibling.classList.contains('page-button')) {
                    let index = +select.innerText
                    if (index < pageNum) {
                        index++
                        for (let i = length - 3; i > 1; i--) {
                            buttons[i].innerText = index--
                        }
                    }
                    reset(select)
                } else {
                    reset(select.nextElementSibling)
                }
            }
            +select.innerText === pageNum ? callBack(pageNum + '') : move()
        }
        container.onclick = ({target}) => target.tagName.toLowerCase() === 'button' && !target.classList.contains('page-button') && reset(target)
    }
}