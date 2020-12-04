
export const types = {
   SETTITLE : 'SETTITLE',
   SETAPPFONT : 'SETAPPFONT',
    SETUSERDATA : 'SETUSERDATA',
    SETDARKMODE : 'SETDARKMODE',
    SETFINISHEDAUTHENTICATIONATTEMPT: 'SETFINISHEDAUTHENTICATIONATTEMPT'
}
const isPc = window.innerWidth > 800;
export const setTitle = (data: any) => (dispatch: any) => {
  let title = data.title || data
  const image = data.image || ''
  const icon = data.icon || ''
    document.title = `${title}   - Inngle `;

    if(!isPc && title.length > 20){
        title = (title as string).substring(0, 20) + ' ...'

    }
        dispatch({
            type: types.SETTITLE,
            payload: {title, image, icon}
        })



   
}
export const setAppFont = (id: any) => (dispatch: any) => {
   




    


        dispatch({
            type: types.SETAPPFONT,
            payload: id
        })



   
}
export const setUserData = (data: any) => (dispatch: any) => {
  

        dispatch({
            type: types.SETUSERDATA,
            payload: data
        })



   
}
export const setFinishedAuthenticationAttempt = () => (dispatch: any) => {
  

        dispatch({
            type: types.SETFINISHEDAUTHENTICATIONATTEMPT
        })



   
}
export const toggleDarkMode = () => (dispatch: any) => {
    

        dispatch({
            type: types.SETDARKMODE
        })



   
}

