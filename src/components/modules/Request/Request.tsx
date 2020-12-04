import React, { useEffect, useRef, useState } from 'react'
import './Request.scss';
import { connect } from 'react-redux'
import { setTitle } from '../../../store/actions/app.action'
import DropdownClick from '../../misc/DropdownClick/DropdownClick';
import { sendToCollectionObs, toaster } from '../../../Providers/core.service';
import { CollectionRequest } from '../../types';
import CollectionsService from '../../../Providers/Collections.service';
import socketService from '../../../Providers/socket.service';
import Activity from '../Activity/Activity';
import Editor, { ControlledEditor } from '@monaco-editor/react';



function Request(props: any) {
    const [saved, setSaved] = useState(true);
    const [requestTree, setRequestTree] = useState('');
    const [activeCellIndex, setActiveCellIndex] = useState(0);
    const [showDetails, setShowDetails] = useState(false);
    const [showActivity, setShowActivity] = useState(true);
    const [tabs, setTabs] = useState([] as any[])
    const [activeRequest, setActiveRequest] = useState(null as unknown as CollectionRequest);
    const subs = useRef([] as any[])
    const navbarCriticalChanged = useRef(false);

    const cells = activeRequest && activeRequest.type == 'emit' ? ['EmitBody', 'Script'] : ['ListenBody', 'Script']


    useEffect(() => {
        props.setTitle('Request');


    }, [])
    useEffect(() => {

        subs.current.push(sendToCollectionObs.subscribe((data: any) => {
            if (!data) {
                return
            }

            if (tabs.indexOf(data.tree) == -1) {
                const tabsClone = [...tabs, data.tree];
                setTabs(tabsClone)
            }
            if (!saved) {
                save()
            }

            setActiveRequest(data.request)
            setRequestTree(data.tree)
        }))

        return () => {
            subs.current.forEach((sub: any) => sub.unSubscribe())
        }

    }, [tabs, activeRequest])

    const user = props.app.userData;

    const darkMode = props.app.darkMode;
    function handleChange(e: any) {
        if (saved) {
            setSaved(false);
        }
        if (e.target.name == 'name' || e.target.name == 'type') {
            navbarCriticalChanged.current = true
        }
        const clone: any = { ...activeRequest }
        clone[e.target.name] = e.target.value;
        setActiveRequest(clone)



    }
    function save() {

        CollectionsService.treeDataModifier({ emit: navbarCriticalChanged.current }, requestTree, (d: any) => {

            console.log({ d })
            Object.keys(activeRequest).forEach(k => {
                d[k] = activeRequest[k]
            })
        })
        CollectionsService.generateRequestHash();
        CollectionsService.persist();
        setSaved(true)

    }
    function deleteTab(tab: string) {
        console.log('delete ', tab)

        if (tab == requestTree) {
            save()
            setActiveRequest(null as unknown as any);
            setRequestTree('')
        }
        const tabKeys = Array.from(tabs.keys());
        const tabsClone = tabs.filter(t => t != tab);

        setTabs(tabsClone)

    }
    function activateTab(tab: string) {
        if (tab == requestTree) {
            return;
        }
        if (!saved) {
            save()
        }
        const ids = tab.split('/')
        const id = ids[ids.length - 1]

        setActiveRequest(CollectionsService.getRequestFromId(id))
        setRequestTree(tab)



    }
    function tabTreeToName(tree: string) {
        const ids = tree.split('/')
        const id = ids[ids.length - 1]
        return CollectionsService.getRequestFromId(id).name
    }

    function action(type: string) {
        if (!props.socket.status.connected) {
            toaster({ type: 'danger', message: `<i class='fa fa-info mr-2 '> </i>  You are not connected` })

            return
        }
        if (type == 'emit') {
            try {
                new Function(activeRequest.script)()(activeRequest.emitBody, (cb: any) => {
                    console.log({ cb })
                })
            } catch (e) {

            }


            socketService.emit(activeRequest.id as any, activeRequest.event, activeRequest.emitBody)
        } else if (type == 'listen') {
            socketService.listen(activeRequest.id as any, activeRequest.event)

        } else if (type == 'cancel-listen') {
            socketService.cancelListen(activeRequest.id as any, activeRequest.event)
        }
    }

    const alreadyListening = (activeRequest && props.socket.tracker[activeRequest.id] && props.socket.tracker[activeRequest.id].type == 'listen')

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

        <div className='Request h-100'>

            <div className='row h-100'>
                <div className={'h-100 p-0 ' + (props.app.darkMode ? ' bg-dark ' : '') + (showActivity ? 'border-right  col-md-9' : 'col-md-12')}>
                    <div className={'pt-2 pl-2 pr-2 ' + (props.app.darkMode ? ' bg-dark-light ' : 'bg-default-light')} style={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', whiteSpace: 'nowrap' }}>
                        {tabs.map((tab, i) => <span className={'cursor p-1 text-color-default ' + (i == 0 ? ' ' : 'border-left ') + (tab == requestTree ? (props.app.darkMode ? ' bg-dark ' : 'bg-app') : '')}><span onClick={() => activateTab(tab)} className='mr-1 small font-weight-bold'> {tabTreeToName(tab)}</span> <span onClick={() => deleteTab(tab)}> <i className='fa fa-close'></i></span> </span>)}
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

                                        <input type="text" disabled={activeRequest.type == 'listen' && alreadyListening} value={activeRequest.event} name="event" onChange={handleChange} className="form-control" placeholder={activeRequest.type == 'emit' ? "Add emitter" : "Add listener"} />
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

                                    <ControlledEditor onChange={(ev: any, value: any) => handleEditorChange(ev, value, 'script')} theme={props.app.darkMode ? 'vs-dark' : 'plugman-light'} options={{
                                        minimap: {
                                            enabled: false
                                        },
                                        wordWrap: 'on',


                                    }} height="calc(100vh - 300px)" value={activeRequest.script || ''} language="javascript" />


                                </div>}



                        </> : <div style={{
                            height: 'calc(100vh - 200px)',
                            display: 'flex',
                            alignItems: 'center',

                            //    justifyContent: 'center'
                        }}>

                                <div className='h4 change-in-dark-1 p-4'>

                                    Open a Request
                                <br />
                                    <br />
                                    <b>How to use</b>
                                    <ol>
                                        <li>Connect  to socket url</li>
                                        <li>Make an emit request </li>
                                        <li>create a listen request</li>
                                        <li>Receive the request from your server and emit back the listen event</li>

                                        <li> Emit the <i>emit</i> request </li>
                                        <li>Listen to the <i>listen</i> request</li>
                                    </ol>

                                </div>
                            </div>
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
    socket: state.socket
})


export default connect(mapStateToProps, { setTitle })(Request)