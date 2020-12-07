import React from 'react'


export default function Blank(props: any) {
    const isPc = window.innerWidth > 800;

    return (
        <div style={{
            height: 'calc(100vh - 200px)',
            display: 'flex',
            alignItems: isPc ? 'center': '',

            //    justifyContent: 'center'
        }}>

            <div className={'change-in-dark-1 ' + (isPc ? 'p-4' : '' )}>
             

                <span className='h3 d-block text-center'>Open a Request</span>
                    <br />
                <br />

                <div className='row'>
                    <div className='mb-3 col-md-6'>
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
                    <div className='mb-3 col-md-6'>
                        <b className='h4'>Testing with socketio demo server </b>
                        <ul className='h6 mt-2'>
                            <li className='mb-2'>Connect  to socket url <code className='small'>https://socketio-chat-h9jt.herokuapp.com/</code></li>
                            <li className='mb-2'>create a listen request <code className='small'>new message</code></li>
                            <li className='mb-2'>Make an emit request  <code className='small'>add user</code> with message body as your username</li>
                            <li className='mb-2'>Make another emit request  <code className='small'>new message</code> with message body</li>
                     <li className='mb-2'> You will not see the <code className='small'>new message</code>  listener emitted back because the demo server does not send back your requests but you will see the messages of other people streaming down the activity bar  </li>
                     </ul>

                    </div></div>
          
            

            </div>
        </div>
    )
}