import React from 'react'

import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs';

import { File } from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import { Banner } from '@/components/appComponents/banner';
import Preview from '@/components/appComponents/preview';

import VideoPlayer from './_components/video-player';
import CourseEnrollButton from './_components/course-enroll-button';
import CourseProgressButton from './_components/course-progress-button';

import { getChapter } from '@/actions/get-chapter';

type chapterDetailProps = {
    params: {
        courseId: string;
        chapterId: string;
    }
}

const ChapterDetailPage = async ({ params }: chapterDetailProps) => {

    const { userId } = auth()

    if (!userId) {
        return redirect("/")
    }

    const {
        chapter,
        course,
        muxData,
        attachments,
        nextChapter,
        userProgress,
        purchase
    } = await getChapter({
        userId,
        chapterId: params?.chapterId,
        courseId: params.courseId
    })

    if (!chapter || !course) {
        return redirect("/")
    }

    const isLocked = !chapter.isFree && !purchase
    const completionOnEnd = !!purchase && !userProgress?.isCompleted

    return (
        <div>
            {userProgress?.isCompleted && (
                <Banner
                    variant={"success"}
                    label={"You already completed this chapter."}
                />
            )}
            {isLocked && (
                <Banner
                    variant={"warning"}
                    label={"You need to purchase this course to watch this chapter."}
                />
            )}
            <div className={"flex flex-col max-w-4xl mx-auto pb-20"}>
                <div className={"p-4"}>
                    <VideoPlayer
                        chapterId={chapter?.id}
                        title={chapter.title}
                        courseId={params.courseId}
                        nextChapterId={nextChapter?.id!}
                        playbackId={muxData?.playbackId!}
                        isLocked={isLocked}
                        completionOnEnd={completionOnEnd}
                        videoUrl={chapter.videoUrl!}
                    />
                </div>
                <div>
                    <div className={"p-4 flex flex-col md:items-center justify-between"}>
                        <h2 className={"text-2xl font-semibold mb-2"}>
                            {chapter.title}
                        </h2>
                        {purchase ? (
                            <CourseProgressButton
                                chapterId={params.chapterId}
                                courseId={params.courseId}
                                nextChapterId={nextChapter?.id}
                                isCompleted={!!userProgress?.isCompleted}
                            />
                        ) : (
                            <CourseEnrollButton
                                courseId={params?.courseId}
                                price={course?.price!}
                            />
                        )}
                    </div>
                    <Separator />
                    <div>
                        <Preview value={chapter.description!} />
                    </div>
                    {!!attachments?.length && (
                        <>
                            <Separator />
                            <div className={"p-4"}>
                                {attachments?.map((attachment) => (
                                    <a
                                        key={attachment?.id}
                                        href={attachment.url}
                                        target={"_blank"}
                                        className={"flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"}
                                    >
                                        <File />
                                        <p className={"line-clamp-1"}>
                                            {attachment.name}
                                        </p>
                                    </a>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ChapterDetailPage;