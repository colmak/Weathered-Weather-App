from django.urls import path
from Weathered import views

urlpatterns = [
    path('', views.index, name="index"),
    path('history/', views.history, name="history"),
]
