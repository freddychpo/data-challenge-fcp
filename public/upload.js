document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var formData = new FormData();
    formData.append('departmentFile', document.getElementById('departmentFile').files[0]);
    formData.append('jobFile', document.getElementById('jobFile').files[0]);
    formData.append('employeeFile', document.getElementById('employeeFile').files[0]);

    fetch('/upload-csv', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert('CSV files uploaded successfully!');
        } else {
            alert('Failed to upload CSV files!');
        }
    })
    .catch(error => {
        console.error('Error uploading CSV files:', error);
        alert('Error uploading CSV files. Please try again later.');
    });
});
