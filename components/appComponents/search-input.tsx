"use client";

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import qs from 'query-string';

import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';

import { useDebounce } from '@/hooks/use-debounce';

const SearchInput = () => {
    const [value, setValue] = useState("")

    const debouncedValue = useDebounce(value)

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const currentCategoryId = searchParams.get("categoryId")

    useEffect(() => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                categoryId: currentCategoryId,
                title: debouncedValue
            }
        }, { skipEmptyString: true, skipNull: true })
        router.push(url)
    }, [debouncedValue, currentCategoryId, router, pathname])

    return (
        <div className={"relative"}>
            <Search className={"w-4 h-4 absolute top-3 left-3 text-slate-600"} />
            <Input
                className={"w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"}
                placeholder={"Search for a course"}
                value={value}
                onChange={(event) => setValue(event.target.value)}
            />
        </div>
    )
}

export default SearchInput;