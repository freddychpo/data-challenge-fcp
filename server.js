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
function processCsvFile(csvFile, model, columns, callback) {
  console.log('CSV data:', csvFile.data.toString('utf8'));
  const csvData = csvFile.data.toString('utf8');
  const lines = csvData.split('\n').filter(line => line.trim() !== '');

  const rows = lines.map(line => {
    const values = line.split(',').map(value => value.trim());
    const row = {};
    columns.forEach((column, index) => {
      row[column] = values[index] !== undefined ? values[index] : null;
    });
    return row;
  });

  console.log('Rows to insert:', rows);

  let errors = [];
  let processedCount = 0;

  rows.forEach(row => {
    model.insert(row, (err, result) => {
      if (err) {
        errors.push(err.sqlMessage || err.message);
      }
      processedCount++;
      if (processedCount === rows.length) {
        callback(errors);
      }
    });
  });

  if (rows.length === 0) {
    callback(errors);
  }
}

// CSV upload endpoint
app.post('/upload-csv', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const departmentFile = req.files.departmentFile;
  const jobFile = req.files.jobFile;
  const employeeFile = req.files.employeeFile;

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
    processCsvFile(departmentFile, model, ['id', 'name'], (fileErrors) => {
      errors = errors.concat(fileErrors);
      filesToProcess--;
      checkIfDone();
    });
  }

  if (jobFile) {
    filesToProcess++;
    const model = require('./server/models/job');
    processCsvFile(jobFile, model, ['id', 'name'], (fileErrors) => {
      errors = errors.concat(fileErrors);
      filesToProcess--;
      checkIfDone();
    });
  }

  if (employeeFile) {
    filesToProcess++;
    const model = require('./server/models/employee');
    processCsvFile(employeeFile, model, ['id', 'name', 'hire_datetime', 'department_id', 'job_id'], (fileErrors) => {
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
