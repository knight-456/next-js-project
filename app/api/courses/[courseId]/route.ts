import { NextRequest, NextResponse } from "next/server";

import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";

export async function PATCH(
    req: NextRequest,
    { params }: {
        params: {
            courseId: string
        }
    }
) {
    try {
        const { userId } = auth()
        const { courseId } = params
        const data = await req.json()

        if (!userId) {
            return NextResponse.json({ data: null, message: "Unauthorized" }, { status: 401 });
        }

        const courseInfo = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                }
            }
        })
        if (!courseInfo) {
            return NextResponse.json({ message: "Not found" }, { status: 404 });

        }

        if (!!data?.isPublished) {
            const hasPublishedChapter = courseInfo.chapters.some((chapter) => chapter.isPublished)

            if (!courseInfo.title || !courseInfo.description || !courseInfo.imageUrl || !courseInfo.categoryId || !hasPublishedChapter) {
                return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
            }
            db.course.update({
                where: {
                    id: courseId,
                    userId: userId
                },
                data: {
                    isPublished: true
                }
            })
        }
        const course = await db.course.update({
            where: {
                id: courseId, userId: userId
            },
            data: { ...data }
        })

        return NextResponse.json({ data: course, message: "Updated Successfully!" }, { status: 200 });
    } catch (error) {
        console.log("[UPDATE COURSE]", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { courseId: string; } }
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

        const courseDetail = await db.course.findUnique({
            where: {
                id: params?.courseId,
                userId: userId
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                }
            }
        })

        if (!courseDetail) {
            return NextResponse.json({ message: "Not found" }, { status: 404 })
        }

        const deletedCourse = await db.course.delete({
            where: {
                id: params.courseId,
                userId: userId
            }
        })

        return NextResponse.json({ data: deletedCourse, message: "Course deleted" }, { status: 200 })
    } catch (error) {
        console.log("[CHAPTER_ID_DELETE]", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}