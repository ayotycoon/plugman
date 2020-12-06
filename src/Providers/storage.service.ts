

const STORAGE_CONSTANTS = {
    DARK_MODE: 'dark-mode',
    DONT_ASK_DARK_MODE: 'DONT-ASK-dark-mode'
 

}



function setBodyDarkMode(mode: string | boolean) {
    const body = document.querySelector('body');

    if (!body) {
        return;
    }

    if (mode === 'true' || mode === true) {
        body.className = 'bg-app-dark';
    } else {
        body.className = 'bg-app-default';
    }

}





export const darkMode = {
    set: (mode: string) => {

        setBodyDarkMode(mode)

        return localStorage.setItem(STORAGE_CONSTANTS.DARK_MODE, mode)
    },
    get: () => {
        const mode = localStorage.getItem(STORAGE_CONSTANTS.DARK_MODE)
        // @ts-ignore
        setBodyDarkMode(mode)

        return mode
    }


}
export const dontAskDarkMode = {
    set: (mode: string) => {

 

        return localStorage.setItem(STORAGE_CONSTANTS.DONT_ASK_DARK_MODE, mode)
    },
    get: () => {
        const mode = localStorage.getItem(STORAGE_CONSTANTS.DONT_ASK_DARK_MODE)
        // @ts-ignore
 

        return mode
    }


}



