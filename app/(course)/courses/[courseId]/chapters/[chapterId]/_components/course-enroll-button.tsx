"use client";

import React, { useState } from 'react'

import { Button } from '@/components/ui/button';

import { formatPrice } from '@/lib/format';
import toast from 'react-hot-toast';
import courseService from '@/app/services/course/course.service';

type courseEnrollButtonProps = {
    courseId: string;
    price: number;
}

const CourseEnrollButton = ({ courseId, price }: courseEnrollButtonProps) => {

    const [isLoading, setIsLoading] = useState(false)

    const onClick = async () => {
        try {
            setIsLoading(true)

            const requestData = {
                params: {
                    courseId: courseId
                }
            }
            const response = await courseService.createCourseCheckoutDetail(requestData)
            if (response.status === 200) {
                window.location.assign(response.data.url)
            }
        } catch {
            toast.error("Something went wrong!")
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <Button
            size={"sm"}
            className={"w-full md:w-auto"}
            onClick={onClick}
            disabled={isLoading}
        >
            {`Enroll for ${formatPrice(price)}`}
        </Button>
    )
}

export default CourseEnrollButton;