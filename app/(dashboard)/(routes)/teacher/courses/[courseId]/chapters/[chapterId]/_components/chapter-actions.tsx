"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Loader, Trash } from "lucide-react";

import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/modals/confirm-modal";

import courseService from "@/app/services/course/course.service";

interface chapterActionsProps {
    disabled: boolean;
    courseId: string;
    chapterId: string;
    isPublished: boolean
}

const ChapterActions = ({ disabled, courseId, chapterId, isPublished }: chapterActionsProps) => {

    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)

    const onHandlePublishChapter = async () => {
        try {
            setIsLoading(true)
            const requestData = {
                params: {
                    courseId: courseId,
                    chapterId: chapterId
                },
                body: {
                    isPublished: !isPublished
                }
            }
            const response = await courseService.updateCourseChapterDetail(requestData)
            if (response.status === 200) {
                toast.success(response.data.message)
                router.refresh()
            } else {
                throw new Error("Something went wrong!")
            }
        } catch (error) {
            toast.error("Something went wrong!")
        } finally {
            setIsLoading(false)
        }
    }

    const onHandleDelete = async () => {
        try {
            setIsLoading(true)

            const requestData = {
                params: {
                    courseId: courseId,
                    chapterId: chapterId
                }
            }
            const response = await courseService.deleteCourseChapterDetail(requestData)
            if (response.status === 200) {
                toast.success(response.data.message || "Chapter deleted")
                router.refresh()
                router.push(`/teacher/course/${courseId}`)
            } else {
                throw new Error("Something went wrong!")
            }
        } catch (error) {
            toast.error("Something went wrong!")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={"flex items-center gap-x-2"}>
            <Button
                variant={"outline"}
                size={"sm"}
                onClick={onHandlePublishChapter}
                disabled={disabled || isLoading}
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onHandleDelete}>
                <Button size={"sm"} disabled={isLoading}>
                    {isLoading && <Loader className={"w-4 h-4"} /> }
                    {!isLoading && <Trash className={"w-4 h-4 "} />}
                </Button>
            </ConfirmModal>
        </div>
    )
}

export default ChapterActions;