import React from 'react'
import './Help.scss'





function Help(props:{
    style?: any,
    children: any,
    className?: any,
}) {
  
   return (
       <span style={props.style} className={props.className}>
{props.children}
       </span>
   )

}

export default Help;