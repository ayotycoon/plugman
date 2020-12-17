import React, { useState, useEffect, useRef } from 'react'
import './Layout.scss'
import { Route, Redirect, Link, Switch } from 'react-router-dom';
import { connect } from 'react-redux'
import { loading } from '../../store/actions/network.action'
import { setUserData, toggleDarkMode, setActiveTree } from '../../store/actions/app.action'
import { confirmer, sendToCollectionObs, getId, prompter } from '../../Providers/core.service';
import * as envJson from '../../env.json'
import { toaster } from '../../Providers/core.service'
import DropdownClick from '../misc/DropdownClick/DropdownClick';
import * as storage from '../../Providers/storage.service'
import socketService from '../../Providers/socket.service';

import { CollectionFolder, CollectionRequest } from '../types';
import CollectionsService, { foldersObs, WorkspaceService } from '../../Providers/Workspace.service';
import { setTimeout } from 'timers';
import TypePill from '../misc/TypePill/TypePill';
import WorkspaceToggle from '../misc/WorkspaceToggle/WorkspaceToggle';
import { copy } from '../../Providers/helpers';
import WebSocketRequestView from '../modules/WebSocketRequestView/WebSocketRequestView';
import SocketIORequestView from '../modules/SocketIORequestView/SocketIORequestView';
import webSocketService from '../../Providers/web-socket.service';

const isPc = window.innerWidth > 800;
function Layout(props: any) {




    const [sidebarMin, setSidebarMin] = useState(!isPc) //isPc
    const [isSocketIOConnection, setIsSocketIOConnection] = useState(WorkspaceService.getIsSocketIOConnection() ) //isPc
    const [socketUrl, setSocketUrl] = useState(WorkspaceService.getServerUrl() || '')
    const [lastSelectedFolderTree, setLastSelectedFolderTree] = useState('/')
    const [collections, setCollections] = useState([] as any[])
    const [contextMenu, setContextMenu] = useState(null as unknown as any);
    const contextRef = useRef(null as unknown as any)
    const lastFolderRef = useRef(null as unknown as any)
    const collectionsModified = useRef(0)


    const darkMode = props.app.darkMode;
    const activeTree = props.app.activeTree;
    const isSocketConnected = isSocketIOConnection ? props.socketIO.status.connected : props.webSocket.status.connected

    function toggleDarkMode() {
        props.toggleDarkMode()
    }



    useEffect(() => {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches && storage.darkMode.get() != 'true' && storage.dontAskDarkMode.get() != 'true'

        ) {
            confirmer(`We detected your ${isPc ? 'device' : 'phone'} is in dark mode, Do you want to change to dark mode ?`)
                .then(_ => {
                    if (!_) {
                        return
                    }
                    toggleDarkMode()
                })
                .catch(() => {
                    storage.dontAskDarkMode.set('true')

                })
        }


        foldersObs.subscribe((data: any) => {

            setCollections(data)
        })

        window.addEventListener('contextmenu', (e: any) => e.preventDefault());
        if (socketUrl) {
            if(isSocketIOConnection){
                socketService.connect(socketUrl)
            } else {
                webSocketService.connect(socketUrl)

            }


      

          
        }

        return () => {



        }
    }, [])

    useEffect(() => {
        if (collectionsModified.current == 1) {
            const params = new URLSearchParams(window.location.search)
            const paramsTree = params.get('requestTree');
            if (paramsTree) {
                onCollectionEvent('openRequest', paramsTree)
            }
        }

        collectionsModified.current++
        return () => {
            // cleanup
        };
    }, [collections]);
    useEffect(() => {
        const f = () => {

            if (!isPc && !sidebarMin) {
                setSidebarMin(true)

            } else {
                window.removeEventListener('scroll', f)
            }





        }
        setTimeout(() => {
            window.addEventListener('scroll', f)

        }, 1000);


        return () => {
            window.removeEventListener('scroll', f)

        }
    }, [sidebarMin])
    const initLoadFinished = props.app.finishedAuthenticationAttempt;
    const user = props.app.userData;

    function sideBarBlur() {

        if (isPc) {
            return
        }


        if (!sidebarMin) {
            setSidebarMin(true)
        }



    }
    function idFromTree(tree: string) {
        const h = tree.split('/');
        return h[h.length - 1]

    }
    function changeCollection(id: number) {

    }

    async function onCollectionEvent(type: string, tree: string, treeName?: string, other?: any) {


        if (type == 'toggleFolder') {
            CollectionsService.treeDataModifier({ emit: true }, tree, (data: any) => {
                data.isFolderOpened = !(data.isFolderOpened || false)
            })


        } else if (type == 'openRequest') {

            try {

                if (tree == activeTree) {
                    return
                }

                const request = CollectionsService.treeDataModifier({ emit: false }, tree).c

                props.history.push(window.location.pathname + '?requestTree=' + tree)

                props.setActiveTree(tree)

                sendToCollectionObs.next({ type: 'open-request', request, tree })

            } catch (e) {
                props.history.push(window.location.pathname)

            }

        }

        //create-request
        //create-folder
        //delete
        //rename
        else if (type == 'delete') {

            CollectionsService.treeDataModifier({ emit: true }, tree, (data: any, collectionTree: any[]) => {

                for (let index = 0; index < collectionTree.length; index++) {
                    const t = collectionTree[index];
                    if (t.id == data.id) {
                        collectionTree[index] = false;
                    }

                }

            })
            sendToCollectionObs.next({ type: 'del-request', tree })
            socketService.removeFromTrackerIfExist(idFromTree(tree))
            CollectionsService.generateRequestHash()
            CollectionsService.persist()
        }
        else if (type == 'rename') {

            const name = await prompter('New Name', other)

            CollectionsService.treeDataModifier({ emit: true }, tree, (data: any, collectionTree: any[]) => {
                data.name = name

            })
            sendToCollectionObs.next({ type: 'rename-request', tree, name })

            CollectionsService.generateRequestHash()
            CollectionsService.persist()



        }
        else if (type == 'create-request') {
            if (tree == '/') {
                toaster({ type: 'info', message: `<i class='fa fa-info mr-2 '> </i> It is not recommended to create a request that is not under a collection` })

            }

            let name = await prompter('Request Name')

            if (!name) {
                return
            }
            CollectionsService.treeDataModifier({ emit: true }, tree, (data: any, collectionTree: any[]) => {
                if (data) {
                    data.children.push({
                        id: getId(),
                        name,
                        type: 'emit',
                        event: ""

                    })
                } else {

                    collectionTree.push({
                        id: getId(),
                        name,
                        type: 'emit',
                        event: ""

                    })
                }

            })

            CollectionsService.generateRequestHash()
            CollectionsService.persist()
        }
        else if (type == 'create-folder') {
            const name = await prompter((tree == '/' ? 'Collection' : 'Folder') + ' Name')
            CollectionsService.treeDataModifier({ emit: true }, tree, (data: any, collectionTree: any[]) => {
                if (data) {
                    data.children.push({
                        id: getId(),
                        name,
                        isFolder: true,
                        children: []

                    })
                } else {
                    collectionTree.push({
                        id: getId(),
                        name,
                        isFolder: true,
                        children: []

                    })
                }

            })

            CollectionsService.generateRequestHash()
            CollectionsService.persist()
        } else if (type == 'copy') {

            CollectionsService.treeDataModifier({ emit: true }, tree, (data: any, collectionTree: any[]) => {
                if (!data) {
                    return
                }
                copy(JSON.stringify(data))

            })




        } else if (type == 'paste') {
            const clipboardText = await navigator.clipboard.readText()
            CollectionsService.treeDataModifier({ emit: true }, tree, (data: any, collectionTree: any[]) => {

                try {

                    const parsed = JSON.parse(clipboardText);
                    if (!parsed) {
                        throw "error"
                    }
                    parsed.name = parsed.name + '_copy';
                    parsed.id = getId();
                    if (parsed.isFolder) {
                        // @ts-ignore
                        function w(children: any[]) {
                            // change ids for all children
                            let childrenRef = children || []

                            for (let i = 0; i < childrenRef.length; i++) {

                                if (childrenRef[i].isFolder) {
                                    childrenRef[i].id = getId()

                                    if (childrenRef[i].children && childrenRef[i].children.length > 0) {
                                        w(childrenRef[i].children)
                                    }

                                } else {
                                    childrenRef[i].id = getId()

                                }



                            }

                        }

                        w(parsed.children)


                    }


                    if (data) {
                        data.children.push(parsed)
                    } else {
                        collectionTree.push(parsed)
                    }

                    CollectionsService.generateRequestHash()
                    CollectionsService.persist()

                } catch (e) {

                }


            })



        }




    }
  
    const  toggleIsSocketIOConnection = ()=> {
        const val = isSocketIOConnection
        if (isSocketConnected){

            toaster({ type: 'info', message: `<i class='fa fa-info mr-2 '> </i> Disconnect before changing to ` + (val ? 'Websockets' : 'Socket-io') })


            return
        }
   
        setIsSocketIOConnection(!val);
        WorkspaceService.setIsSocketIOConnection(!val);
        setSocketUrl(WorkspaceService.getServerUrl() || '')
    }

    function lastFolderCB(tree?: any) {
        if (tree) {
            lastFolderRef.current = function (e: any) {
                setLastSelectedFolderTree('/')


            }

            setTimeout(() => {
                window.addEventListener('click', lastFolderRef.current)
            }, 100)

        } else {
            window.removeEventListener('click', lastFolderRef.current)
        }
        setLastSelectedFolderTree(tree)
    }
    function setContextMenuF(data: any) {
        if (data) {
            contextRef.current = function (e: any) {
                setContextMenu(null)

            }

            window.addEventListener('click', contextRef.current)
        } else {
            window.removeEventListener('click', contextRef.current)
        }
        setContextMenu(data)
    }

    function CollectionRenderer(props: any) {
     
        const collection: CollectionFolder | CollectionRequest = props.data;

        // handles deleted collections
        if (!collection) { return <></> }
        const tree = (props.tree || '') + ('/' + collection.id);
        const treeName = (props.treeName || '') + ('/' + collection.name);

        const isFirstTree = props.tree == undefined

  

        return (
            <div className='text-color-default cursor'>
                {
                    collection.isFolder ?
                        <>
                            <div onContextMenu={(e) => {


                                setContextMenuF({
                                    tree,
                                    x: e.pageX,
                                    y: e.pageY,
                                    type: 'folder',
                                    other: collection.name

                                })

                            }} className={'p-1 hover-collection ' + (tree == lastSelectedFolderTree ? 'bg-dark-light' : '') + (isFirstTree ? ' is-folder-collection border-top border-bottom ' : '')} onClick={() => { lastFolderCB(tree); onCollectionEvent('toggleFolder', tree, treeName) }}><i style={{ width: '15px' }} className={'fa mr-1 ' + (collection.isFolderOpened ? 'fa-angle-down' : 'fa-angle-right')}></i>{collection.name}</div>

                            {collection.isFolderOpened && <div className={' ' + (isFirstTree ? '' : 'ml-2 border-left border-left-dotted')}> <div style={{ paddingLeft: isFirstTree ? '0px' : '10px' }}>{collection.children.map((c, i) => <div><CollectionRenderer key={i + tree} tree={tree} treeName={treeName} data={c} /></div>)}</div> </div>}

                        </>
                        :

                        <>
                            <div onContextMenu={(e) => {


                                setContextMenuF({
                                    tree,
                                    x: e.pageX,
                                    y: e.pageY,
                                    type: 'request',
                                    other: collection.name

                                })
                            }} className={'p-1 hover-collection ' + (tree == activeTree ? 'bg-dark-light' : '')} onClick={() => onCollectionEvent('openRequest', tree, treeName)}>

                                <TypePill type={(collection as any).type} />

                                {collection.name}</div>
                        </>
                }

            </div>
        )

    }

    function ContextMenu(props: any) {
        const isFirstTree = (contextMenu.tree == undefined || contextMenu.tree == '/')

        return (
            <div className={'border rounded text-color-default ' + (darkMode ? 'bg-app-dark' : 'bg-white')} style={{ position: 'fixed', zIndex: 'auto', top: (contextMenu.y + 'px'), left: (contextMenu.x + 'px') }}>
                {(contextMenu.type == 'folder' || contextMenu.type == 'request') && <div onClick={() => onCollectionEvent('copy', contextMenu.tree, contextMenu.treeName, contextMenu.other)} className='pr-2 pl-2 pt-1 pb-1 cursor hover-collection '> <i className=' fa fa-copy mr-2'></i> Copy</div>}
                {(contextMenu.type == 'folder' || contextMenu.type == 'blank') && <div onClick={() => onCollectionEvent('paste', contextMenu.tree, contextMenu.treeName, contextMenu.other)} className='pr-2 pl-2 pt-1 pb-1 cursor hover-collection '> <i className=' fa fa-paste mr-2'></i> Paste</div>}

                {(contextMenu.type == 'folder' || contextMenu.type == 'blank') && <div onClick={() => onCollectionEvent('create-request', contextMenu.tree, contextMenu.treeName, contextMenu.other)} className='pr-2 pl-2 pt-1 pb-1 cursor hover-collection '> <i className={' fa fa fa-file-medical mr-2 ' + (darkMode ? 'text-white' : 'text-dark')}></i> Create Request</div>}
                {(contextMenu.type == 'folder' || contextMenu.type == 'blank') && <div onClick={() => onCollectionEvent('create-folder', contextMenu.tree, contextMenu.treeName, contextMenu.other)} className='pr-2 pl-2 pt-1 pb-1 cursor hover-collection '> <i className={' fa fa-folder-plus mr-2 ' + (darkMode ? 'text-white' : 'text-dark')}></i> Create {isFirstTree ? 'Collection' : 'Folder'}</div>}
                {(contextMenu.type == 'folder' || contextMenu.type == 'request') && <div onClick={() => onCollectionEvent('rename', contextMenu.tree, contextMenu.treeName, contextMenu.other)} className='pr-2 pl-2 pt-1 pb-1 cursor hover-collection '> <i className={' fa fa-pen mr-2 ' + (darkMode ? 'text-white' : 'text-dark')}></i> Rename</div>}
                {(contextMenu.type == 'folder' || contextMenu.type == 'request') && <div onClick={() => onCollectionEvent('delete', contextMenu.tree, contextMenu.treeName, contextMenu.other)} className='pr-2 pl-2 pt-1 pb-1 cursor hover-collection '> <i className='text-danger fa fa-trash mr-2'></i> Delete</div>}

            </div>
        )


    }

    return (
        <>
            {user ?
                <div className={(sidebarMin ? 'Layout ' : 'Layout sidebar-max ') + (darkMode ? 'bg-app-dark' : '')}>


                    <div



                        className={'ml-2 mt-2 mb-2 sidebar border box-shadow pt-3 ' + (darkMode ? 'bg-app-dark' : 'bg-app-default')} >
                        <div className='pl-4  sidebar-logo text-color-default mb-2'>
                            <div className='d-inline-block sidebar-nav-inner'>
                                <span
                                    style={{ marginLeft: '-5px' }}
                                    className='text-center mb-2 d-block'>

                                    <span onClick={() => setSidebarMin(!sidebarMin)}>
                                        <img style={{ width: '30px', height: '30px', position: 'relative', top: '-5px' }} src='/logo.png' className=' mr-3' />
                                        {!sidebarMin && <b className='text-dark pt-2' style={{ fontSize: '25px' }}>PlugMan 🚀 </b>}
                                    </span>
                                    {!sidebarMin && <a className='ml-2 text-color-default' target="_blank" href='https://github.com/ayotycoon/plugman'><i className='fab fa-github'></i></a>}
                                    {!sidebarMin && <span className='d-block text-left' >
                                        <small className='text-color-default' >
                                            S{isSocketIOConnection && <span>ocket-io</span>} <span title={'Change to ' + (!isSocketIOConnection ? 'Socket io' : 'Websockets')} onClick={toggleIsSocketIOConnection} style={{ fontSize: '14px', transform: isSocketIOConnection ? 'rotate(180deg)' : '' }} className='cursor d-inline-block fa fa-toggle-on'></span>  W{!isSocketIOConnection && <span>eb-socket</span>}
                                    </small>

                                        <small className='float-right text-color-default' >
                                            v {envJson.version}
                                        </small>

                                    </span>}

                                </span>

                            </div>


                        </div>





                      {isSocketIOConnection ?
                        <div>
                            
                            <div className='pr-2 pl-2 pb-1 pt-1  border-bottom text-color-default '>
                                <span title='Create request' onClick={() => {
                                    onCollectionEvent('create-request', lastSelectedFolderTree || '/');
                                }} className='cursor mr-2'><i className='fa fa-file-medical'></i></span>
                                <span title='Create folder' onClick={() => {
                                    onCollectionEvent('create-folder', lastSelectedFolderTree || '/');
                                }} className='cursor mr-2'><i className='fa fa-folder-plus'></i></span>
                            </div>
                             <div className={'CollectionRendererContainer ' + (sidebarMin ? 'd-none' : '')}
                                style={{ height: 'calc(100vh - 350px)', overflowY: 'auto', overflowX: 'auto', whiteSpace: 'nowrap', width: '100%', }}>

                                {contextMenu && <ContextMenu />}

                                {collections.map((collection, i) => <CollectionRenderer key={i} data={collection} />)}

                                <div
                                    onContextMenu={(e) => {
                                        setContextMenuF({
                                            tree: '/',
                                            x: e.pageX,
                                            y: e.pageY,
                                            type: 'blank'

                                        })
                                    }}

                                    className='h-100'>

                                </div>
                            </div>
                        </div>
                            : <div className={'p-2 ' + (sidebarMin ? 'd-none' : '')}>
                             <div className='small text-color-default text-center '>
    
                                    Pure Websocket only listens and emits to the "message" event, therefore this is the only event that can be sent and listened to.
    <hr  />
    Only one emit request is provided, listen responses can be seen on the activity bar
    
    </div>
    </div>
    }








                        <div className={'p-2 ' + (sidebarMin ? 'd-none' : '')} style={{ position: 'absolute', bottom: '30px' }}>
                            <input onChange={(e: any) => {
                                setSocketUrl(e.target.value)
                            }} disabled={isSocketConnected} className='form-control small' value={socketUrl} placeholder='Enter socket url' />

                            <div className='mt-1'>{!isSocketConnected ? <> <button onClick={() => {
                                WorkspaceService.setServerUrl(socketUrl);
                                if(isSocketIOConnection){

                                    socketService.connect(socketUrl)
                                }else{
                                    webSocketService.connect(socketUrl)
                                }
                           
                            }} disabled={!socketUrl} className='btn btn-sm btn-primary'>Connect</button> </> : <button onClick={() => {
                                    if (isSocketIOConnection) {
                                        socketService.disconnect()
                                    }else{
                                        webSocketService.disconnect(true)
                                    }
                                
                            }} className='btn btn-sm btn-outline-primary'>Disconnect</button>}
                            </div>
                        </div>

                    </div>

                    <div className={'topbar ' + (!darkMode ? 'bg-app-default' : 'bg-app-dark')}>
                        <span app-data-intro='Displays the current page you are on. Can also click here to show or hide sidebar' app-data-step='2' className='small '>
                            <span className='change-in-dark-1'>
                                <b  >  {props.app.title.title || <>...</>}


                                    {props.app.title.icon &&

                                        <i className={'ml-2 ' + props.app.title.icon} > </i>
                                    }

                                </b>
                            </span>
                        </span>




                        <div className='float-right'>
                            {props.network.loading &&

                                <i style={{ position: 'relative', top: '3px' }} className=' fa fa-sync spin mr-2'></i>
                            }


                            <WorkspaceToggle />


                            <span className='cursor text-center'>
                                <span style={{ top: '5px', position: 'relative' }} onClick={toggleDarkMode} className='pl-2'>

                                    {!darkMode ? <i style={{ fontSize: '20px' }} className=' far fa-moon'></i> : <i className='text-white fa fa-sun'></i>}
                                </span>

                            </span>

                            {false && <DropdownClick>
                                <span className='cursor text-center'>
                                    <span style={{ top: '5px', position: 'relative' }} className='pl-2 text-dark'>
                                        <i className='far fa-bell' style={{ fontSize: '20px' }}></i>

                                    </span>

                                </span>

                                <div className='dropdown-click-close change-in-dark-1 border rounded p-2 bg-white ' style={{ width: '200px', position: 'relative', left: isPc ? `-170px` : '-170px' }}>
                                    notifications

                                    </div>

                            </DropdownClick>}






                        </div>
                    </div>




                    <div onClick={sideBarBlur} style={{ height: '100vh' }} className={'content ' + (!darkMode ? 'bg-app-default' : 'bg-app-dark')}>

                        <Switch>

                            <Route exact path="/">
                                <Redirect to='/request' />
                            </Route>
                          

                            <Route exact path="/request" component={isSocketIOConnection ? SocketIORequestView : WebSocketRequestView} />

                            <Redirect path='**' to='/404' />
                        </Switch>



                    </div>

                </div>
                : <div className={'splash-container ' + (darkMode ? 'bg-app-dark' : '')}>
                    <div className='d-inline-block'>
                        <img src='/logo.png' />
                        <br></br>
                        <div className='loader'>
                            <div className='bar bg-primary'>

                            </div>

                        </div>

                    </div>

                </div>}</>)

}



const mapStateToProps = (state: any) => ({
    network: state.network,
    app: state.app,
    notifications: state.notifications,
    socketIO: state.socketIO,
    webSocket: state.webSocket
})

export default connect(mapStateToProps, { loading, setUserData, toggleDarkMode, setActiveTree })(Layout)