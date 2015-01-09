package database.testInfinispan;

import org.infinispan.Cache;
import org.infinispan.manager.DefaultCacheManager;

import java.io.IOException;

/**
 * Created by White on 13/08/2014.
 */
public class InfinispanTest1 {

    public static void main(String[] args) throws IOException {
//        Cache<Object, Object> cache = new DefaultCacheManager().getCache();

        String configFile = "database/infinispan/infinispan";
        DefaultCacheManager m = new DefaultCacheManager(configFile);
        Cache<String, String> cache = m.getCache("evictionCache");

        // Add a entry
        cache.put("key", "asd");
// Validate the entry is now in the cache
        System.out.print("size = "+cache.size());
        System.out.println("  inside = "+cache.get("key"));
        try {
            Thread.sleep(6000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.print("size = "+cache.size());
        System.out.println("  inside = "+cache.get("key"));
        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
//        while(true)
        {
            System.out.print("size = "+cache.size());
            System.out.println("  inside = "+cache.get("key"));
        }
// Remove the entry from the cache
//        Object v = cache.remove("key");
// Validate the entry is no longer in the cache
//        assertEqual("value", v);

    }
}
