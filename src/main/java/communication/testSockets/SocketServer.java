package communication.testSockets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

/**
 * Created by White on 13.07.2014.
 */
public class SocketServer {
    public static void main(String[] args) throws IOException {
        ServerSocket serverSocket = new ServerSocket(4444);
        //accept method w8 for client connection, i.e. in result we get client socket.
        Socket socket = serverSocket.accept();
        //1st read and displaying incoming message
        //USE ObjectInputStream for serialize object (readObject/ writeObject)
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        String message = bufferedReader.readLine();
        System.out.println("The following message was received from the client "+message);
        //2nd respond to client echoing back the client incoming message
        PrintWriter printWriter = new PrintWriter(socket.getOutputStream(), true);
        printWriter.println("Sever echoing back the following message '" + message + "' from client");
        socket.close();
        serverSocket.close();
    }
}
