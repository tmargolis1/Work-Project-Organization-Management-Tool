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
    <!-- <script src="LoginScreenBackground.js"></script> -->
    <link rel="stylesheet" href="MainScreenStyle.css">
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

          <div class="project-title">
            Project Title
          </div>

          <div class="dropdown">
            <button class="dropbtn">
              <img class="login-img" src="Icons/user-3.png" alt="">
            </button>
            <div class="dropdown-content">

            </div>
          </div>

          <a class="help"><img class="help-img" src="Icons/info.png" alt=""></a>

          <div class="dropdown">
            <button class="dropbtn">
              <img class="add-project-img" src="Icons/plus.png" alt="">
            </button>
            <div class="dropdown-content">

            </div>
          </div>

        </div>
      </div>

      <!-- Body -->
      <div id="Body">

        <div class="side-panel">

          <div class="selection">

            <div class="projects">
              <div class="project-obj">
                <img class="projects-img" src="Icons/calendar-6.png" alt="">
                Project
              </div>
              <div class="project-obj">
                <img class="projects-img" src="Icons/calendar-6.png" alt="">
                Project
              </div>
              <div class="project-obj">
                <img class="projects-img" src="Icons/calendar-6.png" alt="">
                Project
              </div>
            </div>

            <div class="chatrooms">
              <div class="chatroom-obj">
                <img class="chatrooms-img" src="Icons/smartphone-10.png" alt="">
                Chatroom
              </div>
              <div class="chatroom-obj">
                <img class="chatrooms-img" src="Icons/smartphone-10.png" alt="">
                Chatroom
              </div>
              <div class="chatroom-obj">
                <img class="chatrooms-img" src="Icons/smartphone-10.png" alt="">
                Chatroom
              </div>
            </div>

            <div class="button-box">
              <button class="projects-button" onclick="projectsVis()">
                  <img class="projects-img" src="Icons/calendar-6.png" alt="">
              </button>
              <button class="chatrooms-button" onclick="chatroomsVis()">
                  <img class="chatrooms-img" src="Icons/smartphone-10.png" alt="">
              </button>
              <script>
                function projectsVis() {
                  var x = document.getElementsByClassName("projects");
                  x[0].style.display = "block";
                  var y = document.getElementsByClassName("chatrooms");
                  y[0].style.display = "none";
                }
                function chatroomsVis() {
                  var x = document.getElementsByClassName("projects");
                  x[0].style.display = "none";
                  var y = document.getElementsByClassName("chatrooms");
                  y[0].style.display = "block";
                }
              </script>
            </div>

          </div>

          <div class="collapse">
            <div class="collapse-icon">

            </div>
            <button class="collapse-button" onclick="selectionVis()">
                <img class="collapse-img" src="Icons/play-button-1.png" alt="">
            </button>
            <script>
              function selectionVis() {
                var x = document.getElementsByClassName("side-panel");
                var y = document.getElementsByClassName("content");
                if (x[0].style.right === "0px" || x[0].style.right === "") {
                  y[0].style.position = "absolute";
                  y[0].style.width = "calc(100% - 50px)";
                  y[0].style.left = "50px";
                  y[0].style.right = "0px";
                  x[0].style.right = "200px";
                } else {
                  y[0].style.position = "absolute";
                  y[0].style.width = "calc(100% - 250px)";
                  y[0].style.left = "250px";
                  y[0].style.right = "0px";
                  x[0].style.right = "0px";
                }
              }
            </script>
          </div>
        </div>

        <div class="content">

          <div class="active-project">

            <div class="project-content">
              Project
            </div>

            <div class="content-collapse">
                <div class="collapse-icon">
                    <img class="projects-img" src="Icons/calendar-6.png" alt="">
                </div>
                <button class="collapse-button" onclick="activeProjectVis()">
                    <img class="collapse-img" src="Icons/play-button-1.png" alt="">
                </button>
                <script>
                    function activeProjectVis() {
                      var x = document.getElementsByClassName("active-project");
                      var x1 = document.getElementsByClassName("project-content");
                      var y = document.getElementsByClassName("active-chatroom");
                      if (x[0].style.width === "50%" || x[0].style.width === "") {
                        x[0].style.width = "50px";
                        x1[0].style.width = "0px";
                        y[0].style.width = "calc(100% - 50px)";
                      } else {
                        x[0].style.width = "50%";
                        x1[0].style.width = "auto";
                        y[0].style.width = "50%";
                      }
                    }
                  </script>
              </div>
          </div>

          <div class="active-chatroom">

            <div class="chatroom-content">
              Chatroom
            </div>

            <div class="content-collapse">
                <div class="collapse-icon">
                    <img class="chatrooms-img" src="Icons/smartphone-10.png" alt="">
                </div>
                <button class="collapse-button" onclick="activeChatroomVis()">
                    <img class="collapse-img" src="Icons/play-button-1.png" alt="">
                </button>
                <script>
                    function activeChatroomVis() {
                      var x = document.getElementsByClassName("active-chatroom");
                      var x1 = document.getElementsByClassName("chatroom-content");
                      var y = document.getElementsByClassName("active-project");
                      if (x[0].style.width === "50%" || x[0].style.width === "") {
                        x[0].style.width = "50px";
                        x1[0].style.width = "0px";
                        y[0].style.width = "calc(100% - 50px)";
                      } else {
                        x[0].style.width = "50%";
                        x1[0].style.width = "auto";
                        y[0].style.width = "50%";
                      }
                    }
                  </script>
              </div>
          </div>

        </div>
      </div>

      <!-- Footer -->
      <div id="Footer">

        <div class="logo">
            <img class="logo-img" src="Icons/diamond.png" alt="">
        </div>

      </div>

    </div>
  </body>
</html>