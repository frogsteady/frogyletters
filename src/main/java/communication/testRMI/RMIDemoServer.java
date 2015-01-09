package communication.testRMI;

import java.net.MalformedURLException;
import java.rmi.Naming;
import java.rmi.RemoteException;

/**
 * Created by White on 12.07.2014.
 */
public class RMIDemoServer {
    public static void main(String[] args) throws MalformedURLException, RemoteException {
        RMIDemoImpl rmiDemoImpl = new RMIDemoImpl();
        Naming.rebind("RMIDemo", rmiDemoImpl);
        System.out.println("RmiDemoImpl was bound to name 'RMIDemo', and is ready to use");
        try {
            Thread.sleep(50000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
