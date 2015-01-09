package reports.testJasperReport;

import java.sql.*;
import java.util.HashMap;

import net.sf.jasperreports.engine.*;

public class RunnerJasper
{
    /*
    create table customers(id text , firstname text , lastname text , city text , segment text );
    INSERT INTO customers(id, firstname, lastname, city, segment)
    VALUES('id1', 'text1', 'lastname1', 'city1', 'segment1');
    INSERT INTO customers(id, firstname, lastname, city, segment)
    VALUES('id2', 'text2', 'lastname2', 'city2', 'segment2');
    INSERT INTO customers(id, firstname, lastname, city, segment)
    VALUES('id3', 'text3', 'lastname3', 'city3', 'segment3');
    */
    public static void main(String[] args)
    {

        String query = "select * from customers";
        Connection conn = null;
        ResultSet resultSet = null;
        PreparedStatement statement = null;
        System.out.println("Starting");

        try {
            Class.forName("org.postgresql.Driver");
            conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/test", "postgres", "admin");
            statement = conn.prepareStatement(query);
            resultSet = statement.executeQuery();

            /* //show result set ! attention result set can't be used if it already iterate
            while (resultSet.next()){ System.out.println(resultSet.getString("firstname")); }
            */

            /* //color pie
            JasperReport jasperReport = JasperCompileManager.compileReport("src/main/resources/reports/jasperReport/Pie_Specified_Series_Colors.jrxml");
            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, new HashMap<String, Object>(), new JREmptyDataSource());
            JasperExportManager.exportReportToPdfFile(jasperPrint, "colorPie.pdf");
            */

            JasperReport jasperReport = JasperCompileManager.compileReport("src/main/resources/reports/jasperReport/hello.xml");
            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, new HashMap<String, Object>(), new JRResultSetDataSource(resultSet));
            JasperExportManager.exportReportToPdfFile(jasperPrint, "table.pdf");

        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        finally
        {
            try
            {
//                conn.close();
            } catch (Exception e)
            {
                e.printStackTrace();
            }
        }
        System.out.println("Done.");
    }
}