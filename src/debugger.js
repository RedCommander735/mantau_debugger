document.body.style.border = "5px solid green";

const webframe = XPCNativeWrapper.unwrap(window).webframe;

let initialised = false

function init() {
    let interval = setInterval(() => {
        if (XPCNativeWrapper.unwrap(window).webframe.getMainApp) {
            if (XPCNativeWrapper.unwrap(window).webframe.getMainApp().isInitComplete) {
                initialised = true
                done()
                clearInterval(interval)
            }
        }
    }, 500)
}

function done() {
    // Implement debugger here
    console.log('Done');
}

init()