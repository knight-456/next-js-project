"use client";

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';

import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { Course } from '@prisma/client';

import { Pencil } from 'lucide-react';

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

import courseService from '@/app/services/course/course.service';
import { cn } from '@/lib/utils';
import { Combobox } from '@/components/ui/combobox';

interface categoryFormProps {
    initialData: Course;
    courseId: string;
    options: { label: string; value: string }[]
}

const formSchema = z.object({
    categoryId: z.string().min(1)
})

const CategoryForm = ({ initialData, courseId, options }: categoryFormProps) => {

    const [isEditing, setIsEditing] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: initialData.categoryId ?? ""
        }
    })

    const router = useRouter()

    const { isSubmitting, isValid } = form.formState

    const selectedOption = useMemo(() => {
        return options?.find((option) => option?.value === initialData?.categoryId)
    }, [initialData, options])

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
                {"Course category"}
                <Button variant={"ghost"} onClick={toggleEdit}>
                    {isEditing && (
                        <>{"Cancel"}</>
                    )}
                    {!isEditing && (
                        <>
                            <Pencil className={"h-4 w-4 mr-2"} />
                            {"Edit category"}
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn(
                    "text-sm mt-2",
                    !initialData?.categoryId && "text-slate-500 italic"
                )}>
                    {selectedOption?.label ?? "No category"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-4 mt-4"}>
                        <FormField
                            control={form.control}
                            name={"categoryId"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Combobox
                                            options={options}
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

export default CategoryForm;