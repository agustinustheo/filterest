from . import views
from django.urls import path
from django.conf.urls import url, include
from django.views.generic import ListView, DetailView

urlpatterns = [
    path('', views.home, name="filterest-facefilter-home"),
    path('upload/', views.upload, name="filterest-facefilter-upload"),
    path('upload/processImage/', views.processImage, name="filterest-facefilter-process-image"),
]