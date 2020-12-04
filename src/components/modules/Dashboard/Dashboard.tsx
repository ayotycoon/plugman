import React, { useEffect, useState } from 'react'
import './Dashboard.scss';
import { connect } from 'react-redux'
import { setTitle } from '../../../store/actions/app.action'
import * as storage from '../../../Providers/storage.service'
import AsyncImage from '../../misc/AsyncImage/AsyncImage';
import { CONSTANTS } from '../../../env';
import { Link } from 'react-router-dom';
import Help from '../../misc/Help/Help';

function getGreeting() {
    const hours = new Date().getHours()

    if (hours < 12) {
        return 'Good Morning';
    } else if (hours < 16) {
        return 'Good Afternoon';
    } else if (hours < 21) {
        return 'Good Evening';
    } else {
        return 'Good Night';
    }



}

function Dashboard(props: any) {
    const [data, setData] = useState(false);
    const [helpMessage, setHelpMessage] = useState(getGreeting())

    useEffect(() => {
        props.setTitle('Dashboard');
    


    }, [])
    const user = props.app.userData;


    return (
        <>
        <div className='row'>
                <div style={{ borderRadius: '30px' }} className='bg-primary text-white col-12 col-md-6'>
                   <div className='p-3'>
                        <h3>
                            {helpMessage}
                            <br />
    Ready to get started !
</h3>
                   </div>

                </div>
        </div>

     
        </>
    )
}


const mapStateToProps = (state: any) => ({

    app: state.app,
    notifications: state.notifications
})


export default connect(mapStateToProps, { setTitle })(Dashboard)