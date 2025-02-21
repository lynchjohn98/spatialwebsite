"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PreModule() {

    const [showInput, setShowInput] = useState(false); // Show/hide input box

    return (
        <h1>
            Pre-Module: The Importance of Spatial Skills
        </h1>
    );

}