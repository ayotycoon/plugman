export const getId = () => {
  return 'a' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
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


export const refreshUserDataObs = new BehaviourSubject(true)
export const sendToCollectionObs = new BehaviourSubject(null)
export const possibleResizeObs = new BehaviourSubject(false)



export const toastObs = new BehaviourSubject(null)
export const shareObs = new BehaviourSubject(null)
export const modalObs = new BehaviourSubject(null)
export const alertObs = new BehaviourSubject(null)
export const confirmObs = new BehaviourSubject(null)
export const selectObs = new BehaviourSubject(null)
export const promptObs = new BehaviourSubject(null)
const toasterBehaviourSubj = [new DebounceTime(), new DebounceTime()]
export const toaster = (data: any, _timer?: number) => {

    const timer = _timer || 5000
    toastObs.next({ ...data, incoming: true })

    if (data.attention) {
        toastObs.next({ ...data, incoming: true });
        return;
    }
    toasterBehaviourSubj[0].start(() => toastObs.next(null), timer)


    toasterBehaviourSubj[1].start(() => toastObs.next({ ...data, incoming: false }), timer - 500)
}
export const modaler = (data: any) => {
    return new Promise((resolve, reject) => {
        modalObs.next({
            ...data, cb: (closed: boolean) => {
                resolve(closed)

            }
        })
    })
}
export const confirmer = (text: string, body? : string) => {

    return new Promise((resolve, reject) => {
        confirmObs.next({
          text, body, cb: (val: boolean, throwError?: boolean) => {
            if (throwError) {
              reject(val)
              return
            } resolve(val)

            }
        })
    })

}
export const alerter = (text: string, body? : string) => {

    return new Promise((resolve, reject) => {
        alertObs.next({
          text, body
        })
    })

}
export const selecter = (data: any) => {

    return new Promise((resolve, reject) => {
        selectObs.next({
          ...data, cb: (val: boolean, throwError?: boolean) => {
            if (throwError) {
              reject(val)
              return
            } resolve(val)

            }
        })
    })

}
export const prompter = (text: any, value?: string) => {

    return new Promise((resolve, reject) => {
        promptObs.next({
            text,
            value, 
            
            cb: (val: boolean, throwError?: boolean) => {
              if(throwError){
                reject(val)
                return
              }
                resolve(val)

            }
        })
    })

}







