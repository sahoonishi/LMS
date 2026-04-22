import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState={
    user:"",
    token:""
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        userRegistration:(state,action:PayloadAction<{token: string}>)=>{
            state.token = action.payload.token;
        },
        userLoggedIn:(state,action:PayloadAction<{accessToken: string, user: any}>)=>{
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