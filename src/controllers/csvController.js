const csvParser = require('../services/csvParser');
const recordProcessor = require('../services/recordProcessor');
const fs = require('fs').promises;

class CSVController {

  constructor() {}
  
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

      const validationResult = await csvParser.validateCSVFile(req.file);
      if (!validationResult.isValid) {
        return res.status(400).json({ message: validationResult.message });
      }

      const records = await csvParser.parseCSV(req.file.path);
      const processedRecords = records.map(r => recordProcessor.processRecord(r));

      await global.db.insertUsersInBulk(processedRecords);

      const currentAgeDistribution = recordProcessor.calculateAgeDistribution(processedRecords);
      console.log('\nCurrent Age-Group % Distribution');
      currentAgeDistribution.forEach(({ group, percentage }) => {
        console.log(`${group}: ${percentage}%`);
      });

      // calculate overall age distribution
      const allUsers = await global.db.getAllUsers();
      const overallAgeDistribution = recordProcessor.calculateAgeDistribution(allUsers);
      console.log('\nOverall Age-Group % Distribution');
      overallAgeDistribution.forEach(({ group, percentage }) => {
        console.log(`${group}: ${percentage}%`);
      });

      try {
        fs.unlink(req.file.path);
      } catch (cleanupError) {
        console.error('[CSVController] Error cleaning up file:', cleanupError);
      }

      return res.status(201).json({
        message: 'CSV processed successfully',
        data: {
          currentAgeDistribution,
          overallAgeDistribution,
          records: processedRecords
        }
      });
    } catch (error) {
      console.error('[CSVController] Error processing CSV:', error);

      if (req.file && req.file.path) {
        try {
          fs.unlink(req.file.path);
        } catch (cleanupError) {
          console.error('[CSVController] Error cleaning up file:', cleanupError);
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