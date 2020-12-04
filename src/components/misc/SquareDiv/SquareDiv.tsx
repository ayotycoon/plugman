import React, { useState, useEffect, useRef } from 'react'
import { getId } from '../../../Providers'
import './SquareDiv.scss'
import { possibleResizeObs } from '../../../Providers/core.service';
function SquareDiv(props: any) {
    const id = useRef(getId()).current
    const [height, setHeight] = useState('100px');
    const possiblyResizeRef = useRef(null as any);


    useEffect(() => {
        possiblyResizeRef.current = possibleResizeObs.subscribe((resize: boolean) => {
            if (resize) {
                setHeight(document.getElementById(id)?.clientWidth + 'px')
            }

        })

        setHeight(document.getElementById(id)?.clientWidth + 'px')

        return () => {
           possiblyResizeRef.current.unSubscribe()
        }

    }, [])


    return (
        <div className={'SquareDiv ' + (props.center ? 'centered' : '')} id={id} style={{ height }}>

            <div>
                {props.children}

            </div>

        </div>
    )


}


export default SquareDiv;
