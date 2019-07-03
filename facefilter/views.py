from django.shortcuts import render
from django.http import HttpResponse
from . import imgmain as filterimg
from . import videomain as filtervideo

# Create your views here.

def home(request):
  return render(request, 'facefilter/index.html')
  
def upload(request):
  return render(request, 'facefilter/upload.html')
  
def video(request):
  return render(request, 'facefilter/video.html')

def processImage(request):
  if request.method == "POST":
    uploadedImg = request.FILES['image'].read()
    downloadImg = filterimg.process(uploadedImg)
    content_type = request.FILES['image'].content_type
    response = HttpResponse(downloadImg, content_type=content_type)
    response['Content-Disposition'] = "attachment;"
    return response
  else:
    response = JsonResponse({"error": "there was an error"})
    response.status_code = 403
    return response
    
def processVideo(request):
  if request.method == "POST":
    uploadedVideo = request.FILES['video'].read()
    downloadVideo = filtervideo.process(uploadedVideo)
    content_type = request.FILES['video'].content_type
    response = HttpResponse(downloadVideo, content_type=content_type)
    response['Content-Disposition'] = "attachment;"
    return response
  else:
    response = JsonResponse({"error": "there was an error"})
    response.status_code = 403
    return response