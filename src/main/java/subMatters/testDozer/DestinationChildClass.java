package subMatters.testDozer;
public class DestinationChildClass
{
    private Integer prop1;
    private Integer prop2;
    private Integer prop3;

    public DestinationChildClass()
    {
    }

    public DestinationChildClass(Integer prop1, Integer prop2, Integer prop3)
    {
        this.prop1 = prop1;
        this.prop2 = prop2;
        this.prop3 = prop3;
    }

    public Integer getProp1()
    {
        return prop1;
    }

    public void setProp1(Integer prop1)
    {
        this.prop1 = prop1;
    }

    public Integer getProp2()
    {
        return prop2;
    }

    public void setProp2(Integer prop2)
    {
        this.prop2 = prop2;
    }

    public Integer getProp3()
    {
        return prop3;
    }

    public void setProp3(Integer prop3)
    {
        this.prop3 = prop3;
    }
}