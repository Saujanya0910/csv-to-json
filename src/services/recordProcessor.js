class RecordProcessorService {

  constructor() {}

  /**
   * Processes a list of records and returns a new list with transformed data.
   * @param {Object[]} records - The list of records to process.
   * @returns {Object[]} - The processed list of records.
   */
  processRecord(record) {
    const { name, age, ...rest } = record;
    const fullName = `${name.firstName} ${name.lastName}`;
    
    const address = {
      line1: rest.address?.line1 || '',
      line2: rest.address?.line2 || '',
      city: rest.address?.city || '',
      state: rest.address?.state || ''
    };
    
    delete rest.address;
    
    return {
      name: fullName,
      age: parseInt(age) || 0,
      address,
      additionalInfo: rest
    };
  }

  /**
   * Calculates the age distribution from a list of records.
   * @param {Object[]} records - The list of records to process.
   * @returns {Object[]} - The age distribution as an array of objects.
   */
  calculateAgeDistribution(records) {
    const distribution = {
      '<20': 0,
      '20-40': 0,
      '40-60': 0,
      '>60': 0
    };

    const total = records.length;

    records.forEach(record => {
      const age = parseInt(record.age);
      if (age < 20) distribution['<20']++;
      else if (age >= 20 && age < 40) distribution['20-40']++;
      else if (age >= 40 && age < 60) distribution['40-60']++;
      else distribution['>60']++;
    });

    return Object.entries(distribution).map(([group, count]) => ({
      group,
      percentage: ((count / total) * 100).toFixed(2)
    }));
  }
}

module.exports = new RecordProcessorService();