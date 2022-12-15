from django.urls import path
from accounts import views

urlpatterns = [
    path('login/', views.login_view, name="login"),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register_view, name="register"),
    path('profile/', views.profile_view, name="profile"),
    path('display_profile/', views.display_profile_view, name="display_profile"),
    path('delete/', views.delete, name="delete"),
]
