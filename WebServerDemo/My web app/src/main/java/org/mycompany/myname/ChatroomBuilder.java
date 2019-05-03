package org.mycompany.myname;

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.File;
import java.io.FileOutputStream;
import java.nio.channels.FileChannel;

public class ChatroomBuilder extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        File file = new File("DataChatrooms.csv");
        File tempFile = new File("tempChatrooms.csv");

        String name = request.getParameter("name");
        String project = request.getParameter("chatroom");
        String option = request.getParameter("option");
        String newline = project + "," + name + "\n";
        String nextJSP = "/main.jsp";

        System.out.println("Chatroom: " + name + ", " + project + ", " + option);

        file.createNewFile();
        tempFile.createNewFile();

        BufferedReader reader = new BufferedReader(new FileReader(file));
        BufferedWriter writer = new BufferedWriter(new FileWriter(tempFile));

        String line = null;
        boolean found = false;
        while ((line = reader.readLine()) != null) {
            if (line.split(",")[0].equals(project)
                    && line.split(",")[1].equals(name)) {
                System.out.println("Chatroom Found");
                found = true;
                if (option.equals("add")) {
                    writer.write(line + "\n");
                } else {
                    System.out.println("Chatroom Deleted");
                }
            } else {
                writer.write(line + "\n");
            }
        }

        if (option.equals("add") && !found) {
            System.out.println("Chatroom Added");
            writer.write(newline);
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