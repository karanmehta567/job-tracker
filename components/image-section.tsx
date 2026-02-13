'use client'
import Image from "next/image";
import { Button } from "./ui/button";
import { useState } from "react";

export default function ImageSection(){
    const [ButtonState,SetButtonState]=useState("organize") //three states
    return(
        <section className="border-t bg-white py-16">
        <div className="mx-auto container px-4 max-w-6xl">
            <div className="mx-auto px-4 flex items-center justify-center gap-x-5">
            {/* Tabs */}
            <Button onClick={()=>SetButtonState("organize")} className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${ButtonState==='organize'?'bg-primary text-white':'bg-gray-200 text-black hover:bg-gray-200'}`}>Organize Applications</Button>
            <Button onClick={()=>SetButtonState("hired")} className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${ButtonState==='hired'?'bg-primary text-white':'bg-gray-200 text-black hover:bg-gray-200'}`}>Get Hired</Button>
            <Button onClick={()=>SetButtonState("manage")} className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${ButtonState==='manage'?'bg-primary text-white':'bg-gray-200 text-black hover:bg-gray-200'}`}>Manage Boards</Button>
            </div>
            {/* Image logic */}
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-lg border border-gray-200 mt-5 shadow-xl">
            {ButtonState==='organize'&&<Image src={"/images/hero1.png"} alt="image-one" width={1200} height={800}/>}
            {ButtonState==='hired'&&<Image src={"/images/hero2.png"} alt="image-two" width={1200} height={800}/>}
            {ButtonState==='manage'&& <Image src={"/images/hero3.png"} alt="imagethree" width={1200} height={800}/>}
            </div>
        </div>
        </section>
    )
}