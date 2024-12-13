import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ArrowLeft, Eye, LayoutDashboard, Video } from 'lucide-react';

import { auth } from '@clerk/nextjs';

import { IconBadge } from '@/components/appComponents/icon-badge';
import { Banner } from '@/components/appComponents/banner';

import ChapterActions from './_components/chapter-actions';
import ChapterTitleForm from './_components/chapter-title-form';
import ChapterDescriptionForm from './_components/chapter-description-form';
import ChapterAccessForm from './_components/chapter-access-form';
import ChapterVideoForm from './_components/chapter-video-form';

import courseService from '@/app/services/course/course.service';

import { db } from '@/lib/db';

type chapterDetailProps = {
    params: { courseId: string; chapterId: string }
}

const initialResponse = { isLoading: false, data: null, error: null }

const getCourseChapterDetail = async (requestData: chapterDetailProps) => {
    try {
        const response = await courseService.getCourseChapterDetail(requestData)
        if (response.status === 200) {
            return { ...initialResponse, data: response?.data?.data }
        } else {
            throw new Error("Something went wrong!")
        }
    } catch (error: any) {
        console.error(error, error?.response?.data?.message || error?.response?.data?.error || error?.message || "Something went wrong!")
        return { ...initialResponse, error: error?.response?.data?.message || error?.response?.data?.error || error?.message || "Something went wrong!" }
    }
}

const ChapterDetailPage = async ({ params }: chapterDetailProps) => {

    const { userId } = auth()

    if (!userId) {
        redirect("/")
    }

    const chapter = await db.chapter.findUnique({
        where: {
            id: params?.chapterId,
            courseId: params?.courseId
        },
        include: {
            muxData: true
        }
    })

    if (!chapter) {
        redirect("/")
    }

    const requiredFields = [
        chapter.title,
        chapter.description,
        chapter.videoUrl,
    ]

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean)?.length;

    const completedText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean)

    return (
        <>
            {!chapter.isPublished && (
                <Banner
                    variant={"warning"}
                    label={"This chapter is unpublished. It will not be visible in the course."}
                />
            )}
            <div className={"p-6"}>
                <div className={"flex items-center justify-between"}>
                    <div className={"w-full"}>
                        <Link
                            href={`/teacher/courses/${params?.courseId}`}
                            className={"flex items-center text-sm hover:opacity-75 transition mb-6"}
                        >
                            <ArrowLeft className={"h-4 w-4 mr-2"} />
                            {"Back to course setup"}
                        </Link>
                        <div className={"w-full flex items-center justify-between"}>
                            <div className={"flex flex-col gap-y-2"}>
                                <h1 className={"text-2xl font-medium"}>
                                    {"Chapter Creation"}
                                </h1>
                                <span className={"text-sm text-slate-700"}>
                                    {`Complete all fields ${completedText}`}
                                </span>
                            </div>
                            <ChapterActions
                                disabled={!isComplete}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                                isPublished={chapter.isPublished}
                            />
                        </div>
                    </div>
                </div>
                <div className={"grid grid-cols-1 md:grid-cols-2 gap-6 mt-16"}>
                    <div className={"space-y-4"}>
                        <div>
                            <div className={"flex items-center gap-x-2"}>
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className={"text-xl"}>
                                    {"Customize your chapter"}
                                </h2>
                            </div>
                            <ChapterTitleForm
                                initialData={chapter}
                                courseId={params?.courseId}
                                chapterId={params?.chapterId}
                            />
                            <ChapterDescriptionForm
                                initialData={chapter}
                                courseId={params?.courseId}
                                chapterId={params?.chapterId}
                            />
                        </div>
                        <div>
                            <div className={"flex items-center gap-x-2"}>
                                <IconBadge icon={Eye} />
                                <h2 className={"text-xl"}>
                                    {"Access Settings"}
                                </h2>
                            </div>
                            <ChapterAccessForm
                                initialData={chapter}
                                courseId={params?.courseId}
                                chapterId={params?.chapterId}
                            />
                        </div>
                    </div>
                    <div>
                        <div className={"flex items-center gap-x-2"}>
                            <IconBadge icon={Video} />
                            <h2 className={"text-xl"}>
                                {"Add a video"}
                            </h2>
                        </div>
                        <ChapterVideoForm
                            initialData={chapter}
                            courseId={params?.courseId}
                            chapterId={params?.chapterId}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChapterDetailPage;