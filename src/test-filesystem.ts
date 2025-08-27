// Quick test script for FileSystem module
import { FileSystem } from './fileSystem';

async function testFileSystem() {
  const fs = new FileSystem();
  
  console.log('Testing FileSystem module...\n');
  
  // Test 1: List current directory
  console.log('Test 1: List current directory');
  try {
    const items = await fs.listDirectory('.');
    console.log(`✅ Found ${items.length} items`);
    
    // Check sorting
    let lastWasDir = true;
    let sorted = true;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item && item.isDirectory === false && lastWasDir) {
        lastWasDir = false;
      } else if (item && item.isDirectory === true && !lastWasDir) {
        sorted = false;
        break;
      }
    }
    console.log(sorted ? '✅ Folders appear before files' : '❌ Sorting issue: files before folders');
    
    // Show first few items
    console.log('\nFirst 5 items:');
    items.slice(0, 5).forEach(item => {
      console.log(`  ${fs.formatItemName(item)}`);
    });
    
  } catch (error) {
    console.log('❌ Error:', error);
  }
  
  // Test 2: Check icons
  console.log('\n\nTest 2: Icon formatting');
  const testItems = [
    { name: 'test.txt', path: '/test.txt', isDirectory: false },
    { name: 'folder', path: '/folder', isDirectory: true }
  ];
  
  testItems.forEach(item => {
    const formatted = fs.formatItemName(item);
    const expectedIcon = item.isDirectory ? '📁' : '📄';
    const hasCorrectIcon = formatted.includes(expectedIcon);
    console.log(`${hasCorrectIcon ? '✅' : '❌'} ${formatted} - ${hasCorrectIcon ? 'correct icon' : 'wrong icon'}`);
  });
  
  // Test 3: Parent path
  console.log('\n\nTest 3: Parent path calculation');
  const testPaths = [
    { path: '/home/user/docs', expected: '/home/user' },
    { path: '/home', expected: '/' },
    { path: '/', expected: '/' }
  ];
  
  testPaths.forEach(test => {
    const parent = fs.getParentPath(test.path);
    const correct = parent === test.expected;
    console.log(`${correct ? '✅' : '❌'} ${test.path} -> ${parent} (expected: ${test.expected})`);
  });
  
  // Test 4: Root detection
  console.log('\n\nTest 4: Root detection');
  const rootTests = [
    { path: '/', expected: true },
    { path: '/home', expected: false },
    { path: '/home/user', expected: false }
  ];
  
  rootTests.forEach(test => {
    const isRoot = fs.isRoot(test.path);
    const correct = isRoot === test.expected;
    console.log(`${correct ? '✅' : '❌'} ${test.path} is${isRoot ? '' : ' not'} root`);
  });
  
  // Test 5: Path resolution
  console.log('\n\nTest 5: Path resolution');
  const home = process.env.HOME || '';
  const resolved = fs.resolvePath('~/Documents');
  const expected = `${home}/Documents`;
  console.log(`${resolved === expected ? '✅' : '❌'} ~/Documents -> ${resolved}`);
}

testFileSystem().catch(console.error);