import { createSlice } from "@reduxjs/toolkit";

const initialState={
    user:"",
    token:""
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        userRegistration:(state,action)=>{
            state.token = action.payload.token;
        },
        userLoggedIn:(state,action)=>{
            state.token = action.payload.accessToken;
            state.user = action.payload.user;
        },
        userLoggedout:(state)=>{
            state.token = "";
            state.user = "";
        }
    }
})

export const {userRegistration,userLoggedIn,userLoggedout} = authSlice.actions;
export default authSlice.reducer;