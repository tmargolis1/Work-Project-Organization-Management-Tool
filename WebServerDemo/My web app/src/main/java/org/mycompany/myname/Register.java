package org.mycompany.myname;

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;

public class Register extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String fileName = "DataUsers.csv";
        String name = request.getParameter("name");
        String pass = request.getParameter("pass");
        String newLine = "\n" + name + "," + pass;
        String nextJSP = "/main.jsp";

        System.out.println("Register: " + name + ", " + pass);

        File file = new File(fileName);
        if (file.createNewFile()) {
            System.out.println("File is created!");
        } else {
            System.out.println("File already exists.");
        }

        BufferedReader reader = new BufferedReader(new FileReader(fileName));
        String line = null;
        boolean found = false;
        while ((line = reader.readLine()) != null) {
            if (line.split(",")[0].equals(name)) {
                nextJSP = "/index.jsp";
                System.out.println("Username Taken");
                reader.close();
                found = true;
                break;
            }
        }
        reader.close();

        if (!found) {
            BufferedWriter out = new BufferedWriter(new FileWriter(fileName, true));
            out.write(newLine);
            System.out.println("Added New User");
            out.close();
        }

        RequestDispatcher dispatcher = getServletContext().getRequestDispatcher(nextJSP);
        dispatcher.forward(request, response);
    }
}