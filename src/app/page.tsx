import Banner from "@/components/Banner";
import Instruction from "@/components/Instruction";
import NewArivals from "@/components/NewArivals";

export default function Home() {
  return (
    <>
      <main>
        <Banner />
        <NewArivals />
        <Instruction />
      </main>
    </>
  );
}
