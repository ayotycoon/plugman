import React, { useState, useEffect, useRef } from 'react'
import './Dropdown.scss'
import DropdownClick from '../DropdownClick/DropdownClick';
import { getId } from '../../../Providers';



function Dropdown(props: any) {
    const optionsHash: any = { '': { text: '---', value: '' } };
    const options = props.options ? props.options.map((option_: any) => {
        const obj = {
            text: option_.text ? option_.text : option_,
            value: option_.text ? option_.value : option_,

        }
        optionsHash[obj.value] = obj;
        return (
            obj
        )
    }) : [];



    const [value, setValue] = useState(props.default !== undefined ? props.default : '');
const [dropdownBounding, setDropdownBounding] = useState({} as DOMRect)
    const dropdownRef = useRef(null as unknown as HTMLDivElement)



    function setInput(_value: any) {
        const input = _value
        if (input === value) {
            return
        }



        setValue(input)
        if (props.onChange) {
            props.onChange(input)
        }


    }


    useEffect(() => {
        if (props.emitOnInit && props.onChange && value) {
            props.onChange(value)


        }
        return () => {

        }
    }, [])


    useEffect(() => {
        if ((value !== props.default)) {

            setValue(props.default)
        }

        return () => {

        }


    }, [props.default]);
    function clickToggled(value: boolean) {

        setDropdownBounding(dropdownRef.current?.getBoundingClientRect() as any)
 

    }
  

    return (
        <div className='Dropdown'  ref={dropdownRef}>
            <DropdownClick onClick={clickToggled} onScrollClose={true} block={true}>

                <div style={{ width: dropdownRef.current?.clientWidth + 'px' }}>

                    <span className='d-inline-block ' style={{ verticalAlign: 'top', width: 'calc(100% - 10px)', overflow: 'hidden' }}>

                        {optionsHash[value] ? optionsHash[value].text + ' ' : '---'}
                    </span>

                    <i className='float-right fa fa-angle-down mt-1'></i>

                </div>
                <span


                    style={{
                        position: "fixed",
                        top: (dropdownBounding.top + 25) + 'px',
                        minWidth: (dropdownBounding.width) + 'px',
                        zIndex: 5

                    }}>

                    <div className='border rounded bg-white box-shadow' >
                        {(options as any[]).map((optionObj, optionIndex) => {
                            return (
                                <div onClick={() => { setInput(optionObj.value) }} key={optionIndex} className='p-2 list-group-item-action pt-1 pb-1 cursor dropdown-click-close'>{optionObj.text}</div>

                            )
                        })}
                        {!options.length && <div className='list-group-item pt-1  pb-1 text-muted'><small><i>No Match</i></small></div>
                        }


                    </div>


                </span>


            </DropdownClick>







        </div>
    )

}

export default Dropdown;