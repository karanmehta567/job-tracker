'use client'
import { signOut } from "@/lib/auth-client";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function SignOutButton(){
    const router=useRouter()
    return(
        <DropdownMenuItem onClick={async()=>{
            const response=await signOut()
                if(response.data?.success){
                    router.push("/sign-in")
                }else{
                    alert("Error signing out")
                }
        }}>
            Log out
        </DropdownMenuItem>
    )
}