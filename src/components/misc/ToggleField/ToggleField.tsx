import React, { useState } from 'react'
import './ToggleField.scss'
import Field from '../Field/Field';



let lastvalue = ''
function ToggleField(props: any) {
    const [editable, setEditable] = useState(false);


  
    function editableIconClicked () {

        setEditable(!editable)
        if(editable && props.onSave) {
            props.onSave(lastvalue)
        }

    }
    function onChange(value: string) {
        lastvalue = value;
        if(props.onChange){
            lastvalue = value;
            console.log(value)
            props.onChange(value)
        }
    }


    return (
        <div className='ToggleField'>
            <Field {...props} 
            editable={editable} 
            toggleField={true}
            onChange = {onChange}
                editableIconClicked={editableIconClicked}
            />

        </div>
    )

}

export default ToggleField;