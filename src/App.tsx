import React, { useEffect } from 'react';
import './App.scss';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import { store, Provider } from './store'
import { monaco } from '@monaco-editor/react';

import Layout from './components/Layout/Layout';
import Overlay from './components/misc/Overlay/Overlay';


const log = console.log;
console.log = (...args : any) => {

   if(process.env.NODE_ENV !== 'development'){
    return
   }
    log(...args);

}

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
                { foreground: '000000' }
            ],
        }
        monaco.editor.defineTheme('plugman-light', theme)

    
})

function App() {
    useEffect(() => {
 
        
        return () => {
        
        };
    }, []);


    return (
        <Provider store={store}>
            <Overlay />
            
      
            <Router>
                
                <Switch>
               
                
                    <Route path="/" component={Layout}>
                    </Route>
                  

                </Switch>
            </Router >
        </Provider>
    );
}




export default App;
