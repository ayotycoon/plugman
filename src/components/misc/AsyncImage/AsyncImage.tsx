import React, { useState, useEffect, useRef } from 'react'
import './AsyncImage.scss'


function AsyncImage(props: any) {
    const imgRef = useRef(null);
    const zoom = props.zoom
    const dimInDark = props.dimInDark
 /*
    useEffect(() => {
        const src = props.src;
        const image = new Image()
        image.src = src
        
        image.style = props.style 
        image.className = props.className 
        image.alt = props.alt 

        

        image.onload = () => {
           // const newUrl = URL.createObjectURL(image);
            // @ts-ignore
           // imgRef.current.src = newUrl
        }

        return () => {

        }
    }, [])
    */

    return (
        <span className='AsyncImage d-inline-block'>
            <img 
            
            
            ref={imgRef}

                style={{ ...props.style, visibility: zoom ? 'hidden' : 'visible' }}
                className={props.className}
                alt={props.alt}
                // src='/assets/loader.svg'
                src={props.src}
                loading='lazy'


                onClick={props.onClick}
            />
            {zoom && <img

                style={props.style}
                className={props.className + (zoom ? ' zoom' : '')}
                alt={props.alt}
                // src='/assets/loader.svg'
                src={props.src}
                loading='lazy'


                onClick={props.onClick}
            />}
            {dimInDark && <div className='dark-overlay'>
                
                </div>}

        </span>


    )

}


export default AsyncImage
