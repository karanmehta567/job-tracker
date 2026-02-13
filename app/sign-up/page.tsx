'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { signUp } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function SignUpRoute(){
    const [name,SetName]=useState("")
    const [email,SetEmail]=useState("")
    const [password,SetPassword]=useState("")

    const [error,seterror]=useState("")
    const [loading,setloading]=useState(false)
    const router=useRouter()

    async function handleSubmit(e:React.FormEvent){
        e.preventDefault()
        seterror("")
        setloading(true)
        try {
            const response=await signUp.email({
                name,
                email,
                password
            })
            if(response.error){
                seterror(response.error.message ?? 'Failed to sign-up')
            }else{
                router.push('/dashboard')
            }
        } catch (error) {
            seterror("An unexpected error occured")
        }finally{
            setloading(false)
        }
    }
    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white p-4">
            <Card className="w-full max-w-md border-gray-200 shadow-lg">
                <CardHeader className="space-y-1 flex items-center justify-center flex-col">
                    <CardTitle className="text-2xl font-bold text-black">Sign up</CardTitle>
                    <CardDescription className="text-gray-600">Create an account to access website</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                            {error}
                        </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input placeholder="John Doe" required id="name" type="text" className="border-gray-300 focus:border-primary focus:ring-primary"value={name} onChange={(e)=>SetName(e.target.value)}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input onChange={(e)=>SetEmail(e.target.value)} value={email} placeholder="you@example.com" required id="email" type="text" className="border-gray-300 focus:border-primary focus:ring-primary"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input onChange={(e)=>SetPassword(e.target.value)} value={password} placeholder="********" required id="password" type="password" minLength={8} className="border-gray-300 focus:border-primary focus:ring-primary"/>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 mt-4">
                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                            {loading?'Creating...':'Sign up'}
                        </Button>
                        <p className="text-center text-sm text-gray-600">Already have an account? <Link href={'/sign-in'} className="font-medium text-primary hover:underline">Sign in</Link></p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}