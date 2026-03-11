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
                url:'registration',
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
        })        
    })
})