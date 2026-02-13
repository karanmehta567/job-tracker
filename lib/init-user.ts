import Connect2DB from "./db";
import {Board,Column} from './models'

const DEFAULT_Columns=[
    {
        name:"Wish List",
        order:0
    },
    {
        name:"Applied",
        order:1
    },
    {
        name:"Interviewing",
        order:2
    },
    {
        name:"Offer",
        order:3
    },
    {
        name:"Rejected",
        order:4
    }
]
export async function InitializeUser(userId:string){
    try {
        await Connect2DB()
        //  check if board already exists
        const exisitingResult=await Board.findOne({userId,name:'Job Hunt'})
        if(exisitingResult){
            return exisitingResult
        }
        // Create the Board
        const board=await Board.create({
            name:'Job Hunt',
            userId,
            columns:[]
        })
        // Create Columns
        const createdColumns=await Promise.all(
            DEFAULT_Columns.map((col)=>Column.create({
                name:col.name,
                order:col.order,
                boardId:board._id,
                jobApplications:[]
            }))
        )
        // Save the board collection info after doing everything
        board.columns=createdColumns.map((col)=>col._id)
        await board.save()

        return board;
    } catch (error) {
        throw error
    }
}