"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { BookOpen } from 'lucide-react';

import { IconBadge } from '@/components/appComponents/icon-badge';
import CourseProgress from '@/components/appComponents/course-progress';

import { formatPrice } from '@/lib/format';

type courseCardProps = {
    id: string;
    title: string;
    imageUrl: string;
    chaptersLength: number;
    price: number;
    progress: number | null;
    category: string
}

const CourseCard = ({
    id,
    title,
    imageUrl,
    price,
    chaptersLength,
    progress,
    category
}: courseCardProps) => {

    return (
        <Link href={`/courses/${id}`}>
            <div className={"group hover:shadow-sm transition overflow-hidden border rounded-lg h-full"}>
                <div className={"relative w-full aspect-video rounded-md overflow-hidden"}>
                    <Image
                        fill
                        className={"object-cover"}
                        alt={title}
                        src={imageUrl}
                    />
                </div>
                <div className={"p-3 flex flex-col"}>
                    <div className={"text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2"}>
                        {title}
                    </div>
                    <p className={"text-xs text-muted-foreground"}>
                        {category}
                    </p>
                    <div className={"my-3 flex items-center gap-x-2 text-sm md:text-sm"}>
                        <div className={"flex items-center gap-x-1 text-slate-500"}>
                            <IconBadge size={"sm"} icon={BookOpen} />
                            <span>
                                {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
                            </span>
                        </div>
                    </div>
                    {progress !== null ? (
                        <CourseProgress
                            variant={progress === 100 ? "success" : "default"}
                            size={"sm"}
                            value={progress}
                        />
                    ) : (
                        <p className={"text-md md:text-sm font-medium text-slate-700"}>
                            {formatPrice(price)}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default CourseCard