
import { getId } from './index';

const apiCacheHash: any = {

}
interface ApiCache<TR> {
    then: (fn: (arg: TR) => any) => ApiCache<any>;
    catch: (fn: any) => ApiCache<any>;
    finally: (fn: any) => ApiCache<any>;


}
interface ApiCacheConstructor {
    new <TR>(url: string, p: Promise<any>): ApiCache<TR>;
}

// @ts-ignore
export const ApiCache: ApiCacheConstructor = class _apiCache {
    private thenCb: CallableFunction | undefined;
    private catchCb: CallableFunction | undefined;
    private finallyCb: CallableFunction | undefined;

    constructor(url: string, p: any) {

        setTimeout(() => {
            if (apiCacheHash[url] && this.thenCb) {

                this.thenCb(apiCacheHash[url])
            }
        }, 1);

        console.log(apiCacheHash)



        p.then((_: any) => {
            apiCacheHash[url] = _;
            this.thenCb && this.thenCb(_)
        })
        p.catch((_: any) => this.catchCb && this.catchCb(_))
        p.finally(() => this.finallyCb && this.finallyCb())

    }


    then = (cb: CallableFunction) => {
        this.thenCb = cb

        return this.chainer()

    }
    catch = (cb: CallableFunction) => {
        this.catchCb = cb
        return this.chainer()
    }
    finally = (cb: CallableFunction) => {
        this.finallyCb = cb
        return this.chainer()
    }
    private chainer = () => {
        return {
            catch: this.catch,
            then: this.then,
            finally: this.finally,
        }
    }
}

export class Throttle {

    time = 100
    wait = false;
    skip = 0
    times = 0
    constructor(time: number, skip?: number) {

        this.time = time
        this.skip = skip || 0

    }
    start(cb: CallableFunction) {


        if (!this.wait) {
            this.times++
            if (this.skip && this.times === this.skip) {

            } else {
                cb()
                this.wait = true;
            }

            setTimeout(() => {
                this.wait = false;
            }, this.time);
        }


    }
    resetSkip() {
        this.times = 0
    }


}


export class DebounceTime {

    time = 400
    ref: any;
    active = false;
    public start = (fn: Function, time?: number) => {
        if (this.ref) {
            clearTimeout(this.ref)
        }

        this.active = true;
        if (time) {
            this.time = time
        }
        const deffFun = () => {
            fn()
            this.active = false
        }

        this.ref = setTimeout(deffFun, this.time);
    }
    public destroy() {
        clearTimeout(this.ref)
    }


}


export class BehaviourSubject {
    initialValue = null
    lastValue = null
    // @ts-ignore
    fns: { [id: string]: Function } = {};
    constructor(value: any) {
        this.lastValue = value
        this.initialValue = value
    }

    public next = (newValue: any) => {
        this.lastValue = newValue
        this.subscribe()

    }
    public subscribe = (fn?: Function, value?: any) => {
        let id: string;
        if (fn) {
            id = getId()
            this.fns[id] = fn


        }

        if (this.fns) {
            Object.values(this.fns).forEach(_fn => {
                _fn(this.lastValue)
            })

        }


        if (fn) {

            return {
                unSubscribe: () => {
                    delete this.fns[id]
                    if (Object.keys(this.fns).length === 0) {
                        this.lastValue = this.initialValue

                    }

                }
            }
        }

    }
}


export const objectClone = <T>(obj: T) => {

    if (!obj) {
        return obj
    }


    return JSON.parse(JSON.stringify(obj)) as T
}

export const wait = (miliseconds: number = 5000) => {

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, miliseconds);
    })

}


let textArea: any;
export let copy: any;

function isOS() {
    return navigator.userAgent.match(/ipad|iphone/i);
}

function createTextArea(text: any) {

    textArea = document.createElement('textArea');
    textArea.value = text;
    document.body.appendChild(textArea);
}

function selectText() {
    let range: any,
        selection: any;

    if (isOS()) {
        range = document.createRange();
        range.selectNodeContents(textArea);
        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        textArea.setSelectionRange(0, 999999);
    } else {
        textArea.select();
    }
}

function copyToClipboard() {
    document.execCommand('copy');
    document.body.removeChild(textArea);
}

copy = function (text: any) {
    createTextArea(text);
    selectText();
    copyToClipboard();
};
