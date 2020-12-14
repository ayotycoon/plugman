import { getId } from './index';
import { BehaviourSubject } from './helpers';

export const TYPE_KEYS = {
    SOCKETIO: 'socket-io',
    WEBSOCKETS: 'web-sockets'
}

let activeWorkSpaceKey = 'default-workspace'
let activeWorkspaceData: {
    name: string;
    socketIOUrl: string;
    webSocketUrl: string;
    version: string;
    isSocketIOConnection: boolean
    folders: any[]
    webSocketRequest: any

} = {
    name: '',
    socketIOUrl: '',
    webSocketUrl: '',
    version: '',
    isSocketIOConnection: false,
    folders: [],
    webSocketRequest:{

    }

}
const idToRequestHash: any = {

}
const defaultWebSocketRequest = {

    bodyType: "object",
    emitBody: `{"foo": "bar"}`
}
const defaultFolderStructure = {
    name: 'default',
    version: '1.1',
    serverUrl: '',
    folders: [
 
    {
        id: getId(),
        name: 'Example SocketIO Collection 😉',
        isFolder: true,
        isFolderOpened:true,
        children:[
            {
                id: getId(),
                name: 'Sample emit request',
                isFolder: false,
                event: "message",
                type: "emit",
                emitBody: `{"foo": "bar"}`
            },
            {
                id: getId(),
                name: 'Sample listen request',
                isFolder: false,
                event: "message",
                type: "listen",
                listenBody: `{"foo": "bar"}`
            },
            {
                id: getId(),
                name: 'i am a request in a collection',
                isFolder: false,
                event: "message_listener",
                type: "listen",
                listenBody: `{"foo": "bar"}`
            },
        ],
    },
    {
        id: getId(),
        name: 'Right click on me to see  options',
        isFolder: true,
        children:[
        
        ],
    }
],
    webSocketRequest: defaultWebSocketRequest
 


}

const defaultWorkspacesStructure = {
    'default-workspace':{name:'Default', key: 'default-workspace'}
}
let workspaces: any;

/**
 * Helps to remove un wanted code next time the application initializes
 * @param data
 */
function sanitize(data: any){


    return data

}
    export const  isSocketIOConnection = () => {
    return activeWorkspaceData.isSocketIOConnection || false
}
export class WorkspaceService {

    public static persist() {
        localStorage.setItem(activeWorkSpaceKey, JSON.stringify(activeWorkspaceData))

    }
    public static load() {
        activeWorkspaceData = sanitize(JSON.parse(localStorage.getItem(activeWorkSpaceKey) || JSON.stringify(defaultFolderStructure)))

    }
    // ww
    public static loadWorkspaces() {
        workspaces = JSON.parse(localStorage.getItem('workspaces') || JSON.stringify(defaultWorkspacesStructure))
        activeWorkSpaceKey = localStorage.getItem('active-workspace') || activeWorkSpaceKey

       
    }
    public static getWorkspaces() {
        return  workspaces;

    }
    public static changeWorkspace(key:string) {
        if(key == activeWorkSpaceKey){
            return
        }
        localStorage.setItem('active-workspace', key)
        window.location.reload()

    }
    public static addWorkspace(name:string) {
        name = name.substring(0,13)
        const key: string = getId()
        const _workspace = this.getWorkspaces()
        _workspace[key]={name,key}

        localStorage.setItem('workspaces', JSON.stringify(_workspace))
        localStorage.setItem('active-workspace', key)
        this.changeWorkspace(key);

    }
    public static getActiveWorkspaceKey() {
        return  activeWorkSpaceKey

    }
    public static getIsSocketIOConnection(){

        return isSocketIOConnection();

    }
    public static setIsSocketIOConnection(value: boolean) {

        activeWorkspaceData.isSocketIOConnection = value;
        this.persist()

    }
    public static setWebSocketRequest(data: any) {

        activeWorkspaceData.webSocketRequest = data;
        this.persist()

    }
    public static getServerUrl(){
     
        let serverUrl ;
        if (isSocketIOConnection()){
            serverUrl = activeWorkspaceData.socketIOUrl;

        } else {
            serverUrl = activeWorkspaceData.webSocketUrl;
        }

        return serverUrl;

    }
    public static setServerUrl(url:string){

    
        if (isSocketIOConnection()) {
             activeWorkspaceData.socketIOUrl = url;

        } else {
             activeWorkspaceData.webSocketUrl = url;
        }

     
        this.persist()

    }


    private static setDataFolders(folders: any[]) {
        activeWorkspaceData.folders = folders;
    }
    public static generateRequestHash() {
        function folderParse(dd: any[]) {
            dd.forEach(d => {
                if (d.isFolder) {
                    folderParse(d.children || [])
                } else {
                    idToRequestHash[d.id] = d
                }
            })

        }
        folderParse(activeWorkspaceData.folders)

    }
    public static getRequestHash() {
        return idToRequestHash;



    }
    public static getWebSocketRequest() {
        return activeWorkspaceData.webSocketRequest || defaultWebSocketRequest;



    }
    public static getRequestFromId(tree: string) {

        return idToRequestHash[tree]

    }
    public static treeDataModifier(options: any = {}, tree: string, cb?: any, localFolders?: any[]): any {
        const treeSplit = tree.split('/').filter(_ => _)

        let treeIndex = 0;
        let targetC;


        function treeDataModifierF(cb?: any, localFolders?: any[]): any {
            let lastLoop = false;
            if (treeIndex === (treeSplit.length - 1)) {
                lastLoop = true
            }
            let folderTree: any[] = localFolders || JSON.parse(JSON.stringify(activeWorkspaceData.folders));


            if (treeSplit.length === 0) {

                if (cb) {
                    cb(null, folderTree)

                }
                WorkspaceService.setDataFolders(folderTree);
                if (options.emit) {

                    foldersObs.next(activeWorkspaceData.folders);
                }
                return { c: null, folderTree }

            }






            const id = treeSplit[treeIndex];



            for (let c of folderTree) {
                if (c.id === id) {
                    targetC = c;

                    if (c.isFolder && (treeIndex < (treeSplit.length - 1))) {

                        treeIndex++
                        treeDataModifierF(cb, c.children)


                    }



                    if (cb && lastLoop) {

                        cb(c, folderTree)

                    }
                    WorkspaceService.setDataFolders(folderTree);
                    if (options.emit) {

                        foldersObs.next(activeWorkspaceData.folders);
                    }

                    return { c: targetC, folderTree }

                }
            }


        }

      
        try {
         

            return treeDataModifierF(cb, localFolders)
            //  data = data.[]


        }
        catch (e) {

            return null

        }

    }




}
WorkspaceService.loadWorkspaces()
WorkspaceService.load()
WorkspaceService.generateRequestHash();

export const foldersObs = new BehaviourSubject(activeWorkspaceData.folders)




export default WorkspaceService