package database.testHibernateSearch.search;

import org.apache.lucene.analysis.KeywordAnalyzer;
import org.apache.lucene.queryParser.ParseException;
import org.apache.lucene.queryParser.QueryParser;
import org.apache.lucene.search.Query;
import org.apache.lucene.util.Version;
import org.hibernate.Session;
import org.hibernate.search.FullTextQuery;
import org.hibernate.search.FullTextSession;
import org.hibernate.search.Search;
import org.hibernate.search.query.dsl.BooleanJunction;
import org.hibernate.search.query.dsl.QueryBuilder;

import java.util.List;
import java.util.Scanner;

public class SearchRunner {
	
	private static void doIndex() throws InterruptedException
    {
		Session session = HibernateUtil.getSession();
		FullTextSession fullTextSession = Search.getFullTextSession(session);
		fullTextSession.createIndexer().startAndWait();
		fullTextSession.close();
	}

	private static List<Contact> search(String queryString)
    {
		Session session = HibernateUtil.getSession();
		FullTextSession fullTextSession = Search.getFullTextSession(session);

		QueryBuilder queryBuilder = fullTextSession.getSearchFactory().buildQueryBuilder().forEntity(Contact.class).get();
        BooleanJunction<BooleanJunction> wholeQuery = queryBuilder.bool();
//        1st method
//		  org.apache.lucene.search.Query luceneQuery = queryBuilder.keyword().onFields("name").matching(queryString).createQuery();
//        2nd method through BooleanJunction
//        wholeQuery.should(queryBuilder.keyword().onFields("name").matching(queryString+"*").createQuery());
        try {
            //3nd method through QueryParser
            QueryParser qp = new QueryParser(Version.LUCENE_35, "", new KeywordAnalyzer());
            qp.setLowercaseExpandedTerms(true);
                //wildcard, prefix, fuzzy and range queries
            final Query query = qp.parse("name:"+queryString+"*");

            //4rd method through MultiFieldQueryParser
//            String[] searchFields = {"name"};
//            QueryParser mqp = new MultiFieldQueryParser(org.apache.lucene.util.Version.LUCENE_35, searchFields, new StopAnalyzer(Version.LUCENE_35));
//            mqp.setDefaultOperator(QueryParser.Operator.OR);
//            mqp.setLowercaseExpandedTerms(true);
//            mqp.setAllowLeadingWildcard(true);
//            final Query mQuery = mqp.parse(queryString);
            wholeQuery.should(query);
        } catch (ParseException e) {
            e.printStackTrace();
        }

		// wrap Lucene query in a javax.persistence.Query
		FullTextQuery fullTextQuery = fullTextSession.createFullTextQuery(wholeQuery.createQuery(), Contact.class);
		List<Contact> contactList = fullTextQuery.list();
		fullTextSession.close();
		return contactList;
	}

	private static void displayContactTableData()
    {
		Session session = null;
		try
        {
			session = HibernateUtil.getSession();
			// Fetching saved data
			List<Contact> contactList = session.createQuery("from Contact").list();
			for (Contact contact : contactList)
            {
				System.out.println(contact);
			}

		} catch (Exception ex) {
			ex.printStackTrace();
		} finally{
			if(session != null) {
				session.close();
			}
		}
	}

    private static void searchConsole() throws InterruptedException {
        System.out.println("\n\n******Data stored in Contact table******\n");
        displayContactTableData();
        // Create an initial Lucene index for the data already present in the database
        doIndex();
        Scanner scanner = new Scanner(System.in);
        String consoleInput = null;
        while (true)
        {
            // Prompt the user to enter query string
            System.out.print("\n\nEnter search key (To exit type 'X')");
            consoleInput = scanner.nextLine();

            if("X".equalsIgnoreCase(consoleInput))
            {
                System.out.println("End");
                HibernateUtil.end();
                System.exit(0);
            }

            List<Contact> result = search(consoleInput);
            System.out.println("\n\n>>>>>>Record found for '" + consoleInput + "'");
            for (Contact contact : result)
            {
                System.out.println(contact);
            }
        }
    }

    public static void baseInsert()
    {
       Contact contact1 = new Contact(1, "Tony Gor", "tony@yahoo.com");
       Contact contact2 = new Contact(2, "Artem Kov", "artem@yahoo.com");
       Contact contact3 = new Contact(3, "Bogdan Kupr", "bogdan@yahoo.com");
        Session session = HibernateUtil.getSession();
        session.beginTransaction();
        session.save(contact1);
        session.save(contact2);
        session.save(contact3);
        session.flush();
        session.getTransaction().commit();
        session.close();
        HibernateUtil.end();
    }

	public static void main(String[] args) throws InterruptedException
    {
//        baseInsert();
        searchConsole(); // hibernate search
    }
}
