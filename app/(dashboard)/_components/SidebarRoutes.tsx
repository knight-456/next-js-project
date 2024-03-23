"use client";

import { guestRoutes } from "./sidebar.data";
import SidebarItem from "./SidebarItem";

export const SidebarRoutes = () => {

    const routes = guestRoutes

    return (
        <div className={"w-full flex flex-col"}>
            {routes.map((route) => (
                <SidebarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    )
}