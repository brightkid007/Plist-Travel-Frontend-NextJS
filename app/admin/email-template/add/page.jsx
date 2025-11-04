"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import DashboardPage from "@/components/admin/email-template/manage/add";

const index = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardPage />
    </Suspense>
  );
};

export default dynamic(() => Promise.resolve(index), {
  ssr: false,
});
