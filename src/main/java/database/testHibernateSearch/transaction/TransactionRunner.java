package database.testHibernateSearch.transaction;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import database.testHibernateSearch.search.Contact;

public class TransactionRunner {

    SessionFactory sessionFactory;

    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    public void testTransaction()
    {
        Session session = sessionFactory.getCurrentSession();
//        session.save(new Contact(1, "NAME", "EMAIL@gmail.com"));
        Contact contact = (Contact)session.get(Contact.class, 1);
        contact.setName("NEW NAME");
    }

	public static void main(String[] args) throws InterruptedException
    {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("database/hibernateSearch/hibernateSearch_transaction.xml");
        TransactionRunner runner = (TransactionRunner)applicationContext.getBean("transactionRunner");
         SessionFactory sessionFactory = (SessionFactory)applicationContext.getBean("sessionFactory");
        runner.setSessionFactory(sessionFactory);
        runner.testTransaction();

    }
}
