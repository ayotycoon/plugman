import { WorkspaceService } from './Workspace.service';
import { toaster } from './core.service';
import { store } from '../store';
import { setStatus, addActivity } from '../store/actions/web-socket.action';
import { bodyTypeParser } from './helpers';


let status: any = {}
class WebSocketService {
    // @ts-ignore
    webSocket: WebSocket;
    // @ts-ignore
    host: string;
    private initialize(host: string, cb?: any) {
       
            this.host = host;
            this.webSocket = new WebSocket(host)

        
            this.webSocket.onopen =  () => {
                toaster({ type: 'success', message: `<i class='fa fa-plug mr-2 '> </i>  Connected 🎉🎉` })
                this.emitActivity('', false,'connected')
                if(cb){
                    cb(true)
                }
               
       
                status.connected = true
                this.next()

            


        }
        this.webSocket.onmessage = (data) => {


            this.emitActivity(data, false)

        }

        this.webSocket.onclose = () => {

            this.disconnect()

        }
      
    }
    public connect(host: string) {
        this.initialize(host, () => {
            const h = WorkspaceService.getWebSocketRequest()
            const emitBody = bodyTypeParser(h.bodyType, h.emitBody)
            this.emit(emitBody)

        })
  
    }
    private next() {
        store.dispatch(setStatus(status))
    }

 
    public disconnect(forced?:boolean) {
        if(forced){
            this.webSocket.close()
            return;
        }
        toaster({ type: 'danger', message: `<i class='fa fa-warning mr-2 '> </i>  Disconnected` })
        this.emitActivity("", false,'disconnected')
        

        status.connected = false
    
        this.next()
     
    }

 emitActivity(data: any, emit: boolean,name?: string){
     data = typeof data == 'string' ? data : JSON.stringify(data)
     store.dispatch(addActivity({data,emit: emit || false,name: name|| 'message'}))
 }
    emit( data: any) {

        this.emitActivity(data,true)

        // if the previous one was listen, remove it

       
        this.webSocket.send( data)


    }


}

const webSocketService = new WebSocketService()

export default webSocketService;