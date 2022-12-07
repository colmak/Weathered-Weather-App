from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, logout


# Create your views here.
def index(request):
    return render(request, 'weathered/index.html')


def history(request):
    return render(request, 'weathered/history.html')


def topweather(request):
    return render(request, 'weathered/topweather.html')


def register_view(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST or None)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('index')

    else:
        form = UserCreationForm()

    return render(request, 'weathered/register.html', {'form': form})


def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('index')
    else:
        form = AuthenticationForm()

    return render(request, 'weathered/login.html', {'form': form})


def logout_view(request):
    logout(request)
    return redirect('index')


def profile_view(request):
    return render(request,'weathered/profile.html')
