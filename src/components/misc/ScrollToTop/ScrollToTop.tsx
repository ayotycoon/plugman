import React, { Component } from 'react';
import { withRouter } from "react-router-dom";

let lastBack = ''
window.addEventListener('popstate', e => {
    lastBack = window.location.pathname;

})

class ScrollToTop extends Component {
    props: any;
    myRef: any;


    constructor(props: any) {
        super(props)
        this.props = props;
        this.myRef = React.createRef();
    }
    componentDidMount() {

        this.sanitizeHash(this.props);
    }
    sanitizeHash(prop: any) {
        const hash = prop.location.hash


        setTimeout(() => {

            if (hash == '#add') {


                (document.querySelector('.add') as HTMLDivElement | null)?.click()
            }
        }, 1000);

    }
    componentDidUpdate(prevProps: any) {


        if (
            (this.props.location.pathname !== prevProps.location.pathname) && (this.props.location.pathname !== lastBack)



        ) {
   

                this.sanitizeHash(this.props);
         
            window.scrollTo(0, 0);
            const searchObj = new URLSearchParams(prevProps.location.search || this.props.location.search)

            const nextRouteParams = {

                previous: (prevProps.location.pathname || '').replace('/', ''),
                current: (this.props.location.pathname || '').replace('/', ''),
            }

            // @ts-ignore
            for (let entry of searchObj) { // each 'entry' is a [key, value] tupple

                const [key, value] = entry;

                if (key === 'current' || key === 'previous') {
                    continue
                }
                // @ts-ignore
                nextRouteParams[key] = value;
            }

            const serialize = new URLSearchParams(nextRouteParams).toString();

            window.history.replaceState(null, '', window.location.pathname + (this.props.location.hash ? this.props.location.hash : '') + `?${serialize}`);


        }
    }
    render() {
        return (
            <div>

            </div>
        );
    }
}



export default withRouter(ScrollToTop);
