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

function validateFileUpload(uploadImageElement) {
    var fileUploadPath = uploadImageElement.value;

    if (fileUploadPath == '') {
        alert("Please upload an image");
        return false;
    } 
    else {
        var extension = fileUploadPath.substring(fileUploadPath.lastIndexOf('.') + 1).toLowerCase();

        if (extension == "png" || extension == "jpeg" || extension == "jpg") {
            return true;
        }
        else {
            alert("Image filter only allows file types of PNG, JPG, and JPEG. ");
            return false;
        }
    }
}

function readURL(input) {
    let reader = new FileReader();
    let uploadImageView = document.getElementById('uploadImageView');
    if (input.files && input.files[0]) {
        reader.onload = function(e) {
            uploadImageView.setAttribute('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
    else{
        uploadImageView.setAttribute('src', '');
    }
}

document.oncontextmenu = new Function("return false;")
const csrfToken = getCookie('csrftoken');
let uploadImageForm = document.getElementById('uploadImageForm');
let uploadImage = document.getElementById('uploadImage');
let uploadImagePreviewTitle = document.getElementById('uploadImagePreviewTitle');

uploadImage.onchange = function() {
    if(document.getElementsByClassName('filterest-download-button').length > 0){
        let prevDownloadButton = document.getElementsByClassName('filterest-download-button')[0];
        prevDownloadButton.parentNode.removeChild(prevDownloadButton);
    }
    let filterestImagePreview = document.getElementsByClassName('filterest-image-preview')[0];
    let labelUploadImage = document.getElementById('labelUploadImage');
    let tempPath = "fakepath\\";

    if(this.value != ""){
        uploadImagePreviewTitle.innerText = "Uploaded Image";
        uploadImagePreviewTitle.setAttribute('class', 'filterest-upload-preview-title');
        filterestImagePreview.setAttribute('class', 'filterest-image-preview filterest-image-preview-view');
        labelUploadImage.setAttribute('class', 'filterest-file-input');
        let labelText = this.value.substring(this.value.indexOf(tempPath) + tempPath.length, this.value.length);
        if(labelText.length > 25){
            labelUploadImage.innerText = labelText.substring(0, 21) + "...";
        }
        else{
            labelUploadImage.innerText = labelText;
        }

        if(document.getElementsByClassName('filterest-button-submit')[0] == undefined){
            let labelSubmitUploadImage = document.createElement('label');
            labelSubmitUploadImage.innerText = "Submit";
            labelSubmitUploadImage.setAttribute('for', 'uploadImageButton');
            labelSubmitUploadImage.setAttribute('class', 'filterest-button-submit');
            filterestImagePreview.appendChild(labelSubmitUploadImage);
        }
    }
    else{
        uploadImagePreviewTitle.innerText = "";
        uploadImagePreviewTitle.setAttribute('class', '');
        filterestImagePreview.setAttribute('class', 'filterest-image-preview');
        labelUploadImage.setAttribute('class', 'filterest-file-input filterest-before-input');
        labelUploadImage.innerText = "Upload Photo";

        if(document.getElementsByClassName('filterest-button-submit')){
            document.getElementsByClassName('filterest-button-submit')[0].parentNode.removeChild(document.getElementsByClassName('filterest-button-submit')[0]);
        }
    }

    readURL(this);
}

uploadImageForm.onsubmit = function(e){
    e.preventDefault();
    let formData = new FormData();
    let uploadImage = document.getElementById('uploadImage');
    
    if(validateFileUpload(uploadImage)){
        formData.append("image", uploadImage.files[0]);
    
        axios({
            method: 'post',
            url: 'processImage/',
            data: formData,
            responseType: 'blob',
            headers: {
                'Content-Type': 'multipart/form-data',
                "X-CSRFToken": csrfToken
            }
        })
        .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            let uploadImageView = document.getElementById('uploadImageView');
            let filterestPreviewContainer = document.getElementsByClassName('filterest-image-preview')[0];
            const newDownloadButton = document.createElement('a');
            newDownloadButton.innerHTML = "<i class='fas fa-arrow-circle-down'></i>"
            newDownloadButton.setAttribute('class', 'filterest-download-button');
            newDownloadButton.href = url;
            newDownloadButton.setAttribute('download', 'filteredimage.jpg');

            if(filterestPreviewContainer.getElementsByClassName('filterest-download-button').length > 0){
                let prevDownloadButton = filterestPreviewContainer.getElementsByClassName('filterest-download-button')[0];
                prevDownloadButton.parentNode.removeChild(prevDownloadButton);
            }
            
            uploadImagePreviewTitle.innerText = "Filtered Image"
            uploadImagePreviewTitle.setAttribute('class', 'filterest-upload-preview-title');
            uploadImageView.setAttribute('src', url);
            filterestPreviewContainer.appendChild(newDownloadButton);
        })
        .catch(ex => {
            alert('Failed to process image, please upload another one');
        })
    }
}