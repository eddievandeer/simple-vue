import Compiler from './compiler'
import Observer from './observer'

class Vue {
    constructor(options) {
        this.$el = options.el
        this.$data = options.data
        this.$options = options

        new Observer(this.$data)
        new Compiler(this.$el, this)
        this.proxyData(this.$data)
    }

    proxyData(data) {
        Object.keys(data).forEach((key) => {
            Object.defineProperty(this, key, {
                get() {
                    return data[key]
                },
                set(newValue) {
                    data[key] = newValue
                }
            })
        })
    }
}

export default Vue