// Minimal fs mock for browser environment
export default {
  existsSync: () => false,
  readFileSync: () => '',
  writeFileSync: () => {},
  mkdirSync: () => {},
  statSync: () => ({ isDirectory: () => false, isFile: () => false }),
  readdirSync: () => []
};
