import React, { useState, useEffect } from 'react'
import './Interactive.scss'
import { BehaviourSubject, DebounceTime } from '../../../Providers/helpers'

let stageObs: BehaviourSubject;
let movementObs: BehaviourSubject


function number2arr(n: number) {

    const arr: number[] = []
    for (let i = 1; i <= n; i++) {

        arr.push(i)

    }
    return arr;
}

function Interactive(props: any) {
    const [stages, setStages] = useState(props.stages || 2)

    const [currStage, setCurrStage] = useState(1)
    const [showNext, setShowNext] = useState(true)
    const [showPrevious, setShowPrevious] = useState(true)

    useEffect(() => {
        stageObs = new BehaviourSubject(1)
        movementObs = new BehaviourSubject(null)
        const sub: any = movementObs.subscribe((data: any) => {
            if (data) {
                if (data.type === 'next') {
                    setShowNext(data.value)
                } else if (data.type === 'previous') {
                    setShowPrevious(data.value)
                }
            }
        })

        return () => {
            sub.unSubscribe()
        }

    }, [])


    return (
        <div className='Interactive' >
            <div className='text-center'>


                {number2arr(stages).map((stage, index) => {
                    return (
                        <div key={index} className={'d-inline-block v-top mr-1 ml-1 ' + (stage <= currStage ? ' bg-primary animated fadeIn' : 'bg-light border')} style={{ width: (80 / stages) + '%', height: '5px' }}>

                        </div>
                    )
                })}
            </div>
            <br />
            <div className='inner'>
                {props.children}
            </div>

            <br />
            <br />


            <footer className='row'>
                <div className='col-6'>

                    {currStage > 1 && <button disabled={!showPrevious} onClick={() => { stageObs.next(currStage - 1); setCurrStage(currStage - 1); }} className='btn btn-sm'>

                        <i className='fa fa-angle-left ml-1'></i> Previous
                    </button>}
                </div>
                <div className='col-6 text-right'>
                    <button disabled={!showNext} onClick={() => { stageObs.next(currStage + 1 > stages ? 1 : currStage + 1); setCurrStage(currStage + 1); (currStage === stages && props.onFinish && props.onFinish()) }} className='btn btn-sm btn-primary'>
                        {currStage === stages ? 'Finish' : 'Next'}
                        <i className='fa fa-angle-right ml-1'></i>
                    </button>
                </div>


            </footer>
        </div>
    )

}

Interactive.Stage = class Stage extends React.Component {
    props: any;
    state = {
        currStage: 1
    }
    sub: any;
    debounceTime = new DebounceTime()

    constructor(props: any) {
        super(props)
        this.props = props;
    }
    componentDidMount() {
        setTimeout(() => {
            this.sub = stageObs.subscribe((val: number) => {
                if (val) {
                    this.setState({ currStage: val })
                }
            })

            this.checkNextAndPreviousProps(); 
        }, 1000);

     
    };
    componentWillReceiveProps(prevProps: any, nextProps: any) {
        if (prevProps.showNext !== nextProps.showNext) {
            this.debounceTime.start(this.checkNextAndPreviousProps.bind(this), 500)
        }

    }
    UNSAFE_componentWillUnmount() {
        this.sub.unSubscribe()

    }
    checkNextAndPreviousProps() {
        if (this.state.currStage !== this.props.stage) {
            return;
        }
        if (this.props.showNext !== undefined) {
            movementObs.next({ type: 'next', value: this.props.showNext })
        }
        if (this.props.showPrevious !== undefined) {
            movementObs.next({ type: 'previous', value: this.props.showNext })
        }

    }
    render() {

        return (
            <>
                {this.state.currStage === this.props.stage && <div className='animated fadeIn'>{this.props.children}</div>}

            </>
        )
    }


}


export default Interactive;