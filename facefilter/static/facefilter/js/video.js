function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function validateFileUpload(uploadVideoElement) {
    var fileUploadPath = uploadVideoElement.value;

    if (fileUploadPath == '') {
        alert("Please upload an video");
        return false;
    } 
    else {
        var extension = fileUploadPath.substring(fileUploadPath.lastIndexOf('.') + 1).toLowerCase();

        if (extension == "mp4" || extension == "avi") {
            return true;
        }
        else {
            alert("video filter only allows file types of AVI,and MP4.");
            return false;
        }
    }
}

function readURL(input) {
    let reader = new FileReader();
    let uploadVideoView = document.getElementById('uploadVideoView');
    if (input.files && input.files[0]) {
        reader.onload = function(e) {
            uploadVideoView.setAttribute('style', '');
            uploadVideoView.setAttribute('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
    else{
        uploadVideoView.setAttribute('style', 'display: none;');
        uploadVideoView.setAttribute('src', '');
    }
}

document.oncontextmenu = new Function("return false;")
const csrfToken = getCookie('csrftoken');
let uploadVideoForm = document.getElementById('uploadVideoForm');
let uploadVideo = document.getElementById('uploadVideo');
let uploadVideoPreviewTitle = document.getElementById('uploadVideoPreviewTitle');

uploadVideo.onchange = function() {
    if(document.getElementsByClassName('filterest-download-button').length > 0){
        let prevDownloadButton = document.getElementsByClassName('filterest-download-button')[0];
        prevDownloadButton.parentNode.removeChild(prevDownloadButton);
    }
    let filterestImagePreview = document.getElementsByClassName('filterest-video-preview')[0];
    let labeluploadVideo = document.getElementById('labeluploadVideo');
    let tempPath = "fakepath\\";

    if(this.value != ""){
        uploadVideoPreviewTitle.innerText = "Uploaded video";
        uploadVideoPreviewTitle.setAttribute('class', 'filterest-upload-preview-title');
        filterestImagePreview.setAttribute('class', 'filterest-video-preview filterest-video-preview-view');
        labeluploadVideo.setAttribute('class', 'filterest-file-input');
        let labelText = this.value.substring(this.value.indexOf(tempPath) + tempPath.length, this.value.length);
        if(labelText.length > 25){
            labeluploadVideo.innerText = labelText.substring(0, 21) + "...";
        }
        else{
            labeluploadVideo.innerText = labelText;
        }

        if(document.getElementsByClassName('filterest-button-submit')[0] == undefined){
            let labelSubmituploadVideo = document.createElement('label');
            labelSubmituploadVideo.innerText = "Submit";
            labelSubmituploadVideo.setAttribute('for', 'uploadVideoButton');
            labelSubmituploadVideo.setAttribute('class', 'filterest-button-submit');
            filterestImagePreview.appendChild(labelSubmituploadVideo);
        }
    }
    else{
        uploadVideoPreviewTitle.innerText = "";
        uploadVideoPreviewTitle.setAttribute('class', '');
        filterestImagePreview.setAttribute('class', 'filterest-video-preview');
        labeluploadVideo.setAttribute('class', 'filterest-file-input filterest-before-input');
        labeluploadVideo.innerText = "Upload Video";

        if(document.getElementsByClassName('filterest-button-submit')){
            document.getElementsByClassName('filterest-button-submit')[0].parentNode.removeChild(document.getElementsByClassName('filterest-button-submit')[0]);
        }
    }

    readURL(this);
}

uploadVideoForm.onsubmit = function(e){
    e.preventDefault();
    let formData = new FormData();
    let uploadVideo = document.getElementById('uploadVideo');
    
    if(validateFileUpload(uploadVideo)){
        formData.append("video", uploadVideo.files[0]);
    
        axios({
            method: 'post',
            url: 'processVideo/',
            data: formData,
            responseType: 'blob',
            headers: {
                'Content-Type': 'multipart/form-data',
                "X-CSRFToken": csrfToken
            }
        })
        .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            let uploadVideoView = document.getElementById('uploadVideoView');
            let filterestPreviewContainer = document.getElementsByClassName('filterest-video-preview')[0];
            const newDownloadButton = document.createElement('a');
            newDownloadButton.innerHTML = "<i class='fas fa-arrow-circle-down'></i>"
            newDownloadButton.setAttribute('class', 'filterest-download-button');
            newDownloadButton.href = url;
            newDownloadButton.setAttribute('download', 'filteredvideo.mp4');

            if(filterestPreviewContainer.getElementsByClassName('filterest-download-button').length > 0){
                let prevDownloadButton = filterestPreviewContainer.getElementsByClassName('filterest-download-button')[0];
                prevDownloadButton.parentNode.removeChild(prevDownloadButton);
            }
            
            uploadVideoPreviewTitle.innerText = "Filtered Video"
            uploadVideoPreviewTitle.setAttribute('class', 'filterest-upload-preview-title');
            uploadVideoView.setAttribute('src', url);
            filterestPreviewContainer.appendChild(newDownloadButton);
        })
        .catch(ex => {
            alert('Failed to process video, please upload another one');
        })
    }
}