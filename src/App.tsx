// import React, { useEffect } from "react";
// import { useBearStore } from "./store";
// import { Button } from "@/components/ui/button";
import _ from "lodash";
import { format } from "date-fns";
import TopBar from './Topbar';




function MyComponent() {

  _.difference([2, 1], [2, 3]);
  console.log(format(new Date(), "'Today is a' ee"));

  return null;
}




// function BearCounter() {
//   const bears = useBearStore((state) => state.bears);
//   return <h1>{bears} bears around here...</h1>;
// }




function App() {
  // const inc = useBearStore((state) => state.addABear);
  MyComponent();
  return (
    <>
      <div className="h-screen w-screen text-xs font-normal pt-10">
        <TopBar />
        <div className="h-full w-screen flex flex-col p-3">
          <div className="border bg-neutral-100 border-black w-full h-full mb-10">
            {/* Main content */}
          </div>
          <div className="mt-auto text-sm flex justify-between px-1">
            <p className="">Here we put some tex</p>
            <p className="hover:text-neutral-400 cursor-pointer">View Code/Project</p>
          </div>
        </div>
        {/* Display the parsed markdown */}

        {/* <div className="pt-10">
          <Button onClick={inc}>Click me</Button> 
          <BearCounter />
        </div> */}
      </div>
    </>
  );
}

export default App;