import { NextRequest, NextResponse } from "next/server";

import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";

export async function PUT(
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
        const { list } = await req.json()

        if (!userId) {
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
        
        for (let item of list) {
            await db.chapter.update({
                where: {
                    id: item.id
                },
                data: { position: item.position }
            })
        }

        return NextResponse.json({ message: "Chapters reordered" }, { status: 200 });
    } catch (error) {
        console.log("[REORDER]", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}