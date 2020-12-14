import React, { useEffect, useRef, useState } from 'react'
import './WebSocketActivity.scss';
import { connect } from 'react-redux'
import { setTitle } from '../../../store/actions/app.action'
import Editor from '@monaco-editor/react';
import DropdownClick from '../../misc/DropdownClick/DropdownClick';
import TypePill from '../../misc/TypePill/TypePill';


function WebSocketActivity(props: any) {
  const eventsDisplayRef = useRef(null as unknown as HTMLDivElement);




    useEffect(() => {


        setTimeout(() => {
            eventsDisplayRef.current?.scrollTo({
                left: 0,
                top: eventsDisplayRef.current.scrollHeight,
                behavior: 'smooth'
            })


        }, 500)


      
        
     

    }, [props.webSocket.activities])

 


    return (

        <div className='WebSocketActivity'>
            <div className='change-in-dark-1 mb-2' style={{ marginTop: '5px' }}> Activity</div>
       
          <br />


            <div ref={eventsDisplayRef} style={{ height: 'calc(100vh - 180px)', overflow: 'auto' }}>
                {(props.webSocket.activities as any[]).map((activity, i) => {
          
          const isActivityEmit = activity.emit
                   return (
                        <div key={i}>
                           
                            <div
                                className={'p-2 text-color-default border rounded ' + (isActivityEmit ? 'border-primary' : 'border-secondary')}
                                style={
                                    {
                                        marginLeft: (isActivityEmit ? '80px' : '0px'),
                                        marginRight: (!isActivityEmit ? '80px' : '0px')
                                    }


                                }>
                               <span style={{ display: 'block', textAlign: (isActivityEmit ? 'right' : 'left') }}>{activity.name} |   <TypePill type={isActivityEmit ? 'emit' : 'listen'} /></span>

                                {activity.data && <div >
                                    <Editor options={{
                                        readOnly: true,
                                        lineNumbers: "off",
                                        scrollBeyondLastLine: false,
                                        minimap: {
                                            enabled: false
                                        },
                                        wordWrap: 'on',
                                        automaticLayout: true

                                    }} theme={props.app.darkMode ? 'vs-dark' : 'plugman-light'}
                                        height='50px'
                                        value={activity.data} language="json" />

                                </div>}
                            </div>
                            <br />
                           
                        </div>
                    )
                })}


            </div>
        </div>


    )
}


const mapStateToProps = (state: any) => ({

    app: state.app,
    webSocket: state.webSocket
})


export default connect(mapStateToProps, { setTitle })(WebSocketActivity)