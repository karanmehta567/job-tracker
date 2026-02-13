import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { InitializeUser } from "./init-user";
import Connect2DB from "./db";

const mongooseInstance=await Connect2DB();
const client=mongooseInstance.connection.getClient()
const db=client.db()

export const auth = betterAuth({
    database: mongodbAdapter(db,{
        client
    }),
    session:{
        cookieCache:{
            enabled:true,
            maxAge:60*60
        }
    },
    emailAndPassword:{
        enabled:true
    },
    databaseHooks:{
        user:{
            create:{
                after:async(user)=>{
                    if(user.id){
                        await InitializeUser(user.id)
                    }
                }
            }
        }
    }
});

export async function GetSession(){
    const result=await auth.api.getSession({
        headers:await headers()
    })
    return result
}
export async function SignOut(){
    const result=await auth.api.signOut({
        headers:await headers()
    })
    if(result.success){
        redirect("/sign-in")
    }
}