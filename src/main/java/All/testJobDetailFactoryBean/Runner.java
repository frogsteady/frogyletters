package All.testJobDetailFactoryBean;

import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Created with IntelliJ IDEA.
 * User: agoripavlovskiy
 * Date: 03.10.14
 * Time: 15:53
 * To change this template use File | Settings | File Templates.
 */
public class Runner {
    public static void main(String[] args) throws Exception {
        new ClassPathXmlApplicationContext("all/jobDetailFactoryBean/spring-quartz.xml");
    }
}
