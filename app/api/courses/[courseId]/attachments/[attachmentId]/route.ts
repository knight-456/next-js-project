import { NextRequest, NextResponse } from "next/server"

import { auth } from "@clerk/nextjs"

import { db } from "@/lib/db"

export async function DELETE(
    req: NextRequest,
    { params }: {
        params: {
            courseId: string;
            attachmentId: string
        }
    }
) {
    console.log("api call", params.attachmentId, params.courseId)
    try {
        const { userId } = auth()

        if (!userId) {
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

        const attachment = await db.attachment.findUnique({
            where: {
                id: params?.attachmentId,
                courseId: params?.courseId
            }
        })

        if (!attachment) {
            return NextResponse.json({ message: "No Attachment Found" }, { status: 404 })
        }

        await db.attachment.delete({
            where: {
                id: params?.attachmentId
            }
        })

        return NextResponse.json({ message: "Deleted successfully!" }, { status: 200 })

    } catch (error) {
        console.log("DELETE_COURSE_ATTACHMENT_ID", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 200 })
    }
}