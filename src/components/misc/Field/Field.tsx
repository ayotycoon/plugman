import React, { useState, useEffect, useRef } from 'react'
import './Field.scss'
import { DebounceTime } from '../../../Providers/helpers';
import { getId } from '../../../Providers';
import { prependOnceListener } from 'process';




function Field(props: any) {
    const [validatorError, setValidatorError] = useState('');
    const [value, setValue] = useState(props.default || '');
    const [valid, setValid] = useState(props.default ? true : false );
    const [touched, setTouched] = useState(false);
    const [focused, setFocused] = useState(false);
    const [fliteredOptions, setFliteredOptions] = useState(props.options || []);


    const blurDebounceRef: any = useRef(null);
    let blurDebounce: any = blurDebounceRef.current
    const id = useRef(getId()).current



    let setInputDebounceRef: any = useRef( [new DebounceTime(), new DebounceTime()])
    const setInputDebounce: [DebounceTime, DebounceTime] = setInputDebounceRef.current;

    function setInput(value: any, trigger?:boolean) {
        let input = value
        if(!trigger){
            setValue(input)
        }
   
   
        function fun() {
            let valid_ = false
            if (props.validators && props.validators.length) {
             
                for (let validator of props.validators) {
                    try {
                        const functionValid = new Function('arg1,arg2', validator.function)(input)

                        valid_ = functionValid
                        if (!functionValid) {
                            setValidatorError(validator.error)

                            break;
                        }

                    } catch (e){
                        setValidatorError(validator.error)
                    }


                }

                if (valid_ !== valid) {
                    setValid(!!valid_)

                }
                if (valid_ && props.onValidChange) {
                    props.onValidChange(input)

                    
                }

            } else {
                valid_ = true
                if (!valid) {
                    setValid(true)
                }
            }

            if(trigger){
                setTouched(true)
                return valid_
            }

            if (!touched) {
                setTouched(true)
            }


            if (props.onChange) {
                props.onChange(input)
            }
        
            if (props.options) {
                const arr = [...props.options].filter(a => a.match(new RegExp(input, 'i')))
                setFliteredOptions(arr)

            }

            return valid_
        }

        if (trigger){
            return fun()
        }
        setInputDebounce[0].start(fun)
    }
    function setFocusedDebounce(val: boolean) {
        if (blurDebounce) {
            clearInterval(blurDebounce)
        }
        blurDebounce = setTimeout(() => {
            setFocused(val)
        }, 500);

        if (!valid && props.validatorDefault) {
            setInput(props.validatorDefault)

        }
    }
    function editableIconClicked() {
        if (props.editable && !valid && touched) {

            return
        }
        props.editableIconClicked()
    }




    useEffect(() => {
        if ((value !== props.default)  && props.default && !touched) {

      setValue(props.default)
        }

        return () => {
      
        }


    }, [props.default]);


 

    useEffect(() => {

        if (props.onEmitCusRef) {
            const cusRef = {

                triggerValidate: () => {
           
                    return setInput(value, true)

                },
                id
            }
            props.onEmitCusRef(cusRef)
        }
        return () => {
            // @ts-ignore
            //  setInputDebounce = undefined
        }


    }, [value]);
 
    const type = props.mtype || props.type
    return (
        <div className='Field'>
            <label className='d-block'><span className={props.inline ? '' : 'font-weight-bold'}>{props.label} </span> {props.info && <><span className='info-container '> <i className='fa fa-info-circle'></i><div className='info-content p-2 rounded text-white bg-info'>{props.info}</div></span> </>}

                {value && ((!props.toggleField) && !props.inline || (props.editable ? true : false)) && <i onClick={() => setInput('')} title='clear' className='fa fa-close float-right mr-1 mt-1'></i>}

                {props.toggleField && !props.disabled && <span className='float-right mr-2' onClick={() => props.editableIconClicked ? editableIconClicked() : ''}>
                    {!props.editable ?
                        <i className='fa fa-pen'></i> : <i className='fa fa-save'></i>}

                </span>}
            </label>
            <span className='ml-2 d-block'>{validatorError && !valid && <small className='text-danger'>{validatorError}</small>}</span>

            <div className='  value-view'>
                {!props.editable && props.toggleField ?
                    <div>

                        {value ? value :
                            <>
                                <i>empty</i>
                            </>

                        }
                    </div>
                    :
                    <>

                        {
                            type !== 'textarea' ?
                                <>



                                    <input  name={props.name || props.label} style={props.style} disabled={props.disabled} placeholder={props.placeholder} className={!valid && touched ? 'form-control text-danger border-danger' : 'form-control'} type={type} value={value} onChange={(e) => setInput(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocusedDebounce(false)} />
                                    <span className='d-block' style={{ position: 'relative' }}>
                                        {type === 'select' && focused &&
                                            <div className='border rounded bg-white' style={{ position: 'absolute', top: 0, left: 0, width: '100%', maxHeight: '200px', overflowY: 'auto', zIndex: 2 }}>
                                                {(fliteredOptions as any[]).map((optionObj, optionIndex) => {
                                                    return (
                                                        <div onClick={() => { setInput(optionObj.value ? optionObj.value : optionObj); setFocused(false) }} key={optionIndex} className='p-2 list-group-item-action pt-1 pb-1 cursor'>{optionObj.text ? optionObj.text : optionObj}</div>

                                                    )
                                                })}
                                                {!fliteredOptions.length && <div className='list-group-item pt-1 pb-1 text-muted'><small><i>No Match</i></small></div>
                                                }


                                            </div>
                                        }
                                    </span>
                                </> : <>
                                    <textarea style={props.style}  disabled={props.disabled} placeholder={props.placeholder} className={!valid && touched ? 'form-control text-danger border-danger' : 'form-control'} value={value} onChange={(e) => setInput(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocusedDebounce(false)} ></textarea>

                                </>
                        }
                    </>


                }
            </div>


        </div>
    )

}

export default Field;