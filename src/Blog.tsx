import React, { useState, useEffect } from 'react';
import TopBar from './Topbar';
import { useNavigate } from 'react-router-dom';
import f2 from './usefilesystem';


console.log(f2);
// 展平结构


const initialBlogList = [
  { title: "Blog 1", category: "Category 1", date: "2021-07-01" },
  { title: "Blog 2", category: "Category 2", date: "2021-07-02" },
  { title: "Blog 3", category: "Category 3", date: "2021-07-03" },
  { title: "Blog 4", category: "Category 4", date: "2021-07-04" }
];

// Expand the initial list
const timesToExpand = 4;
let expandedBlogList = [...initialBlogList];
for (let i = 0; i < timesToExpand; i++) {
  expandedBlogList = expandedBlogList.concat(expandedBlogList);
}

enum SortMethod {
  TITLE = 'title',
  CATEGORY = 'category',
  DATE = 'date'
}

const Blog = () => {
  const [blogList, setBlogList] = useState(expandedBlogList);

  const [, setCurSort] = useState(SortMethod.TITLE);


  const sortByTitle = () => {
    setCurSort(SortMethod.TITLE);
    setBlogList([...blogList].sort((a, b) => a.title.localeCompare(b.title)));
  };

  const sortByCategory = () => {
    setCurSort(SortMethod.CATEGORY);
    setBlogList([...blogList].sort((a, b) => a.category.localeCompare(b.category)));
  };

  const sortByDate = () => {
    setCurSort(SortMethod.DATE);
    setBlogList([...blogList].sort((a, b) => a.date.localeCompare(b.date)));
  };
  const navigate = useNavigate();
  const handleNavigation = (id: string) => {
    navigate(`/blog/${id}`);
  };

  // const { fileSystem, flattenedFileSystem, flattenFileSystem,findItemByID } = useFileSystemStore();

  // useEffect(() => {
  //     flattenFileSystem();
  // }, [fileSystem, flattenFileSystem]);

  return (
    <>
      <div className="h-screen w-screen text-xs font-normal pt-10">
        <TopBar />
        <div className='hidden xl:block w-1/3 absolute mx-3 mt-12'>
          <div className='w-full border bg-neutral-200 aspect-square'>
            {/* Additional content */}
          </div>
        </div>
        <div className="h-full w-screen flex flex-col uppercase font-semibold relative xl:pl-3">
          <div className="flex gap-4 px-3 hover:cursor-pointer pb-3 w-screen xl:w-2/3 ml-auto">
            <p className="w-1/4 relative" onClick={sortByTitle}>
              Title
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-[15px] absolute translate-x-[31px] -translate-y-[15.5px]">
                <path fillRule="evenodd" d="M8 14a.75.75 0 0 0 .75-.75V4.56l1.22 1.22a.75.75 0 1 0 1.06-1.06l-2.5-2.5a.75.75 0 0 0-1.06 0l-2.5 2.5a.75.75 0 0 0 1.06 1.06l1.22-1.22v8.69c0 .414.336.75.75.75Z" clipRule="evenodd" />
              </svg>
            </p>
            <p className="w-1/3 lg:w-1/2 translate-x-1" onClick={sortByCategory}>Tag</p>
            <p className="w-1/3 translate-x-1 lg:w-1/4" onClick={sortByCategory}>Category</p>
            <p className="w-[92px]" onClick={sortByDate}>Date</p>
          </div>


          <div className='w-screen xl:w-2/3 ml-auto'>
            {f2.map((blog, index) => (
              <div onClick={() => handleNavigation(blog.id!)}
                key={index}
                className="flex justify-between font-normal gap-4 px-3 hover:font-semibold hover:text-neutral-500 hover:underline cursor-pointer">
                <p className="w-1/4">{blog.name}</p>
                <p className="w-1/3 lg:w-1/2 translate-x-1">{blog.id}</p>
                <p className="w-1/3 lg:w-1/4 flex -translate-x-1">
                  <svg className='size-2 translate-y-1 -translate-x-1'>
                    <circle cx="4" cy="4" r="4" fill="red" />
                  </svg>
                  {blog.path}
                </p>
                <p className="w-[92px]">{blog.path}</p>
              </div>
            ))}
          </div>
          <div className="h-4"></div>
        </div>
        {/* Optionally render file system structure for debugging */}
        {/* <div className="debug">
          <pre>{JSON.stringify(fileSystem, null, 2)}</pre>
        </div> */}
      </div>
    </>
  );
};

export default Blog;