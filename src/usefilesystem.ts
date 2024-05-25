// import create, { StateCreator } from 'zustand';
// import { persist } from 'zustand/middleware';
import hashSum from 'hash-sum';
import structure from '../public/Notes/structure.json';


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

// interface FileSystemStore {
//   fileSystem: FileTree;
//   flattenedFileSystem: FileSystemItem[];
//   flattenFileSystem: () => void;
//   findItemByID: (id: string) => FileSystemItem | undefined;
// }

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

// const useFileSystemStore = create<FileSystemStore>(
//   persist<FileSystemStore>(
//     (set, get) => ({
//       fileSystem: f,
//       flattenedFileSystem: [],
//       flattenFileSystem: () => {
//         const fileSystem = get().fileSystem;
//         // console.log("Current file system in store:", fileSystem);
//         const flattened = flattenFileSystemHelper(fileSystem);
//         // console.log("Flattened file system:", flattened);
//         set({ flattenedFileSystem: flattened });
//       },
//       findItemByID: (id: string) => {
//         const fileSystem = get().fileSystem;
//         return findItemByIDHelper(id, fileSystem);
//       },
//     }),
//     {
//       name: 'file-system-storage',
//       getStorage: () => localStorage, // 确保我们使用的是localStorage
//       serialize: (state) => {
//         // console.log("Serializing state:", state);
//         return JSON.stringify(state);
//       },
//       deserialize: (str) => {
//         const state = JSON.parse(str);
//         // console.log("Deserialized state:", state);/
//         return state;
//       },
//     }
//   ) as StateCreator<FileSystemStore, [], []>
// );

// export default useFileSystemStore;