package All;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

/*Интерфейс BlockingQueue является очередью (Queue), т.е. его элементы хранятся в порядке «первый пришел, первый вышел» (FIFO – first in, first out).
Элементы, вставленные в коллекцию в определенном порядке, будут извлечены из нее в том же самом порядке. Также интерфейс гарантирует, что любая попытка извлечь элемент
из пустой очереди заблокирует вызывающий поток до тех пор, пока в коллекции не появится элемент, который можно извлечь.
Аналогично, любая попытка вставить элемент в заполненную очередь заблокирует вызывающий поток, пока в коллекции не освободится место для нового элемента.

BlockingQueue также поддерживает методы, принимающие параметр time, обозначающий, как долго потоки должны пребывать в блокированном состоянии перед
тем как вернуть управление, сигнализируя о том, что добавление или извлечение элемента не удалось.*/

class Producer implements Runnable
{
    private BlockingQueue<String> drop;
    List<String> messages = Arrays.asList(
            "Mares eat oats",
            "Does eat oats",
            "Little lambs eat ivy",
            "Wouldn't you eat ivy too?");

    public Producer(BlockingQueue<String> d) { this.drop = d; }

    public void run()
    {
        try
        {
            for (String s : messages)
                drop.put(s);
            drop.put("DONE");
        }
        catch (InterruptedException intEx)
        {
            System.out.println("Interrupted! " +
                    "Last one out, turn out the lights!");
        }
    }
}

class Consumer implements Runnable
{
    private BlockingQueue<String> drop;
    public Consumer(BlockingQueue<String> d) { this.drop = d; }

    public void run()
    {
        try
        {
            String msg = null;
            while (!((msg = drop.take()).equals("DONE")))
                System.out.println(msg);
        }
        catch (InterruptedException intEx)
        {
            System.out.println("Interrupted! " +
                    "Last one out, turn out the lights!");
        }
    }
}

public class testBlockingQueue
{
    public static void main(String[] args)
    {
        BlockingQueue<String> drop = new ArrayBlockingQueue(1, true);
        (new Thread(new Producer(drop))).start();
        (new Thread(new Consumer(drop))).start();
    }
}