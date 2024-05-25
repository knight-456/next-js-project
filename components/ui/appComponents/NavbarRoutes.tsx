"use client";

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { UserButton } from '@clerk/nextjs';

import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';

const NavbarRoutes = () => {

    const pathname = usePathname();

    const isTeacherPage = useMemo(() => pathname?.startsWith('/teacher'), [pathname]);
    const isPlayerPage = useMemo(() => pathname?.startsWith("/chapter"), [pathname])

    return (
        <div className={"flex gap-x-2 ml-auto"}>
            {(isTeacherPage || isPlayerPage) ? (
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
    )
}

export default NavbarRoutes;