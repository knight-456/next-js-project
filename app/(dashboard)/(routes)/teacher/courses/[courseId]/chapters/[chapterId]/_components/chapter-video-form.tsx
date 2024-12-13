"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import toast from 'react-hot-toast';

import * as z from "zod";

import { Chapter, MuxData } from '@prisma/client';

import { Pencil, PlusCircle, VideoIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import FileUpload from '@/components/appComponents/file-upload';

import courseService from '@/app/services/course/course.service';

interface videoFormProps {
    initialData: Chapter & { muxData: MuxData | null };
    courseId: string;
    chapterId: string;
}

const formSchema = z.object({
    videoUrl: z.string().min(1)
})

const ChapterVideoForm = ({ initialData, courseId, chapterId }: videoFormProps) => {

    const [isEditing, setIsEditing] = useState(false)

    const router = useRouter()

    const toggleEdit = () => setIsEditing(!isEditing)

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const requestData = {
                params: { courseId: courseId, chapterId: chapterId },
                body: data
            }
            const response = await courseService.updateCourseChapterDetail(requestData)
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
                {"Chapter video"}
                <Button variant={"ghost"} onClick={toggleEdit}>
                    {isEditing && (
                        <>{"Cancel"}</>
                    )}
                    {(!isEditing && !initialData?.videoUrl) && (
                        <>
                            <PlusCircle className={"w-4 h-4 mr-2"} />
                            {"Add a video"}
                        </>
                    )}
                    {(!isEditing && initialData?.videoUrl) && (
                        <>
                            <Pencil className={"h-4 w-4 mr-2"} />
                            {"Edit video"}
                        </>
                    )}
                </Button>
            </div>
            {(!isEditing && (
                !initialData?.videoUrl ? (
                    <div className={"flex items-center justify-center h-60 bg-slate-200 rounded-md"}>
                        <VideoIcon className={"h-10 w-10 text-slate-500"} />
                    </div>
                ) : (
                    <div className={"relative aspect-video mt-2"}>
                        <video
                            src={initialData?.videoUrl}
                            controls
                            className={"w-full h-full aspect-video"}
                        />
                    </div>
                )
            ))}
            {isEditing && (
                <div>
                    <FileUpload
                        endPoint={'chapterVideo'}
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ videoUrl: url })
                            }
                        }}
                    />
                    <div className={"text-xs text-muted-foreground mt-4"}>
                        {"Upload to this chapter's video."}
                    </div>
                </div>
            )}
            {(initialData?.videoUrl && !isEditing) && (
                <div className={"text-xs text-muted-foreground mt-2"}>
                    {"Videos can take a few minutes to process. Refresh the page if video not appear."}
                </div>
            )}
        </div>
    )
}

export default ChapterVideoForm;