package communication.testRMI;

import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;

/**
 * Created by White on 12.07.2014.
 */
public class RMIDemoImpl extends UnicastRemoteObject implements RMIDemo {

    protected RMIDemoImpl() throws RemoteException {
        super();
    }

    @Override
    public String doCommunicate(String name) throws RemoteException {
        return "method doCommunicate return :"+name;
    }
}
