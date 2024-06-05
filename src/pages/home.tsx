
import React from 'react';
const Home: React.FC = () => {
    return (
        <>
            <div className="h-full w-screen flex flex-col p-3">
                <div className="border bg-neutral-100 border-foreground w-full aspect-auto min-h-96 sm:aspect-square lg:aspect-[16/10] xl:aspect-[2/1] mb-5">
                </div>
                <div className="mt-auto text-sm flex justify-between px-1">
                    <p className="">Here we put some tex</p>
                    <p className="hover:text-neutral-400 cursor-pointer">View Code/Project</p>
                </div>
            </div>
        </>
    )
}
export default Home;