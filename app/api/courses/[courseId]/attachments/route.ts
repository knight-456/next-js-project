import { NextRequest, NextResponse } from "next/server";

import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";

import { isTeacher } from "@/lib/teacher";

export async function POST(
    req: NextRequest,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth()
        const { url } = await req.json()

        if (!userId || !isTeacher(userId)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: params?.courseId,
                userId: userId
            }
        })

        if (!courseOwner) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }
        const attachment = await db.attachment.create({
            data: {
                url,
                name: url.split("/").pop(),
                courseId: params?.courseId
            }
        })

        return NextResponse.json({ data: attachment }, { status: 200 });
    } catch (error) {
        console.log("[COURSE_ID_ATTACHMENTS]", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}