const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const app = express();
const config = require('./server/config/config');
const db = require('./server/config/db');
const path = require('path');

//  Configuration to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const employeesHiredQuarters = require('./server/routes/employees_hired_quarters');
const departmentsAboveMean = require('./server/routes/departments_above_mean');

app.use(bodyParser.json());
app.use(fileUpload());

// Use routes
app.use('/api', employeesHiredQuarters);
app.use('/api', departmentsAboveMean);

// Function to process CSV file without headers
function processCsvFile(csvFile, model, columns, batchSize, callback) {
  const csvData = csvFile.data.toString('utf8');
  const lines = csvData.split('\n').filter(line => line.trim() !== '');

  const rows = lines.map(line => {
    const values = line.split(',').map(value => value.trim());
    const row = {};
    columns.forEach((column, index) => {
      if (column) {
        if (column === 'hire_datetime' && values[index] === '') {
          row[column] = null;
        } else if (column === 'name' && values[index] === '') {
          row[column] = null;
        } else {
          row[column] = values[index] !== undefined ? values[index] : null;
        }
      }
    });
    return row;
  });

  let errors = [];
  let processedCount = 0;

  // Función para insertar un lote de registros
  function insertBatch(batch, callback) {
    let batchProcessedCount = 0;
    batch.forEach((row, rowIndex) => {
      // Validar fecha si el modelo es "hired_employees" y no es null
      if (row.hire_datetime) {
        const date = new Date(row.hire_datetime);
        if (isNaN(date.getTime())) {
          errors.push(`Invalid date value at row ${rowIndex + 1}`);
          batchProcessedCount++;
          if (batchProcessedCount === batch.length) {
            callback();
          }
          return;
        }
      }

      model.insert(row, (err, result) => {
        if (err) {
          errors.push(`Error at row ${rowIndex + 1}: ${err.message}`);
        }
        batchProcessedCount++;
        processedCount++;
        if (batchProcessedCount === batch.length) {
          callback();
        }
      });
    });

    if (batch.length === 0) {
      callback();
    }
  }

  // Split records into batches and process them
  const totalBatches = Math.ceil(rows.length / batchSize);
  let currentBatch = 0;

  function processNextBatch() {
    if (currentBatch < totalBatches) {
      const start = currentBatch * batchSize;
      const end = start + batchSize;
      const batch = rows.slice(start, end);
      currentBatch++;
      insertBatch(batch, processNextBatch);
    } else {
      callback(errors);
    }
  }

  processNextBatch();
}


// CSV upload endpoint
app.post('/upload-csv', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const departmentFile = req.files.departmentFile;
  const jobFile = req.files.jobFile;
  const employeeFile = req.files.employeeFile;
  const batchSize = 1000; // Define the batch size here

  let filesToProcess = 0;
  let errors = [];

  function checkIfDone() {
    if (filesToProcess === 0) {
      if (errors.length > 0) {
        res.status(500).json({ errors });
      } else {
        res.send('CSV files processed successfully.');
      }
    }
  }

  if (departmentFile) {
    filesToProcess++;
    const model = require('./server/models/department');
    processCsvFile(departmentFile, model, ['id', 'name'], batchSize, (fileErrors) => {
      errors = errors.concat(fileErrors);
      filesToProcess--;
      checkIfDone();
    });
  }

  if (jobFile) {
    filesToProcess++;
    const model = require('./server/models/job');
    processCsvFile(jobFile, model, ['id', 'name'], batchSize, (fileErrors) => {
      errors = errors.concat(fileErrors);
      filesToProcess--;
      checkIfDone();
    });
  }

  if (employeeFile) {
    filesToProcess++;
    const model = require('./server/models/employee');
    processCsvFile(employeeFile, model, ['id', 'name', 'hire_datetime', 'department_id', 'job_id'], batchSize, (fileErrors) => {
      errors = errors.concat(fileErrors);
      filesToProcess--;
      checkIfDone();
    });
  }

  // If no file is uploaded, send reply
  if (filesToProcess === 0) {
    res.status(400).send('No valid files were uploaded.');
  }
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
