import React from 'react'


export default function Blank(props: any) {


    return (
        <div style={{
            height: 'calc(100vh - 200px)',
            display: 'flex',
            alignItems: 'center',

            //    justifyContent: 'center'
        }}>

            <div className='change-in-dark-1 p-4'>

                <span className='h3 d-block text-center'>Open a Request</span>
                    <br />
                <br />

                <div className='row'>
                    <div className='col-6 col-md-6'>
                        <b className='h4'>How to use</b>
                        <ul className='h6 mt-2'>
                            <li className='mb-2'>Connect  to socket url</li>

                            <li className='mb-2'>Make an emit request </li>
                            <li className='mb-2'>create a listen request</li>
                            <li className='mb-2'>Receive the request from your server and emit back the listen event</li>

                            <li className='mb-2'> Emit the <code>emit</code> request </li>
                            <li className='mb-2'>Listen to the <code>listen</code> request</li>
                        </ul>

                    </div>
                    <div className='col-6 col-md-6'>
                        <b className='h4'>Using the official demo server </b>
                        <ul className='h6 mt-2'>
                            <li className='mb-2'>Connect  to socket url <code className='small'>https://socketio-chat-h9jt.herokuapp.com/</code></li>
                            <li className='mb-2'>create a listen request <code className='small'>new message</code></li>
                            <li className='mb-2'>Make an emit request  <code className='small'>add user</code> with message body as your username</li>
                            <li className='mb-2'>Make another emit request  <code className='small'>new message</code> with message body</li>
                          
         
                            <li className='mb-2'> Watch the activity bar listen to your events as you emit the <code className='small'>message</code> request </li>
                       </ul>

                    </div></div>
          
            

            </div>
        </div>
    )
}