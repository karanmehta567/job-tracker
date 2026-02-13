import KanbanBoard from "@/components/kaban-board"
import { GetSession } from "@/lib/auth"
import Connect2DB from "@/lib/db"
import { Board } from "@/lib/models"
import { redirect } from "next/navigation"
import { Suspense } from "react"

async function getBoard(userId:string){
    "use cache"
    await Connect2DB();
    // get board
    const boardDoc=await Board.findOne({
        userId:userId,
        name:'Job Hunt'
    }).populate({
        path:'columns',
        populate:{
            path:'jobApplications'
        }
    })
    if(!boardDoc){
        return null
    }
    const board=JSON.parse(JSON.stringify(boardDoc))
    return board
}
async function DashboardWrapper(){
    const session=await GetSession()
    if(!session?.user){
        return redirect('/sign-in')
    }
    const board=await getBoard(session?.user.id??"")
    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-black">{board.name}</h1>
                    <p className="text-gray-600">Track your job applications</p>
                </div>
                <KanbanBoard board={board} userId={session.user.id}/>
            </div>
        </div>
    )
}
export default async function Dashboard(){
    return (
        <Suspense fallback={<p className="flex items-center justify-center h-screen border text-lg font-bold px-5 py-5">Loading.....</p>}>
            <DashboardWrapper/>
        </Suspense>
    )
}