package subMatters.testSshGanymed;

import java.io.BufferedReader;
import java.io.IOException;

public class HelperSSH
{

    /**
     * @param pattern
     * @param reader
     * @param INPUT_STREAM_READING_TIMEOUT
     * @return string of response until reach pattern (usually ":")
     * @throws java.io.IOException
     */
    public static String readUntil(final String pattern, BufferedReader reader, final long INPUT_STREAM_READING_TIMEOUT) throws IOException
    {
        if(pattern == null || pattern.length() == 0)
        {
            throw new IOException("Read until pattern is null or empty. Reading from stream may cast to hanging");
        }

        StringBuilder input = new StringBuilder();

        boolean isReachedPattern = false;
        long startTime = System.currentTimeMillis();
        long timePoint = startTime+1;

        while(!isReachedPattern && (timePoint - startTime) < INPUT_STREAM_READING_TIMEOUT)
        {
            if(reader.ready())
            {
                int charsReadCount;
                char[] buffer = new char[1024];
                if((charsReadCount = reader.read(buffer)) >= 0)
                {
                    input.append((new String(buffer)).substring(0, charsReadCount));

                    int pos = input.lastIndexOf(pattern);
                    if (pos > 0 && pattern.equals(input.substring(pos).trim()))
                    {
                        isReachedPattern = true;
                    }
                }
            }
            timePoint = System.currentTimeMillis();
        }

        if(!isReachedPattern)
        {
            throw new IOException("Reading from stream finished by timeout: " + INPUT_STREAM_READING_TIMEOUT
                    + "ms. Read until pattern was not reached!");
        }

        return input.toString().trim();
    }


    public static boolean isWriteLockLockMessage(final String message)
    {
        return message.contains("You don't have the write lock");
    }

    public static boolean isSessionExpiredMessage(final String message)
    {
        return message.contains("The session expired") || " ".equals(message);
    }
}
