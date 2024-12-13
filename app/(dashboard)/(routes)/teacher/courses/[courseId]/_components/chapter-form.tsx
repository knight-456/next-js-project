"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';

import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { Chapter, Course } from '@prisma/client';

import { Loader2, PlusCircle } from 'lucide-react';

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import ChaptersList from './chapters-list';

import courseService from '@/app/services/course/course.service';

import { cn } from '@/lib/utils';

interface chapterFormProps {
    initialData: Course & { chapters: Chapter[] };
    courseId: string
}

const formSchema = z.object({
    title: z.string().min(1, { message: "Title is required" })
})

const ChapterForm = ({ initialData, courseId }: chapterFormProps) => {

    const [isCreating, setIsCreating] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        }
    })

    const router = useRouter()

    const { isSubmitting, isValid } = form.formState

    const toggleCreating = () => {
        setIsCreating(!isCreating)
        form.setValue("title", "")
    }

    const onHandleEdit = (id: string) => {
        router.push(`/teacher/courses/${courseId}/chapters/${id}`)
    }

    const onHandleReorder = async (updatedData: { id: string; position: number }[]) => {
        try {
            setIsUpdating(true)

            const requestData = {
                params: { courseId: courseId },
                body: { list: updatedData }
            }
            const response = await courseService.updateCourseChapterOrder(requestData)
            if (response.status === 200) {
                toast.success(response.data.message)
            } else {
                throw new Error(response.data.message)
            }
        } catch (error) {
            toast.error("Something went wrong!")
        } finally {
            setIsUpdating(false)
        }
    }

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const requestData = {
                params: { courseId: courseId },
                body: data
            }
            const response = await courseService.createCourseChapterDetail(requestData)
            if (response.status === 200) {
                toggleCreating()
                router.refresh()
                toast.success(response.data.message)
            } else {
                throw new Error(response.data.message)
            }
        } catch (error) {
            toast.error("Something went wrong!")
        }
    }

    return (
        <div className={"relative mt-6 border bg-slate-100 rounded-md p-4"}>
            {isUpdating && (
                <div className={"absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center"}>
                    <Loader2 className={"animate-spin h-6 w-6 text-sky-700"} />
                </div>
            )}
            <div className={"font-medium flex items-center justify-between"}>
                {"Course chapters"}
                <Button variant={"ghost"} onClick={toggleCreating}>
                    {isCreating && (
                        <>{"Cancel"}</>
                    )}
                    {!isCreating && (
                        <>
                            <PlusCircle className={"h-4 w-4 mr-2"} />
                            {"Add a chapter"}
                        </>
                    )}
                </Button>
            </div>
            {isCreating && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-4 mt-4"}>
                        <FormField
                            control={form.control}
                            name={"title"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder={"e.g. 'Introduction to the course'"}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={!isValid || isSubmitting}
                            type={"submit"}
                        >
                            {"Create"}
                        </Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData?.chapters?.length && "text-slate-500 italic",
                )}>
                    {!initialData?.chapters?.length && "No Chapters"}
                    <ChaptersList
                        onEdit={onHandleEdit}
                        onReorder={onHandleReorder}
                        items={initialData.chapters || []}
                    />
                </div>
            )}
            {isCreating && (
                <p className={"text-xs text-muted-foreground mt-4"}>
                    {"Drag and drop to reorder the chapters"}
                </p>
            )}
        </div>
    )
}

export default ChapterForm;