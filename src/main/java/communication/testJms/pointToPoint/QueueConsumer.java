package communication.testJms.pointToPoint;
import javax.jms.*;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import java.util.Properties;

public class QueueConsumer implements MessageListener {

    public static void main(String[] args) throws NamingException, JMSException {
        System.out.println("+++++ Entering JMS topic consumer +++++");
        Context context = getInitialContext();
        QueueConnectionFactory queueConnectionFactory = (QueueConnectionFactory)context.lookup("jms/RemoteConnectionFactory");
        Queue queue = (Queue) context.lookup("queue/wislaInterHopEvents");

        QueueConnection queueConnection = queueConnectionFactory.createQueueConnection();
        QueueSession queueSession = queueConnection.createQueueSession(false, TopicSession.AUTO_ACKNOWLEDGE);
        queueSession.createReceiver(queue).setMessageListener(new QueueConsumer());
        queueConnection.start();
        try {
            Thread.sleep(70000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("+++++ Exiting JMS topic consumer +++++");
    }
    @Override
    public void onMessage(Message message) {
        try {
            //((ObjectMessage)message).getObject() serialize
            System.out.println("Receive :"+((TextMessage)message).getText());
        } catch (JMSException e) {
            e.printStackTrace();
        }
    }

    public static Context getInitialContext() throws NamingException {
        Properties props = new Properties();
        props.put(Context.INITIAL_CONTEXT_FACTORY, "org.jboss.naming.remote.client.InitialContextFactory" );
        props.put(Context.PROVIDER_URL, "remote://localhost:4447");
        props.put(Context.SECURITY_PRINCIPAL, "testuser");
        props.put(Context.SECURITY_CREDENTIALS, "testpassword");
        Context context = new InitialContext(props);
        return context;
    }
}
