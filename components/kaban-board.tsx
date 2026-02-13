"use client"

import { IBoard } from "@/lib/models/Board"
import { Award, CalendarHeart, CheckIcon, MicIcon, MoreHorizontal, TrashIcon, XIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import CreateJobApplication from "./CreateJobApplication"
import { IJobApplication } from "@/lib/models/JobApplication"
import { IColumn } from "@/lib/models/column"
import JobApplicationCard from "./JobApplicationCard"
import { CSS } from "@dnd-kit/utilities"
import {SortableContext, useSortable, verticalListSortingStrategy} from '@dnd-kit/sortable';
import { UseBoard } from "@/hooks/useBoard"
import {closestCorners, DndContext, PointerSensor, useDroppable, useSensor, useSensors} from '@dnd-kit/core'

interface KBoardProps{
    board:IBoard
    userId:string
}
interface ColConfig{
    color:string,icon:React.ReactNode
}
const COL_CONFIG:Array<ColConfig>=[
    {
        color:'bg-cyan-500',
        icon:<CalendarHeart className="h-4 w-4"/>
    },
    {
        color:'bg-purple-500',
        icon:<CheckIcon className="h-4 w-4"/>
    },
    {
        color:'bg-green-500',
        icon:<MicIcon className="h-4 w-4"/>
    },
    {
        color:'bg-yellow-500',
        icon:<Award className="h-4 w-4"/>
    },
    {
        color:'bg-red-500',
        icon:<XIcon className="h-4 w-4"/>
    }
]
function DropAbleColumn({column,config,boardId,sortedColumn}:{column:any,config:ColConfig,boardId:any,sortedColumn:any[]}){
    const sortedJobs=column.jobApplications?.sort((a:any,b:any)=>a.order-b.order) || []
    const {setNodeRef,isOver}=useDroppable({
        id:column._id,
        data:{
            type:'column',
            columnId:column._id
        }
    })
    return (
        <Card className="min-w-75 shrink-0 shadow-md p-0">
            <CardHeader className={`${config.color} text-white rounded-t-lg pb-3 pt-5`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {config.icon}
                        <CardTitle className="text-white text-base font-semibold">
                            {column.name}
                        </CardTitle>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={'ghost'} size={'icon'} className="h-6 w-6 text-white hover:bg-white/20">
                                <MoreHorizontal/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-destructive">
                                <TrashIcon className="h-4 w-4"/>Delete Column
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className={`space-y-2 pt-4 bg-gray-50/50 min-h-100 rounded-b-lg ${isOver?'ring-2 ring-blue-500':''}`} ref={setNodeRef}>
                <SortableContext items={sortedJobs.map((job:any)=>job._id)} strategy={verticalListSortingStrategy}>
                    {sortedJobs.map((job:any,key:any)=>(
                        <SortableJobCard key={key} job={{...job,columnId:job.columnId || column._id}} columns={sortedColumn}/>
                    ))}
                    {/* Create Job Appplication */}
                    <CreateJobApplication columnId={column._id} boardId={boardId}/>
                </SortableContext>
            </CardContent>
        </Card>
    )
}
function SortableJobCard({job,columns}:{job:IJobApplication;columns:IColumn[]}){
    const {attributes,listeners,transform,transition,isDragging,setNodeRef}=useSortable({
        id:job._id as any,
        data:{
            type:"job",
            job
        }
    })
    const style={
        transform:CSS.Transform.toString(transform),
        transition,
        opacity:isDragging?0.5:1
    }
    return (
        <div ref={setNodeRef} style={style}>
            <JobApplicationCard job={job} columns={columns} dragHandleProps={{...attributes,...listeners}}/>
        </div>
    )
}
export default function KanbanBoard({board,userId}:KBoardProps){
    const {columns,moveJob}=UseBoard(board)
    const sortedColumns=columns.sort((a:any,b:any)=>a.order-b.order) || []
    const sensors=useSensors(useSensor(PointerSensor,{
        activationConstraint:{
            distance:8
        }
    }))
    async function HandleDragEnd(event: any) {
        const { active, over } = event;
        if (!over || !active) return;
        // Only handle job cards
        if (active.id === over.id) return;
        // Find the job being dragged
        let fromColumnId = null;
        let job = null;
        for (const col of columns) {
            const found = col.jobApplications?.find((j: any) => j._id === active.id);
            if (found) {
                fromColumnId = col._id;
                job = found;
                break;
            }
        }
        if (!job) return;
        // Find the destination column
        let toColumnId = null;
        for (const col of columns) {
            if (col.jobApplications?.some((j: any) => j._id === over.id)) {
                toColumnId = col._id;
                break;
            }
        }
        // If dropped on column itself (not a card), use column id
        if (!toColumnId) {
            toColumnId = over.id;
        }
        // If dropped in same column and same position, do nothing
        if (fromColumnId === toColumnId && active.id === over.id) return;
        // Find new order (index in destination)
        let newOrder = 0;
        const toCol = columns.find((c: any) => c._id === toColumnId);
        if (toCol && toCol.jobApplications) {
            const overIndex = toCol.jobApplications.findIndex((j: any) => j._id === over.id);
            newOrder = overIndex === -1 ? toCol.jobApplications.length : overIndex;
        }
        // Call moveJob to update state
        moveJob(active.id, toColumnId, newOrder);
    }
    async function HandleDragStart() {
        // Optionally implement visual feedback
    }
    return (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={HandleDragStart} onDragEnd={HandleDragEnd}>
            <div className="space-y-4">
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {columns.map((col,key)=>{
                        const config=COL_CONFIG[key] ||  
                        {
                            color:'bg-cyan-500',
                            icon:<CalendarHeart className="h-4 w-4"/>
                        }
                        return (
                        <DropAbleColumn key={key} column={col} config={config} boardId={board._id} sortedColumn={sortedColumns}/>
                        )
                    })}
                </div>
            </div>
        </DndContext>
    )
}