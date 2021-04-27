import Vue from './src/simple-vue'

const app = new Vue({
    el: '#app',
    data: {
        message: 'message',
        obj: {
            a: 123,
            b: 231
        }
    },
    methods: {
        handleClick() {
            console.log(this);
            this.message = new Date().toLocaleString()
        }
    }
})

// app.message = 'new message'

// console.log(app.message);