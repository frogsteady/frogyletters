package communication.testJms.withSpring;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.jms.core.MessageCreator;


import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.jms.*;

/**
 * Created by White on 13.07.2014.
 */
@ManagedBean
@SessionScoped
public class JmsSpringProducer {

    public static void main(String[] args) {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("/communication/jms/withSpring/jms.xml");

        JmsTemplate jmsTemplate = (JmsTemplate)applicationContext.getBean("jmsTemplate");

        jmsTemplate.send(
                new MessageCreator()
                {
                    public Message createMessage(final Session session) throws JMSException
                    {
                        return session.createTextMessage("hello from spring QWERTY");
                    }
                }
        );

        // example of transaction, received all mesages and rollback it
//        JmsTransactionManager transactionManager = (JmsTransactionManager)applicationContext.getBean("jmsTransactionManager");
//        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());
//        Message msg;
//        while ((msg = jmsTemplate.receive(jmsTemplate.getDefaultDestination()))!=null)
//        try {
//            System.out.println("message received " + ((TextMessage) msg).getText());
//        } catch (JMSException e) {
//            e.printStackTrace();
//        }
//        transactionManager.rollback(status);
        //OR
//        transactionManager.commit(status);
    }
}
