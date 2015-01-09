package communication.testJms.topicSuscriber;

import javax.jms.*;
import javax.naming.Context;
import javax.naming.NamingException;

/**
 * Created by White on 09.07.2014.
 */
public class TopicProducer {
    public static void main(String[] args) throws NamingException, JMSException {
        System.out.println("+++++ Entering JMS topic publisher +++++");
        Context context = TopicConsumer.getInitialContext();
        TopicConnectionFactory topicConnectionFactory = (TopicConnectionFactory)context.lookup("jms/RemoteConnectionFactory");
        Topic topic = (Topic) context.lookup("topic/wislaDatacollectionConfig");

        TopicConnection topicConnection = topicConnectionFactory.createTopicConnection();
        TopicSession topicSession = topicConnection.createTopicSession(false, TopicSession.AUTO_ACKNOWLEDGE);
        topicConnection.start();

        TopicProducer topicProducer = new TopicProducer();
        topicProducer.sendMessage("hello from publisher", topicSession, topic);
        System.out.println("+++++ Exiting JMS topic publisher +++++");
    }

    public void sendMessage(String message, TopicSession topicSession, Topic topic) throws JMSException {
        TopicPublisher topicPublisher = topicSession.createPublisher(topic);
        TextMessage textMessage = topicSession.createTextMessage(message);
        topicPublisher.publish(textMessage);
        topicPublisher.close();
    }
}
