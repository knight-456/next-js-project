import React from 'react';
import { redirect } from 'next/navigation'

import { auth } from '@clerk/nextjs'

import { isTeacher } from '@/lib/teacher'

type Props = {
    children: React.ReactNode
}

const layout = ({ children }: Props) => {
    const { userId } = auth()

    if (!isTeacher(userId)) {
        return redirect("/")
    }
    return (
        <>
            {children}
        </>
    )
}

export default layout