import Dep from './dep'
import { isObject, def } from "../shared/utils"

class Observer {
    constructor(value) {
        this.dep = new Dep()
        def(value, '__ob__', this)
        this.walk(value)
    }

    walk(data) {
        Object.keys(data).forEach((key) => {
            this.defineReactive(data, key, data[key])
        })
    }

    observe(data) {
        if (!isObject(data)) return

        let ob
        // 已被观察则返回data.__ob__，省去多余操作
        if (data.__ob__ && data.__ob__ instanceof Observer) {
            ob = data.__ob__;
        }
        else {
            ob = new Observer(data)
        }

        return ob
    }

    defineReactive(obj, key, value) {
        this.observe(value)

        Object.defineProperty(obj, key, {
            get: () => {
                console.log(`get ${key}: ${value}`)
                this.dep.depend()
                return value
            },
            set: (newValue) => {
                if (value === newValue) return
                this.observe(newValue)
                value = newValue

                this.dep.notify()
                console.log(`set ${key}: ${newValue}`)
            }
        })
    }
}

export default Observer