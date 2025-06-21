
"use server";
import LiveStatus from './status';
export default async function Home() {
  console.log("Start")
  // const data = await fetchData();
  // console.log("Data fetched:", data);
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div>Hi</div>
      <LiveStatus/>
    </div>
  );
}
