const csvParser = require('../services/csvParser');
const recordProcessor = require('../services/recordProcessor');
const fs = require('fs');

class CSVController {
  
  /**
   * Processes the CSV file and inserts records into the database.
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
   */
  async processCSV(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No CSV file uploaded' });
      }

      const validationResult = csvParser.validateCSVFile(req.file);
      if (!validationResult.isValid) {
        return res.status(400).json({ message: validationResult.message });
      }

      const records = await csvParser.parseCSV(req.file.path);
      for (const record of records) {
        const processedRecord = recordProcessor.processRecord(record);
        await global.db.insertUser(
          processedRecord.name,
          processedRecord.age,
          processedRecord.address,
          processedRecord.additionalInfo
        );
      }

      const ageDistribution = recordProcessor.calculateAgeDistribution(records);
      console.log('\nAge-Group % Distribution');
      ageDistribution.forEach(({ group, percentage }) => {
        console.log(`${group}: ${percentage}%`);
      });

      try {
        fs.promises.unlink(req.file.path);
      } catch (cleanupError) {
        console.error('[processCSV] Error cleaning up file:', cleanupError);
      }

      return res.status(201).json({
        message: 'CSV processed successfully',
        ageDistribution 
      });
    } catch (error) {
      console.error('[processCSV] Error processing CSV:', error);

      if (req.file && req.file.path) {
        try {
          fs.promises.unlink(req.file.path);
        } catch (cleanupError) {
          console.error('[processCSV] Error cleaning up file:', cleanupError);
        }
      }
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
}

module.exports = new CSVController();