import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs';

import { db } from '@/lib/db';

import SearchInput from '@/components/appComponents/search-input';
import { CoursesList } from '@/components/appComponents/courses-list';

import Categories from './_components/categories';

import { getCourses } from '@/actions/get-courses';

interface searchParamsProps {
    searchParams: {
        title: string;
        categoryId: string;
    }
}
const SearchPage = async ({
    searchParams
}: searchParamsProps) => {
    const {userId} = auth()

    if (!userId) {
        return redirect("/")
    }

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc"
        }
    })

    const courses = await getCourses({
        userId,
        ...searchParams
    })

    return (
        <>
            <div className={"px-6 pt-6 md:hidden md:mb-0 block"}>
                <SearchInput />
            </div>
            <div className={"p-6 space-y-4"}>
                <Categories items={categories} />
                <CoursesList items={courses} />
            </div>
        </>
    )
}

export default SearchPage;