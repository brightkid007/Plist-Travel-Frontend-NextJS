"use client";

import dynamic from "next/dynamic";
import DashboardPage from "@/components/dashboard/dashboard/db-loyalty"

const LoyaltyProgram = () => {
  return (
    <>
      <DashboardPage />
    </>
  );
};

export default dynamic(() => Promise.resolve(LoyaltyProgram), {
  ssr: false,
});
