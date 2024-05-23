import { useState } from 'react';
import TopBar from './Topbar';

let initialBlogList = [
  {
    "title": "Blog 1",
    "category": "Category 1",
    "date": "2021-07-01"
  },
  {
    "title": "Blog 2",
    "category": "Category 2",
    "date": "2021-07-02"
  },
  {
    "title": "Blog 3",
    "category": "Category 3",
    "date": "2021-07-03"
  },
  {
    "title": "Blog 4",
    "category": "Category 4",
    "date": "2021-07-04"
  }
];

// Expand the initial list
const timesToExpand = 4;
for (let i = 0; i < timesToExpand; i++) {
  initialBlogList = initialBlogList.concat(initialBlogList);
}

enum SortMethod {
  TITLE = 'title',
  CATEGORY = 'category',
  DATE = 'date'
}

const Blog = () => {
  const [blogList, setBlogList] = useState(initialBlogList);
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

  return (
    <>
      <div className="h-screen w-screen text-xs font-normal pt-10">
        <TopBar />
        <div className='hidden xl:block w-1/3 absolute mx-3 mt-12'>
            <div className='w-full border bg-neutral-200 aspect-square'>

            </div>
          </div>
        <div className="h-full w-screen flex flex-col uppercase font-semibold relative xl:pl-3">
         
          <div className="flex gap-4 px-3 hover:cursor-pointer pb-3 w-screen xl:w-2/3 ml-auto">
            <p className="w-1/2" onClick={sortByTitle}>Title</p>
            <p className="w-1/2" onClick={sortByCategory}>Category</p>
            <p className="w-[84px]" onClick={sortByDate}>Date</p>
          </div>
          <div className='w-screen xl:w-2/3 ml-auto'>

            {blogList.map((blog, index) => (
              <div key={index} className="  flex justify-between font-normal gap-4 px-3 hover:font-semibold hover:text-neutral-500 hover:underline cursor-pointer">
                <p className="w-1/2">{blog.title}</p>
                <p className="w-1/2 flex -translate-x-1">
                  <svg className='size-2 translate-y-1 -translate-x-1'>
                    <circle cx="4" cy="4" r="4" fill="red" />
                  </svg>
                  {blog.category}</p>
                <p className="w-[84px]">{blog.date}</p>
              </div>
            ))}
          </div>

          <div className="h-4"></div>
        </div>
      </div>
    </>
  );
};

export default Blog;