


//Get the file object binary, convert to downloadable object

async function getTheUpload(origin, primary_account_id, agency_id, agency_name, upload_id, requestOptions){

    // Get the file object

    const file = await fetch(`${origin}/uploads/${primary_account_id}/${agency_id}/${upload_id}/files`, requestOptions);
    const fileBlob = await file.blob();
    const fileUrl = URL.createObjectURL(fileBlob);

    // Create an anchor element

    const anchor = document.createElement("a");
    anchor.href = fileUrl
    anchor.download = `${agency_name}_${upload_id}`

    // Click anchor element to download file as zip

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor)
    URL.revokeObjectURL(fileUrl)

}

// Get the latest upload Id and pass it to getTheUpload()
// To download binary

async function fetchLatestUpload(origin, primary_account_id, agency_id, agency_name, requestOptions){

    // Create async request for the latest upload id.

    const fetch_response = await fetch(`${origin}/uploads/${primary_account_id}/${agency_id}/?limit=1`, requestOptions)
    // Await the response
    const data = await fetch_response.json()

    // Pass the upload id as an argument
    getTheUpload(origin, 
        primary_account_id, 
        agency_id, 
        agency_name,
        data.uploads[0].id_, 
        requestOptions)
}

/*
Chrome storage content

'origin': window.origin,
'active_agency_id': active_agency.id,
'active_agency_pid': active_agency.primary_account_id,
'active_agency_name': active_agency.name,
'token': window.localStorage.access_token
*/

document.addEventListener('DOMContentLoaded', function() {

    var link = document.getElementById('get-upload-btn');
    // onClick's logic below:

    link.addEventListener('click', async () => {
        const response = await GetStorageItems.getItemFromKey('local_storage')
        const chrome_local =  response.local_storage
        // Create a new headers object
        const myHeaders = new Headers();

        // Get the active agency information

        // Add the token to the headers for the fetch requests
        myHeaders.append("Authorization", `Bearer ${chrome_local.token}`);
        myHeaders.append("Cache-Control", "no-cache");


        // Set request options
        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        
        // Get the upload Id
        fetchLatestUpload(chrome_local.origin, 
            chrome_local.active_agency_pid, 
            chrome_local.active_agency_id, 
            chrome_local.active_agency_name, 
            requestOptions);
    });
    
});