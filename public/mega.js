const uploadFile = async(input) =>{
    const fileInput = input;
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('file', file);
    return new Promise((resolve, reject) => {
        fetch('/upload', {
            method: 'POST', body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('File caricato con successo. Path:', data.Result);
            resolve(data);
        })
        .catch(error => {
            reject(error);
        });
    })
}

const downloadFile=async(fileName)=>{
    let body = {mega: fileName, name: 'test.txt'};
    try {
        const response = await fetch('/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlN0ZWZhbm8iLCJpYXQiOjE3MTUwMTIyMTIsImV4cCI6MTcxNTAxOTQxMn0.ZZSIlqewPKhG-qJ6a9VA9NjGTeSNpdwiHZ2tIx-aoa4"
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }

        const buffer = await response.arrayBuffer();
        const file = new File([buffer], response.headers.get('Content-Disposition').split('filename=')[1]);
        // Create a new URL object for the file
        const url = window.URL.createObjectURL(file);
        return url
    } catch (e) {
        console.error('Error during file download:', e);
    }
}

export { uploadFile, downloadFile};
