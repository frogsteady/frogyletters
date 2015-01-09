package database.testHibernateSearch.transaction;

import org.hibernate.CallbackException;
import org.hibernate.EmptyInterceptor;
import org.hibernate.type.Type;
import database.testHibernateSearch.search.Contact;

import java.io.Serializable;
import java.util.Arrays;
import java.util.Date;

/**
 * Created by White on 25.07.2014.
 */
public class EntityInterceptor extends EmptyInterceptor{

    private static final long serialVersionUID = -1396244157117835991L;

    @Override
    public boolean onFlushDirty( final Object entity,
                                 final Serializable id,
                                 final Object[] currentState,
                                 final Object[] previousState,
                                 final String[] propertyNames,
                                 final Type[] types )  throws CallbackException
    {
        if(entity instanceof Contact)
        {
            setValue(currentState, propertyNames, "updateDate", new Date());
            return true;
        }
        return false;
    }


    @Override
    public boolean onSave( final Object entity,
                           final Serializable id,
                           final Object[] state,
                           final String[] propertyNames,
                           final Type[] types ) throws CallbackException
    {
        if(entity instanceof Contact)
        {
            Date currentTime = new Date();
            setValue(state, propertyNames, "updateDate", currentTime);
            return true;
        }
        return false;
    }

    private void setValue(final Object[] state,
                          final String[] propertyNames,
                          final String propertyToSet,
                          final Object value)
    {
        int index = Arrays.asList(propertyNames).indexOf(propertyToSet);
        if (index >= 0)
        {
            state[index] = value;
        }
    }
}
