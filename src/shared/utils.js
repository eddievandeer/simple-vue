export function isObject(obj) {
    return obj != null && typeof obj === 'object'
}

export function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    })
}

export function isElementNode(node) {
    return node.nodeType === 1
}

export function isTextNode(node) {
    return node.nodeType === 3
}

export function isDirector(name) {
    return name.startsWith('v-')
}

export function isEventName(name) {
    return name.startsWith('@')
}

export function getValue(expr, vm) {
    return vm.$data[expr.trim()]
}

export function setValue(expr, vm, newValue) {
    vm.$data[expr] = newValue
}

export function remove(arr, item) {
    if (arr.length) {
        const index = arr.indexOf(item)
        if (index > -1) {
            return arr.splice(index, 1)
        }
    }
}