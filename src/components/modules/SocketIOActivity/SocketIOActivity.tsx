import React, { useEffect, useRef, useState } from 'react'
import './SocketIOActivity.scss';
import { connect } from 'react-redux'
import { setTitle } from '../../../store/actions/app.action'
import Editor from '@monaco-editor/react';
import DropdownClick from '../../misc/DropdownClick/DropdownClick';
import TypePill from '../../misc/TypePill/TypePill';

const DEFAULTS = {
    'listen-connect': true,
    'listen-disconnect': true,
}

function SocketIOActivity(props: any) {
    const [events, setEvents] = useState({} as any)
    const eventsDisplayRef = useRef(null as unknown as HTMLDivElement);
    function setEventRefF(hash: any) {
    
       

  
        const h = {...hash}

        Object.keys(events).forEach(key => {
            const prevValue = events[key]
    

            if (prevValue == undefined) {
                h[key] =  true
            }else {
                h[key] = prevValue
            }
            


        })


       

        setEvents(h)

    }

function keyGen(type: any,event: any){
    return type + '-' + event
}


    useEffect(() => {


        setTimeout(() => {
            eventsDisplayRef.current?.scrollTo({
                left: 0,
                top: eventsDisplayRef.current.scrollHeight,
                behavior: 'smooth'
            })


        }, 500)


      
        
        const hash: any = {...DEFAULTS} ;
        (Object.values(props.socketIO.tracker) as any[]).forEach(e => {
            const key = keyGen(e.type, e.event);
            hash[key] = true;

        });

        setEventRefF(hash)

    }, [props.socketIO.activities, props.socketIO.tracker])

 
    const totalEvents = Object.values(events);
    const activeEvents = totalEvents.filter(_=>_) 

    return (

        <div className='SocketIOActivity'>
            <div className='change-in-dark-1 mb-2' style={{ marginTop: '5px' }}> Activity</div>
       
            <DropdownClick onClick={(opened:boolean) => {
               if(!opened){
                  
               }
            }} block={true}>
                <div className='border pr-3 pl-2 pt-2 pb-2 change-in-dark-1 rounded capitalize input-mimick cursor '>
                    {activeEvents.length == totalEvents.length ? 'All' : (activeEvents.length + " Events")}
                    <i className='fa fa-angle-down float-right '></i>
                </div>

                <div className='change-in-dark-1 capitalize p-2 input-mimick'>
 
                    {Object.keys(events).map((k, i) => <div key={i} className=' '><>
                        <input
                            checked={events[k]}
                        onChange={(e: any) => {
                            
                           setEvents({
                               ...events, [k]:e.target.checked
                           })
                        }} type='checkbox' className='cursor mr-1' />
                    {k}</></div>)}
                </div>



            </DropdownClick>
            <br />


            <div ref={eventsDisplayRef} style={{ height: 'calc(100vh - 180px)', overflow: 'auto' }}>
                {(props.socketIO.activities as any[]).map((activity, i) => {
                    const isActivityEmit = activity.type == 'emit';
                    const showEvent = events[keyGen(activity.type, activity.event)] != false
                    return (
                        <div key={i}>
                            {showEvent ?<>
                            <div
                                className={'p-2 text-color-default border rounded ' + (isActivityEmit ? 'border-primary' : 'border-secondary')}
                                style={
                                    {
                                        marginLeft: (isActivityEmit ? '80px' : '0px'),
                                        marginRight: (!isActivityEmit ? '80px' : '0px')
                                    }


                                }>
                                    <span style={{ display: 'block', textAlign: (isActivityEmit ? 'right' : 'left') }}>{activity.event} |   <TypePill type={(activity as any).type} /></span>

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
                            </>: <></>}
                        </div>
                    )
                })}


            </div>
        </div>


    )
}


const mapStateToProps = (state: any) => ({

    app: state.app,
    socketIO: state.socketIO
})


export default connect(mapStateToProps, { setTitle })(SocketIOActivity)