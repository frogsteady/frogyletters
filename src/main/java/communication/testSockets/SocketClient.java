package communication.testSockets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

/**
 * Created by White on 13.07.2014.
 */
public class SocketClient {
    public static void main(String[] args) throws IOException {
        Socket socket = new Socket("localhost", 4444);
        //1st send message to server
        PrintWriter printWriter = new PrintWriter(socket.getOutputStream(), true);
        printWriter.println("Tony");
        //2nd read and display response from SocketServer
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        System.out.println("The following reply was received from server: "+bufferedReader.readLine());
        socket.close();

    }
}
