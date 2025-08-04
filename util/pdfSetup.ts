import * as FileSystem from 'expo-file-system';

export async function setupSamplePDF() {
  try {
    const samplePDFUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    const destination = FileSystem.documentDirectory + 'sample.pdf';
    
    const fileInfo = await FileSystem.getInfoAsync(destination);
    
    if (!fileInfo.exists) {
      await FileSystem.downloadAsync(samplePDFUrl, destination);
      console.log('Sample PDF downloaded successfully');
    } else {
      console.log('Sample PDF already exists');
    }
  } catch (error) {
    console.error('Error setting up sample PDF:', error);
  }
} 