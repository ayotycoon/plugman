import React from 'react'

export default function TypePill(props: any){
    return(
        <small className={'p-1  font-weight-bold ' + (props.type == 'emit' ? 'text-primary' : 'text-secondary')} >{ props.type}</small>
    )
}