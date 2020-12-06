
export const types = {
   SETTITLE : 'SETTITLE',
   SETAPPFONT : 'SETAPPFONT',
    SETUSERDATA : 'SETUSERDATA',
    SETDARKMODE : 'SETDARKMODE',
    SETACTIVETREE : 'SETACTIVETREE',
 
}
const isPc = window.innerWidth > 800;
export const setTitle = (data: any) => (dispatch: any) => {
  let title = data.title || data
  const image = data.image || ''
  const icon = data.icon || ''
    document.title = `Plugman - ${title} `;

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
export const setActiveTree = (data: any) => (dispatch: any) => {
  

        dispatch({
            type: types.SETACTIVETREE,
            payload: data
        })



   
}

export const toggleDarkMode = () => (dispatch: any) => {
    

        dispatch({
            type: types.SETDARKMODE
        })



   
}

