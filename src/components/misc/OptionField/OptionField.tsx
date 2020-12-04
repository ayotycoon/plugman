import React, { useState, useEffect, useRef } from 'react'
import './OptionField.scss'
import { DebounceTime } from '../../../Providers/helpers';
import { getId } from '../../../Providers';



function OptionField(props: any) {
    const [validatorError, setValidatorError] = useState('');
    const [value, setValue] = useState(props.default || '');
    const [valid, setValid] = useState(false);
    const [touched, setTouched] = useState(false);

    const checkboxHash: any = {}
    value.split('|').forEach((_: string) => {
        checkboxHash[_] = true

    });


    const blurDebounceRef: any = useRef(null);
    let blurDebounce: any = blurDebounceRef.current

    const id = useRef(getId()).current;



    let setInputDebounceRef: any = useRef([new DebounceTime(), new DebounceTime()])
    const setInputDebounce: [DebounceTime, DebounceTime] = setInputDebounceRef.current;

    function setInput(value: any) {
        const input = value


        setValue(input)
        function fun() {

            if (props.validators && props.validators.length) {
                let valid_ = false
                for (let validator of props.validators) {
                    try {
                        const functionValid = new Function('arg1,arg2', validator.function)(input)

                        valid_ = functionValid
                        if (!functionValid) {
                            setValidatorError(validator.error)

                            break;
                        }

                    } catch {
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
                if (!valid) {
                    setValid(true)
                }
            }

            if (!touched) {
                setTouched(true)
            }


            if (props.onChange) {
                props.onChange(input)
            }


        }

        setInputDebounce[0].start(fun)
    }

    function editableIconClicked() {
        if (props.editable && !valid && touched) {

            return
        }
        props.editableIconClicked()
    }

    useEffect(() => {
        return () => {
            // @ts-ignore
            //  setInputDebounce = undefined
        }


    }, []);
    useEffect(() => {
        if ((value !== props.default) && props.default) {
         setValue(props.default)
        }

        return () => {
            if (blurDebounce) {
                clearTimeout(blurDebounce)
            }
        }


    }, [props.default]);
    useEffect(() => {
     
        document.querySelector('#' + id)
            ?.querySelectorAll('input')
            .forEach(input => {
                if (checkboxHash[input.value]) {
                    input.checked = true
                    return;
                }
             
input.checked = false;
            })

    }, [value]);

    function getValueCheckbox() {
        let str = ''
        document.querySelector('#' + id)
            ?.querySelectorAll('input')
            .forEach(input => {
                if (!input.checked) {
                    return;
                }
                str = `${str}${str ? '|' : ''}${input.value}`

            })

        console.log(str)
        return str;

    }
    return (
        <div id={id} className='OptionField'>
            <label className='d-block'>
                <span
                style={props.labelStyle}
                    className={props.inline ? '' : 'font-weight-bold'}>
                    {props.label} </span>
                {props.info && !props.inline && <>
                    <span className='info-container '>
                        <i className='fa fa-info-circle'>
                        </i>
                        <div className='info-content p-2 rounded text-white bg-info'>{props.info}</div></span> </>}


                {props.toggleOptionField && <span className='float-right mr-2' onClick={() => props.editableIconClicked ? editableIconClicked() : ''}>
                    {!props.editable ?
                        <i className='fa fa-pen'></i> : <i className='fa fa-save'></i>}

                </span>}
            </label>
            <span className='ml-2 d-block'>{validatorError && !valid && <small className='text-danger'>{validatorError}</small>}</span>

            <div className={'value-view ' + (!props.inline ? '' : '')}>
                {!props.editable && props.toggleOptionField ?
                    <div>

                        {value ? value :
                            <>
                                <i>empty</i>
                            </>

                        }
                    </div>
                    :
                    <>




                        <span className='d-block option-container' style={{ position: 'relative' }}>

                            {(props.options || []).map((option: string, index: number) => {
                                return (
                                    <div key={index}>
                                        <input
                                            value={option}
                                      disabled={props.disabled}
                                            onChange={(e: any) => setInput(props.type === 'radio' ? e.target.value : getValueCheckbox())}
                                            name={props.id}
                                            id={props.id + index}
                                            type={props.type} />
                                        <label htmlFor={props.id + index} className='ml-2'>{option}</label>

                                    </div>
                                )
                            })}


                        </span>


                    </>


                }
            </div>


        </div>
    )

}

export default OptionField;