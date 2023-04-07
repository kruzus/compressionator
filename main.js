const sharp = require('sharp');
const fs = require('fs');

const maxFileSizeInBytes = 1000000; // 1 MB
const [filename] = process.argv.slice(2); // slice off the first two arguments

try {
    if (!filename) {
      throw new Error('Please provide an image filename to the sharp function.');
    }
    
    sharp(filename)
      .resize({ width: 1280 })
      .toBuffer((err, data, info) => {
        if (err) throw err;
    
        let quality = 85;
        let buffer = data;
    
        // Reduce image quality until file size is less than maxFileSizeInBytes
        while (buffer.length > maxFileSizeInBytes && quality > 0) {
          quality -= 5;
          buffer = sharp(data).jpeg({ quality }).toBuffer();
        }
    
        fs.writeFileSync('output.jpg', buffer);
    
        console.log(`Original file size: ${info.size}`);
        console.log(`Compressed file size: ${buffer.length}`);
        console.log(`Compression quality: ${quality}%`);
      });
  } catch (err) {
    console.error(err.message);
  }
  
