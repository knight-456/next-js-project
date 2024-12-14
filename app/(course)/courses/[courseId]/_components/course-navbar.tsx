import React from 'react'

import { Chapter, Course, UserProgress } from '@prisma/client'

import NavbarRoutes from '@/components/appComponents/NavbarRoutes'

import CourseMobileSidebar from './course-mobile-sidebar'

interface courseNavbarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null
        })[]
    },
    progressCount: number
}

const CourseNavbar = ({
    course,
    progressCount
}: courseNavbarProps) => {

    return (
        <div className={"p-5 border-b h-full flex items-center bg-white shadow-sm"}>
            <CourseMobileSidebar course={course} progressCount={progressCount} />
            <NavbarRoutes />
        </div>
    )
}

export default CourseNavbar