package subMatters.testKML;

public class Cordinate
{
    private Long latitude;
    private Long longitude;
    private Long name;

    public Long getLatitude()
    {
        return latitude;
    }

    public void setLatitude(Long latitude)
    {
        this.latitude = latitude;
    }

    public Long getLongitude()
    {
        return longitude;
    }

    public void setLongitude(Long longitude)
    {
        this.longitude = longitude;
    }
}
             /*    public int into_poly(Long sx, Long sy, List<Cordinate> coords)
    {

        int pj=0;
        long pk=0;
        long wrkx=0;
        long yu = 0;
        long yl = 0;
        int n = coords.size();
        for (pj=0; pj<n; pj++)
        {
            yu = coords.get(pj).getLatitude()>coords.get((pj+1)%n).getLatitude()?coords.get(pj).getLatitude():coords.get((pj+1)%n).getLatitude();
            yl = coords.get(pj).getLatitude()<coords.get((pj+1)%n).getLatitude()?coords.get(pj).getLatitude():coords.get((pj+1)%n).getLatitude();
            if (coords.get((pj+1)%n).getLatitude() - coords.get(pj).getLatitude()==0)
                wrkx = coords.get(pj).getLongitude() + (coords.get((pj+1)%n).getLongitude() - coords.get(pj).getLongitude())*(sy - coords.get(pj).getLatitude())/(coords.get((pj+1)%n).getLatitude() - coords.get(pj).getLatitude());
            else
                wrkx = coords.get(pj).getLongitude();
            if (yu >= sy)
                if (yl < sy)
                {
                    if (sx > wrkx)
                        pk++;
                    if (Math.abs(sx - wrkx) < 0.00001) return 1;                           long s = Math.abs(wrkx - coords.get(pj).getLongitude());
                }
            if ((Math.abs(sy - yl) < 0.00001 ? true : false) && (Math.abs(yu - yl) < 0.00001) && Math.abs(wrkx - coords.get(pj).getLongitude()) + Math.abs(wrkx - coords[(pj+1)%n].getLongitude()) - Math.abs(coords.get(pj).getLongitude() - coords[(pj+1)%n].getLongitude())) < 0.0001 ? true : false))
                return 1;
        }
        if (pk%2==0)
            return 1;
        else
            return 0;
    }*/