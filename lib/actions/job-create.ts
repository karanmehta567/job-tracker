"use server"
import { revalidatePath } from "next/cache"
import { GetSession } from "../auth"
import Connect2DB from "../db"
import { Board, Column, JobApplication } from "../models"

interface CreateJobApplicationData{
    company:string,
    position:string,
    location?:string,
    salary?:string,
    jobUrl?:string,
    tags?:string[],
    description?:string,
    notes?:string,
    columnId:any,
    boardId:any
}
export async function CreateJobApplicationServerAction(data:CreateJobApplicationData){
    const session=await GetSession()
    if(!session?.user){
        return {error:'Unauthorized!'}
    }
    await Connect2DB()
    const {
        company,
        position,
        location,
        salary,
        jobUrl,
        tags,
        description,
        notes,
        columnId,
        boardId
    }=data
    if(!company || !position || !columnId || !boardId){
        return {error:'Fields missing'}
    }
    // Verify board ownership
    const board=await Board.findOne({
        _id:boardId,
        userId:session.user.id
    })
    if(!board){
        return {error:'Board not found or user not authorized'}
    }
    // Verify col belong to that board
    const column=await Column.findOne({
        _id:columnId,
        boardId:boardId
    })
    if(!column){
        return {error:'Column not found'}
    }
    const maxOrder=(await JobApplication.findOne({columnId}).sort({order:-1}).select("order").lean()) as {order:number}|null
    const jobApplication=await JobApplication.create({
        company,
        position,
        location,
        salary,
        jobUrl,
        tags:tags || [],
        description,
        notes,
        userId:session.user.id,
        columnId,
        boardId,
        status:'applied',
        order:maxOrder?maxOrder.order+1:0
    })
    // We have col collection- and it has jobApplication sub-field, ref to it and store the id of upper inside col collection
    await Column.findByIdAndUpdate(columnId,{
        $push:{jobApplications:jobApplication._id}
    })
    revalidatePath('/dashboard')
    return {data:JSON.parse(JSON.stringify(jobApplication))}
}
export async function DeleteJobApplication(id:any){
    const session=await GetSession();
    if(!session?.user){
        return {error:'Unauthorized'}
    }
    const jobApplication=await JobApplication.findById(id);
    if(!jobApplication){
        return {error:'No Job Application with this ID found in database'}
    }
    if(jobApplication.userId!==session.user.id){
        return {error:'Unauthroized to delete the job profile'}
    }
    await Column.findByIdAndUpdate(jobApplication.columnId,{
        $pull:{jobApplications:id}
    })
    await JobApplication.deleteOne({_id:id})
    revalidatePath('/dashboard')
    return {success:true}
}
export async  function UpdateJobApplication(id:any,updates:{
    company?:string,
    position?:string,
    location?:string,
    salary?:string,
    jobUrl?:string,
    tags?:string[],
    description?:string,
    notes?:string,
    columnId?:any,
    order?:number
}){
    const session=await GetSession();
    if(!session){
        return {error:'Unauthorized'}
    }
    const jobApplication=await JobApplication.findById(id)
    if(!jobApplication){
        return {error:'No Job Application with id found'}
    }
    if(jobApplication.userId!==session.user.id){
        return {error:'Unauthorized'}
    }
    const {columnId,order,...otherUpdates}=updates
    const updatesToApply:Partial<{
        company?:string,
        position?:string,
        location?:string,
        salary?:string,
        jobUrl?:string,
        tags?:string[],
        description?:string,
        notes?:string,
        columnId:any,
        order?:number
    }>=otherUpdates

    const currentColumnId=jobApplication.columnId.toString()
    const newColumnId=columnId?.toString()
    
    const isMovingtoDifferenetColumn=newColumnId&&newColumnId!==currentColumnId
    if(isMovingtoDifferenetColumn){
        await Column.findByIdAndUpdate(currentColumnId,{
            $pull:{jobApplication:id}
        }) 
    const jobsinTragetColumns=await JobApplication.find({
        columnId:newColumnId,
        _id:{$ne:id}
    }).sort({order:1}).lean()
    let newOrderValue: number;
    if(order!==undefined && order!==null){
        newOrderValue=order*100

        const jobsthatneedtoshift=jobsinTragetColumns.slice(order)
        for (const job of jobsthatneedtoshift){
            await JobApplication.findByIdAndUpdate(job._id,{
                $set:{order:job.order+100}
            })
        }
    }else{
        if(jobsinTragetColumns.length>0){
            const lastJobOrder=jobsinTragetColumns[jobsinTragetColumns.length-1].order || 0
            newOrderValue=lastJobOrder+100
        }else{
            newOrderValue=0
        }
    }
    updatesToApply.columnId=newColumnId
    updatesToApply.order=newOrderValue
    await Column.findByIdAndUpdate(newColumnId,{
        $push:{jobApplications:id}
    })} 
    else if(order!==undefined && order!==null){
        const otherJobsinColumns=await JobApplication.find({
            columnId:currentColumnId,
            _id:{$ne:id}
        }).sort({order:1}).lean()
        const currentJobOrder=jobApplication.order || 0
        const currentPositionIndex=otherJobsinColumns.findIndex((job)=>job.order>currentJobOrder)
        const oldPositionIndex=currentPositionIndex===-1?otherJobsinColumns.length:currentPositionIndex    
        const newOrderValue=order*100
        if(order<oldPositionIndex){
            const jobsToShiftDown=otherJobsinColumns.slice(order,oldPositionIndex)
            for(const job of jobsToShiftDown){
                await JobApplication.findByIdAndUpdate(job._id,{
                $set:{order:job.order+100}
            })
            }
        }else if(order>oldPositionIndex){
            const jobsToShiftUp=otherJobsinColumns.slice(oldPositionIndex,order)
            for(const job of jobsToShiftUp){
                const newOrder=Math.max(0,job.order-100)
                await JobApplication.findByIdAndUpdate(job._id,{
                $set:{order:newOrder}
            })
        }
    }
    updatesToApply.order=newOrderValue
    }
    const updated=await JobApplication.findByIdAndUpdate(id,updatesToApply,{
        new:true
    })
    revalidatePath('/dashboard')
    return {data:JSON.parse(JSON.stringify(updated))}
}