import hashSum from 'hash-sum';
import structure from '/src/asset/Notes/structure.json';


const f = JSON.parse(JSON.stringify(structure)) as FileTree;
console.log("Initial structure:", f);

interface FileSystemItem {
  id?: string;
  type: 'file' | 'directory';
  name: string;
  path: string;
}

interface File extends FileSystemItem {
  type: 'file';
}

interface Directory extends FileSystemItem {
  type: 'directory';
  contents: FileSystemItem[];
}

type FileTree = File | Directory;


const flattenFileSystemHelper = (item: FileSystemItem): FileSystemItem[] => {
  item.id = hashSum(item.path);
  if (item.type === 'file') {
    return [item];
  } else {
    const directory = item as Directory;
    const contents = directory.contents.flatMap(flattenFileSystemHelper);
    return [ ...contents]; 
  }
};

const f2 = flattenFileSystemHelper(f);
export default f2;
console.log("Flattened structure:", f2);

const findItemByIDHelper = (id: string, item: FileSystemItem): FileSystemItem | undefined => {
  if (item.id === id) {
    return item;
  } else if (item.type === 'directory') {
    const directory = item as Directory;
    for (const content of directory.contents) {
     return findItemByIDHelper(id, content);
    }
  }
  return undefined;
};
