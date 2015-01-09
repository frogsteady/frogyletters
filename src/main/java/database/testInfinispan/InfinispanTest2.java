package database.testInfinispan;

import org.infinispan.Cache;
import org.infinispan.manager.DefaultCacheManager;

/**
 * Created by White on 13/08/2014.
 */
public class InfinispanTest2 {

    public static void main(String[] args) {
        Cache<Object, Object> cache = new DefaultCacheManager().getCache();
        try {
            Thread.sleep(3000);

        // Add a entry
//        cache.put("key", "value");
// Validate the entry is now in the cache
        while(true)
        {
            System.out.print("size = "+cache.size());
            System.out.println("  inside = "+cache.get("key"));
            Thread.sleep(3000);

        }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
// Remove the entry from the cache
//        Object v = cache.remove("key");
// Validate the entry is no longer in the cache
//        assertEqual("value", v);
    }
}
