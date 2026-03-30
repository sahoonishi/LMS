import {apiSlice} from "../api/apiSlice";
import { userRegistration } from "./authSlice";

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
                url:'register',
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
                url:"activateuser",
                method:"POST",
                body:{
                    activationToken,
                    activationCode
                },
                credentials:"include"                
            })
        })        
    })
})

export const {useRegisterUserMutation,useActivationMutation} = authApi;