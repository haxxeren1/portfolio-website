barba.init({
    transitions: [{
        name: 'fade',

        leave(data) {
            return gsap.to(data.current.container, {
                opacity: 0,
                duration: 0.4,
                ease: 'power2.inOut'
            })
        },

        enter(data) {
            return gsap.from(data.next.container, {
                opacity: 0,
                duration: 0.4,
                ease: 'power2.inOut'
            })
        }
    }]
})

barba.hooks.afterEnter(() => {
    window.Webflow && window.Webflow.destroy()
    window.Webflow && window.Webflow.ready()
    window.Webflow && window.Webflow.require('ix2').init()
    window.scrollTo(0, 0)
})