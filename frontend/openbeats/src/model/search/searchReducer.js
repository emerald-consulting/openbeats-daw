
const initialState={
    searchText:'',
    showAllSearchCount:0,
    selectedPost:null,
    selectedUserId:0
}

const searchReducer=(state=initialState,action)=>{
    switch(action.type){
        case 'UPDATE_SEARCH':{
            return {
                ...initialState,searchText:action.value
            }
        }
        case 'SHOW_ALL_SEARCH':{
            return {
                ...initialState,searchText:state.searchText,showAllSearchCount:state.showAllSearchCount+1,selectedPost:null,selectedUserId:0
            }
        }
        case 'SELECT_POST':{
            return {
                ...initialState,selectedPost:action.value,showAllSearchCount:0,selectedUserId:0
            }
        }
        case 'SELECT_PROFILE':{
            return {
                ...initialState,selectedUserId:action.value,showAllSearchCount:0,selectedPost:null
            }
        }
        case 'CLEAR_ALL_SEARCH':{
            return {...initialState}
        }
        default:{
            return {...initialState}
        }
    }
}

export default searchReducer;