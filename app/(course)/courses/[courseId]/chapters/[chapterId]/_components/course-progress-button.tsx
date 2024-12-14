"use client";

import React, { useState } from 'react'

import { CheckCircle, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useConfettiStore } from '@/hooks/use-confeetti-store';
import toast from 'react-hot-toast';
import courseService from '@/app/services/course/course.service';

interface courseProgressButtonProps {
    chapterId: string;
    courseId: string;
    isCompleted?: boolean;
    nextChapterId?: string;
}

const CourseProgressButton = ({
    chapterId,
    courseId,
    isCompleted,
    nextChapterId
}: courseProgressButtonProps) => {

    const router = useRouter()
    const confetti = useConfettiStore()

    const [isLoading, setIsLoading] = useState(false)

    const onClick = async () => {
        try {
            setIsLoading(true)
            const requestData = {
                params: {
                    courseId: courseId,
                    chapterId: chapterId
                },
                body: {
                    isCompleted: !isCompleted
                }
            }
            const response = await courseService.updateCourseChapterProgress(requestData)
            if (response.status === 200) {
                if (!isCompleted && !nextChapterId) {
                    confetti.onOpen()
                }

                if (!isCompleted && nextChapterId) {
                    router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
                }

                toast.success(response.data.message)
                router.refresh()
            } else {
                throw new Error(response?.data?.message || "Something went wrong")
            }
        } catch {
            toast.error("Something went wrong!")
        } finally {
            setIsLoading(false)
        }
    }
    const Icon = isCompleted ? XCircle : CheckCircle

    return (
        <Button
            type={"button"}
            variant={isCompleted ? "outline" : "success"}
            className={"w-full md:w-auto"}
            onClick={onClick}
            disabled={isLoading}
        >
            {isCompleted ? "Not completed" : "Mark as complete"}
            <Icon className={"w-4 h-4 ml-2"} />
        </Button>
    )
}

export default CourseProgressButton