package communication.testJms.pointToPoint;

import javax.jms.*;
import javax.naming.Context;
import javax.naming.NamingException;

/**
 * Created by White on 09.07.2014.
 */
public class QueueProducer {
    public static void main(String[] args) throws NamingException, JMSException {
        System.out.println("+++++ Entering JMS topic publisher +++++");
        Context context = QueueConsumer.getInitialContext();
        QueueConnectionFactory queueConnectionFactory = (QueueConnectionFactory)context.lookup("jms/RemoteConnectionFactory");
        Queue queue = (Queue) context.lookup("queue/wislaInterHopEvents");

        QueueConnection queueConnection = queueConnectionFactory.createQueueConnection();
        QueueSession queueSession = queueConnection.createQueueSession(false, TopicSession.AUTO_ACKNOWLEDGE);
        queueConnection.start();

        QueueProducer queueProducer = new QueueProducer();
        queueProducer.sendMessage("hello from publisher queqe7", queueSession, queue);
        System.out.println("+++++ Exiting JMS topic publisher +++++");
    }

    public void sendMessage(String message, QueueSession queueSession, Queue queue) throws JMSException {
        //ObjectMessage objectMessage = queueSession.createObjectMessage() serialize
        QueueSender queueSender = queueSession.createSender(queue);
        TextMessage textMessage = queueSession.createTextMessage(message);
        queueSender.send(textMessage);
        queueSender.close();
    }
}
