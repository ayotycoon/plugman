import React from 'react'
import './Modal.scss'

interface ModalI {
    title?: string;
    zIndex?: number;
    preventCloseOnClickOutside?: boolean;
    jsx?: boolean;

    type?: 'loading';
    onClose?: CallableFunction;
    children?: any;
}


function Modal(props: ModalI) {

    function onClose() {
        if (props.onClose) {
            props.onClose()
        }
    }
    function clickedOutside(e: any) {
        if (e.target.className.match('Modal-center') && props.type !== 'loading' && !props.preventCloseOnClickOutside) {
            onClose()
        }
    }

    return (
        <div className='Modal Modal-center ' style={{ zIndex: props.type === 'loading' ? 100 : (props.zIndex || 30) }} onClick={clickedOutside}>

            <div className={'Modal-inner p-3 rounded' + (props.type === 'loading' ? ' ' : ' bg-white')}>
                <div className='Modal-inner-heading'>
                    <div className='Modal-inner-heading-text'>
                        <h4 className='font-weight-bold'>{props.title}</h4>
                    </div>
                    {props.type !== 'loading' &&
                        <div className='Modal-inner-heading-close-container'>
                            <div onClick={onClose} className='Modal-close bg-danger'>
                                <i className='fa fa-close text-white'>

                                </i>
                            </div>
                        </div>}


                </div>
                {!props.jsx && <div dangerouslySetInnerHTML={{ __html: props.children }}></div>}
                {props.jsx && props.children}


                {props.type === 'loading' &&

                    <div className='text-center'>

                        <img src='/assets/loader.svg' />
                    </div>
                }

            </div>

        </div>
    )

}

export default Modal;