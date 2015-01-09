/**
 * 
 */
package database.testHibernateSearch.search;

import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;
import org.hibernate.service.ServiceRegistryBuilder;
import org.hibernate.service.internal.StandardServiceRegistryImpl;

import java.util.Properties;

public class HibernateUtil {
	
	private static SessionFactory sessionFactory = null;
	private static ServiceRegistry serviceRegistry = null;

    static
    {
        configureSessionFactory();
    }

	private static SessionFactory configureSessionFactory() throws HibernateException
    {
	    Configuration configuration = new Configuration();
	    configuration.configure();
	    Properties properties = configuration.getProperties();
		serviceRegistry = new ServiceRegistryBuilder().applySettings(properties).buildServiceRegistry();
	    sessionFactory = configuration.buildSessionFactory(serviceRegistry);
	    return sessionFactory;  
	}

    public static Session getSession()
    {
		return sessionFactory.openSession();
	}

    public static void end()
    {
        sessionFactory.close();
        ServiceRegistryBuilder.destroy(serviceRegistry);
    }

	private HibernateUtil() {}
}
