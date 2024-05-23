
function TopBar() {
    return (
        <div className="uppercase absolute top-0 w-screen h-10 border-black flex px-3 items-center justify-between xl:justify-normal">
            <a href={`/`} className=" hover:text-neutral-400 cursor-pointer xl:w-1/6">CHQYY4</a>

            <div className="flex gap-4 hover:*:text-neutral-400 *:cursor-pointer transition duration-1000 xl:w-1/2">
                <a href={`/graphics`}>Graphics</a>
                <a href={`/courses`}>Courses</a>
                <a href={`/photography`}>Photography</a>
                <a href={`/blog`}>Blog</a>
                <a href={`/single`}>SingleBlog</a>
            </div>

            <a href={`/about`} className="hover:text-neutral-400 cursor-pointer -translate-x-2 xl:ml-auto">About</a>
        </div>)
}

export default TopBar;