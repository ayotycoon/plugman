import React from 'react'

export default function TypePill(props: any){
    return(
        <small style={{width:'45px',verticalAlign:'top',marginTop:'-2px'}} className={'d-inline-block p-1  font-weight-bold ' + (props.type == 'emit' ? 'text-primary' : 'text-secondary')} >{ props.type}</small>
    )
}