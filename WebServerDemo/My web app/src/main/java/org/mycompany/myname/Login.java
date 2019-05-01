package org.mycompany.myname;

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;

public class Login extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String fileName = "DataUsers.csv";
        String name = request.getParameter("name");
        String pass = request.getParameter("pass");
        String searchLine = name + "," + pass;
        String nextJSP = "/index.jsp";

        System.out.println("Login: " + name + ", " + pass);

        File file = new File(fileName);
        if (file.createNewFile()) {
            System.out.println("File is created!");
        } else {
            System.out.println("File already exists.");
        }

        BufferedReader reader = new BufferedReader(new FileReader(fileName));
        String line = null;
        while ((line = reader.readLine()) != null) {
            if (line.equals(searchLine)) {
                nextJSP = "/main.jsp";
                System.out.println("Username Found");
                reader.close();
                break;
            }
        }
        reader.close();

        RequestDispatcher dispatcher = getServletContext().getRequestDispatcher(nextJSP);
        dispatcher.forward(request, response);
    }
}