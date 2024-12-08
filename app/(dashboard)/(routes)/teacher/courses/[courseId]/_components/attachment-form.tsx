"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import toast from 'react-hot-toast';

import * as z from "zod";
import { Attachment, Course } from '@prisma/client';

import { File, ImageIcon, Loader, Pencil, PlusCircle, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import FileUpload from '@/components/appComponents/file-upload';

import courseService from '@/app/services/course/course.service';

interface attachmentFormProps {
    initialData: Course & { attachments: Attachment[] };
    courseId: string;
}

const formSchema = z.object({
    url: z.string().min(1),
})

const AttachmentForm = ({ initialData, courseId }: attachmentFormProps) => {

    const [isEditing, setIsEditing] = useState(false)
    const [deleteAttachment, setDeleteAttachment] = useState<string | null>(null);

    const router = useRouter()

    const toggleEdit = () => setIsEditing(!isEditing)

    const onHandleDelete = async (id: string) => {
        try {
            setDeleteAttachment(id)
            const requestData = {
                params: { courseId: courseId, attachmentId: id }
            }
            const response = await courseService.deleteCourseAttachmentDetail(requestData)
            if (response.status === 200) {
                toast.success(response?.data?.message)
                router.refresh()
            } else {
                throw new Error(response.data.message || "Something went wrong")
            }
        } catch (error: any) {
            setDeleteAttachment(null)
            console.log(error?.response?.data?.message || error?.response?.data?.error || "Something went wrong!")
            toast.error(error?.response?.data?.message || error?.response?.data?.error || "Something went wrong!")
        }
    }

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const requestData = {
                params: { courseId: courseId },
                body: data
            }
            const response = await courseService.createCourseAttachmentsDetail(requestData)
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
                {"Course attachments"}
                <Button variant={"ghost"} onClick={toggleEdit}>
                    {isEditing && (
                        <>{"Cancel"}</>
                    )}
                    {!isEditing && (
                        <>
                            <PlusCircle className={"w-4 h-4 mr-2"} />
                            {"Add a file"}
                        </>
                    )}
                    {/* {(!isEditing && initialData?.imageUrl) && (
                        <>
                            <Pencil className={"h-4 w-4 mr-2"} />
                            {"Edit image"}
                        </>
                    )} */}
                </Button>
            </div>
            {(!isEditing && (
                <>
                    {(initialData?.attachments?.length === 0) && (
                        <p className={"text-sm mt-w text-slate-500 italic"}>
                            {"No attachments yet"}
                        </p>
                    )}
                    {(initialData?.attachments?.length > 0) && (
                        <div className={"space-y-2"}>
                            {initialData?.attachments.map((attachment) => (
                                <div className={"flex items-center p-3 w-full bg-sky-100 border border-sky-200 text-sky-700 rounded-md"}>
                                    <File className={"h-4 w-4 mr-2 flex-shrink-0"} />
                                    <p className={"text-xs line-clamp-1"}>
                                        {attachment?.name}
                                    </p>
                                    {(deleteAttachment === attachment?.id) &&
                                        <div>
                                            <Loader className={"w-4 h-4 animate-spin"} />
                                        </div>
                                    }
                                    {(deleteAttachment !== attachment?.id) &&
                                        <button className={"mx-auto hover:opacity-75 transition"} onClick={() => onHandleDelete(attachment?.id)}>
                                            <X className={"w-4 h-4"} />
                                        </button>
                                    }
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ))}
            {isEditing && (
                <div>
                    <FileUpload
                        endPoint={'courseAttachment'}
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ url: url })
                            }
                        }}
                    />
                    <div className={"text-xs text-muted-foreground mt-4"}>
                        {"Add anything your student might need to complete the course."}
                    </div>
                </div>
            )}
        </div>
    )
}

export default AttachmentForm;