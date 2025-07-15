//blank template
"use client";
import { insertNewCourse } from "@/app/actions";
import { useState } from "react";   
import { useRouter } from "next/navigation";

export default function Research() {
    const router = useRouter();
    return (
        <div>
            <h1>Research Study Page and Information</h1>
        </div>
    )
}