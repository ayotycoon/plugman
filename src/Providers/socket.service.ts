import { CollectionsService } from './Collections.service';
import { setTimeout } from 'timers';
import { BehaviourSubject } from './helpers';
import { toaster } from './core.service';
import io from 'socket.io-client';

import { addNotification } from '../store/actions/notification.action';
import { store } from '../store';
import { addActivity, setStatus, setTrackers } from '../store/actions/socket.action';


let tracker: {
    [id: string]: {
        type: 'emit' | 'listen'
        event: string
    }

} = {}
let listenEventToId:{
    [event: string]: string

}={}
let status: any = {}


class SocketService {
    // @ts-ignore
    socket: SocketIOClient.Socket;
    // @ts-ignore
    host: string;
    public initialize(host: string, cb?: any) {
       
            this.host = host;
            this.socket = io(host)

            this.socket.on('connect', () => {
                if(cb){
                    cb(true)
                }
               
                this.emitActivity('listen', 'connect')
                status.connected = true
                this.next()

            
            this.socket.on('disconnect', () => {

                this.disconnect()
                // this.initialize(this.host)

            })

        })
      
    }
    public initializeAndListen(host: string) {
        this.initialize(host, () => {
            const h = CollectionsService.getRequestHash()
            Object.values(h).forEach((b: any) => {
                if (b.type == 'emit' && b.event) {
                    this.emit(b.id, b.event, b.emitBody)
                }
                if (b.type == 'listen' && b.event) {
                    this.listen(b.id, b.event)
                }
            })

        })
  
      

     

     
    }
    private next() {
        store.dispatch(setStatus(status))
    }
    private emitActivity(type: string, event: string, data?: any) {
        store.dispatch(addActivity({ type, event, data }))

    }
    private emitTracker(id?: string, data?: any) {
        if (!id) {
            tracker = {};
            store.dispatch(setTrackers(tracker))
            return
        }
        if (!data) {
            delete tracker[id];
        } else {
            tracker[id] = data
        }



        store.dispatch(setTrackers(tracker))

    }
    removeFromTrackerIfExist(id:string){
        
        if(tracker[id]){
            if (tracker[id].type == 'listen'){
                delete listenEventToId[tracker[id].event]
                this.socket.removeListener(tracker[id].event);
            }
            this.emitTracker(id)
        }

    }
    public disconnect() {
        // @ts-ignore
        this.socket.destroy();
        // @ts-ignore
        delete this.socket;
        // @ts-ignore
        this.socket = null;

        status.connected = false
        this.emitActivity('listen', 'disconnect')
        this.emitTracker()
        this.next()
        console.log('disconnecting')
    }

    cancelListen(id: string, event: string) {
        this.emitTracker(id)
        delete listenEventToId[event]
        this.socket.removeListener(event);
    }
    listen(id: string, event: string) {
        if (listenEventToId[event] ){
            toaster({ type: 'danger', message: `<i class='fa fa-info mr-2 '> </i>  A request is already listening to this event "<b>${event}</b>"` })
            return
        }
        if (tracker[id] && tracker[id].type == 'listen') {
            return;
        }
        this.emitTracker(id, {
            type: 'listen',
            event

        })
        listenEventToId[event] = id;

        this.socket.on(event, (data: any) => {
            this.emitActivity('listen', event, (typeof data == 'string' ? data : JSON.stringify(data)))

        })
    }
    emit(id: string, event: string, data: any) {

        // if the previous one was listen, remove it

        if (tracker[id] && tracker[id].type == 'listen') {
            delete listenEventToId[event]
            this.socket.removeListener(event);


        }
        if (!tracker[id] || tracker[id].type != 'emit') {
            this.emitTracker(id, {
                type: 'emit',
                event

            })
        }

        this.socket.emit(event, data)

        this.emitActivity('emit', event, data)

    }

    private onMessage(data: { type: 'toast' | 'new-notification' | 'modal' | 'action', data: any }) {

        if (data.type === 'modal') {
            return
        }
        if (data.type === 'action') {
            return
        }
        if (data.type === 'new-notification') {
            //console.log(data)
            store.dispatch(addNotification(data.data))

            toaster({ message: '1 new notification ' })

            return
        }

        toaster(data.data)


    }
}

const socketService = new SocketService()

export default socketService