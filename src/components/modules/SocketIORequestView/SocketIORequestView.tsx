import React, { useEffect, useRef, useState } from 'react'
import './SocketIORequestView.scss';
import { connect } from 'react-redux'
import { setTitle, setActiveTree } from '../../../store/actions/app.action'
import DropdownClick from '../../misc/DropdownClick/DropdownClick';
import { sendToCollectionObs, toaster } from '../../../Providers/core.service';
import { CollectionRequest } from '../../types';
import CollectionsService from '../../../Providers/Workspace.service';
import socketService from '../../../Providers/socket.service';
import Activity from '../SocketIOActivity/SocketIOActivity';
import Editor, { ControlledEditor } from '@monaco-editor/react';
import * as envJson from '../../../env.json'
import Blank from '../../misc/Blank/Blank';
import { bodyTypeParser } from '../../../Providers/helpers';

const bodyTypes = ["string","json", "object","number"]
function SocketIORequestView(props: any) {
    const [saved, setSaved] = useState(true);
    const [requestTree, setRequestTree] = useState('');
    const [activeCellIndex, setActiveCellIndex] = useState(0);
    const [showDetails, setShowDetails] = useState(false);
    const [showActivity, setShowActivity] = useState(true);
    const [tabs, setTabs] = useState([] as any[])
    const [activeRequest, setActiveRequest] = useState(null as unknown as CollectionRequest);
    const subs = useRef([] as any[])
    const navbarCriticalChangedRef = useRef(false);
    const saveKeyRef = useRef(null as unknown as any);

    const cells = activeRequest && activeRequest.type == 'emit' ? ['EmitBody', 'Options'] : ['ListenBody', 'Options']



    useEffect(() => {


        subs.current.push(sendToCollectionObs.subscribe((data: any) => {
            if (!data) {
                return
            }

            switch (data.type) {
                case 'open-request':

                    // if tab doesnt exist before, create a new pne
                    if (tabs.indexOf(data.tree) == -1) {
                        const tabsClone = [...tabs, data.tree];
                        setTabs(tabsClone)
                    }
                    // if the previous request was not saved, save it
                    if (!saved) {
                        save()
                    }


                    // get old emitted message
                    if (data.request.type == 'listen') {
                        const plausibleOldEmittions = socketService.getLastListenEvent(data.request.event);
                        // get old emittions, the ones that happened when yoy were away
                        if (plausibleOldEmittions && plausibleOldEmittions != data.request.listenerBody) {
                            data.request.listenerBody = plausibleOldEmittions

                            toaster({ type: 'info', message: `<i class='fa fa-info mr-2 '> </i> Listen Body updated for this request` })
                            setTimeout(() => {
                                setSaved(false)
                            }, 500);
                        }




                    }
                    setActiveRequest(data.request)
                    setRequestTree(data.tree)


                    break;
                case 'del-request':

                    if (tabs.indexOf(data.tree) != -1) {
                        deleteTab(data.tree)
                    }
                    break;
                case 'rename-request':

                    if (data.tree == requestTree) {
                        setActiveRequest({ ...activeRequest, name: data.name })
                    }
                    break;
            }



        }

        ))
        props.setTitle(activeRequest ? activeRequest.name : '')
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
                   if(!saved){
                       save()
                   }
                
            }
        }

        document.addEventListener('keydown', saveKeyRef.current);
    


        return () => {
            subs.current.forEach((sub: any) => sub.unSubscribe())
           // document.removeEventListener('keydown', saveKeyRef.current);


        }

    }, [tabs, activeRequest])

    const user = props.app.userData;

    const darkMode = props.app.darkMode;
    function handleChange(e: any) {
        if (saved) {
            setSaved(false);
        }
        if (e.target.name == 'name' || e.target.name == 'type') {
            navbarCriticalChangedRef.current = true
        }
        const clone: any = { ...activeRequest }
        clone[e.target.name] = e.target.value;
        setActiveRequest(clone)



    }
    function save() {

        CollectionsService.treeDataModifier({ emit: navbarCriticalChangedRef.current }, requestTree, (d: any) => {

     
            Object.keys(activeRequest).forEach(k => {
                d[k] = activeRequest[k]
            })
        })
        CollectionsService.generateRequestHash();
        CollectionsService.persist();
        setSaved(true)

    }
    function deleteTab(tab: string) {
        const tabsClone = tabs.filter(t => t != tab);


        if (tab == requestTree) {
            save()

            if (tabsClone.length > 0) {
                activateTab(tabsClone[tabsClone.length - 1])
            } else {
                // clear the location request tree
                props.history.push(window.location.pathname)
                setActiveRequest(null as unknown as any);
                setRequestTree('')
            }


        }



        setTabs(tabsClone)

    }
    function activateTab(tree: string) {
        if (tree == requestTree) {
            return;
        }
        if (!saved) {
            save()
        }
        // update the location request tree
        props.history.push(window.location.pathname + '?requestTree=' + tree)
        props.setActiveTree(tree)

        const ids = tree.split('/')
        const id = ids[ids.length - 1]

        setActiveRequest(CollectionsService.getRequestFromId(id))
        setRequestTree(tree)



    }
    function tabTreeToName(tree: string) {
        const ids = tree.split('/')
        const id = ids[ids.length - 1]
        return CollectionsService.getRequestFromId(id)?.name
    }


    async function action(type: string) {
        if (!props.socketIO.status.connected) {
            toaster({ type: 'danger', message: `<i class='fa fa-info mr-2 '> </i>  You are not connected` })

            return
        }
        if (type == 'emit') {
            let body: any = activeRequest.emitBody;


            try {
                body = bodyTypeParser(activeRequest.bodyType, activeRequest.emitBody)
             

            } catch (e) {
                toaster({ type: 'info', message: `<i class='fa fa-info mr-2 '> </i> Could not convert body to '${activeRequest.bodyType}', Sending body as string instead` })


            }




            socketService.emit(activeRequest.id as any, activeRequest.event, body)
        } else if (type == 'listen') {
            socketService.listen(activeRequest.id as any, activeRequest.event)

        } else if (type == 'cancel-listen') {
            socketService.cancelListen(activeRequest.id as any, activeRequest.event)
        }
    }

    const alreadyListening = (activeRequest && props.socketIO.tracker[activeRequest.id] && props.socketIO.tracker[activeRequest.id].type == 'listen')

    const handleEditorChange = (ev: any, value: any, type: any) => {
        setSaved(false)
        if (type == 'emit') {
            setActiveRequest({ ...activeRequest, emitBody: value });
        }
        if (type == 'script') {
            setActiveRequest({ ...activeRequest, script: value });
        }

    };
    const editNameAndDescription = () => {

        alert('coming soon......')
    }



    return (

        <div className='SocketIORequestView h-100'>

            <div className='row h-100'>
                <div className={'h-100 p-0 ' + (props.app.darkMode ? ' bg-dark ' : '') + (showActivity ? 'border-right  col-md-9' : 'col-md-12')}>
                    <div className={'pt-2 pl-2 pr-2 ' + (props.app.darkMode ? ' bg-dark-light ' : 'bg-default-light')} style={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', whiteSpace: 'nowrap' }}>
                        {tabs.map((tab, i) => <span key={i} className={'cursor p-1 text-color-default ' + (i == 0 ? ' ' : 'border-left ') + (tab == requestTree ? (props.app.darkMode ? ' bg-dark ' : 'bg-app') : '')}><span onClick={() => activateTab(tab)} className='mr-1 small font-weight-bold'> {tabTreeToName(tab)}</span> <span onClick={() => deleteTab(tab)}> <i className='fa fa-close'></i></span> </span>)}
                    </div>
                    <div style={{ height: 'calc(100vh - 180px)', overflow: 'auto' }} className='p-2'>
                        {activeRequest ? <>


                            <div className='change-in-dark-1 mb-2' style={{ marginTop: '5px' }}>
                                <div className='float-right'>
                                    <div onClick={() => setShowActivity(!showActivity)} className='cursor text-primary'>
                                        {showActivity ? <>
                                            <i className='fa fa-arrow-right'></i>
                                        </> : <>
                                                <i className='fa fa-arrow-left'></i>
                                            </>}


                                    </div>
                                </div>
                                <div><span className='cursor' onClick={() => setShowDetails(!showDetails)}><i style={{ width: '15px' }} className={' fa mr-1 ' + (showDetails ? 'fa-caret-down' : 'fa-caret-right')}></i>{activeRequest.name}</span> <span className='cursor small ml-2' onClick={() => editNameAndDescription()}><i className='fa fa-pen'></i></span></div>

                                {showDetails &&

                                    <div style={{ marginLeft: '15px' }} className=' small'>
                                        {activeRequest.description ? <>{activeRequest.description}</> : <small className='cursor' onClick={() => editNameAndDescription()}>Add description<i className='fa fa-pen ml-2'></i></small>}
                                    </div>
                                }
                            </div>

                            <div className='request-bar'>
                                <div className='request-bar-item request-bar-item-1'>


                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <select disabled={activeRequest.type == 'listen' && alreadyListening} name="type" onChange={handleChange} value={activeRequest.type} className='form-control'>
                                                <option value='emit'>Emit</option>
                                                <option value='listen'> Listen</option>
                                            </select>

                                        </div>

                                        <input type="text" disabled={activeRequest.type == 'listen' && alreadyListening} value={activeRequest.event} name="event" onChange={handleChange} className="form-control" placeholder={activeRequest.type == 'emit' ? "Add emit event" : "Add listen event"} />

                                    </div>


                                </div>
                                <div className='request-bar-item request-bar-item-2'>
                                    {activeRequest.type == 'emit' && <button onClick={() => action('emit')} className="btn btn-secondary" type="button" >Emit</button>}
                                    {activeRequest.type == 'listen' && <button onClick={() => action(alreadyListening ? 'cancel-listen' : 'listen')} className="btn btn-secondary" type="button" >{alreadyListening ? 'Cancel listener' : 'Listen'}</button>}

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

                            {activeCellIndex == 0 && activeRequest.type == 'emit' &&

                                <div>





                                    <ControlledEditor theme={props.app.darkMode ? 'vs-dark' : 'plugman-light'} options={{
                                        minimap: {
                                            enabled: false
                                        },
                                        wordWrap: 'on'


                                    }} height="calc(100vh - 300px)" onChange={(ev: any, value: any) => handleEditorChange(ev, value, 'emit')} value={activeRequest.emitBody || ''} language="json" />
                                </div>}

                            {activeCellIndex == 0 && activeRequest.type == 'listen' &&

                                <div>

                                    <ControlledEditor theme={props.app.darkMode ? 'vs-dark' : 'plugman-light'} options={{
                                        minimap: {
                                            enabled: false
                                        },
                                        wordWrap: 'on',
                                        readOnly: true

                                    }} height="calc(100vh - 300px)" value={activeRequest.listenerBody || ''} language="json" />

                                    <small className='text-color-default'>Listen body is automatically updated when this event is called</small>
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
                                                <td><select name="bodyType" className='capitalize' onChange={handleChange} value={activeRequest.bodyType}> {bodyTypes.map((bodyType,i) => <option value={bodyType} key={i}>{bodyType}</option>)} </select>
                                                </td>
                                                <td className='small'>Determines what the body should be sent as for emit requests and also what type of body the listen requests are receiving</td>
                                            </tr>
                                            <tr>

                                            <td> Initialize On Connect</td>
                                            <td>{
                                                // @ts-ignore
                                                <select name="initializeOnConnect" onChange={handleChange} value={activeRequest.initializeOnConnect || false} className=''>  <option value={true}>Yes</option>   <option value={false}>No</option>  </select>} </td>
                                                <td className='small'>Determines if this listener should be automatically fired when a connection is made</td>
                                            </tr>
                                        </tbody>
                                    </table>



                                </div>}
                            {
                                /*
                            activeCellIndex == 2 &&

                                <div>

                                    <ControlledEditor onChange={(ev: any, value: any) => handleEditorChange(ev, value, 'script')} theme={props.app.darkMode ? 'vs-dark' : 'plugman-light'} options={{
                                        minimap: {
                                            enabled: false
                                        },
                                        wordWrap: 'on',


                                    }} height="calc(100vh - 300px)" value={activeRequest.script || ''} language="javascript" />


                                </div>
                                */

                            }



                        </> : 
                        
                       <Blank />
                        }

                    </div>
                </div>
                <div className={showActivity ? 'col-md-3 h-100' : "d-none"}>
                    <Activity />


                </div>
            </div>
        </div>


    )
}


const mapStateToProps = (state: any) => ({

    app: state.app,
    notifications: state.notifications,
    socketIO: state.socketIO
})


export default connect(mapStateToProps, { setTitle, setActiveTree })(SocketIORequestView)