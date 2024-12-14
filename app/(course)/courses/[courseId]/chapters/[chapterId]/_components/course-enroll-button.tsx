"use client";

import React from 'react'

import { Button } from '@/components/ui/button';

import { formatPrice } from '@/lib/format';

type courseEnrollButtonProps = {
    courseId: string;
    price: number;
}

const CourseEnrollButton = ({ courseId, price }: courseEnrollButtonProps) => {

    return (
        <Button
            size={"sm"}
            className={"w-full md:w-auto"}
        >
            {`Enroll for ${formatPrice(price)}`}
        </Button>
    )
}

export default CourseEnrollButton;