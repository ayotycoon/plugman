import React from 'react'
import SquareDiv from '../SquareDiv/SquareDiv';
import './Loading.scss'


function Loading(props: any) {


    return (
        <div className='Loading animated fadeIn'>
            {props.type && props.type == 1 && <div className='row'>
                {[1, 2, 3].map((index) => {
                    return (

                        <div key={index} className='col-md-4 col-lg-3 mt-2'>
                            <div className='image rounded'>
                                <SquareDiv>


                                </SquareDiv>
                            </div>
                            <div className='pt-2'>
                                <div className='text rounded'></div>

                                <div className='text rounded mt-2'></div>

                            </div>




                        </div>



                    )
                })}
            </div>}


            {props.type && props.type == 2 && <div className='row'>
                {[1, 2, 3].map((index) => {
                    return (

                        <div key={index} className='col-md-6 col-lg-4 col-xl-3'>
                            <div className='image rounded'>

                                <SquareDiv>


                                </SquareDiv>
                                <br />
                                <br />
                                <br />
                            </div>
                        </div>



                    )
                })}
            </div>}


            {props.type && props.type == 3 && <div className='row'>
                {[1, 2, 3].map((index) => {
                    return (
                        <div key={index} className='col-md-4 col-lg-3 mt-2'>
                            <div className='image rounded notif'>

                            </div>
                        </div>)
                })}
            </div>}


            {props.type && props.type == 4 && <div className='row'>
                {[1, 2, 3].map((index) => {
                    return (

                        <div key={index} className='col-md-4 col-lg-3 mt-2'>
                            <div className='image rounded'>
                                <SquareDiv>

                                </SquareDiv>
                                <SquareDiv>

                                </SquareDiv>


                            </div>
                        </div>



                    )
                })}
            </div>}



            {!props.type && <div className='text-center'><img src='/assets/loader.svg' /></div>}



        </div>
    )

}


export default Loading
