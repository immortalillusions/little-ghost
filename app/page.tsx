"use server";
import LiveStatus from './status';
export default async function Home() {
  console.log("Start")
  // const data = await fetchData();
  // console.log("Data fetched:", data);
  
  return (
    <LiveStatus/>
  );
}
