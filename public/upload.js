document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var formData = new FormData();
    var departmentFile = document.getElementById('departmentFile').files[0];
    var jobFile = document.getElementById('jobFile').files[0];
    var employeeFile = document.getElementById('employeeFile').files[0];

    var fileNames = [];
    if (departmentFile) {
        fileNames.push(departmentFile.name);
        formData.append('departmentFile', departmentFile);
    }
    if (jobFile) {
        fileNames.push(jobFile.name);
        formData.append('jobFile', jobFile);
    }
    if (employeeFile) {
        fileNames.push(employeeFile.name);
        formData.append('employeeFile', employeeFile);
    }

    fetch('/upload-csv', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log(response);
        if (response.ok) {
            alert(`CSV file(s) \n${fileNames.join('\n')} \nuploaded successfully!`);
        } else {
            return response.json().then(data => {
                throw new Error(data.errors ? data.errors.join('\n') : 'Failed to upload CSV files');});
        }
    })
    .catch(error => {
        console.error('Error uploading CSV files:', error);
        alert('Error uploading CSV files. Here is the error message:\n' + error.message);
    });
});
