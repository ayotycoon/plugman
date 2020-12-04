
function _reset(stage) {
    const prepend = 'data-intro'
    const prepend2 = 'data-step'
    const s_selector1 = `${stage}-${prepend}`
    const s_selector2 = `${stage}-${prepend2}`

    // reset possible previous
    document.querySelectorAll(`[${prepend}]`)
        .forEach(_ => {

            _.removeAttribute(prepend)
            _.removeAttribute(prepend2)

        })
    // add new ones
    document.querySelectorAll(`[${s_selector1}]`)
        .forEach(_ => {
            const val = _.getAttribute(`${s_selector1}`)
            const val2 = _.getAttribute(`${s_selector2}`)


            _.setAttribute(prepend, val)
            _.setAttribute(prepend2, val2)

        })
}
function _startIntro(stage, cb) {
    const options = {
        exitOnEsc: false,
        exitOnOverlayClick: false
    }
    // general layout



    _reset(stage)
    introJs()
        .setOptions(options)
        // .oncomplete(cb)
        .onexit(cb)
        .start();








}

function _preStartIntro(stage, cb) {
    if (!document.querySelector('#introjs-script')){

        const link1 = document.createElement('link')
        link1.rel = "stylesheet"
        link1.href = "/introjs.min.css"

        link1.crossorigin = "anonymous"



        document.querySelector('head').appendChild(link1)


        const script1 = document.createElement('script');
        script1.src = "/intro.min.js"

        script1.id = 'introjs-script'
        script1.crossorigin = "anonymous"


        document.querySelector('body').appendChild(script1)

        document.querySelector('#introjs-script')
            .onload = () => {

                _startIntro(stage, cb)
            }


    } else {
        _startIntro(stage, cb)
    }








}

window.preStartIntro = _preStartIntro


