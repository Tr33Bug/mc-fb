import { FileSystem } from './fileSystem';

async function testEmptyDir() {
  const fs = new FileSystem();
  
  console.log('Testing empty directory handling...\n');
  
  try {
    const items = await fs.listDirectory('./test-empty');
    console.log(`✅ Empty directory handled: ${items.length} items`);
    if (items.length === 0) {
      console.log('✅ Correctly shows 0 items for empty directory');
    } else {
      console.log('❌ Unexpected items in empty directory:', items);
    }
  } catch (error) {
    console.log('❌ Error handling empty directory:', error);
  }
  
  // Test large directory
  console.log('\nTesting large directory (/usr/bin)...');
  try {
    const items = await fs.listDirectory('/usr/bin');
    console.log(`✅ Large directory handled: ${items.length} items`);
    if (items.length > 100) {
      console.log('✅ Successfully loaded 100+ files');
    }
  } catch (error) {
    console.log('❌ Error with large directory:', error);
  }
}

testEmptyDir().catch(console.error);