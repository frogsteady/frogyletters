package communication.testJms.topicSuscriber;
import javax.jms.*;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import java.util.Properties;

public class TopicConsumer implements MessageListener {

    public static void main(String[] args) throws NamingException, JMSException {
        System.out.println("+++++ Entering JMS topic consumer +++++");
        Context context = getInitialContext();
        TopicConnectionFactory topicConnectionFactory = (TopicConnectionFactory)context.lookup("jms/RemoteConnectionFactory");
        Topic topic = (Topic) context.lookup("topic/wislaDatacollectionConfig");

        TopicConnection topicConnection = topicConnectionFactory.createTopicConnection();
        TopicSession topicSession = topicConnection.createTopicSession(false, TopicSession.AUTO_ACKNOWLEDGE);
        topicSession.createSubscriber(topic).setMessageListener(new TopicConsumer());
        topicConnection.start();
        try {
            Thread.sleep(50000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("+++++ Exiting JMS topic consumer +++++");
    }
    @Override
    public void onMessage(Message message) {
        try {
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
