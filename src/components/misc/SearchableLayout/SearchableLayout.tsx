import React, { useState, useRef, useEffect } from 'react'
import { DebounceTime } from '../../../Providers/helpers'
import DropdownClick from '../DropdownClick/DropdownClick';


function SearchableLayout(props: any) {
    const tabs: string[] = props.tabs || [];
    const [currTab, setCurrTab] = useState(tabs[0])
    const [search, setSearch] = useState('');
    const debounceSearch = useRef(new DebounceTime()).current
    function funSetCurrTab(_tab: string) {
        setCurrTab(_tab)
        if (props.onChangeTab) {
            props.onChangeTab(_tab)
        }

    }



    function funSetSearch(value: string) {
        setSearch(value)
        if (props.onSearch) {
            debounceSearch.start(() => props.onSearch(value), 1000)
        }

    }


    useEffect(() => {
        const intro = props.intro
        if (!intro || !intro.data) {
            return
        }

        const introData = intro.data as any[];
        introData.forEach((_: any) => {

            const el: HTMLDivElement | null = document.querySelector(`[intro-key='${_.introKey}']`)
            if (!el) {
                console.log('not found')
                return
            }
            el.setAttribute(`${intro.stage}-data-intro`, _.dataIntro);
            el.setAttribute(`${intro.stage}-data-step`, _.dataStep);
        })
        return () => {

        }
    }, [])
    return (
        <div className={'SearchableLayout '} >
            <div className='row mb-3'>
                {!props.hideSearch && <div className={'col-12 order-2 order-lg-1 mt-1 ' + (tabs.length > 0 ? 'col-lg-10' : '')}>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            {props.add && <span intro-key='add' onClick={props.onAdd} className="input-group-text add">

                                <i className='fa fa-plus'></i>

                            </span>}
                        </div>
                        <input value={search} onChange={(e: any) => { const value = e.target.value; funSetSearch(value) }} placeholder={props.placeholder} className='form-control' />
                    </div>
                </div>}
                {tabs.length > 0 && <div className='col-12 order-1 order-lg-2  col-lg-2  mt-1'>
                    <div intro-key='1' className=' border-bottom text-center'>
                        <DropdownClick block={true}>
                            <h5 className='cursor font-weight-bold change-in-dark-1'>{currTab}
                            
                            <i className='fa fa-angle-down ml-2'></i>
                            </h5>
                            <div className='bg-white border rounded p-2 change-in-dark-1'>

                        
                                {tabs.map((tab, i) => <h5 intro-key={(i + 1) + ''} key={i} onClick={() => funSetCurrTab(tab)} className={'cursor dropdown-click-close pb-3  ' + (currTab === tab ? 'border-bottom border-primary text-primary ' : '')}>
                                    
                                    
                                    {tab}</h5>)}
                            </div>
                        </DropdownClick>
                        

                    </div>
                </div>}

            </div>

            {props.children}

            {props.more ? <div className='text-center'>
                <br />
                <button onClick={props.onMore} className='btn btn-sm btn-default border'>
                    Load More
                         </button>
            </div> : ''}



        </div>
    )


}


export default SearchableLayout;
