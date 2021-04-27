import Watcher from "../observer/watcher"
import {
    isDirector,
    isElementNode,
    isTextNode,
    getValue,
    setValue,
    isEventName
} from "../shared/utils"

const events = {
    model(node, value, vm) {
        const initValue = getValue(value, vm)

        new Watcher(vm, value, (newValue) => {
            this.modelUpdater(node, newValue)
        })

        node.addEventListener('input', (e) => {
            const newValue = e.target.value
            setValue(value, vm, newValue)
        })

        this.modelUpdater(node, initValue)
    },
    text(node, value, vm) {
        let result
        if (value.includes('{{')) {
            // {{ xxx }}
            result = value.replace(/\{\{(.+)\}\}/g, (...args) => {
                const expr = args[1].trim()

                new Watcher(vm, expr, (newValue) => {
                    this.textUpdater(node, newValue)
                })

                return getValue(expr, vm)
            })
        } else {
            // v-text="xxx"
            result = getValue(value, vm)
        }

        this.textUpdater(node, result)
    },
    on(node, value, vm, eventName) {
        const fn = vm.$options.methods[value]

        node.addEventListener(eventName, fn.bind(vm), false)
    },
    textUpdater(node, value) {
        node.textContent = value
    },
    modelUpdater(node, value) {
        node.value = value
    }
}

class Compiler {
    constructor(el, vm) {
        this.el = isElementNode(el) ? el : document.querySelector(el)
        this.vm = vm

        const fragment = this.compilerFragment(this.el)
        this.compile(fragment)
        this.el.appendChild(fragment)
    }

    compile(fragment) {
        const childNodes = Array.from(fragment.childNodes)

        childNodes.forEach(childNode => {
            if (isElementNode(childNode)) {
                // console.log('标签节点', childNode);
                this.compileElement(childNode)
            }
            else if (isTextNode(childNode)) {
                // console.log('文本节点', childNode);
                this.compileText(childNode)
            }

            if (childNode.childNodes && childNode.childNodes.length) {
                this.compile(childNode)
            }
        })
    }

    compileElement(node) {
        const attributes = Array.from(node.attributes)

        attributes.forEach(attr => {
            const { name, value } = attr
            if (isDirector(name)) {
                // v-model, v-text, v-on:click
                const [, directive] = name.split('-')
                const [compileKey, eventName] = directive.split(':')

                events[compileKey](node, value, this.vm, eventName)
            } else if (isEventName(name)) {
                // @
                const [, eventName] = name.split('@')
                events['on'](node, value, this.vm, eventName)
            }
        })
    }

    compileText(node) {
        const content = node.textContent
        if (/\{\{(.+)\}\}/.test(content)) {
            // console.log('content', content);
            events['text'](node, content, this.vm)
        }
    }

    compilerFragment(el) {
        const f = document.createDocumentFragment()
        let firstChild

        while (firstChild = el.firstChild) {
            f.appendChild(firstChild)
        }

        return f
    }
}

export default Compiler