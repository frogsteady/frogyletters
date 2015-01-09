package communication.testJms.withSpring;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.TextMessage;

/**
 * Created by White on 15.07.2014.
 */
public class JmsSpringConsumer implements MessageListener {
    @Override
    public void onMessage(Message message) {
        try {
            System.out.println(this.getClass().getName() + " received :"+((TextMessage)message).getText());
        } catch (JMSException e) {
            e.printStackTrace();
        }
    }
}
