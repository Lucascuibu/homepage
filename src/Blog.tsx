import { useEffect, useState } from 'react';
import TopBar from './Topbar';

class FileSystemItem {
  constructor(name) {
    this.name = name;
  }
}

class File extends FileSystemItem {
  constructor(name) {
    super(name);
    this.type = 'file';
  }
}

class Directory extends FileSystemItem {
  constructor(name, contents = []) {
    super(name);
    this.type = 'directory';
    this.contents = contents;
  }
}

function parseFileSystem(json) {
  if (json.type === 'file') {
    return new File(json.name);
  } else if (json.type === 'directory') {
    const contents = json.contents.map(parseFileSystem);
    return new Directory(json.name, contents);
  }
}

async function fetchAndParseFileSystem(url) {
  console.log('Fetching JSON from URL:', url);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    console.log(json);
    const fileSystem = parseFileSystem(json);
    console.log(fileSystem);
    return fileSystem;
  } catch (error) {
    console.error('Failed to fetch or parse JSON:', error);
  }
}

const fetchedFileSystem = async() => await fetchAndParseFileSystem("http://10.0.0.106:8080/structure.json");
      console.log(fetchedFileSystem);

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
  const [fileSystem, setFileSystem] = useState(null);
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

  // useEffect(() => {
  //   const fetchData = async () => {
      
  //     setFileSystem(fetchedFileSystem); // Store the fetched file system in state
  //   };
  //   fetchData();
  // }, []);

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
            {blogList.map((blog, index) => (
              <div key={index} className="flex justify-between font-normal gap-4 px-3 hover:font-semibold hover:text-neutral-500 hover:underline cursor-pointer">
                <p className="w-1/4">{blog.title}</p>
                <p className="w-1/3 lg:w-1/2 translate-x-1"></p>
                <p className="w-1/3 lg:w-1/4 flex -translate-x-1">
                  <svg className='size-2 translate-y-1 -translate-x-1'>
                    <circle cx="4" cy="4" r="4" fill="red" />
                  </svg>
                  {blog.category}
                </p>
                <p className="w-[92px]">{blog.date}</p>
              </div>
            ))}
          </div>
          <div className="h-4"></div>
        </div>
        {/* Optionally render file system structure for debugging */}
        <div className="debug">
          <pre>{JSON.stringify(fileSystem, null, 2)}</pre>
        </div>
      </div>
    </>
  );
};

export default Blog;