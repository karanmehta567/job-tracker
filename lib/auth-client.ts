import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: "https://jobflow-lemon.vercel.app/"
})
export const {signUp,signIn,useSession,signOut}=authClient