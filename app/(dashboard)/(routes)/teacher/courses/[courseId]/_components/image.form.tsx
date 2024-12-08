"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import toast from 'react-hot-toast';

import * as z from "zod";
import { Course } from '@prisma/client';

import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import FileUpload from '@/components/appComponents/file-upload';

import courseService from '@/app/services/course/course.service';

interface imageFormProps {
    initialData: Course;
    courseId: string
}

const formSchema = z.object({
    imageUrl: z.string().min(1, { message: "Image is required" })
})

const ImageForm = ({ initialData, courseId }: imageFormProps) => {

    const [isEditing, setIsEditing] = useState(false)

    const router = useRouter()

    const toggleEdit = () => setIsEditing(!isEditing)

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const requestData = {
                params: { courseId: courseId },
                body: data
            }
            const response = await courseService.updateCourseDetail(requestData)
            if (response.status === 200) {
                toggleEdit()
                router.refresh()
                toast.success(response.data.message || "Updated successfully")
            } else {
                throw new Error(response.data.message)
            }
        } catch (error) {
            toast.error("Something went wrong!")
        }
    }

    return (
        <div className={"mt-6 border bg-slate-100 rounded-md p-4"}>
            <div className={"font-medium flex items-center justify-between"}>
                {"Course image"}
                <Button variant={"ghost"} onClick={toggleEdit}>
                    {isEditing && (
                        <>{"Cancel"}</>
                    )}
                    {(!isEditing && !initialData?.imageUrl) && (
                        <>
                            <PlusCircle className={"w-4 h-4 mr-2"} />
                            {"Add an image"}
                        </>
                    )}
                    {(!isEditing && initialData?.imageUrl) && (
                        <>
                            <Pencil className={"h-4 w-4 mr-2"} />
                            {"Edit image"}
                        </>
                    )}
                </Button>
            </div>
            {(!isEditing && (
                !initialData?.imageUrl ? (
                    <div className={"flex items-center justify-center h-60 bg-slate-200 rounded-md"}>
                        <ImageIcon className={"h-10 w-10 text-slate-500"} />
                    </div>
                ) : (
                    <div className={"relative aspect-video mt-2"}>
                        <Image
                            alt={"upload"}
                            fill
                            className={"object-cover rounded-md"}
                            src={initialData?.imageUrl}
                        />
                    </div>
                )
            ))}
            {isEditing && (
                <div>
                    <FileUpload
                        endPoint={'courseImage'}
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ imageUrl: url })
                            }
                        }}
                    />
                    <div className={"text-xs text-muted-foreground mt-4"}>
                        {"16:9 aspect ratio recommended"}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ImageForm;