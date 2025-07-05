// Mock fs module for browser environment
const fsMock = {
  existsSync: () => false,
  readFileSync: () => '',
  writeFileSync: () => {},
  mkdirSync: () => {},
  statSync: () => ({ 
    isDirectory: () => false, 
    isFile: () => false,
    isSymbolicLink: () => false,
    size: 0,
    mtime: new Date()
  }),
  readdirSync: () => [],
  promises: {
    readFile: () => Promise.resolve(''),
    writeFile: () => Promise.resolve(),
    mkdir: () => Promise.resolve(),
    readdir: () => Promise.resolve([]),
    stat: () => Promise.resolve({
      isDirectory: () => false,
      isFile: () => false,
      isSymbolicLink: () => false,
      size: 0,
      mtime: new Date()
    })
  }
};

module.exports = fsMock;
