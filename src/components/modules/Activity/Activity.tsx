import React, { useEffect, useRef, useState } from 'react'
import './Activity.scss';
import { connect } from 'react-redux'
import { setTitle } from '../../../store/actions/app.action'
import Editor from '@monaco-editor/react';

function Activity(props: any) {
    const [eventRefs, setEventRefs] = useState({
        'listen-connect': true,
        'listen-disconnect': true,
    })
    const eventsDisplayRef = useRef(null as unknown as HTMLDivElement);
    function setEventRefF(hash: any) {

        const c = { ...eventRefs }

        Object.keys(hash).forEach(key => {

            if (c[key] == undefined) {
                c[key] = true
            }


        })
      


        setEventRefs(c)

    }



    useEffect(() => {
     const hash: any = {};
   
        (Object.values(props.socket.tracker) as any[]).forEach(e => {
            const key = e.type + '-' + e.event;
            hash[key] = true;
          
         
        });
        setEventRefF(hash)



    }, [props.socket.tracker])
 
    useEffect(() => {
   

        setTimeout(() => {
          eventsDisplayRef.current?.scrollTo({
                left: 0,
              top: eventsDisplayRef.current.scrollHeight,
                behavior: 'smooth'
            })

         
        }, 500)

    }, [props.socket.activities])
 
    
     
    return (

        <div className='Activity'>
            <div className='change-in-dark-1 mb-2' style={{ marginTop: '5px' }}> Activity</div>
            <select className='form-control'>
                <option value='all'>All</option>
                {Object.keys(eventRefs).map((k, i) => <option key={i} value={k}>{k}</option>)}
            </select>
            <br />


<div ref={eventsDisplayRef} style={{height: 'calc(100vh - 180px)', overflow: 'auto'}}>
            {(props.socket.activities as any[]).map((activity, i) => {
                const isActivityEmit = activity.type == 'emit';
                return (
                    <div key={i}>
                    <div
                            className={'p-2 text-color-default border rounded ' + (isActivityEmit ? 'border-primary' : 'border-secondary')}
                    style={
                        {marginLeft: (isActivityEmit ? '80px' : '0px'),
                                marginRight: (!isActivityEmit ? '80px' : '0px')}
                        
                        
                        }>
                            <span style={{display:'block', textAlign: (isActivityEmit ? 'right' : 'left')}}>{activity.event} | {activity.type}</span>
                       
                        {activity.data && <div >
                            <Editor options={{
                                readOnly:true,
                                    lineNumbers: "off",
                                    scrollBeyondLastLine: false,
                                    minimap: {
                                        enabled: false
                                    },
                                    wordWrap: 'on',
                                    automaticLayout: true 
                                
                                }} theme={props.app.darkMode ? 'vs-dark' : 'plugman-light'}
                            height='50px'
                                     value={activity.data}  language="json" />
                     
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
    socket: state.socket
})


export default connect(mapStateToProps, { setTitle })(Activity)