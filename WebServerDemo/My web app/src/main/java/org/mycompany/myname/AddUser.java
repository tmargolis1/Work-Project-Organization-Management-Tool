package org.mycompany.myname;

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.File;
import java.io.FileOutputStream;
import java.nio.channels.FileChannel;

public class AddUser extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String name = request.getParameter("name");
        String user = request.getParameter("user");
        String option = request.getParameter("option");
        String project = request.getParameter("project");
        String chatroom = request.getParameter("chatroom");
        String nextJSP = "/main.jsp";
        String fileName;

        if (project != null) {
            fileName = "DataProjects.csv";
        } else {
            fileName = "DataChatrooms.csv";
        }

        System.out.println(project);
        System.out.println(chatroom);
        System.out.println(name);

        File file = new File(fileName);
        File tempFile = new File("tempAdd.csv");

        file.createNewFile();
        tempFile.createNewFile();

        BufferedReader reader = new BufferedReader(new FileReader(file));
        BufferedWriter writer = new BufferedWriter(new FileWriter(tempFile));

        String line = null;
        boolean found = false;
        while ((line = reader.readLine()) != null) {
            if ((line.split(",")[0].equals(project)
                    || line.split(",")[0].equals(chatroom))
                    && line.split(",")[1].equals(name)) {
                String newLine = line.split(",")[0] + ","
                        + line.split(",")[1] + ",";
                for (int i = 2; i < line.split(",").length; i++) {
                    if (line.split(",")[i].equals(user)) {
                        System.out.println("Found User");
                        found = true;
                        if (option.equals("delete")) {
                            System.out.println("Deleted User");
                        } else {
                            newLine += line.split(",")[i] + ",";
                        }
                    } else {
                        newLine += line.split(",")[i] + ",";
                    }
                }
                if (option.equals("add") && !found && !user.equals(name)) {
                    System.out.println("Added User");
                    newLine += user + ",";
                }
                newLine = newLine.substring(0, newLine.length() - 1);
                writer.write(newLine + "\n");
            } else {
                writer.write(line + "\n");
            }
        }

        writer.close();
        reader.close();

        FileChannel src = new FileInputStream(tempFile).getChannel();
        FileChannel dest = new FileOutputStream(file).getChannel();
        dest.transferFrom(src, 0, src.size());

        tempFile.delete();

        RequestDispatcher dispatcher = getServletContext().getRequestDispatcher(nextJSP);
        dispatcher.forward(request, response);
    }
}