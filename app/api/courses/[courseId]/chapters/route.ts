import { NextRequest, NextResponse } from "next/server";

import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";

import { isTeacher } from "@/lib/teacher";

export async function POST(
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
        const { title } = await req.json()

        if (!userId || !isTeacher(userId)) {
            return NextResponse.json({ data: null, message: "Unauthorized" }, { status: 401 });
        }

        if (!courseId) {
            return NextResponse.json({ data: null, message: "No Course Found" }, { status: 404 });
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: params?.courseId,
                userId
            }
        })

        if (!courseOwner) {
            return NextResponse.json({ data: null, message: "Unauthorized" }, { status: 401 });
        }

        const lastChapter = await db.chapter.findFirst({
            where: {
                courseId: params?.courseId
            },
            orderBy: {
                position: "desc"
            }
        })

        const newPosition = lastChapter ? lastChapter.position + 1 : 1

        const chapter = await db.chapter.create({
            data: {
                title,
                courseId: params?.courseId,
                position: newPosition
            }
        })

        return NextResponse.json({ data: chapter, message: "Created Successfully!" }, { status: 200 });
    } catch (error) {
        console.log("[Chapters]", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}