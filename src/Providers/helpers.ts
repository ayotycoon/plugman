
import { getId } from './index';


export const bodyTypeParser = (bodyType: any, body: any) =>{

    if (bodyType == 'object') {
        return JSON.parse(body)
    } else if (bodyType == 'number') {
        return parseInt(body)

    } else if (bodyType == 'json') {
        if (!JSON.parse(body)) {
            throw "invalid json"
        }
    }

    return body;

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
