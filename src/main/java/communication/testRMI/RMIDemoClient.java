package communication.testRMI;

import java.net.MalformedURLException;
import java.rmi.Naming;
import java.rmi.NotBoundException;
import java.rmi.RemoteException;

/**
 * Created by White on 12.07.2014.
 */
public class RMIDemoClient {
    public static void main(String[] args) throws RemoteException, NotBoundException, MalformedURLException {
        String url = new String("rmi://localhost"+"/RMIDemo");
        RMIDemo rmiDemo = (RMIDemo)Naming.lookup(url);
        String serverReply = rmiDemo.doCommunicate("Tony");
        System.out.println("SocketServer reply is:"+serverReply);
    }
}
