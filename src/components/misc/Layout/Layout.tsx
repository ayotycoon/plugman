import React, { useState, useEffect, useRef } from 'react'
import './Layout.scss'
import { NavLink, Route, Redirect, Link, Switch } from 'react-router-dom';
import { connect } from 'react-redux'
import { loading } from '../../../store/actions/network.action'
import { setUserData, toggleDarkMode, setFinishedAuthenticationAttempt } from '../../../store/actions/app.action'
import { setNotifications } from '../../../store/actions/notification.action'

import { refreshUserDataObs, confirmer, sendToCollectionObs, getId, prompter } from '../../../Providers/core.service';


import { toaster } from '../../../Providers/core.service'

import DropdownClick from '../DropdownClick/DropdownClick';


import * as storage from '../../../Providers/storage.service'
import Dashboard from '../../modules/Dashboard/Dashboard';
import { CONSTANTS, host } from '../../../env';
import socketService from '../../../Providers/socket.service';
import AsyncImage from '../AsyncImage/AsyncImage';
import { NumberLiteralType } from 'typescript';
import Request from '../../modules/Request/Request';
import { CollectionFolder, CollectionRequest } from '../../types';
import CollectionsService, { collectionsObs } from '../../../Providers/Collections.service';
import { setTimeout } from 'timers';



const isPc = window.innerWidth > 800;

const navLinks = [

    {
        name: 'Collections',
        link: '/request',
        fa: ' fa fa-th'
    },


]

function Layout(props: any) {




    const [sidebarMin, setSidebarMin] = useState(!isPc) //isPc
    const [activeNavIndex, setActiveNavIndex] = useState(0)
    const [activeTree, setActiveTree] = useState('')
    const [socketUrl, setSocketUrl] = useState(storage.serverUrl.get() || '')
    const [lastSelectedFolderTree, setLastSelectedFolderTree] = useState('/')
    const [collections, setCollections] = useState([] as any[])
    const [contextMenu, setContextMenu] = useState(null as unknown as any)
    const activenav = navLinks[activeNavIndex];
    const contextRef = useRef(null as unknown as any)
    const lastFolderRef = useRef(null as unknown as any)
    const collectionsModified = useRef(0)

    const darkMode = props.app.darkMode;

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

     
        collectionsObs.subscribe((data: any) => {

            setCollections(data)
        })

        window.addEventListener('contextmenu', (e: any) => e.preventDefault());
        if(socketUrl){

        
        socketService.initializeAndListen(socketUrl)
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
    const isGuest = initLoadFinished && !user;



    const notifications = (props.notifications as any[] || []).filter(_ => !_.read);
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
    function changeNav(n: number) {
        const nextIndex = activeNavIndex + n;
        props.history.push(navLinks[nextIndex].link)
        // to={activenav.link}
        setActiveNavIndex(nextIndex)
    }

    async function onCollectionEvent(type: string, tree: string, treeName?: string) {


        if (type == 'toggleFolder') {
            CollectionsService.treeDataModifier({ emit: true }, tree, (data: any) => {
                data.isFolderOpened = !(data.isFolderOpened || false)
            })


        } else if (type == 'openRequest') {

            try{

            

            const request = CollectionsService.treeDataModifier({ emit: false }, tree).c

            props.history.push(window.location.pathname + '?requestTree=' + tree)
            setActiveTree(tree)

            sendToCollectionObs.next({ request, tree })

            }catch(e){

            }

        }
        
        //create-request
        //create-folder
        //delete
        //rename
        else if (type == 'delete'){
          
            CollectionsService.treeDataModifier({ emit: true }, tree, (data: any, collectionTree: any []) => {
              
                for (let index = 0; index < collectionTree.length; index++) {
                  const t = collectionTree[index];
                    if (t.id == data.id) {
                        collectionTree[index] = false;
                    }
                  
              }
            
            })
 
            socketService.removeFromTrackerIfExist(idFromTree(tree))
            CollectionsService.generateRequestHash()
            CollectionsService.persist()
        }
        else if (type == 'rename'){
            const name = await prompter('New Name')
           
                CollectionsService.treeDataModifier({ emit: true }, tree, (data: any, collectionTree: any[]) => {
                    data.name = name

                })

                CollectionsService.generateRequestHash()
                CollectionsService.persist()
            
          
          
        }
        else if (type == 'create-request'){
            const name = await prompter('Request Name')
            CollectionsService.treeDataModifier({ emit: true }, tree, (data: any, collectionTree: any []) => {
             if(data){
                 data.children.push({
                     id: getId(),
                     name,
                     type: 'emit',
                     event: ""

                 })
             } else {
                 console.log(collectionTree)
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
        else if (type == 'create-folder'){
            const name = await prompter('Folder Name')
            CollectionsService.treeDataModifier({ emit: true }, tree, (data: any, collectionTree: any []) => {
             if(data){
                 data.children.push({
                     id: getId(),
                     name,
                     isFolder: true,
                     children: []

                 })
             }else{
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
        }




    }
  
    function lastFolderCB(tree?: any) {
        if (tree) {
            lastFolderRef.current = function (e: any) {
                setLastSelectedFolderTree('/')
                lastFolderCB()
                
            } 

            setTimeout(()=> {
                window.addEventListener('click', lastFolderRef.current)
            },500)
          
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

        if(!collection){return <></>}
        const tree = (props.tree || '') + ('/' + collection.id);
        const treeName = (props.treeName || '') + ('/' + collection.name);

      

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
                                    isFolder:true

                                })
                            }} className={'p-1 hover-collection ' + (tree == lastSelectedFolderTree ? 'bg-dark-light' : '')} onClick={() => { lastFolderCB(tree);onCollectionEvent('toggleFolder', tree, treeName)}}><i style={{ width: '15px' }} className={'fa mr-1 ' + (collection.isFolderOpened ? 'fa-angle-down' : 'fa-angle-right')}></i>{collection.name}</div>

                            {collection.isFolderOpened && <div className='border-left ml-1'> <div style={{ paddingLeft: '10px' }}>{collection.children.map((c, i) => <div><CollectionRenderer key={i + tree} tree={tree} treeName={treeName} data={c} /></div>)}</div> </div>}

                        </>
                        :

                        <>
                            <div onContextMenu={(e) => {
                              

                                setContextMenuF({
                                    tree,
                                    x: e.pageX,
                                    y: e.pageY,
                                    isFolder: false

                                })
                            }} className={'p-1 hover-collection ' + (tree == activeTree ? 'bg-dark-light' : '')} onClick={() => onCollectionEvent('openRequest', tree, treeName)}> <small className={'p-1  font-weight-bold ' + ((collection as any).type == 'emit' ? 'text-primary' : 'text-secondary')} >{
                                // @ts-ignore
                                collection.type}</small> {collection.name}</div>
                        </>
                }

            </div>
        )

    }
    function onContextMenu(type:string, tree: string){
       // const sure = await confirmer('are you sure you want to logout ?')
    }

    function ContextMenu(props: any) {

        return (
            <div className={' border text-color-default ' + (darkMode ? 'bg-app-dark': 'bg-white')} style={{ position: 'fixed', zIndex: 'auto', top: (contextMenu.y + 'px'), left: (contextMenu.x + 'px') }}>
             
                {contextMenu.isFolder && <div onClick={() => onCollectionEvent('create-request', contextMenu.tree)} className='p-1 cursor hover-collection '> <i className={' fa fa fa-file-medical mr-2 '+ (darkMode ? 'text-white' :'text-dark')}></i> Create Request</div>}
                {contextMenu.isFolder && <div onClick={() => onCollectionEvent('create-folder',contextMenu.tree)} className='p-1 cursor hover-collection '> <i className={' fa fa-folder-plus mr-2 '+ (darkMode ? 'text-white' :'text-dark')}></i> Create Folder</div>}
                <div onClick={()=>onCollectionEvent('rename',contextMenu.tree)} className='p-1 cursor hover-collection '> <i className={' fa fa-pen mr-2 '+ (darkMode ? 'text-white' :'text-dark')}></i> Rename</div>
                <div onClick={()=>onCollectionEvent('delete',contextMenu.tree)} className='p-1 cursor hover-collection '> <i className='text-danger fa fa-trash mr-2'></i> Delete</div>

            </div>
        )


    }

    return (
        <>
            {user ?
                <div className={(sidebarMin ? 'Layout ' : 'Layout sidebar-max ') + (darkMode ? 'bg-app-dark' : '')}>


                    <div



                        className={'ml-2 mt-2 mb-2 sidebar border box-shadow pt-3 ' + (darkMode ? 'bg-app-dark' : 'bg-app-default')} >
                        <div className='pl-4  sidebar-logo text-color-default mb-4'>
                            <div className='d-inline-block sidebar-nav-inner'>
                                <span
                                    style={{ marginLeft: '-5px' }}
                                    onClick={() => setSidebarMin(!sidebarMin)} className='text-center mb-2 d-block'>

                                    <img style={{ width: '30px', height: '30px' }} src='/logo.png' className=' mr-3' />
                                    {!sidebarMin && <b className='text-dark pt-2' style={{ fontSize: '25px' }}>PlugMan </b>}

                                </span>

                            </div>


                        </div>
                        {user && <div >

                            {
                                <div className="navbar-ticker border-top border-bottom pt-2 pb-2">
                                    <div className='navbar-ticker-left text-color-default'>
                                        {activeNavIndex > 0 && <div onClick={() => changeNav(-1)} className='w-100 h-100'>
                                            <i className='fa fa-angle-left'></i>
                                        </div>}


                                    </div>
                                    <div className='navbar-ticker-main sidebar-nav text-color-default text-dark'>

                                        <div className='sidebar-nav-inner'>
                                            <i className={activenav.fa}></i>
                                            <span className='sidebar-text'>{activenav.name}</span>
                                        </div>

                                    </div>
                                    <div className='navbar-ticker-right text-color-default'>
                                        {(activeNavIndex < navLinks.length - 1) && <div onClick={() => changeNav(1)} className='w-100 h-100'>
                                            <i className='fa fa-angle-right'></i>
                                        </div>}
                                    </div>
                                </div>

                            }

                        </div>}



                        {activeNavIndex== 0 &&
                        
                            <div>
                            <div className='pr-2 pl-2 pb-1 pt-1  border-bottom text-color-default '>
                                <span title='Create request' onClick={() => {
                                    onCollectionEvent('create-request', lastSelectedFolderTree || '/');
                                }} className='cursor mr-2'><i className='fa fa-file-medical'></i></span>
                                <span title='Create folder' onClick={() => {
                                    onCollectionEvent('create-folder', lastSelectedFolderTree ||'/');
                                }} className='cursor mr-2'><i className='fa fa-folder-plus'></i></span>
                            </div>
                            <div 
                            style={{ height: 'calc(100vh - 350px)', overflowY: 'auto' }}>
                        <div className='pt-2' style={{ marginLeft: '10px', whiteSpace: 'nowrap', width: '100%', overflow: 'auto' }}>
                            {contextMenu && <ContextMenu />}
                         
                            {collections.map(collection => <CollectionRenderer data={collection} />)}
                        </div>
                        </div>
                        </div>
                        
                        }
                        


                        <div className='p-2' style={{ position: 'absolute', bottom: '30px' }}>
                            <input onChange={(e: any) => {
setSocketUrl(e.target.value)
                            }} className='form-control small' value={socketUrl} placeholder='Enter socket url' />

                            <div className='mt-1'>{!props.socket.status.connected ?<> <button onClick={() => {
                                storage.serverUrl.set(socketUrl);
                                socketService.initialize(socketUrl)
                            }} className='btn btn-sm btn-primary'>Connect</button>
                            <br/>
                                <small onClick={() => {
                                    socketService.initializeAndListen(socketUrl)
                                }} className='text-primary cursor 
                                '>Connect and fire all events</small>
                            
                            </> : <button onClick={() => {
                                socketService.disconnect()
                            }} className='btn btn-sm btn-outline-primary'>Disconnect</button>}
                            </div>
                        </div>

                    </div>

                    <div className={'topbar ' + (!darkMode ? 'bg-app-default' : 'bg-app-dark')}>
                        <span app-data-intro='Displays the current page you are on. Can also click here to show or hide sidebar' app-data-step='2' className='small '>
                            <span className='change-in-dark-1'>
                                <b  >  {props.app.title.title || <>Inngle</>}
                                    {props.app.title.image &&

                                        <AsyncImage className='ml-2' src={props.app.title.image} alt={props.app.title.title} style={{ width: '25px', height: '25px', borderRadius: '50%' }} />
                                    }

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
                            {user && <>
                                {false && <DropdownClick>
                                    <span className='cursor bg-nav p-2 pb-3 box-shadow' style={{ borderRadius: '30px' }}>
                                        <span style={{ position: 'relative', top: '2px' }} className='mr-2 font-weight-bold  d-none d-md-inline change-in-dark-1'>
                                            <i className=' fa fa-angle-down ml-2 mr-2'></i>
                                            {user.name}

                                        </span>
                                        <span
                                            app-data-intro='Displays your profile image, clicking gives you further actions' app-data-step='1'
                                            style={{ position: 'relative' }}>
                                            <AsyncImage className='border ' style={{ borderRadius: '50%', width: '30px' }} src={user.img ? '' : CONSTANTS.DEFAULT_USER_IMAGE} />
                                            {notifications.length !== 0 && <span className='toast1 text-info  fa fa-asterisk'></span>}
                                        </span>
                                    </span>

                                    <div className='dropdown-click-close change-in-dark-1 border rounded p-2 bg-white ' style={{ width: '200px', position: 'relative', left: isPc ? `-100px` : '-170px' }}>
                                        <Link to='/dashboard' className='d-block dropdown-click-close'>

                                            <span className=' d-block list-group-item-action p-2 dropdown-click-close' style={{ position: 'relative' }}>
                                                <i className=' fa fa-th mr-2'></i>
                                                {notifications.length !== 0 && <span className='toast2 text-info'>{notifications.length <= 9 ? notifications.length : `9+`}</span>}
                                            Dashboard</span>

                                        </Link>
                                        <Link to='/forms' className='d-block dropdown-click-close '>
                                            <span className=' d-block list-group-item-action dropdown-click-close p-2'>
                                                <i className=' fa fa-archive mr-2'></i>
                                            My Forms</span>

                                        </Link>
                                        <Link to='/documents' className=' d-block dropdown-click-close'>
                                            <span className=' d-block list-group-item-action p-2 dropdown-click-close'>
                                                <i className=' fa fa-layer-group mr-2'></i>
                                            Documents</span>

                                        </Link>
                                        <Link to='/Members' className=' d-block dropdown-click-close'>
                                            <span className=' d-block list-group-item-action p-2 dropdown-click-close'>
                                                <i className=' fa fa-sticky-note mr-2'></i>
                                            Members</span>

                                        </Link>
                                        <Link to='/settings' className=' d-block dropdown-click-close'>
                                            <span className=' d-block list-group-item-action p-2 dropdown-click-close'>
                                                <i className=' fa fa-cog mr-2'></i>
                                            Settings</span>

                                        </Link>
                                        <div onClick={props.toggleDarkMode} className=' d-block  text-right cursor '>
                                            <span className=' d-block list-group-item-action p-2'>
                                                {darkMode ? <i className=' fa fa-sun'></i> : <i className=' fa fa-moon'></i>}
                                            </span>

                                        </div>


                                    </div>

                                </DropdownClick>

                            }



                            </>}
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

                           
                            <Route exact path="/request" component={Request} />

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
    socket: state.socket
})

export default connect(mapStateToProps, { loading, setUserData, toggleDarkMode, setFinishedAuthenticationAttempt, setNotifications })(Layout)