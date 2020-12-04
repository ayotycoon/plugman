import React from 'react'


function Empty(props: any) {


    return (
        <div className={'Empty text-info text-center'} >

            {!props.data.length ?

                <div onClick={props.onAction} className='text-center p-2 d-inline-block'>
                    <br />
                    <br />
                    {props.type === 'forms' && <div>
                        <i style={{fontSize: '100px', transform: 'rotate(180deg)'}} className='fa fa-box-open'></i>
                        <br />
                        <br />
No Forms  found, click anywhere this text or  <i className='fa fa-plus'></i> to create a new form
                    </div>}





                    {props.type === 'dashboard-forms' && <div>
                        <i style={{fontSize: '100px', transform: 'rotate(180deg)'}} className='fa fa-box-open'></i>
                        <br />
                        <br />
No Forms  To explore at this time, please check back later
                    </div>}



                    {props.type === 'templates' && <div>
                        <i style={{fontSize: '100px'}} className='fa fa-plug'></i>
                        <br />
                        <br />
No Templates found
                    </div>}
                    {props.type === 'form-analytics' && <div>
                        <i style={{fontSize: '100px'}} className='fa fa-plug'></i>
                        <br />
                        <br />
No form analytics found
                    </div>}
                    {props.type === 'form-analytics-year' && <div>
                        <i style={{fontSize: '100px'}} className='fa fa-plug'></i>
                        <br />
                        <br />
No form analytics found for this year
                    </div>}



                    {props.type === 'documents' && <div>
                        <i style={{fontSize: '100px'}} className='fa fa-layer-group'></i>
                        <br />
                        <br />
No Documents  found, click anywhere this text or  go to Dashboard to apply to a form
                    </div>}
                   

                    
                  
                </div> : ''}



        </div>
    )


}


export default Empty;
