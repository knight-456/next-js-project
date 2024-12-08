import { NextRequest, NextResponse } from "next/server";

import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";

export async function handleValidateGetCourse(req: NextRequest) {

    console.log("inside function")
    const { userId } = auth()

    if (!userId) {
        return NextResponse.json({ data: null, message: "Unauthorized" }, { status: 401 });
    }

    const courseId = req.nextUrl.searchParams.get("courseId")

    if (!courseId) {
        return NextResponse.json({ data: null, message: "Missing courseId in query" }, { status: 400 });
    }

    const course = await db.course.findUnique({ where: { id: courseId } })

    if (!course) {
        return NextResponse.json({ message: "No Course Found!" }, { status: 400 })
    }

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId
    ]

    const totalFields = Object.keys(course)?.length
    const completedFields = requiredFields.filter(field => field != null).length;
    const response = {
        course,
        meta: {
            requiredFields: requiredFields.length,
            totalFields,
            completedFields,
        }
    }

    console.log("api response", response)

    return NextResponse.json({ data: response }, { status: 200 });
}