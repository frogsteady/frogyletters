package subMatters.testKML;

import de.micromata.opengis.kml.v_2_2_0.*;
import de.micromata.opengis.kml.v_2_2_0.Coordinate;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;

class Boss
{
    static private Map<String, List<List<Coordinate>>> map = new HashMap();

    public static void main(String[] args)
    {
        Kml kml = Kml.unmarshal(new File("src/main/resources/subMatters/KML/regions2010_wgs.kml"));
        Document document = (Document)kml.getFeature();
        Folder folder = (Folder) document.getFeature().get(0);
        List<Feature> features = folder.getFeature();     //MultiGeometry m;

        for(Feature feature : features)
        //Feature feature = features.get(0);
        {
            Placemark placemark = (Placemark) feature;
            if(placemark.getGeometry() instanceof Polygon)
            {
                Polygon polygon = (Polygon) placemark.getGeometry();
                List<Coordinate> coordinates = polygon.getOuterBoundaryIs().getLinearRing().getCoordinates();
                if(!map.containsKey(placemark.getName()))
                {
                    map.put(placemark.getName(), new ArrayList<List<Coordinate>>());
                }
                map.get(placemark.getName()).add(coordinates);
            }
            if(placemark.getGeometry() instanceof MultiGeometry)
            {
                MultiGeometry multiGeometry = (MultiGeometry) placemark.getGeometry();
                for(Geometry geometry : multiGeometry.getGeometry())
                {
                    Polygon polygon = (Polygon) geometry;
                    List<Coordinate> coordinates = polygon.getOuterBoundaryIs().getLinearRing().getCoordinates();
                    if(!map.containsKey(placemark.getName()))
                    {
                        map.put(placemark.getName(), new ArrayList<List<Coordinate>>());
                    }
                    map.get(placemark.getName()).add(coordinates);
                }
            }
            int result = into_poly(-169.100000D, 65.76256D, map.get(placemark.getName()).get(0));
            if(result == 1)
            {
                System.out.println("pause to result");
            }
        }



        for(Map.Entry<String,List<List<Coordinate>>> all : map.entrySet())
        {
            for(List<Coordinate> listCoordinate : all.getValue())
            {
                if(into_poly(78.100000D, 65.76256D, listCoordinate)==1)
                {
                    System.out.println(all.getKey());
                    System.out.println("haha");
                }
            }
        }



        System.out.println("hhh");
    }
    //65,76256° -169,100000°   61,76256° 88,100000°       -169.100000D, 65.76256D
    //65,76256° -169,113305°

    //-169.113305°, 65.76256°
            //+38° 34' 24.00", -109° 32' 57.00"
    /**
     * class Coordiate
     * longitude x
     * latitude  y
     */

    public static int into_poly(Double sx, Double sy, List<Coordinate> coords)
    {

        int pj=0;
        long pk=0;
        Double wrkx=0D;
        Double yu = 0D;
        Double yl = 0D;
        int n = coords.size();
        for (pj=0; pj<n; pj++)
        {
            yu = coords.get(pj).getLatitude()>coords.get((pj+1)%n).getLatitude()?coords.get(pj).getLatitude():coords.get((pj+1)%n).getLatitude();
            yl = coords.get(pj).getLatitude()<coords.get((pj+1)%n).getLatitude()?coords.get(pj).getLatitude():coords.get((pj+1)%n).getLatitude();
            if (coords.get((pj+1)%n).getLatitude() - coords.get(pj).getLatitude()>0)
                wrkx = coords.get(pj).getLongitude() + (coords.get((pj+1)%n).getLongitude() - coords.get(pj).getLongitude())*(sy - coords.get(pj).getLatitude())/(coords.get((pj+1)%n).getLatitude() - coords.get(pj).getLatitude());
            else
                wrkx = coords.get(pj).getLongitude();
            if (yu >= sy)
                if (yl < sy)
                {
                    if (sx > wrkx)
                        pk++;
                    if (Math.abs(sx - wrkx) < 0.00001) return 1;
                }
          /*  if ((Math.abs(sy - yl) < 0.00001) && (Math.abs(yu - yl) < 0.00001) && (Math.abs(Math.abs(wrkx - coords.get(pj).getLongitude()) + Math.abs(wrkx - coords.get((pj+1)%n).getLongitude()) - Math.abs(coords.get(pj).getLongitude() - coords.get((pj+1)%n).getLongitude())) < 0.0001))
                return 1;*/
        }
        if (pk%2>0)
            return 1;
        else
            return 0;
    }
}