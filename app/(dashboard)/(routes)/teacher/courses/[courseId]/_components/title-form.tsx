"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';

import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";

import { Pencil } from 'lucide-react';

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import courseService from '@/app/services/course/course.service';

interface titleFormProps {
    initialData: {
        title: string;
    };
    courseId: string
}

const formSchema = z.object({
    title: z.string().min(1, { message: "Title is required" })
})

const TitleForm = ({ initialData, courseId }: titleFormProps) => {

    const [isEditing, setIsEditing] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    })

    const router = useRouter()

    const { isSubmitting, isValid } = form.formState

    const toggleEdit = () => setIsEditing(!isEditing)

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const requestData = {
                params: { courseId: courseId },
                body: data
            }
            const response = await courseService.updateCourseDetail(requestData)
            // const response = await axios.patch(`/api/courses/${params?.courseId}`, data)
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
                {"Course title"}
                <Button variant={"ghost"} onClick={toggleEdit}>
                    {isEditing && (
                        <>{"Cancel"}</>
                    )}
                    {!isEditing && (
                        <>
                            <Pencil className={"h-4 w-4 mr-2"} />
                            {"Edit title"}
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className={"text-sm mt-2"}>
                    {initialData?.title}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-4 mt-4"}>
                        <FormField
                            control={form.control}
                            name={"title"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type={"text"}
                                            disabled={isSubmitting}
                                            placeholder={"e.g. 'Advanced web development'"}
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

export default TitleForm