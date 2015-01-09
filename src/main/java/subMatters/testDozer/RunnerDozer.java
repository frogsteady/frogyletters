package subMatters.testDozer;

import org.dozer.DozerBeanMapper;
import org.dozer.Mapper;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

class RunnerDozer
{
    public static void main(String[] args)
    {
        List<String> mappingFiles = new ArrayList<String>(1);
        mappingFiles.add("subMatters/dozer/dozerBeanMapping.xml");

        Mapper mapper = new DozerBeanMapper(mappingFiles);
        SourceChildClass sourceObject = new SourceChildClass("1","2","3");
        DestinationChildClass destReverse = new DestinationChildClass(1,2,3);
        DestinationChildClass destObject = mapper.map(sourceObject, DestinationChildClass.class, "caseA");
        SourceChildClass sourceReverse = mapper.map(destReverse, SourceChildClass.class, "caseA");
        System.out.println(destObject.getProp1()+" "+destObject.getProp2()+" "+destObject.getProp3());
        System.out.println(sourceReverse.getProp1()+" "+sourceReverse.getProp2()+" "+sourceReverse.getProp3());

        //#2
        DestinationClass dest = new DestinationClass();
        dest.setDestDate(new Date());
        SourceClass source = mapper.map(dest, SourceClass.class);
        System.out.println(source.getSourceDate());

        //#3
        SourceClass source1 = new SourceClass();
        source1.setSourceDate("09/07/2014 19:56:46:880");
        DestinationClass dest1 = mapper.map(source1, DestinationClass.class);
        System.out.println(dest1.getDestDate());

    }
}