import dynamic from "next/dynamic";
import DashboardPage from "@/components/dashboard/dashboard/db-loyalty"

export const metadata = {
  title: "Loyalty Program || Plist Travel",
  description: "Enjoy our Loyalty Program",
};

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
