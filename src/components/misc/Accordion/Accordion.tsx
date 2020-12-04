import React, { useState, useEffect } from 'react'
import './Accordion.scss'
import { getId } from '../../../Providers';




function Accordion(props: any) {
    let id: any;
   
    const [opened, setOpened] = useState(false);
    const allowedProps = { accordiongroup: props.for,opened: `${opened}` }



    function setOpenedFun(opened:boolean){
 

        if (opened && allowedProps.accordiongroup) {
           
                const elements = document.querySelectorAll(`[accordiongroup = '${props.for}' ]`)
             
                elements.forEach(el => {
                    if(id !== el.id && el.getAttribute('opened') === 'true') {
                      
                        (el.querySelector('.Accordion-clickable') as HTMLElement)?.click();
                       
                    }
                })
            
        }
        if (props.onClick) {
            props.onClick(opened)
        }
        setOpened(opened)
    }
    useEffect(() => {
        id = getId();
        if (props.opened) {
            setOpened(true)
        }

    }, [])

    return (
        <div id={id} {...allowedProps}  className={'Accordion ' + props.className}>
            <div className='p-1 mb-2'>
                <div className={props.labelClass}>
                    <span onClick={() => setOpenedFun(!opened)} className='cursor Accordion-clickable' style={{position: 'relative',left: '-4px'}}> {opened ? <i className='fa fa-angle-down mr-2'></i> : <i className='fa fa-angle-right mr-2'></i>}
                    <b>
                            {props.bullet && <i style={{ fontSize: '10px', position: 'relative', top: '-2.5px' }} className='fa fa-circle mr-2'></i>}
                        
                        {props.label}</b> {props.secondaryLabel && <i>( {props.secondaryLabel} )</i>} </span>

    <i className='float-right mr-2'>{props.value}</i>
                </div>

                 
                <div className='pl-2 pt-2 border-left inner' style={{ maxHeight: opened ? '800px' : '0px', overflow: opened ? 'visible' : 'hidden'}}>
                    
                      {props.children}
                      
                      </div>

                                </div>

        </div>
    )

}

export default Accordion;