package communication.testHttpInvoker;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Client 
{
	public static void main(String[] args) 
	{
        final ApplicationContext context = new ClassPathXmlApplicationContext("communication/httpInvoker/httpInvoker.xml");
        final Calculation calculation =(Calculation) context.getBean("calculationBeanClient");
        System.out.println(calculation.cube(5));
    }
}
