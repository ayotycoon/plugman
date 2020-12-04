import React, { useEffect } from 'react';
import './App.scss';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import { store, Provider } from './store'
import { monaco } from '@monaco-editor/react';

import Layout from './components/misc/Layout/Layout';
import Overlay from './components/misc/Overlay/Overlay';
import ScrollToTop from './components/misc/ScrollToTop/ScrollToTop';
import { possibleResizeObs } from './Providers/core.service';
import {  DebounceTime } from './Providers/helpers';
import socketService from './Providers/socket.service';

monaco
    .init()
    .then(monaco => {
        const theme = {
            base: 'vs',
            inherit: true,
            colors: {
                "editor.background": '#f6f7fa'
            },
           rules: [
                { token: 'green', background: 'FF0000', foreground: '00FF00', fontStyle: 'italic' },
                { token: 'red', foreground: 'FF0000', fontStyle: 'bold underline' },
                { background: '000000' },
                { foreground: 'FFFFFF' }
            ],
        }
        monaco.editor.defineTheme('plugman-light', theme)

    
})
const ref = new DebounceTime()

window.addEventListener('resize', () => {
    ref.start(() => possibleResizeObs.next(true), 500)
})
//socketService.initialize()
function App() {
    useEffect(() => {
 
        
        return () => {
        
        };
    }, []);


    return (
        <Provider store={store}>
            <Overlay />
            
      
            <Router>
                <ScrollToTop />
                <Switch>
               
                
                    <Route path="/" component={Layout}>
                    </Route>
                  

                </Switch>
            </Router >
        </Provider>
    );
}




export default App;
