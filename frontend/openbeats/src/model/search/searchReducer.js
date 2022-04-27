import { createSlice } from '@reduxjs/toolkit'

export const searchSlice = createSlice({
    name: 'search',
    initialState: {
        searchText: '',
        showAllSearchCount: 0,
        selectedPost: null,
        selectedUserId: 0
    },
    reducers: {
        updateSearch: (state, action) => {
            state.searchText = action.payload;
        },
        showAllSearch: (state, action) => {
            state.searchText=state.searchText;
            state.showAllSearchCount = state.showAllSearchCount + 1
            state.selectedPost = null;
            state.selectedUserId = 0
        },
        selectPost: (state, action) => {
            state.selectedPost = action.payload
            state.showAllSearchCount = 0;
            state.selectedUserId = 0;
        },
        selectProfile: (state, action) => {
            state.searchText='';
            state.selectedUserId = action.payload
            state.showAllSearchCount = 0
            state.selectedPost = null
        },
        clearAllSearch: (state, action) => {
            state.searchText = '';
            state.showAllSearchCount = 0;
            state.selectedPost = null;
            state.selectedUserId = 0;
        },
    }
})

export const { updateSearch, showAllSearch, selectPost, selectProfile, clearAllSearch } = searchSlice.actions

export default searchSlice.reducer


// const initialState={
//     searchText:'',
//     showAllSearchCount:0,
//     selectedPost:null,
//     selectedUserId:0
// }

// const searchReducer=(state=initialState,action)=>{
//     switch(action.type){
//         case 'UPDATE_SEARCH':{
//             return {
//                 ...initialState,searchText:action.value
//             }
//         }
//         case 'SHOW_ALL_SEARCH':{
//             return {
//                 ...initialState,searchText:state.searchText,showAllSearchCount:state.showAllSearchCount+1,selectedPost:null,selectedUserId:0
//             }
//         }
//         case 'SELECT_POST':{
//             return {
//                 ...initialState,selectedPost:action.value,showAllSearchCount:0,selectedUserId:0
//             }
//         }
//         case 'SELECT_PROFILE':{
//             return {
//                 ...initialState,selectedUserId:action.value,showAllSearchCount:0,selectedPost:null
//             }
//         }
//         case 'CLEAR_ALL_SEARCH':{
//             return {...initialState}
//         }
//         default:{
//             return {...initialState}
//         }
//     }
// }

// export default searchReducer;