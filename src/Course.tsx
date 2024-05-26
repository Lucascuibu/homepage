function Courses() {
  return (
    <>
      <div className="h-full w-screen flex flex-col p-3">
        <div className=" bg-neutral-100 w-full h-max mb-4">
          <img src="/dgp.png" alt="dgp.png" className='object-contain align-middle xl:aspect-2/1' />
        </div>
        <div className=" text-sm flex justify-between px-1">
          <p className="">Introduction to Digital Geometry Processing</p>
          <p className="hover:text-neutral-400 cursor-pointer">View Code/Project</p>
        </div>
      </div>
    </>
  );
}

export default Courses;