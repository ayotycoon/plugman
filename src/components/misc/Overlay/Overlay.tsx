import React, { useState, useEffect, useRef } from 'react'
import './Overlay.scss'
import { toastObs, alertObs, shareObs, modalObs, confirmObs, selectObs, promptObs, toaster } from '../../../Providers/core.service'
import Modal from '../Modal/Modal'

import { copy as helperCopy } from '../../../Providers/helpers'




function Overlay() {
    const [toastData, setToastData] = useState(null as any)
    const [shareContent, setShareContent] = useState(null as any);
    const [modalContent, setModalContent] = useState(null as any);
    const [confirmContent, setConfirmContent] = useState(null as any);
    const [alertContent, setAlertContent] = useState(null as any);
    const [selectContent, setSelectContent] = useState(null as any);
    const [promptContent, setPromptContent] = useState(null as any);
    const res = useRef(null as any)

    useEffect(() => {
        toastObs.subscribe((incomingToastData: any) => {

            if (incomingToastData) {
                setToastData(incomingToastData)
            } else {
                setToastData(null)
            }

        })
        shareObs.subscribe((incomingShareContent: any) => {

            if (incomingShareContent) {
                setShareContent(incomingShareContent)
            } else {
                setShareContent(null)
            }

        })
        modalObs.subscribe((incomingModalContent: any) => {

            if (incomingModalContent) {
                setModalContent(incomingModalContent)
                res.current = incomingModalContent.cb
            } else {
                setModalContent(null)
            }

        })
        confirmObs.subscribe((incomingConfirmContent: any) => {

            if (incomingConfirmContent) {
                setConfirmContent(incomingConfirmContent)
                res.current = incomingConfirmContent.cb

            } else {
                //setConfirmContent(null)
            }

        })
        alertObs.subscribe((incomingAlertContent: any) => {

            if (incomingAlertContent) {
                setAlertContent(incomingAlertContent)

            } else {
                //setConfirmContent(null)
            }

        })
        selectObs.subscribe((incomingSelectContent: any) => {

            if (incomingSelectContent) {
                setSelectContent(incomingSelectContent)
                res.current = incomingSelectContent.cb

            } else {
                setSelectContent(null)
            }
        })
        promptObs.subscribe((incomingPromptContent: any) => {

            if (incomingPromptContent) {
                setPromptContent(incomingPromptContent)

                res.current = incomingPromptContent.cb

            } else {
                setPromptContent(null)
            }

        })









    }, [])



    function hideAttentionToast() {
        toastObs.next({ ...toastData, incoming: false })
        setTimeout(() => {
            toastObs.next(null)
        }, 500);
    }


    return (
        <>
            {shareContent && <Modal jsx={true} title='Share' onClose={() => { setShareContent(null) }} >
                <div className='text-center'>
                    {
                        [
                            {
                                icon: 'fa fa-copy', name: 'Copy', onClick: () => {
                                    helperCopy(shareContent)
                                    toaster({ message: 'Successfully copied link' })



                                }
                            },
                            {
                                icon: 'fab fa-whatsapp', name: 'whatsapp', onClick: () => {

                                    helperCopy(shareContent)

                                    window.open(`whatsapp://send?${encodeURIComponent(shareContent)}`);
                                }
                            },
                        
                            {
                                icon: 'fab fa-twitter', name: 'twitter', onClick: () => {

                                    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareContent)}`, '_blank');


                                }
                            },

                        ]
                            .map((media, index) => {
                                return (
                                    <div key={index}  className='mt-2'>
                                        <div onClick={media.onClick} className='d-inline-block'>
                                        <i className={media.icon} style={{ fontSize: '40px' }} />
                                        <br />
                                        {media.name}
                                        </div>

                                    </div>
                                )
                            })
                    }
                </div>


            </Modal>}




            {modalContent && <Modal type={modalContent.type} title={modalContent.title} onClose={() => { setModalContent(null); res.current(true) }} > {modalContent.body}</Modal>}
            {confirmContent &&

                <Modal preventCloseOnClickOutside={true} jsx={true} title={'Confirm'} onClose={() => { res.current(false, true); setConfirmContent(null) }} > {confirmContent.text}

                    {confirmContent.body && <>
                        <br />

                        <span dangerouslySetInnerHTML={{ __html: confirmContent.body }}></span>
                    </>}
                    <hr />
                    <div className='row'>
                        <div className='col-6'>
                            <button onClick={() => { res.current(true); setConfirmContent(null) }} className='btn btn-primary'>Yes</button>
                        </div>
                        <div className='col-6 text-right'>

                            <button onClick={() => { res.current(false); setConfirmContent(null) }} className='btn text-danger'>No</button>
                        </div>
                    </div>
                </Modal>}


            {alertContent &&

                <Modal zIndex={100} preventCloseOnClickOutside={true} jsx={true} title={'Alert'} onClose={() => { setAlertContent(null) }} > {alertContent.text}

                    {alertContent.body && <>
                        <br />

                        <span dangerouslySetInnerHTML={{ __html: alertContent.body }}></span>
                    </>}
               

                 
                </Modal>}



            {selectContent && <Modal jsx={true} preventCloseOnClickOutside={true} title={selectContent.title}
                onClose={() => { res.current(false, true); setSelectContent(null) }} >
                {selectContent.options.map((option: any, index: number) => {
                    const optionText = option.option || option;
                    const optionInfo = option.info;

                    return (
                        <div key={index}>
                            <input value={optionText} onChange={(e: any) => setSelectContent({ ...selectContent, value: e.target.value })} name='selector' type='radio' className='mr-2' id={'selector-' + optionText}></input>

                            <label htmlFor={'selector-' + optionText}>{optionText}</label>
                            {optionInfo && <span className='float-right each-select'><i className='fa fa-question-circle '></i>

                                <div className='select-info bg-info rounded p-2 text-white'>
                                    {optionInfo}
                                </div>

                            </span>}
                            <br />
                        </div>
                    )
                })}

                <hr />
                <div className='text-center'>
                    <div className='btn btn-group'>
                        {selectContent.value && <button onClick={() => { res.current(selectContent.value); setSelectContent(null) }} className='btn btn-primary'>Ok</button>}


                        <button onClick={() => { res.current(false); setSelectContent(null) }} className='btn btn-outline-danger'>Cancel</button>
                    </div>
                </div>

            </Modal>}


            {promptContent && <Modal jsx={true} preventCloseOnClickOutside={true} title={promptContent.text}
                onClose={() => { res.current(false, true); setPromptContent(null) }} >
                <input value={promptContent.value} onChange={(e: any) => setPromptContent({ ...promptContent, value: e.target.value })} className='form-control'></input>


                <hr />
                <div className='text-center'>
                    <div className='btn btn-group'>
                        {promptContent.value && <button onClick={() => { res.current(promptContent.value); setPromptContent(null) }} className='btn btn-primary'>Ok</button>}


                        <button onClick={() => { res.current(false); setPromptContent(null) }} className='btn btn-outline-danger'>Cancel</button>
                    </div>
                </div>

            </Modal>}


            {toastData &&
                <div className={'Alert animated pt-3 pl-3 ' + (toastData.incoming ? ' fadeIn' : 'fadeOut') + (toastData.attention ? ' alert-attention' : '')}>
                    <div className={`d-inline-block animated alert-inner box-shadow rounded alert alert-${toastData.type || 'info'}` + (toastData.incoming ? ' slideInDown' : ' slideOutUp')}>
                        <span dangerouslySetInnerHTML={{ __html: toastData.message }}></span>

                        {toastData.attention && <div>
                            <hr />
                            <button onClick={hideAttentionToast} className={'btn btn-sm btn-' + (toastData.type || 'info')}>
                                Ok
                        </button>

                        </div>}
                    </div>
                </div>}</>

    )

}

export default Overlay;