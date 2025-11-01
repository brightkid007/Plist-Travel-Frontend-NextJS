"use client";

import dynamic from "next/dynamic";
import AddStaticPage from "@/components/admin/cms/manage/AddStaticPage";
import AddBanner from "@/components/admin/cms/manage/AddBanner";
import { useSearchParams } from "next/navigation";

const index = () => {
  const service = useSearchParams().get("service");
  return service == "static" ? <AddStaticPage /> : <AddBanner />;
};

export default dynamic(() => Promise.resolve(index), {
  ssr: false,
});
