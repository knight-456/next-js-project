import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs';

import { CircleDollarSign, File, LayoutDashboard, ListChecks } from 'lucide-react';

import { IconBadge } from '@/components/appComponents/icon-badge';

import TitleForm from './_components/title-form';
import DescriptionForm from './_components/description-form';
import ImageForm from './_components/image.form';
import CategoryForm from './_components/category-form';
import PriceForm from './_components/price-form';
import AttachmentForm from './_components/attachment-form';
import ChapterForm from './_components/chapter-form';

import { db } from '@/lib/db';
import { Banner } from '@/components/appComponents/banner';
import Actions from './_components/actions';

const CourseDetailPage = async ({ params }: { params: { courseId: string } }) => {

    const { userId } = auth()

    if (!userId) {
        return redirect("/")
    }

    const courseDetail = await db.course.findUnique({
        where: {
            id: params.courseId,
            userId
        },
        include: {
            chapters: {
                orderBy: {
                    position: "asc"
                }
            },
            attachments: {
                orderBy: {
                    createdAt: "desc"
                }
            }
        }
    })

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc"
        }
    })

    if (!courseDetail) {
        return redirect("/")
    }

    const requiredFields = [
        courseDetail?.title,
        courseDetail?.description,
        courseDetail?.imageUrl,
        courseDetail?.price,
        courseDetail?.categoryId,
        courseDetail.chapters.some((chapter) => chapter.isPublished)
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length

    const completionText = `${completedFields}/${totalFields}`

    const isComplete = requiredFields.every(Boolean)

    return (
        <>
            {!courseDetail?.isPublished &&
                <Banner label={"This course is unpublished. It will not be visible to the students."} />
            }
            <div className={"p-6"}>
                <div className={"flex items-center justify-between"}>
                    <div className={"flex flex-col gap-y-2"}>
                        <h1 className={"text-2xl font-medium"}>
                            {"Course setup"}
                        </h1>
                        <span className={"text-sm text-slate-700"}>
                            {`Complete all fields ${completionText}`}
                        </span>
                    </div>

                    {/* Add action */}
                    <Actions
                        disabled={!isComplete}
                        courseId={params?.courseId}
                        isPublished={courseDetail.isPublished}
                    />
                </div>
                <div className={"grid grid-cols-1 md:grid-cols-2 gap-6 mt-16"}>
                    <div>
                        <div className={"flex items-center gap-x-2"}>
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className={"text-xl"}>
                                {"Customize your course"}
                            </h2>
                        </div>
                        <TitleForm
                            initialData={courseDetail}
                            courseId={courseDetail?.id}
                        />
                        <DescriptionForm
                            initialData={courseDetail}
                            courseId={courseDetail?.id}
                        />
                        <ImageForm
                            initialData={courseDetail}
                            courseId={courseDetail?.id}
                        />
                        <CategoryForm
                            initialData={courseDetail}
                            courseId={courseDetail?.id}
                            options={Object.values(categories)?.map((category) => ({
                                label: category?.name,
                                value: category?.id
                            }))}
                        />
                    </div>
                    <div className={"space-y-6"}>
                        <div>
                            <div className={"flex items-center gap-x-2"}>
                                <IconBadge icon={ListChecks} />
                                <h2 className={"text-xl"}>
                                    {"Course Chapters"}
                                </h2>
                            </div>
                            <ChapterForm
                                initialData={courseDetail}
                                courseId={courseDetail?.id}
                            />
                        </div>
                        <div>
                            <div className={"flex items-center gap-x-2"}>
                                <IconBadge icon={CircleDollarSign} />
                                <h2 className={"text-xl"}>
                                    {"Sell your course"}
                                </h2>
                            </div>
                            <PriceForm
                                initialData={courseDetail}
                                courseId={courseDetail?.id}
                            />
                        </div>
                        <div>
                            <div className={"flex items-center gap-x-2"}>
                                <IconBadge icon={File} />
                                <h2 className={"text-xl"}>
                                    {"Resources & Attachments"}
                                </h2>
                            </div>
                            <AttachmentForm
                                initialData={courseDetail}
                                courseId={courseDetail?.id}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CourseDetailPage;