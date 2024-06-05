function Courses() {
  return (
    <>
      <div className="h-full  max-w-screen-lg mx-auto  flex flex-col p-3">
        <div className="flex">
          <div className=" bg-neutral-100 w-1/2 md:w-1/3 h-full">
            <img src="/dgp.png" alt="dgp.png" className='object-cover ' />
          </div>
          <div className="flex flex-col pl-1 md:pl-4  justify-between md:mb-3 md:mt-1 text-pretty">
            <p className=" text-xl">Introduction to Digital Geometry Processing</p>
            <p className="hover:text-neutral-400 cursor-pointer">View Code/Project</p>
          </div>
        </div>

      </div>
    </>
  );
}

export default Courses;