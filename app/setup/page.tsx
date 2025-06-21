"use server";

import SetupButton from './SetupButton';

export default async function Setup() {
  console.log("setup")
  // const data = await fetchData();
  // console.log("Data fetched:", data);
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div>Setup</div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <SetupButton type="thermostat" />
        <SetupButton type="lock" />
        <SetupButton type="light" />
      </div>
    </div>
  );
}
