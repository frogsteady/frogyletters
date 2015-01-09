package communication.testRMI;

import java.rmi.Remote;
import java.rmi.RemoteException;

/**
 * Created by White on 12.07.2014.
 */
public interface RMIDemo extends Remote{
    public String doCommunicate(String name) throws RemoteException;
}
