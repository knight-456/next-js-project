import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";

export async function PUT(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const { userId } = auth()
        const { isCompleted } = await req.json()

        if (!userId) {
            return NextResponse.json({ message: "Unauthorized!" }, { status: 401 })
        }

        const userProgress = await db.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId: params.chapterId
                }
            },
            update: {
                isCompleted
            },
            create: {
                userId,
                chapterId: params.chapterId,
                isCompleted
            }
        })
        return NextResponse.json({ data: userProgress, message: "Progress updated" }, { status: 200 })
    } catch (error) {
        console.log("[CHAPTER_ID_PROGRESS]", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 400 })
    }
}