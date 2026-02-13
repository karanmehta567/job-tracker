"Use client"
import { IColumn } from "@/lib/models/column"
import { IJobApplication } from "@/lib/models/JobApplication"
import { Card, CardContent } from "./ui/card"
import { Edit2Icon, ExternalLinkIcon, MoreVertical, PlusIcon, Trash2Icon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { DeleteJobApplication, UpdateJobApplication } from "@/lib/actions/job-create"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import React, { useState } from "react"

interface JobAppProps{
    job:IJobApplication,
    columns:IColumn[],
    dragHandleProps?:React.HTMLAttributes<HTMLElement>
}
export default function JobApplicationCard({job,columns,dragHandleProps}:JobAppProps){
    const [isEditing,SetEditing]=useState(false)
    const [formData,SetFormData]=useState({
        company:job.company || "",
        position:job.position|| "",
        location:job.position|| "",
        salary:job.salary||"",
        jobUrl:job.jobUrl||"",
        tags:job.tags?.join("")||"",
        description:job.description||"",
        notes:job.notes||""
    })
    async function HandleUpdate(e:React.FormEvent){
        e.preventDefault()
        try {
            const result=await UpdateJobApplication(job._id,{
                ...formData,
                tags:formData.tags.split(',').map((tag)=>tag.trim()).filter((tag)=>tag.length>0)
            })
            if(!result.error){
                SetEditing(false)
            }
        } catch (error) {
            console.log('Unable to move the job application',error)
        }
    }
    async function HandleDelete(e:React.FormEvent){
        e.preventDefault()
        try {
            const result=await DeleteJobApplication(job._id as any)
            if(result.error){
                console.log("An error occured while deleting",result.error)
            }
        } catch (error) {
            console.log('Unable to move the job application',error)
        }
    }
    async function HandleMove(newColumnId:string){
        try {
            const result=await UpdateJobApplication(job._id,{
                columnId:newColumnId
            })
        } catch (error) {
            console.log('Unable to move the job application',error)
        }
    }
    return (
        <div>
            <Card className="cursor-pointer transition-shadow hover:shadow-lg bg-white group shadow-sm" {...dragHandleProps}>
                <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0 ml-2.5">
                            <h3 className="font-semibold text-lg mb-1">{job.position}</h3>
                            <p className="text-md text-muted-foreground mb-2">{job.company}</p>
                            {job.description&&(
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{job.description }</p>
                            )}
                            {job.tags?(
                                <>
                                    {job.tags.length>0&&(
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {job.tags.map((tag,key)=>(
                                                <span key={key} className="px-3 py-2 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 first-letter:uppercase">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ):(null)}
                            {
                                job.jobUrl&&(
                                    <a target="_blank" href={job.jobUrl} onClick={(e)=>e.stopPropagation()} className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1">
                                        <ExternalLinkIcon className="h-5 w-5"/>
                                    </a>
                                )
                            }
                        </div>
                        <div className="flex items-start gap-1">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="h-6 w-6"  size='icon' variant={'ghost'}>
                                    <MoreVertical className="h-4 w-4"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={()=>SetEditing(true)}>
                                    <Edit2Icon className="mr-2 h-4 w-4"/>
                                    Edit
                                </DropdownMenuItem>
                                {
                                    columns.length>1&&(
                                        <>
                                            {
                                                columns.filter((c)=>c._id!==job.columnId).map((column,key)=>(
                                                    <DropdownMenuItem key={key} onClick={()=>HandleMove(column._id as any)}>
                                                        Move to {column.name}
                                                    </DropdownMenuItem>
                                                ))
                                            }
                                        </>
                                    )
                                }
                                <DropdownMenuItem variant={'destructive'} onClick={HandleDelete}>
                                    <Trash2Icon className="mr-2 h-4 w-4"/>
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    </div>
                </CardContent>
            </Card>
            <Dialog open={isEditing} onOpenChange={SetEditing}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        Add Job description
                    </DialogTitle>
                    <DialogDescription>
                        Track a new job application
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-4">
                    <div className="space-y-4 hover:border-primary">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="company">Company *</Label>
                                <Input required id='company'
                                value={formData.company}
                                onChange={(e)=>SetFormData({...formData,company:e.target.value})}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="position">Position *</Label>
                                <Input required id='position'
                                value={formData.position}
                                onChange={(e)=>SetFormData({...formData,position:e.target.value})}/>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input required id='location'
                                value={formData.location}
                                onChange={(e)=>SetFormData({...formData,location:e.target.value})}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="salary">Salary</Label>
                                <Input required id='salary' placeholder="ex: $100k-$300k"
                                value={formData.salary}
                                onChange={(e)=>SetFormData({...formData,salary:e.target.value})}/>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="jobUrl">Job URL</Label>
                            <Input required id='jobUrl'placeholder="https:../...."
                            value={formData.jobUrl}
                            onChange={(e)=>SetFormData({...formData,jobUrl:e.target.value})}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (comma separated)</Label>
                            <Input required id='tags' placeholder="React, Nodejs, Docker"
                            value={formData.tags}
                            onChange={(e)=>SetFormData({...formData,tags:e.target.value})}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" rows={4} placeholder="Brief description about the role..."
                            required
                            value={formData.description}
                            onChange={(e)=>SetFormData({...formData,description:e.target.value})}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea id="notes" rows={2}
                            required
                            value={formData.notes}
                            onChange={(e)=>SetFormData({...formData,notes:e.target.value})}/>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant={'outline'} onClick={()=>SetEditing(false)}>Cancel</Button>
                        <Button type="submit" onClick={HandleUpdate}>Save Changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
        </div>
    )
}