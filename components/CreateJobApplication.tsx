'use client'
import { PlusIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { useState } from "react"
import { CreateJobApplicationServerAction } from "@/lib/actions/job-create"

interface CreateJobProps{
    columnId:string,
    boardId:string
}
const INITIAL_FORM_DATA={
        company:"",
        position:"",
        location:"",
        salary:"",
        jobUrl:"",
        tags:"",
        description:"",
        notes:""
}
export default function CreateJobApplication({columnId,boardId}:CreateJobProps){
    const [open,setOpen]=useState(false)
    const [formData,SetFormData]=useState(INITIAL_FORM_DATA)
    async function HandleSubmit(e:React.FormEvent){
        e.preventDefault();
        try {
            const response=await CreateJobApplicationServerAction({
                ...formData,
                columnId,
                boardId,
                tags:formData.tags.split(',').map((tag)=>tag.trim()).filter((tag)=>tag.length>0)
            })
            if(response.error){
                console.log("Failed to create application",response.error)
            }else{
                SetFormData(INITIAL_FORM_DATA)
                setOpen(false)
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button className="border hover:text-primary w-full mb-4 justify-start text-muted-foreground" variant={'ghost'}>
                    <PlusIcon className="w-4 h-4"/>
                    Add Job
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        Add Job description
                    </DialogTitle>
                    <DialogDescription>
                        Track a new job application
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={HandleSubmit}>
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
                        <Button type="button" variant={'outline'} onClick={()=>setOpen(false)}>Cancel</Button>
                        <Button type="submit">Add Application</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}