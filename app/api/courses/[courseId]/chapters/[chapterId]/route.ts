import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: {
        params: { courseId: string; chapterId: string }
    }) {
    try {
        // const { userId } = auth()

        // if (!userId) {
        //     return NextResponse.json({ message: "Unauthorized!" }, { status: 401 })
        // }

        const chapterDetail = await db.chapter.findUnique({
            where: {
                id: params?.chapterId,
                courseId: params?.courseId
            },
            include: { muxData: true }
        })

        if (!chapterDetail) {
            return NextResponse.json({ message: "No chapter found!" }, { status: 404 })
        }

        return NextResponse.json({ data: chapterDetail }, { status: 200 })
    } catch (error) {
        // console.log("[ChapterID]", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const { userId } = auth()
        const { isPublished, ...values } = await req.json()

        if (!userId) {
            return NextResponse.json({ message: "Unauthorized!" }, { status: 401 })
        }

        const CourseOwner = await db.course.findUnique({
            where: {
                id: params?.courseId,
                userId
            }
        })

        if (!CourseOwner) {
            return NextResponse.json({ message: "Unauthorized!" }, { status: 401 })
        }

        const chapterInfo = await db.chapter.findUnique({
            where: {
                id: params?.chapterId,
                courseId: params?.courseId
            }
        })

        const muxData = await db.muxData.findUnique({
            where: {
                chapterId: params?.chapterId
            }
        })

        if (isPublished) {
            if (!!chapterInfo?.title && !!chapterInfo?.videoUrl && !!chapterInfo?.description) {
                await db.chapter.update({
                    where: {
                        id: params?.chapterId,
                        courseId: params?.courseId
                    },
                    data: {
                        isPublished: true
                    }
                })
            } else {
                return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
            }
        }

        if (!isPublished && !!chapterInfo?.isPublished) {
            const publishedChaptersInCourse = await db.chapter.findMany({
                where: {
                    id: params?.courseId,
                    isPublished: true
                }
            })
            if (!publishedChaptersInCourse?.length) {
                await db.course.update({
                    where: {
                        id: params?.courseId
                    },
                    data: {
                        isPublished: false
                    }
                })
            }
            await db.chapter.update({
                where: {
                    id: params?.chapterId,
                    courseId: params?.courseId
                },
                data: {
                    isPublished: false
                }
            })
        }

        const chapterDetail = await db.chapter.update({
            where: {
                id: params?.chapterId,
                courseId: params?.courseId
            },
            data: { ...values }
        })

        if (!chapterDetail) {
            return NextResponse.json({ message: "No chapter found!" }, { status: 404 })
        }


        if (values?.videoUrl) {
            const existingVideo = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId
                }
            })

            if (!!existingVideo) {
                await db.muxData.delete({
                    where: {
                        id: existingVideo.id
                    }
                })
            }

            await db.muxData.create({
                data: {
                    chapterId: params.chapterId,
                    assetId: `${params.courseId}${params.chapterId}`,
                    playbackId: `${params.courseId}${params.chapterId}`
                }
            })
        }

        return NextResponse.json({ data: chapterDetail, message: "Chapter updated" }, { status: 200 })
    } catch (error) {
        console.log("[COURSE_ChapterID]", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const { userId } = auth()

        if (!userId) {
            return NextResponse.json({ message: "Unauthorized!" }, { status: 401 })
        }

        const CourseOwner = await db.course.findUnique({
            where: {
                id: params?.courseId,
                userId
            }
        })

        if (!CourseOwner) {
            return NextResponse.json({ message: "Unauthorized!" }, { status: 401 })
        }

        const chapterDetail = await db.chapter.findUnique({
            where: {
                id: params?.chapterId,
                courseId: params?.courseId
            }
        })

        if (!chapterDetail) {
            return NextResponse.json({ message: "Not found" }, { status: 404 })
        }

        if (chapterDetail.videoUrl) {
            const existingVideoData = await db.muxData.findFirst({
                where: {
                    chapterId: params?.chapterId
                }
            })

            if (existingVideoData) {
                await db.muxData.delete({
                    where: {
                        id: existingVideoData.id
                    }
                })
            }
        }

        const deletedChapter = await db.chapter.delete({
            where: {
                id: params.chapterId
            }
        })

        const publishedChaptersInCourse = await db.course.findMany({
            where: {
                id: params.courseId,
                isPublished: true
            }
        })

        if (!publishedChaptersInCourse?.length) {
            await db.course.update({
                where: {
                    id: params.courseId
                },
                data: {
                    isPublished: false
                }
            })
        }

        return NextResponse.json({ data: deletedChapter, message: "Chapter deleted" }, { status: 200 })
    } catch (error) {
        console.log("[CHAPTER_ID_DELETE]", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}