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

    let errorSet = new Set();

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
                if (Array.isArray(data.errors)) {
                    data.errors.forEach(error => {
                        errorSet.add(error);
                    });
                } else {
                    errorSet.add(data.errors || 'Failed to upload CSV files');
                }
                throw new Error('Failed to upload CSV files');
            });
        }
    })
    .catch(error => {
        console.error('Error uploading CSV files:', error);
        if (error instanceof SyntaxError) {
            alert('Error uploading CSV files. The server returned invalid JSON.');
        } else {
            console.log('Error set:', errorSet);
            alert('Error uploading CSV files. Here is the error message:\n' + Array.from(errorSet).join('\n'));
        }
    });
});
