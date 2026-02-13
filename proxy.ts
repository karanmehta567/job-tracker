import { NextRequest, NextResponse } from "next/server";
import { GetSession } from "./lib/auth";

export default async function proxy(req:NextRequest){
    const session=await GetSession()
    // check if on dash page
    // const CheckIfOnDashboard=req.nextUrl.pathname.startsWith("/dashboard")
    // if(CheckIfOnDashboard && !session?.user){
    //     return NextResponse.redirect(new URL("/sign-in",req.url))
    // }
    const CheckIfOnSignUp=req.nextUrl.pathname.startsWith("/sign-up")
    const CheckIfOnSignIn=req.nextUrl.pathname.startsWith("/sign-in")
    if((CheckIfOnSignIn||CheckIfOnSignUp) &&session?.user){
        return NextResponse.redirect(new URL("/dashboard",req.url))
    }
    return NextResponse.next()
}