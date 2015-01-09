package subMatters.testDozer;


import java.util.Collection;
import java.util.Date;
import java.util.List;

public class DestinationClass
{
    private Integer sourceStringForInteger;
    private Long sourceStringForLong;
    private int sourceStringForint;
    private String sourceStringForString;
    private Collection destCol;
    private Date destDate;
    private Collection list;

    public Collection getList()
    {
        return list;
    }

    public void setList(Collection list)
    {
        this.list = list;
    }

    public Date getDestDate()
    {
        return destDate;
    }

    public void setDestDate(Date destDate)
    {
        this.destDate = destDate;
    }

    public Integer getSourceStringForInteger()
    {
        return sourceStringForInteger;
    }

    public void setSourceStringForInteger(Integer sourceStringForInteger)
    {
        this.sourceStringForInteger = sourceStringForInteger;
    }

    public Long getSourceStringForLong()
    {
        return sourceStringForLong;
    }

    public void setSourceStringForLong(Long sourceStringForLong)
    {
        this.sourceStringForLong = sourceStringForLong;
    }

    public int getSourceStringForint()
    {
        return sourceStringForint;
    }

    public void setSourceStringForint(int sourceStringForint)
    {
        this.sourceStringForint = sourceStringForint;
    }

    public String getSourceStringForString()
    {
        return sourceStringForString;
    }

    public void setSourceStringForString(String sourceStringForString)
    {
        this.sourceStringForString = sourceStringForString;
    }

    public Collection getDestCol()
    {
        return destCol;
    }

    public void setDestCol(Collection destCol)
    {
        this.destCol = destCol;
    }
}
