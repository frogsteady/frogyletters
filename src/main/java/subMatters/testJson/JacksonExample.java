package subMatters.testJson;

import java.io.File;
import java.io.IOException;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

public class JacksonExample {
    public static void main(String[] args) {

        User user = new User();
        ObjectMapper mapper = new ObjectMapper();

        try {
            // convert user object to json string, and save to a file
            mapper.writeValue(new File("d:\\user.json"), user);
            // display to console
            System.out.println(mapper.writeValueAsString(user));
        } catch (Exception e) {
            e.printStackTrace();
        }
      //  System.out.println(System.getProperty("jboss.server.data.dir"));

    }

}