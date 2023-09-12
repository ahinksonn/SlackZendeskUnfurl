const fs = require('fs');
const csvParser = require('csv-parser');

// Read the CSV file
const csvFilePath = 'data/ticket-fields-about.csv';
const jsonData = [];

fs.createReadStream(csvFilePath)
  .pipe(csvParser())
  .on('data', (row) => {
    jsonData.push(row);
  })
  .on('end', () => {
    // Convert JSON data to string and save to a file
    const jsonFilePath = 'data/ticket-fields-about.json';
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));

    console.log('CSV to JSON conversion completed.');
  });