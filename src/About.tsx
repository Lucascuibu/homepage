import TopBar from './Topbar';

function About() {
  return (
    <>
      <div className="h-screen w-screen text-xs font-normal pt-10 b overflow-y-hidden">
        <TopBar />

        <div className="h-full w-screen flex flex-col p-3">
          <div className="border bg-neutral-100 border-black w-full h-full mb-10">

          </div>
          <div className="mt-auto text-sm flex justify-between px-1">
            <p className="">Here we put some tex</p>
            <p className="hover:text-neutral-400 cursor-pointer">View Code/Project</p>
          </div>

        </div>
      </div>
    </>
  );
}

export default About;