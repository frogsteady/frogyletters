package subMatters.testGoogleGuava;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import com.google.common.base.Function;
import com.google.common.collect.Collections2;

class Entity
{
    private Integer id;
    public Entity(final Integer id) { this.id = id; }
    public Integer getId() { return id; }

    public void setId(Integer id) {
        this.id = id;
    }
}

public class RunnerGuava {

    public static void main(final String [] args) {

        Collection<Entity> entities = Arrays.asList(
                new Entity(1),
                new Entity(2),
                new Entity(3)
        );

        //transform pick up id(or other fields) from collection in another collection
//        transform() возвращает не новую коллекцию, а отображение существующей (live view).
//        •	результат вычисляется тогда, когда вы к нему обратитесь (и даже более того: при каждом обращении он будет вычисляться снова и снова, поэтому если вам нужно использовать результат несколько раз, то лучше его закэшировать)
//        •	изменения в исходной коллекции будут влиять на результат (иными словами результат вызова transform() до и после добавления нового элемента в исходную коллекцию будет отличаться)
//        •	при попытке добавить элемент в результирующую коллекцию вы получите UnsupportedOperationException (т.е. добавить вы ничего не сможете, а вот удалить — запросто)
//
//        В Guava также есть Iterables.transform() и Lists.transform(), которые можно применять к соответствующим типам.

        entities.add(new Entity(5));
        Collection<Integer> ids = Collections2.transform(entities, new Function<Entity, Integer>()
        {
            @Override
            public Integer apply(final Entity entity)
            {
                return entity.getId();
            }
        });
//        ((List<Entity>)entities).get(0).setId(5); //result output will change
//        entities.add(new Entity(5)); //UnsupportedOperationException
        System.out.println(ids);
    }

}
