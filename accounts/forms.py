from django import forms
from django.contrib.auth.models import User

from .models import Profile


class UpdateUserForm(forms.ModelForm):
    username = forms.CharField(max_length=100, required=True, widget=forms.TextInput(attrs={'class': 'form-control'}))

    class Meta:
        model = User
        fields = ['username']


class UpdateProfileForm(forms.ModelForm):
    profile_pic = forms.ImageField(widget=forms.FileInput(attrs={'class': 'form-control-file'}))
    about = forms.CharField(widget=forms.Textarea(attrs={'class': 'form-control', 'rows': 5}))

    class Meta:
        model = Profile
        fields = ['profile_pic', 'about']
