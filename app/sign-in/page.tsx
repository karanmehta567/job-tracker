'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "@/lib/auth-client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignUpRoute(){
    const [email,setemail]=useState("")
    const [password,setpassword]=useState("")

    const [error,seterror]=useState("")
    const [loading,setloading]=useState(false)
    const router=useRouter()

    async function HandleSubmit(e:React.FormEvent){
        e.preventDefault()

        seterror("")
        setloading(true)

        try {
            const response=await signIn.email({
                email,password
            })
            if(response.error){
                seterror(response.error.message??'Could not sign-in user')
            }else{
                router.push("/dashboard")
            }
        } catch (error) {
            seterror("An error occured while signing in")
        }finally{
            setloading(false)
        }
    }
    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white p-4">
            <Card className="w-full max-w-md border-gray-200 shadow-lg">
                <CardHeader className="space-y-1 flex items-center justify-center flex-col">
                    <CardTitle className="text-2xl font-bold text-black">Sign in</CardTitle>
                    <CardDescription className="text-gray-600">Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <form onSubmit={HandleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                            {error}
                        </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input placeholder="you@example.com" required id="email" type="text" className="border-gray-300 focus:border-primary focus:ring-primary" onChange={(e)=>setemail(e.target.value)} value={email}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input placeholder="********" required id="password" type="password" minLength={8} className="border-gray-300 focus:border-primary focus:ring-primary" onChange={(e)=>setpassword(e.target.value)} value={password}/>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 mt-4">
                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                            {loading?(
                                'Signing user...'
                            ):(
                                'Sign in'
                            )}
                        </Button>
                        <p className="text-center text-sm text-gray-600">Do not have an account? <Link href={'/sign-up'} className="font-medium text-primary hover:underline">Sign up</Link></p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}