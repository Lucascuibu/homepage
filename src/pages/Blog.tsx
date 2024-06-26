import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchData, FileSystemItem, f2 } from '../utils/usefilesystem';


enum SortMethod {
  TITLE = 'title',
  CATEGORY = 'category',
  DATE = 'date'
}

const Blog = () => {
  const [blogList, setBlogList] = useState(f2);
  const [, setCurSort] = useState(SortMethod.TITLE);

  const sortByTitle = () => {
    setCurSort(SortMethod.TITLE);
    setBlogList([...blogList].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const sortByCategory = () => {
    setCurSort(SortMethod.CATEGORY);
    setBlogList([...blogList].sort((a, b) => a.type.localeCompare(b.type)));
  };

  const sortByDate = () => {
    setCurSort(SortMethod.DATE);
    setBlogList([...blogList].sort((a, b) => a.time.localeCompare(b.time)));
  };
  const navigate = useNavigate();
  const handleNavigation = (id: string) => {
    navigate(`/blog/${id}`);
  };


  return (
    <>

      <div className='hidden xl:block w-1/3 absolute mx-3 mt-12'>
        <div className='w-full border bg-neutral-200 aspect-square'>
        </div>
      </div>
      <div className="h-full w-screen flex flex-col uppercase font-semibold relative xl:pl-3">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 pl-3 pr-2 hover:cursor-pointer pb-3 w-screen xl:w-2/3 ml-auto">
          <p className="col-span-2 md:col-span-3" onClick={sortByTitle}>
            Title
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4 absolute translate-x-9 -translate-y-[18px]">
              <path fillRule="evenodd" d="M8 14a.75.75 0 0 0 .75-.75V4.56l1.22 1.22a.75.75 0 1 0 1.06-1.06l-2.5-2.5a.75.75 0 0 0-1.06 0l-2.5 2.5a.75.75 0 0 0 1.06 1.06l1.22-1.22v8.69c0 .414.336.75.75.75Z" clipRule="evenodd" />
            </svg>
          </p>
          <p className="hidden md:flex translate-x-1" onClick={sortByCategory}>Tag</p>
          <p className="hidden md:flex" onClick={sortByCategory}>Category</p>
          <p className="flex justify-end" onClick={sortByDate}>Date</p>
        </div>


        <div className='w-screen xl:w-2/3 ml-auto'>
          {blogList.map((blog, index) => (
            <div onClick={() => handleNavigation(blog.id!)}
              key={index}
              className="grid grid-cols-3 md:grid-cols-6 justify-between font-normal gap-4 pl-3 pr-2 hover:font-semibold hover:text-neutral-500 hover:underline cursor-pointer">
              <p className="col-span-2 md:col-span-3">{blog.name.split(".")[0]}</p>
              <p className="hidden md:flex translate-x-1">{blog.id}</p>
              <p className="hidden md:flex -translate-x-1">
                <svg className='size-2 translate-y-1 -translate-x-1'>
                  <circle cx="4" cy="4" r="4" fill="red" />
                </svg>
                {blog.category}
              </p>
              <p className="flex justify-end">{blog.time}</p>
            </div>
          ))}
        </div>
        <div className="h-4"></div>
      </div>

    </>
  );
};

export default Blog;