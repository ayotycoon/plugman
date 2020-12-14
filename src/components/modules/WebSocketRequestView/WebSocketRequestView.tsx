import React, { useEffect, useRef, useState } from 'react'
import './WebSocketRequestView.scss';
import { connect } from 'react-redux'
import { setTitle, setActiveTree } from '../../../store/actions/app.action'
import DropdownClick from '../../misc/DropdownClick/DropdownClick';
import { sendToCollectionObs, toaster } from '../../../Providers/core.service';
import { CollectionRequest } from '../../types';
import CollectionsService, { WorkspaceService } from '../../../Providers/Workspace.service';
import webSocketService from '../../../Providers/web-socket.service';
import Activity from '../SocketIOActivity/SocketIOActivity';
import Editor, { ControlledEditor } from '@monaco-editor/react';
import * as envJson from '../../../env.json'
import Blank from '../../misc/Blank/Blank';
import { bodyTypeParser } from '../../../Providers/helpers';
import WebSocketActivity from '../WebSocketActivity/WebSocketActivity';

const bodyTypes = ["string", "json", "object", "number"]
function WebSocketRequestView(props: any) {
    const [saved, setSaved] = useState(true);
    const [activeCellIndex, setActiveCellIndex] = useState(0);
    const [activeRequest, setActiveRequest] = useState(WorkspaceService.getWebSocketRequest() as unknown as CollectionRequest);
    const subs = useRef([] as any[])
    const saveKeyRef = useRef(null as unknown as any);

    const cells =  ['Body', 'Options'] 



    useEffect(() => {


       props.setTitle('Web Socket')
        if (envJson.prod && !saved) {
            window.onbeforeunload = function (event: any) {
                if (!saved) {
                    save()
                }
                return true
            };

        }

        saveKeyRef.current = function (event: any) {
            var S: any = 83,
                activeElement: any = document.activeElement;


            if ((event.key === S || event.keyCode === S) && (event.metaKey || event.ctrlKey) && activeElement.nodeName === 'TEXTAREA') {

                event.preventDefault();
                if (!saved) {
                    save()
                }

            }
        }

        document.addEventListener('keydown', saveKeyRef.current);



        return () => {
            subs.current.forEach((sub: any) => sub.unSubscribe())
            // document.removeEventListener('keydown', saveKeyRef.current);


        }

    }, [activeRequest])

    const user = props.app.userData;

    const darkMode = props.app.darkMode;
    function handleChange(e: any) {
        if (saved) {
            setSaved(false);
        }
    
        const clone: any = { ...activeRequest }
        clone[e.target.name] = e.target.value;
        setActiveRequest(clone)



    }
    function save() {

        CollectionsService.setWebSocketRequest(activeRequest)
     
        setSaved(true)

    }
  
   

    async function emit() {
        let body: any = activeRequest.emitBody;
        if (!props.webSocket.status.connected){
            alert('connect first')

            return
        }

        try {
            body = bodyTypeParser(activeRequest.bodyType, activeRequest.emitBody)

        } catch (e) {
            toaster({ type: 'info', message: `<i class='fa fa-info mr-2 '> </i> Could not convert body to '${activeRequest.bodyType}', Sending body as string instead` })
        }

        webSocketService.emit(body)
    }

    const handleEditorChange = (ev: any, value: any, type: any) => {
        setSaved(false)

            setActiveRequest({ ...activeRequest, emitBody: value });
     

    };
  


    return (

        <div className='WebSocketRequestView h-100'>

            <div className='row h-100'>
                <div className={'h-100 p-0 ' + (props.app.darkMode ? ' bg-dark ' : '') + ( 'border-right  col-md-9')}>
                   
                    <div style={{ height: 'calc(100vh - 180px)', overflow: 'auto' }} className='p-2'>
                        



                            <div className='request-bar'>
                            <div className='request-bar-item request-bar-item-1'>


                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <select disabled={true} name="type" defaultValue='emit' className='form-control'>
                                            <option value='emit'>Emit</option>
                                            <option value='listen'> Listen</option>
                                        </select>

                                    </div>

                                    <input type="text" disabled={true} defaultValue='message' name="event" className="form-control"  />

                                </div>


                            </div>
                     
                                <div className='request-bar-item request-bar-item-2'>
                                    <button onClick={() => emit()} className="btn btn-secondary" type="button" >Send</button>
                         
                                </div>
                                <div className='request-bar-item request-bar-item-3'>

                                    {!saved && <button onClick={save} className="btn btn-outline-secondary" type="button">Save</button>}
                                </div>

                            </div>
                        <br />
                        <div className='text-color-default' style={{}}>
                            {cells.map((cell, i) => {
                                return (
                                    <div onClick={() => setActiveCellIndex(i)} key={i} className={'cell mr-2 p-2  d-inline cursor ' + (activeCellIndex == i ? 'border-bottom border-secondary' : '')} style={{ borderBottomWidth: '5px' }}>
                                        {cell}
                                    </div>)
                            })}
                        </div>
                        <br />
                   
                            {activeCellIndex == 0  &&

                                <div>





                                    <ControlledEditor theme={props.app.darkMode ? 'vs-dark' : 'plugman-light'} options={{
                                        minimap: {
                                            enabled: false
                                        },
                                        wordWrap: 'on'


                                    }} height="calc(100vh - 300px)" onChange={(ev: any, value: any) => handleEditorChange(ev, value, 'emit')} value={activeRequest.emitBody || ''} language="json" />
                                </div>}

                          {activeCellIndex == 1 &&

                                <div>

                                    <table className="table text-color-default">
                                        <thead>
                                            <tr>
                                                <th scope="col">Option</th>
                                                <th scope="col">Value</th>
                                                <th scope="col">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>

                                                <td> Body Type</td>
                                                <td><select name="bodyType" className='capitalize' onChange={handleChange} value={activeRequest.bodyType}> {bodyTypes.map((bodyType, i) => <option value={bodyType} key={i}>{bodyType}</option>)} </select>
                                                </td>
                                                <td className='small'>Determines what the body should be sent as </td>
                                            </tr>
                                  
                                        </tbody>
                                    </table>



                                </div>}
                         



                        

                    </div>
                </div>
                <div className={'col-md-3 h-100' }>
                    <WebSocketActivity />


                </div>
            </div>
        </div>


    )
}


const mapStateToProps = (state: any) => ({

    app: state.app,
    notifications: state.notifications,
    socketIO: state.socketIO,
    webSocket: state.webSocket
})


export default connect(mapStateToProps, { setTitle, setActiveTree })(WebSocketRequestView)