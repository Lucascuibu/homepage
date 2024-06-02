import hashSum from "hash-sum";
import structure from "../public/Notes//structure.json";

export interface FileSystemItem {
  id?: string;
  type: "file" | "directory";
  file_type?: string;
  name: string;
  path: string;
  category?: string;
  time: string;
}

interface File extends FileSystemItem {
  type: "file";
}

interface Directory extends FileSystemItem {
  type: "directory";
  contents: FileSystemItem[];
}

type FileTree = File | Directory;

const flattenFileSystemHelper = (item: FileSystemItem): FileSystemItem[] => {
  item.id = hashSum(item.path);
  item.category = item.path.split("/")[1];
  if (item.type === "file") {
    return [item];
  } else {
    const directory = item as Directory;
    const contents = directory.contents.flatMap(flattenFileSystemHelper);
    return [...contents];
  }
};

const f = JSON.parse(JSON.stringify(structure)) as FileTree;
const f2 = flattenFileSystemHelper(f).filter((item) => item.file_type === "Markdown");
export { f2 };

export async function fetchData() {
  try {
    const response = await fetch(
      "/api/Lucascuibu/Notes/5c00f2b3d4218c20917b4447900a1835fbfea62c/structure.json",
    );
    const data = (await response.json()) as FileTree;

    const filteredData = flattenFileSystemHelper(data).filter(
      (item) => item.file_type === "Markdown",
    );
    return filteredData;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const findItemByIDHelper = (
  id: string,
  item: FileSystemItem,
): FileSystemItem | undefined => {
  if (item.id === id) {
    return item;
  } else if (item.type === "directory") {
    const directory = item as Directory;
    for (const content of directory.contents) {
      return findItemByIDHelper(id, content);
    }
  }
  return undefined;
};

export function findpathByID(id: string, f2: FileSystemItem[]) {
  for (const item of f2) {
    if (item.id === id) {
      return item.path;
    }
  }
  return undefined;
}
