"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';

import { Loader2, Lock } from 'lucide-react';

import { useConfettiStore } from '@/hooks/use-confeetti-store';

import { cn } from '@/lib/utils';
import courseService from '@/app/services/course/course.service';

interface videoPlayerProps {
    playbackId: string;
    courseId: string;
    chapterId: string;
    nextChapterId: string;
    isLocked: boolean;
    completionOnEnd: boolean;
    title: string;
    videoUrl: string;
}

const VideoPlayer = ({
    playbackId,
    courseId,
    chapterId,
    nextChapterId,
    isLocked,
    completionOnEnd,
    title,
    videoUrl
}: videoPlayerProps) => {

    // const [isReady, setIsReady] = useState(false)
    const router = useRouter()
    const confetti = useConfettiStore()

    const onEnded = async () => {
        try {
            const requestData = {
                params: {
                    courseId: courseId,
                    chapterId: chapterId
                },
                body: {
                    isComplete: true
                }
            }
            if (completionOnEnd) {
                const response = await courseService.updateCourseChapterProgress(requestData)
                if (response.status === 200) {
                    if (!nextChapterId) {
                        confetti.onOpen()
                    }

                    toast.success(response.data.message || "Progress updated")
                    router.refresh()

                    if (nextChapterId) {
                        router.push(`/courses/${courseId}/chapters/${chapterId}`)
                    }
                } else {
                    throw new Error(response?.data?.message || "Something went wrong")
                }
            }
        } catch {
            toast.error("Something went wrong!")
        }
    }

    return (
        <div className={"relative aspect-video"}>
            {/* {(!isReady && !isLocked) && (
                <div className={"absolute inset-0 flex items-center justify-center bg-slate-800"}>
                    <Loader2 className={"w-8 h-8 animate-spin text-secondary"} />
                </div>
            )} */}
            {isLocked &&
                <div className={"absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary"}>
                    <Lock className={"w-8 h-8"} />
                    <p className={"text-sm"}>
                        {"This chapter is locked"}
                    </p>
                </div>
            }
            {!isLocked && (
                <div className={"w-full h-full aspect-video bg-black/90"}>
                    <video
                        src={videoUrl}
                        title={title}
                        className={"w-full h-full aspect-video"}
                        // className={cn(
                        //     !isReady && "hidden"
                        // )}
                        // onCanPlay={() => setIsReady(true)}
                        onEnded={onEnded}
                        autoPlay
                    />
                </div>
            )}
        </div>
    )
}

export default VideoPlayer