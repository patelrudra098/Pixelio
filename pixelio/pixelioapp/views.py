from django.shortcuts import render
from django.contrib import messages
from pixelioapp.models import Contact
# Create your views here.
def index(request):
    return render(request,"index.html")
def contact(request):
    if request.method=="POST":
        name=request.POST.get("name")
        email=request.POST.get("email")
        desc=request.POST.get("desc")
        
        myquery=Contact(name=name,email=email,desc=desc)
        myquery.save()
        messages.info(request,"feedback submitted!")
        return render(request,"about.html")


    
def home(request):
    return render(request,"home.html")

def about(request):
    return render(request,"about.html")

# def login(request):
#     return render(request,"login.html")

# def register(request):
#     return render(request,"register.html")