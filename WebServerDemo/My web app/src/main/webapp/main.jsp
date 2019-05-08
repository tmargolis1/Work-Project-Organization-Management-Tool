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

    <%@ page import ="java.util.*"%>
    <%@ page import="java.io.*" %>
    <%
        String name = request.getParameter("name");
        String currentProject = "";
        String currentChatroom = "";
        String temp = "";
        ArrayList users = new ArrayList();
        ArrayList projects = new ArrayList();
        ArrayList chatrooms = new ArrayList();
        System.out.println(name);

        BufferedReader usersReader = new BufferedReader(new FileReader("DataUsers.csv"));
        String line = null;
        while ((line = usersReader.readLine()) != null) {
            users.add(line.split(",")[0]);
        }
        usersReader.close();
        BufferedReader projectsReader = new BufferedReader(new FileReader("DataProjects.csv"));
        while ((line = projectsReader.readLine()) != null) {
            if (currentProject.equals("") && line.split(",")[1].equals(name)) {
                currentProject = line.split(",")[0];
            }
            temp = "";
            for (int i = 0; i < line.split(",").length; i++) temp += line.split(",")[i] + ",";
            temp = temp.substring(0, temp.length() - 1);
            projects.add(temp);
        }
        projectsReader.close();
        BufferedReader chatroomsReader = new BufferedReader(new FileReader("DataChatrooms.csv"));
        while ((line = chatroomsReader.readLine()) != null) {
            if (currentChatroom.equals("")) {
                currentChatroom = line.split(",")[0];
            }
            temp = "";
            for (int i = 0; i < line.split(",").length; i++) temp += line.split(",")[i] + ",";
            temp = temp.substring(0, temp.length() - 1);
            chatrooms.add(temp);
        }
        chatroomsReader.close();

        System.out.println(users);
        System.out.println(projects);
        System.out.println(chatrooms);
    %>

    <script>
      var currentProject = "";
      var projectsArray = new Array();
      var currentChatroom = "";
      var chatroomsArray = new Array();

      window.onload = function() {
        var currentProject = "<%= currentProject %>";
        <%
        for (int i=0; i < projects.size(); i++) {
        %>
        projectsArray[<%= i %>] = "<%= projects.get(i) %>";
        <%}%>
        var currentChatroom = "<%= currentChatroom %>";
        <%
        for (int i=0; i < chatrooms.size(); i++) {
        %>
        chatroomsArray[<%= i %>] = "<%= chatrooms.get(i) %>";
        <%}%>
      }
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

          <div class="project-title"></div>

          <div class="dropdown">
            <button class="dropbtn">
              <img class="login-img" src="Icons/user-3.png" alt="">
            </button>
            <div class="dropdown-content">
              <label for="username"><b><%= name %></b></label>
              <button class="logout-button" onclick="location.href='index.jsp'">Logout</button>
            </div>
          </div>

          <div class="dropdown">
            <button class="dropbtn">
              <img class="add-project-img" src="Icons/plus.png" alt="">
            </button>
            <div class="dropdown-content">
                <form action="project" name="ProjectBuilder" onsubmit="return validateProjectForm()">

                  <label for="project"><b>Project</b></label>
                  <input type="text" placeholder="Enter Project" name="project" autocomplete="off" maxlength="20" required>

                  <select name="option">
                      <option value="add">Add</option>
                      <option value="delete">Delete</option>
                  </select>

                  <input type="hidden" name="name" value=<%= name %>>
                  <button type="submit">Submit</button>
                </form>
                <form action="chatroom" name="ChatroomBuilder" onsubmit="return validateChatroomForm()">

                  <label for="chatroom"><b>Chatroom</b></label>
                  <input type="text" placeholder="Enter Chatroom" name="chatroom" autocomplete="off" maxlength="20" required>

                  <select  name="option">
                      <option value="add">Add</option>
                      <option value="delete">Delete</option>
                  </select>

                  <input type="hidden" name="name" value=<%= name %>>
                  <button type="submit">Submit</button>
                </form>
                <script>
                    function validateProjectForm() {
                      var projectName = document.forms["ProjectBuilder"]["project"].value;
                      console.log(projectName);
                      if (projectName.includes(",") || projectName.includes("\n")) {
                        alert("Invalid Project Name");
                        return false;
                      }
                    }
                    function validateChatroomForm() {
                      var chatroomName = document.forms["ChatroomBuilder"]["chatroom"].value;
                      console.log(chatroomName);
                      if (chatroomName.includes(",") || chatroomName.includes("\n")) {
                        alert("Invalid Project Name");
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

        <div class="side-panel">

          <div class="selection">

            <div class="projects">
                <%
                    Iterator<String> itProject = projects.iterator();
                    int index = 0;
                    boolean found = false;
                    while (itProject.hasNext()) {
                        String project = itProject.next();
                        found = false;
                        for (int i = 1; i < project.split(",").length; i++) {
                            if (project.split(",")[i].equals(name)) {
                                found = true;
                                break;
                            }
                        }
                        if (found) {
                        %>
                            <div class="select-obj" id="project<%= index %>" onclick="setProject(<%= index %>)">
                                <img class="projects-img" src="Icons/calendar-6.png" alt="">
                                <label for="project-name"><b><%= project.split(",")[0] %></b></label>
                                <form action="addUser" class="select-form" name="ProjectBuilder">
                                    <label for="Users"><b>Select User</b></label>
                                    <select name="user">
                                        <%
                                            Iterator<String> itUsers = users.iterator();
                                            while (itUsers.hasNext()) {
                                                String user = itUsers.next();
                                                %>
                                                    <option value="<%= user.split(",")[0] %>"><%= user.split(",")[0] %></option>
                                                <%
                                            }
                                        %>
                                    <select>
                                    <select  name="option">
                                      <option value="add">Add</option>
                                      <option value="delete">Delete</option>
                                  </select>
                                    <input type="hidden" name="name" value=<%= name %>>
                                    <input type="hidden" name="project" value=<%= project.split(",")[0] %>>
                                    <button type="submit">Submit</button>
                                </form>
                            </div>
                        <%
                        }
                        index++;
                    }
                %>
                <script>
                    function setProject(index) {
                        var title = document.getElementsByClassName("project-title");
                        title[0].innerHTML = projectsArray[index].split(",")[0];
                    }
                </script>
            </div>

            <div class="chatrooms">
                <%
                    Iterator<String> itChatroom = chatrooms.iterator();
                    index = 0;
                    while (itChatroom.hasNext()) {
                        String chatroom = itChatroom.next();
                        found = false;
                        for (int i = 1; i < chatroom.split(",").length; i++) {
                            if (chatroom.split(",")[i].equals(name)) {
                                found = true;
                                break;
                            }
                        }
                        if (found) {
                        %>
                            <div class="select-obj" id="chatroom<%= index %>">
                                <img class="chatrooms-img" src="Icons/smartphone-10.png" alt="">
                                <label for="chatroom-name"><b><%= chatroom.split(",")[0] %></b></label>
                                <form action="addUser" class="select-form" name="ProjectBuilder">
                                    <label for="Users"><b>Select User</b></label>
                                    <select name="user">
                                        <%
                                            Iterator<String> itUsers = users.iterator();
                                            while (itUsers.hasNext()) {
                                                String user = itUsers.next();
                                                %>
                                                    <option value="<%= user.split(",")[0] %>"><%= user.split(",")[0] %></option>
                                                <%
                                            }
                                        %>
                                    <select>
                                    <select  name="option">
                                      <option value="add">Add</option>
                                      <option value="delete">Delete</option>
                                  </select>
                                    <input type="hidden" name="name" value=<%= name %>>
                                    <input type="hidden" name="chatroom" value=<%= chatroom.split(",")[0] %>>
                                    <button type="submit">Submit</button>
                                </form>
                            </div>
                        <%
                            index++;
                        }
                    }
                %>
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
