"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import AddPackage from "@/components/admin/package/plan/AddPackage";

const index = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddPackage />
    </Suspense>
  );
};

export default dynamic(() => Promise.resolve(index), {
  ssr: false,
});
