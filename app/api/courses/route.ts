import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server"
import { handleValidateGetCourse } from "./validator";

export async function POST(
    req: NextRequest,
) {
    try {
        const { userId } = auth();
        const { title } = await req.json();

        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const course = await db.course.create({
            data: {
                userId,
                title,
            }
        });

        return NextResponse.json({ data: course }, { status: 200 });
    } catch (error) {
        console.log("[CREATE COURSE]", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const response = await handleValidateGetCourse(req)
        console.log("api response", response)

        return response;
    } catch (error) {
        // console.log("[GET COURSE]", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}