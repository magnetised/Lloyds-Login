# Lloyds TSB Login Automation Script

Lloyds TSB have an unwieldy login system. This script automates the process of logging in and allows you to properly use password managers such as [1Password](http://agilewebsolutions.com/products/1Password).

What's wrong with Lloyds Current Login
--------------------------------------

The default Lloyds login is a two-step process.

1. Enter your user id and password in a standard form
2. Using pulldowns enter in various random charachers from a "memorable" string.

The idea of step 2 is probably to defeat key loggers by having a mouse based password entry step.

The problem is that unless you have a completely trivial "memorable" string you will need to refer to this string in order to pass the second step.

This makes logging in a pain and actively reduces the security of the process by guaranteeing that either you (a) have a trivial and easy to remember memorable string to make step 2 of the login easy or (b) you have a complex string and are forced to open this in plain view every time you want to login.

Neither of these solutions are very secure.

How this script helps
---------------------

This script allows you to enter the memorable string into a password field as you would with your password and then automates the second stage of the login process using Javascript.

This increases both the security and speed of logging in to your bank.

Security is increased because you can have a very complex, very un-memorable "memorable" string and not have to let anyone passing see it every time you login. Speed is improved because you only have to enter one set of info and avoid the tedious second stage completely because it's done for you.

For those worried about key loggers -- perhaps rightly so -- there is one simple solution: don't use a windows machine to log into your bank. Note that using 1Password on the Mac (or it's Windows equivalent) means that you never actually type anything and none of your login information appears on the screen at any point.

How it works
------------

Because this is your bank account and you're rightly extremely suspicious of anyone telling you they can make your login "easier", here is a blow by blow account of exactly what happens when you use this script.


1. You browse to the Lloyds TSB (personal) login page
2. You click the "Lloyds Login" bookmarklet you added earlier following the instructions below
3. The bookmarklet injects a <script> tag into the login page in order to load the login functions
4. This script tag loads from wherever you've hosted the files (this must be a remote location accessible via http. See below for instructions and recommendations)
5. the newly loaded script injects a CSS file in order to make things pretty 
6. then builds a new login form and overlays this on top of the original.

This is where the fun begins.

7. Using your secure password manager (e.g. [1Password](http://agilewebsolutions.com/products/1Password) on the Mac) you fill in this new form with your user id, super-strong password and unguessable memorable information
8. Then you hit login.
9. As part of its setup the script has added in an invisible iframe to the page and set the target of the original Lloyds login form to be this frame.
10. Using javascript, the original login form is filled in using the values you entered in step 7 and this form is submitted
11. The second stage login page loads into the iframe invisibly in the background
12. Once the second stage page has loaded the script (still running on the original page) is notified and sets the three pulldowns to the correct values using the memorable info you entered in step 7. 
13. It then sets the target of the form in the iframe to be the main window and submits to complete the process.

If all goes well you will now be taken to your account overview page. As you see, this is not a replacement of the Lloyds login procedure, or a workaround. It's a simple automation, recreating all of the steps you would normally have to do by hand using javascript code.

This script has been kept deliberately dependency free. What you see is what you get. Please feel free to read through to make sure that nothing dodgy is going on. Please do read through the source and you'll see that none of your login information is being sent to some remote website.

Installation
------------

To work this script must be installed on a web server. For your own security don't use anyone else's version of this file. Don't link directly to the file on GitHub. Don't use a version hosted on your friends server. You need to be sure that the script hasn't been tampered with since you installed it. 

If you already use [Dropbox](https://www.dropbox.com/referrals/NTI3MDI3Mjk) then the easiest thing to do is install the files into the "Public" directory.

If you don't then you're missing out, [Dropbox is fantastic](https://www.dropbox.com/referrals/NTI3MDI3Mjk).

Once you have the files safely online then make a note of the URL that will take you to the bookmarklet.html page (if you're using dropbox then right click on the 'bookmarklet.html' file, find the Dropbox options and select 'Copy public URL').

Navigate to this page in your default browser and drag the "Lloyds Login" link it gives you to your bookmarks bar.

Now, next time you want to login to your Lloyds account you simply navigate to the [Lloyds TSB login](https://online.lloydstsb.co.uk/customer.ibc) page and click the "Lloyds Login" (or whatever you renamed it to) bookmarklet.

Browser Compatibility
---------------------

This script has been tested on:

* Firefox 3 (Mac)
* Safari 4 (Mac)

If you have a browser where it doesn't work then please [let me know](http://github.com/magnetised/Lloyds-Login/issues).


