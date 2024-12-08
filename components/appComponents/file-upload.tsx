"use client";

import toast from "react-hot-toast";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";

interface fileUploadProps {
    onChange: (url: string) => void;
    endPoint: keyof typeof ourFileRouter
}

const FileUpload = ({ onChange, endPoint }: fileUploadProps) => {
    return (
        <UploadDropzone
            endpoint={"courseImage"}
            onClientUploadComplete={(res) => {
                onChange(res?.[0]?.url);
            }}
            onUploadError={(error: Error) => {
                toast.error(`${error?.message}`)
            }}
        />
    )
}

export default FileUpload