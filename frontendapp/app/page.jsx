import Wrapper from "@/components/layout/Wrapper";
import MainHome from "../app/(homes)/page";

export const metadata = {
  title: "Home || Plist - Travel Service Platform",
  description: "Plist - Travel Service Platform",
};

export default function Home() {
  return (
    <>
      <Wrapper>
        <MainHome />
      </Wrapper>
    </>
  );
}
