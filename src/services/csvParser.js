const fs = require('fs').promises;
const dot = require('dot-object');

class CSVParserService {

  constructor() {}

  /**
   * Parses a CSV file and returns an array of objects
   * @param {string} filePath - Path to the CSV file
   * @returns {Promise<Object[]>} - Array of objects representing the CSV records
   */
  async parseCSV(filePath) {
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const lines = fileContent.split('\n').map(line => line.trim()).filter(Boolean);
      const headers = this.parseHeaders(lines[0]);
      const records = this.parseRecords(headers, lines.slice(1));
      return records;
    } catch (error) {
      throw new Error(`CSV parsing failed: ${error.message}`);
    }
  }

  /**
   * Parses the header line of the CSV file
   * @param {string} headerLine - The first line of the CSV file
   * @returns {string[]} - Array of header names
   */
  parseHeaders(headerLine) {
    return headerLine.split(',').map(header => header.trim());
  }

  /**
   * Parses the records of the CSV file
   * @param {string[]} headers - Array of header names
   * @param {string[]} dataLines - Array of lines containing the CSV data
   * @returns {Object[]} - Array of objects representing the CSV records
   */
  parseRecords(headers, dataLines) {
    return dataLines.map(line => {
      const values = line.split(',').map(value => value.trim());
      const record = {};
      
      headers.forEach((header, index) => {
        record[header] = values[index];
      });
      
      return dot.object(record);
    });
  }

  /**
   * Validates if the uploaded file is a valid CSV file
   * @param {Express.Multer.File} file - The uploaded file object
   * @returns {Object} Validation result with isValid flag and message
   */
  async validateCSVFile(file) {
    try {
      // mime type
      if (!(file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel')) {
        return {
          isValid: false,
          message: 'Invalid file type. Only CSV files are allowed.'
        };
      }
  
      // file extension
      const fileExtension = file.originalname.split('.').pop().toLowerCase();
      if (fileExtension !== 'csv') {
        return {
          isValid: false,
          message: 'Invalid file extension. Only .csv files are allowed.'
        };
      }
  
      // file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        return {
          isValid: false,
          message: 'File too large. Maximum size is 5MB.'
        };
      }

      // required headers
      const requiredHeaders = ['name.firstName', 'name.lastName', 'age'];
      const fileContent = await fs.readFile(file.path, 'utf-8');
      const firstLine = fileContent.split('\n')[0].trim();
      const headers = this.parseHeaders(firstLine);
      
      for (const requiredHeader of requiredHeaders) {
        if (!headers.includes(requiredHeader)) {
          return {
            isValid: false,
            message: `Required header "${requiredHeader}" is missing in the CSV file.`
          };
        }
      }
  
      return {
        isValid: true,
        message: 'File is valid'
      };

    } catch (error) {
      console.error('[CSVParserService] Error validating CSV file:', error);
      return {
        isValid: false,
        message: `File validation failed: ${error.message}`
      };
    }
  }
}

module.exports = new CSVParserService();