"use client";

import { useState } from "react";
import AdminDashboardLayout from "../common/layout";
import General from "./General";
import Appearance from "./Appearance";
import Localization from "./Localization";
import Payments from "./Payments";
import Security from "./Security";
import Notifications from "./Notifications";


const index = () => {
    const [activeTab, setActiveTab] = useState("general");
    const tabs = [
        {
            label: "General",
            value: "general",
            content: <General key={"general"} />,
        },
        // {
        //     label: "Appearance",
        //     value: "appearance",
        //     content: <Appearance key={"appearance"} />,
        // },
        {
            label: "Localization",
            value: "localization",
            content: <Localization key={"localization"} />,
        },
        {
            label: "Payments",
            value: "payments",
            content: <Payments key={"payments"} />,
        },
        {
            label: "Security",
            value: "security",
            content: <Security key={"security"} />,
        },
        {
            label: "Notifications",
            value: "notifications",
            content: <Notifications key={"notifications"} />,
        },
    ];


    return <AdminDashboardLayout>
        <div className="row y-gap-20 justify-between items-center mb-5">
            <div className="col-auto">
                <h1 className="text-30 lh-14 fw-600">System Configuration & Settings</h1>
                <div className="text-15 text-light-1">
                    Manage global settings and configurations for the platform.
                </div>
            </div>
        </div>

        <div className="row px-10 mb-20">
            {tabs.map((item) => (
                <div className="col-auto px-5" key={item.value}>
                    <button
                        className={`text-14 px-10 fw-500 py-5 rounded-8 ${activeTab === item.value ? "bg-white" : "text-light-1"
                            }`}
                        onClick={() => setActiveTab(item.value)}
                    >
                        {item.label}
                    </button>
                </div>
            ))}
        </div>

        <div className="px-15">
            {tabs.map((item) => item.value === activeTab && item.content)}
        </div>
    </AdminDashboardLayout>
}

export default index;