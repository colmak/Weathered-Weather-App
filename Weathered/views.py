from django.shortcuts import render

from Weathered.models import Reaction


# Create your views here.
def index(request):

    return render(request, 'weathered/index.html')


def history(request):
    reaction = Reaction.objects.all()
    context = {'reactions': reaction}
    return render(request, 'weathered/history.html', context)



