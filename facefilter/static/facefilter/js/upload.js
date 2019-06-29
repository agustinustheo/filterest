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
const csrfToken = getCookie('csrftoken')

let uploadImageForm = document.getElementById('uploadImageForm');


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
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'file.jpg');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        })
        .catch(ex => {
            alert('Error: check console for details');
            console.log(ex);
        })
    }
}