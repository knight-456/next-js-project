"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { guestRoutes, teacherRoutes } from "./sidebar.data";
import SidebarItem from "./SidebarItem";

export const SidebarRoutes = () => {
    const pathname = usePathname();

    const isTeacherPage = useMemo(() => pathname?.includes("/teacher"), [pathname]);

    const routes = useMemo(() => isTeacherPage ? teacherRoutes : guestRoutes, [isTeacherPage])

    return (
        <div className={"w-full flex flex-col"}>
            {routes.map((route, index) => (
                <SidebarItem
                    key={index}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    )
}