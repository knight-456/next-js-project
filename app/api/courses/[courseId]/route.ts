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

        const course = await db.course.update({
            where: {
                id: courseId, userId: userId
            },
            data: { ...data }
        })

        return NextResponse.json({ data: course, message: "Updated Successfully!" }, { status: 200 });
    } catch (error) {
        // console.log("[GET COURSE]", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}