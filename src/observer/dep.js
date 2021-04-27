import { remove } from '../shared/utils'

let uid = 0

export default class Dep {
    constructor() {
        this.id = ++uid
        this.subs = []
    }

    addSub(watcher) {
        this.subs.push(watcher)
    }

    removeSub(sub) {
        remove(this.subs, sub)
    }

    depend() {
        const target = Dep.target

        if (target) {
            target.addDep(this)
        }
    }

    notify() {
        const subs = this.subs.slice()

        if (process.env.NODE_ENV !== 'production') {
            subs.sort((a, b) => a.id - b.id)
        }

        subs.forEach(w => w.update())
    }
}

Dep.target = null

const targetStack = []

export function pushTarget(target) {
    targetStack.push(target)
    Dep.target = target
}

export function popTarget() {
    targetStack.pop()
    Dep.target = targetStack[targetStack.length - 1]
}