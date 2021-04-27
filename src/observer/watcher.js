import Dep, { pushTarget, popTarget } from './dep'
import { getValue } from "../shared/utils"

let uid = 0

class Watcher {
    constructor(vm, expr, callback) {
        this.id = ++uid
        this.vm = vm
        this.expr = expr
        this.callback = callback
        this.deps = []
        this.newDeps = []
        this.depIds = new Set()
        this.newDepIds = new Set()
        // 通过getter的形式对数据进行绑定，标记当前watcher
        this.oldValue = this.getOldValue()
    }

    addDep(dep) {
        const id = dep.id

        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id)
            this.newDeps.push(dep)
            if (!this.depIds.has(id)) {
                dep.addSub(this)
            }
        }
    }

    getOldValue() {
        pushTarget(this)
        const oldValue = getValue(this.expr, this.vm)
        popTarget()
        this.cleanupDeps()
        return oldValue
    }

    cleanupDeps() {
        let i = this.deps.length

        while (i--) {
            const dep = this.deps[i]
            if (!this.newDepIds.has(dep.id)) {
                dep.removeSub(this)
            }
        }

        // depIds赋为newDepIds的值，并清空newDepIds
        let tmp = this.depIds
        this.depIds = this.newDepIds
        this.newDepIds = tmp
        this.newDepIds.clear()

        // deps赋为newDeps的值，并清空newDeps
        tmp = this.deps
        this.deps = this.newDeps
        this.newDeps = tmp
        this.newDeps.length = 0
    }

    update() {
        const newValue = getValue(this.expr, this.vm)

        if (newValue !== this.oldValue) {
            this.callback.call(this.vm, newValue)
        }
    }
}

export default Watcher