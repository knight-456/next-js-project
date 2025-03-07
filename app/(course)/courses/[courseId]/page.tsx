import React from 'react';
import { redirect } from 'next/navigation';

import { db } from '@/lib/db';

type courseDetailProps = {
    params: { courseId: string }
}

const CourseDetailPage = async ({ params }: courseDetailProps) => {
    const course = await db.course.findUnique({
        where: {
            id: params?.courseId
        },
        include: {
            chapters: {
                where: {
                    isPublished: true
                },
                orderBy: {
                    position: "asc"
                }
            }
        }
    });

    if (!course) {
        return redirect("/")
    }

    return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`)
}

export default CourseDetailPage