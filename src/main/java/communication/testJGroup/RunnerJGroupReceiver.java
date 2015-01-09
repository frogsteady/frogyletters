package communication.testJGroup;

import org.jgroups.JChannel;
import org.jgroups.Message;
import org.jgroups.ReceiverAdapter;

/**
 * Created by White on 15/08/2014.
 */
public class RunnerJGroupReceiver {
    public static void main(String[] args) throws Exception {
        JChannel channel = new JChannel( "UDP(bind_addr=127.0.0.1)" );
        channel.connect( "MyCluster" );

        channel.setReceiver(new ReceiverAdapter()
        {
            @Override
            public void receive(Message m)
            {
                System.out.println( m.getObject() );
            }
        });


        try {
            Thread.sleep(50000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
