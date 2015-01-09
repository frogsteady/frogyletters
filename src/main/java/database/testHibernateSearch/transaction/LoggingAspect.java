package database.testHibernateSearch.transaction;

import org.aspectj.lang.ProceedingJoinPoint;

/**
 * Created by White on 25.07.2014.
 */
public class LoggingAspect {

    public Object myAroundAdvice(ProceedingJoinPoint pjp)
    {
        System.out.println("AOP LOGGER BEGIN");
        Object returnValue = null;
        try {
            returnValue = pjp.proceed();
        } catch (Throwable throwable) {
            System.out.println("AOP LOGGER ERROR");
            throwable.printStackTrace();
        }
        System.out.println("AOP LOGGER END");
        return returnValue;

    }
}
