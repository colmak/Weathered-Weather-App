from django.shortcuts import render


# Create your views here.
def index(request):
    return render(request, 'weathered/index.html')


def history(request):
    return render(request, 'weathered/history.html')


def login(request):
    return render(request, 'weathered/login.html')


def register(request):
    return render(request, 'weathered/register.html')


def topweather(request):
    return  render(request, 'weathered/topweather.html')
