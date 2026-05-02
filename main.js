barba.init({
    transitions: [{
        name: 'default-transition',
        leave() {
            console.log('Barba: leave fired')
        },
        enter() {
            console.log('Barba: enter fired')
        }
    }]
})

console.log('Barba version:', barba.version)