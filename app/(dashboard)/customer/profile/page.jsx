"use client";

import dynamic from "next/dynamic";
import DashboardPage from "@/components/dashboard/dashboard/db-profile"

const ProfilePage = () => {
    return (
        <>
            <DashboardPage />
        </>
    );
};


export default dynamic(() => Promise.resolve(ProfilePage), {
    ssr: false,
});
