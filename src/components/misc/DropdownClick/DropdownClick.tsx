import React, { useState, useEffect, useRef } from 'react'
import './DropdownClick.scss'
import { getId } from '../../../Providers';



function isDescendant(parent: HTMLElement, child: HTMLElement) {
    var node = child.parentNode;
    while (node != null) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

function DropdownClick(props: any) {

    const [clicked, setClicked] = useState(false);
    const DropdownClickRef = useRef(null as any);
    const clickedFunRef = useRef(null as any);
    const scrollRef = useRef({

        fn: () => { }
    });
    const componentIsMounted = useRef(true)


    function preSetClickedFun(value: boolean) {
        const elem: HTMLDivElement | null = DropdownClickRef.current;
        if (props.onClick) {
            props.onClick(value)
        }
        if (value) {



            clickedFunRef.current = window.addEventListener('click', (e: any) => {

                // @ts-ignore
                if ((e.target.className.match('dropdown-click-close') || !isDescendant(DropdownClickRef.current, e.target)) && componentIsMounted.current) {
                    if (props.onClick) {
                        props.onClick(false)
                    }
                    preSetClicked(false)
                }
            })

        } else {


            if (clickedFunRef.current) {

                window.removeEventListener('click', clickedFunRef.current)
            }
        }

        preSetClicked(value);
    }
    function preSetClicked(value: boolean) {
        function onScroll() {
       
    
                setClicked(false);
                // remove listener
                document.removeEventListener('scroll', scrollRef.current.fn, true)

            

        }



        if (props.onScrollClose) {
            if (value) {
                scrollRef.current.fn = onScroll;

                // listen to scroll event
                document.addEventListener('scroll', scrollRef.current.fn, true)


            } else {
                document.removeEventListener('scroll', scrollRef.current.fn, true)

            }
        }
        setClicked(value)
    }

    useEffect(() => {


        return () => {
            componentIsMounted.current = false;


            if (clickedFunRef.current) {
                window.removeEventListener('click', clickedFunRef.current)
                document.removeEventListener('scroll', scrollRef.current.fn, true);
            }
        };
    }, []);


    return (
        <div ref={DropdownClickRef} style={{
            zIndex: clicked ? 5 : 1
        }} className={'DropdownClick ' + (props.block ? 'd-block' : 'd-inline-block')}>
            <div

                onClick={() => preSetClickedFun(!clicked)} className='one'>
                {props.children[0]}
            </div>
            {clicked &&
                <div className='two'>
                    {props.children[1]}
                </div>}



        </div>
    )

}

export default DropdownClick;