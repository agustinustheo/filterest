from django.shortcuts import render
from django.http import HttpResponse
from facefilter.facefilter import imgmain as filterimg

# Create your views here.

def home(request):
  return render(request, 'facefilter/home.html')
  
def upload(request):
  return render(request, 'facefilter/upload.html')

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