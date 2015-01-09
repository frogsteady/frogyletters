package communication.testJGroup;

import java.io.BufferedReader;
import java.io.InputStreamReader;

import org.jgroups.JChannel;
import org.jgroups.Message;
import org.jgroups.ReceiverAdapter;

public class RunnerJGroupSender {

    public static void main( String[] args ) throws Exception {
        JChannel channel = new JChannel( "UDP(bind_addr=127.0.0.1)" );
        channel.connect( "MyCluster" );

        BufferedReader in = new BufferedReader( new InputStreamReader( System.in ) );
        while ( true )
        {
            String line = in.readLine();
            if (line.equalsIgnoreCase("quit") || line.equalsIgnoreCase("exit"))
            {
                break;
            }
            channel.send( new Message( null, null, line ) );
        }
        channel.close();
    }

}