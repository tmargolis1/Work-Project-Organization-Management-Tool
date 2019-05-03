<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>p5.js example</title>
    <style> body {padding: 0; margin: 0;} </style>
    <script src="p5/p5.js"></script>
    <script src="p5/addons/p5.dom.min.js"></script>
    <script src="p5/addons/p5.sound.min.js"></script>
    <script src="LoginScreenBackground.js"></script>
    <link rel="stylesheet" href="LoginScreenStyle.css">
    <script>
        console.log(window.location.pathname)
    </script>
  </head>
  <body>

    <!-- Container -->
    <div id="Container">

      <!-- Header -->
      <div id="Header">

        <div class="logo">
          <img class="logo-img" src="Icons/diamond.png" alt="">
          <div class="title">Co-Lab</div>
        </div>

        <div class="header-right">

           <div class="dropdown">
           <button class="dropbtn">
             <img class="login-img" src="Icons/plus.png" alt="">
           </button>
           <div class="dropdown-content">

             <!-- Form -->
             <div class="login-form">
                 <form action="register" name="register" onsubmit="return validateRegisterForm()">
                   <label for="name"><b>Username</b></label>
                   <input type="text" placeholder="Enter Username" name="name" autocomplete="off" maxlength="20" required>
                   <label for="pass"><b>Password</b></label>
                   <input type="password" placeholder="Enter Password" name="pass" maxlength="20" required>
                   <label for="repass"><b>Confirm</b></label>
                   <input type="password" placeholder="Renter Password" name="repass" maxlength="20" required>
                   <button type="submit">Register</button>
                 </form>
             </div>
             <!-- Validation -->
             <script>
                function validateRegisterForm() {
                  var name = document.forms["register"]["name"].value;
                  if (name.includes(",") || name.includes("\n") || name.includes(" ")) {
                    alert("Invalid Name");
                    return false;
                  }
                  var pass = document.forms["register"]["pass"].value;
                  var repass = document.forms["register"]["repass"].value;
                  if (pass.includes(",") || pass.includes("\n") || pass != repass) {
                    alert("Invalid Password");
                    return false;
                  }
                }
              </script>

           </div>
         </div>

          <div class="dropdown">
            <button class="dropbtn">
              <img class="login-img" src="Icons/user-3.png" alt="">
            </button>
            <div class="dropdown-content">

              <!-- Form -->
              <div class="login-form">
                  <form action="login" name="login" onsubmit="return validateLoginForm()">
                    <label for="name"><b>Username</b></label>
                    <input type="text" placeholder="Enter Username" name="name" autocomplete="off" maxlength="20" required>
                    <label for="pass"><b>Password</b></label>
                    <input type="password" placeholder="Enter Password" name="pass" maxlength="20" required>
                    <button type="submit">Login</button>
                  </form>
              </div>
              <!-- Validation -->
              <script>
                function validateLoginForm() {
                  var name = document.forms["login"]["name"].value;
                  if (name.includes(",") || name.includes("\n") || name.includes(" ")) {
                    alert("Invalid Name");
                    return false;
                  }
                  var pass = document.forms["login"]["pass"].value;
                  if (pass.includes(",") || pass.includes("\n")) {
                    alert("Invalid Password");
                    return false;
                  }
                }
              </script>
            </div>
          </div>

          <a class="help"><img class="help-img" src="Icons/info.png" alt=""></a>
        </div>
      </div>

      <!-- Body -->
      <div id="Body">

        <div class="sidebar">
          <div class="anchor-holder">
            <a href="#overview">Overview</a>
            <a href="#description">Description</a>
            <a href="#solution">Solution</a>
            <a href="#implementation">Implementation</a>
            <a href="#details">Details</a>
          </div>
        </div>

        <div class="content">
          <div class="overview" id='overview'>
            <h2>Overview</h2>
            <p>• We aim to design, develop, and implement a web based tool that can help parties and organizations communicate and organize task from day to day responsibilities to full scale projects. </p>
            <p>• Keeping all members of a project in the loop and informed can be a difficult, yet necessary, task. This tool would help to keep everyone on the same page and make organization easy and comprehensive.  </p>
          </div>
          <div class="description" id='description'>
            <h2>Description</h2>
            <p>• We wish to create a web based application that can be accessed by many users to facilitate effective communication and project organization. </p>
            <p>• To do this, we will implement a user/profile system to track activities and ownership. We will design a helpful online chat application to connect users and distribute ideas and information. Finally, we will give the users an opportunity to plan and organize tasks and objectives on a calendar based timeline that will display information effectively to all members of the project.</p>
          </div>
          <div class="solution" id='solution'>
            <h2>Solution</h2>
            <p>• We hope do design a nice looking front end application that can support different kinds of user systems and application windows. The 3 distinct applications, user profile and ownership, online chats and project chatrooms, and scheduling with use of a calendar, will be sectioned off to their own systems. These systems will then be integrated into the main application and connected to the front end. </p>
            <p>• The application will start at a login screen and then move into a single page that will make all the functionality and information accessible. This page will have a multi window layout to display both the active chatrooms and project calendar. This page will also include several sidebars for selecting and editing either projects, chatrooms, messages, or calendars. </p>
            <p>• File management and sharing, as well as, intensive database logging for chatrooms and messages is out of scope for the time being </p>
          </div>
          <div class="implementation" id='implementation'>
            <h2>Implementation</h2>
            <p>• Our proposed solution will include: </p>
            <ul>
              <li>Client-side technologies: HTML, CSS, JavaScript </li>
              <li>Server-side technologies: Java, JSP, Servlets </li>
              <li>Platform: Windows supported browsers </li>
              <li>Python/mySQL potentially for database </li>
            </ul>
          </div>
          <div class="details" id='details'>
            <h2>Details</h2>
            <p>• The sections of the project will be divided and distributed as follows:
                Login and Ownership: Nick Sienkiewicz
                Scheduling and Calendar Representation: Tommy Margolis
                Project Chatrooms: Jacob Sacdalan
                </p>
            <p>• The application will be locally hosted. </p>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div id="Footer">

        <div class="information">Information</div>
        <div class="links">Links</div>

        <div class="logo">
            <img class="logo-img" src="Icons/diamond.png" alt="">
        </div>

      </div>

    </div>
  </body>
</html>
