import {apiSlice} from "../api/apiSlice";
import { userLoggedIn, userRegistration } from "./authSlice";

type UserRegistrationResponse = {
    message: string;
    token: string;
}

type UserRegistrationData = {
    [key: string]: any;
}

export const authApi = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        // endpoint for user registration
        registerUser:builder.mutation<UserRegistrationResponse, UserRegistrationData>({
            query:(data: UserRegistrationData)=>({
                url:'/user/register',
                method:"POST",
                body:data,
                credentials:"include",
            }),
            async onQueryStarted(arg:{}, {queryFulfilled, dispatch}: {queryFulfilled: Promise<any>, dispatch: any}){
                try {
                    const result = await queryFulfilled;
                    dispatch(userRegistration({token:result.data.activationToken}));
                } catch (error:any) {
                    console.log(error);
                }
            }
        }),
        activation:builder.mutation({
            query:({activationToken,activationCode})=>({
                url:"/user/activateuser",
                method:"POST",
                body:{
                    activationToken,
                    activationCode
                },
                credentials:"include"                
            })
        }),
        login:builder.mutation({
            query:({email,password})=>({
                url:"/user/login",
                method:"POST",
                body:{
                    email,
                    password
                },
                credentials:"include"
            }),
            async onQueryStarted(arg,{queryFulfilled,dispatch}){
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({accessToken:result.data.accessToken,user:result.data.user}));
                } catch (error:any) {
                    console.log(error);
                }
            }
        })        
    })
})

export const {useRegisterUserMutation,useActivationMutation,useLoginMutation} = authApi;