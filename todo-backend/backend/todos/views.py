from django.shortcuts import render, HttpResponse

# Create your views here.
def health_check(request):
    return HttpResponse("OK")