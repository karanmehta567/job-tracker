"use client"
import { IBoard } from "@/lib/models/Board";
import { IColumn } from "@/lib/models/column";
import { useEffect, useState } from "react";

export function UseBoard(initialBoard?:IBoard|null){
    const [board,SetBoard]=useState<IBoard|null>(initialBoard|| null)
    const [columns,SetColumns]=useState<IColumn[]>(initialBoard?.columns as any||[])
    const [error,SetError]=useState<string|null>(null)

    useEffect(()=>{
        if(initialBoard){
            SetBoard(initialBoard),
            SetColumns(initialBoard.columns as any ||[])
        }
    },[initialBoard])
    async function moveJob(jobApplicationId:string,newColumnId:string,newOrder:number){
        // Find the job and its current column
        let job:any = null;
        columns.forEach((col) => {
            const found = col.jobApplications?.find((j:any) => (j._id?.toString?.() ?? j._id) === jobApplicationId);
            if (found) {
                job = found;
            }
        });
        if (!job) return;
        // Remove job from ALL columns to prevent duplicates
        const newColumns = columns.map((col) => {
            return {
                ...col,
                jobApplications: col.jobApplications.filter((j:any) => (j._id?.toString?.() ?? j._id) !== jobApplicationId)
            };
        });
        // Insert into new column at newOrder
        const toColumnIdx = newColumns.findIndex(col => (col._id?.toString?.() ?? col._id) === newColumnId);
        if (toColumnIdx === -1) return;
        const toCol = newColumns[toColumnIdx];
        let updatedJobs = Array.isArray(toCol.jobApplications) ? [...toCol.jobApplications] : [];
        const updatedJob = { ...job, columnId: newColumnId };
        updatedJobs.splice(newOrder, 0, updatedJob);
        const jobsWithOrder = updatedJobs.map((j, idx) => ({ ...j, order: idx }));
        (newColumns as any)[toColumnIdx] = { ...toCol, jobApplications: jobsWithOrder };
        SetColumns(newColumns as any);
    }
    return {board,columns,error,moveJob}
}