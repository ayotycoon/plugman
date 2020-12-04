import React, {  useState, useEffect, useRef } from 'react'
import './Button.scss'


function Button(props: any) {
    const [clicked, setClicked] = useState(false)
    const componentMounted = useRef(true)


    function setClickedFun() {

        setClicked(true)
   
        if(props.onClick) {
    
            props.onClick().finally(() => {
                
                console.log('set clicked fall')
                if (componentMounted.current) {
                    setClicked(false)
                }
             
            
            }) 
        }
     


    }

    useEffect(() => {
     
        return () => {
         componentMounted.current = false
        };
    }, []);
    return (
        <button type={props.type} onClick={setClickedFun} disabled={(clicked) || props.disabled ? true : false} className={'Button ' + props.className} >

                {clicked &&
                    <div className='pt-2' style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                        <i className='fa fa-circle-notch spin '></i>
                    </div>}


                <span style={{ visibility: clicked ? 'hidden' : 'visible' }}>{props.children}</span>

            </button>


    )

}


export default Button
