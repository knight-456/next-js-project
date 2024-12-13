"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';

import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { Chapter } from '@prisma/client';

import { Pencil } from 'lucide-react';

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import Editor from '@/components/appComponents/editor';

import courseService from '@/app/services/course/course.service';

import { cn } from '@/lib/utils';
import Preview from '@/components/appComponents/preview';

interface chapterDescriptionFormProps {
    initialData: Chapter;
    courseId: string;
    chapterId: string;
}

const formSchema = z.object({
    description: z.string().min(1)
})

const ChapterDescriptionForm = ({ initialData, courseId, chapterId }: chapterDescriptionFormProps) => {

    const [isEditing, setIsEditing] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData.description ?? ""
        }
    })

    const router = useRouter()

    const { isSubmitting, isValid } = form.formState

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
                {"Chapter description"}
                <Button variant={"ghost"} onClick={toggleEdit}>
                    {isEditing && (
                        <>{"Cancel"}</>
                    )}
                    {!isEditing && (
                        <>
                            <Pencil className={"h-4 w-4 mr-2"} />
                            {"Edit description"}
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData?.description && "text-slate-500 italic"
                )}>
                    {!initialData?.description && "No description"}
                    {initialData?.description && <Preview value={initialData.description} />}
                </div>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-4 mt-4"}>
                        <FormField
                            control={form.control}
                            name={"description"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Editor
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className={"flex items-center gap-x-2"}>
                            <Button
                                disabled={!isValid || isSubmitting}
                                type={"submit"}
                            >
                                {"Save"}
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}

export default ChapterDescriptionForm;