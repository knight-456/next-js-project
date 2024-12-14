"use client";

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { UserButton } from '@clerk/nextjs';

import { LogOut } from 'lucide-react';

import { Button } from "@/components/ui/button";

import SearchInput from './search-input';

const NavbarRoutes = () => {

    const pathname = usePathname();

    const isTeacherPage = useMemo(() => pathname?.startsWith('/teacher'), [pathname]);
    const isCoursePage = useMemo(() => pathname?.startsWith("/courses"), [pathname])
    const isSearchPage = useMemo(() => pathname === "/search", [])

    return (
        <>
            {isSearchPage && (
                <div className={"hidden md:block"}>
                    <SearchInput />
                </div>
            )}
        <div className={"flex gap-x-2 ml-auto"}>
            {(isTeacherPage || isCoursePage) ? (
                <Link href={"/"}>
                    <Button size={"sm"} variant={"ghost"}>
                        <LogOut className={"h-4 w-4 mr-2"} />
                        {"Exit"}
                    </Button>
                </Link>
            ) : (
                <Link href={"/teacher/courses"}>
                    <Button size={"sm"} variant={"ghost"}>
                        {"Teacher Mode"}
                    </Button>
                </Link>
            )}
            <UserButton afterSignOutUrl={'/'} />
        </div>
        </>
    )
}

export default NavbarRoutes;