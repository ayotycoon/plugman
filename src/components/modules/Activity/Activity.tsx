import React, { useEffect, useRef, useState } from 'react'
import './Activity.scss';
import { connect } from 'react-redux'
import { setTitle } from '../../../store/actions/app.action'
import Editor from '@monaco-editor/react';
import DropdownClick from '../../misc/DropdownClick/DropdownClick';
import TypePill from '../../misc/TypePill/TypePill';

const DEFAULTS = {
    'listen-connect': true,
    'listen-disconnect': true,
}
function Activity(props: any) {
    const [events, setEvents] = useState(DEFAULTS)
    const eventsDisplayRef = useRef(null as unknown as HTMLDivElement);
    function setEventRefF(hash: any, e?: any) {
    
        console.log({hash})

        const c = { ...events }

        Object.keys(hash).forEach(key => {

            if (c[key] == undefined) {
                c[key] = e ? hash[key] : true
            }else if(e){
                c[key] = hash[key] 
            }
            


        })


       

        setEvents(c)

    }

function keyGen(type: any,event: any){
    return type + '-' + event
}

    useEffect(() => {
        const hash: any = {};

        (Object.values(props.socket.tracker) as any[]).forEach(e => {
            const key = keyGen(e.type , e.event);
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

 
    const totalEvents = Object.values(events);
    const activeEvents = totalEvents.filter(_=>_) 

    return (

        <div className='Activity'>
            <div className='change-in-dark-1 mb-2' style={{ marginTop: '5px' }}> Activity</div>
       
            <DropdownClick onClick={(opened:boolean) => {
               if(!opened){
                  
               }
            }} block={true}>
                <div className='border pr-3 pl-2 pt-2 pb-2 change-in-dark-1 rounded capitalize input-mimick cursor '>
                    {activeEvents.length == totalEvents.length ? 'All' : (activeEvents.length + " Events")}
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
                {(props.socket.activities as any[]).map((activity, i) => {
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
    socket: state.socket
})


export default connect(mapStateToProps, { setTitle })(Activity)