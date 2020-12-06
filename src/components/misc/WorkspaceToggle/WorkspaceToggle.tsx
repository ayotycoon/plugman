import React from 'react'
import { prompter } from '../../../Providers/core.service'
import WorkspaceService from '../../../Providers/Workspace.service'
import DropdownClick from '../DropdownClick/DropdownClick'


export default function WorkspaceToggle(props: any) {
    const activeWorkspace = WorkspaceService.getActiveWorkspaceKey()
    const workspaces = WorkspaceService.getWorkspaces()
    function changeWorkspace(key: string){
        WorkspaceService.changeWorkspace(key)

    }
    async function addWorkspace(){
        const name: any = await prompter('Enter workspace name')
        WorkspaceService.addWorkspace(name)

    }
    
    return (
        <span className='d-inline-block' style={{verticalAlign: 'top'}}>
            <DropdownClick style={{ width: '156px', top: '5px', position: 'relative' }} childBlock={true}>
            <small className='d-block bg-primary cursor font-weight-bold border rounded p-1 text-white '>
                <i className='fa fa-th'></i> {workspaces[activeWorkspace].name}  <i className='float-right mt-1 fa fa-angle-down ml-2'></i>
            </small>

            <div className='dropdown-click-close change-in-dark-1 border rounded bg-white '>
                {(Object.values(workspaces) as any[]).map((w, i) => <small key={i} onClick={()=>changeWorkspace(w.key)} className='p-1 cursor d-block hover-collection'>{w.name}</small>)}



                <small onClick={()=>addWorkspace()} className='p-1 cursor d-block hover-collection text-right'><i>Create new</i> <i className='fa fa-plus'></i></small>

            </div>

        </DropdownClick>
        </span>
    )
}