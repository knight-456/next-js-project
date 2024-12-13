"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";

import "react-quill/dist/quill.bubble.css";

interface previewProps {
    value: string;
}

const Preview = ({
    value
}: previewProps) => {
    const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), [])

    return (
        <ReactQuill
            theme="bubble"
            value={value}
            readOnly
        />
    )
}

export default Preview;