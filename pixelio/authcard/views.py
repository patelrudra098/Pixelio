from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

def signup(request):
    if request.method == "POST":
        email = request.POST['email']
        password = request.POST['pass1']
        
        try:
            validate_email(email)
        except ValidationError:
            messages.warning(request, "Invalid email format")
            return render(request, 'signup.html')

        if "@" not in email:
            messages.warning(request, "Email must contain @ symbol")
            return render(request, 'signup.html')

        if len(email) < 4 or len(email) > 16:
            messages.warning(request, "Username should be between 4 and 16 characters")
            return render(request, 'signup.html')

        if len(password) < 8:
            messages.warning(request, "Password must be 8 characters long")
            return render(request, 'signup.html')
                           
        try:
            if User.objects.get(username=email):
                messages.info(request, "Email is Taken")
                return render(request, 'signup.html')
        except Exception as e:
            pass

        user = User.objects.create_user(email, email, password)
        user.save()

        return redirect('/auth/login/')
    return render(request, "signup.html")

def handlelogin(request):
    if request.method == "POST":
        username = request.POST['email']
        userpassword = request.POST['pass1']
        myuser = authenticate(username=username, password=userpassword)

        if myuser is not None:
            login(request, myuser)
            messages.success(request, "Login Success")
            return redirect('/home')
        else:
            messages.error(request, "Invalid Credentials")
            return redirect('/auth/login')

    return render(request, 'login.html')  

def handlelogout(request):
    logout(request)
    messages.info(request, "Logout Success")
    return redirect('/auth/login')
