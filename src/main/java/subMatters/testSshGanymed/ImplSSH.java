package subMatters.testSshGanymed;

import ch.ethz.ssh2.Connection;
import ch.ethz.ssh2.Session;
import ch.ethz.ssh2.StreamGobbler;
import ch.ethz.ssh2.transport.ClientTransportManager;

import java.io.*;
import java.lang.reflect.Field;
import java.net.Socket;

public class ImplSSH {
    // Constants
    public static final int MAX_COMMAND_EXECUTION_RETRIES = Integer.parseInt(System.getProperty("ssh.connection.max_command_execution_retries","1"));
    // Timeout constants (in ms)
    public static final long CONNECTION_TIMEOUT = Long.parseLong(System.getProperty("ssh.connection.timeout", "10000"));
    public static final long INPUT_STREAM_READING_TIMEOUT = Long.parseLong(System.getProperty("ssh.connection.input_stream_timeout", "20000"));
    public static final long KEY_EXCHANGE_TIMEOUT = Long.parseLong(System.getProperty("ssh.connection.key_exchange_timeout", "120000"));
    // Buffer to write commands to be executed on server
    protected BufferedWriter writer;
    // Buffer to read server's output
    protected BufferedReader reader;
    private Session session;
    private Connection connection;

    final String hostIP = "192.168.176.182";
    final String userName = "admin";
    final String password = "admin";
    private boolean isConnected;
    public ImplSSH()
    {
        //and set hostIP, userName, password
        connection = new Connection(hostIP);
        connection.addConnectionMonitor(new ConnectionMonitor());
    }


    public synchronized String executeCommand(final String command) //throws SshConnectionFailureException, AuthenticationException, DeviceUnavailableException
    {
        int executionRetries = 0;
        while(true)
        {
            connectIfNotConnected();
//            try
//            {
                return directCommandExecution(command);
//            }
//            catch(final WriteLockFailureException e)
//            {
//                LOG.error("Haven't the write lock. Command \"" + command + "\" execution failed for: " + this, e);
//                if(++executionRetries > MAX_COMMAND_EXECUTION_RETRIES)
//                {
//                    throw new DeviceUnavailableException("Haven't the write lock", e, hostIP, Protocol.SSH);
//                }
//                // Try to reinitialize write lock on device
//                try
//                {
//                    directCommandExecution("session writelock");
//                }
//                catch (final CommandExecutionException commandExecutionException)
//                {
//                    LOG.error("Unable to acquire writelock for: " + toString(), commandExecutionException);
//                }
//            }
//            catch(final SessionFailureException e)
//            {
//                LOG.error("Session not ready. Command \"" + command + "\" execution failed for: " + toString(), e);
//                if(++executionRetries > MAX_COMMAND_EXECUTION_RETRIES)
//                {
//                    throw new DeviceUnavailableException("Device is unavailable - impossible to execute command", e, hostIP, Protocol.SSH);
//                }
//                // Try to reinitialize session on device
//                reconnect();
//            }
//            catch(final CommandExecutionException e)
//            {
//                LOG.error("Command \"" + command + "\" execution failed for: " + this, e);
//                if(++executionRetries > MAX_COMMAND_EXECUTION_RETRIES)
//                {
//                    throw new DeviceUnavailableException("Device is unavailable - impossible to execute command", e, hostIP, Protocol.SSH);
//                }
//                // Try to reinitialize connection to device
//                reconnect();
//            }
//            LOG.warn("Retrying command \""+ command +"\" execution for: " + this);
        }
    }

    protected void connectIfNotConnected() //throws AuthenticationException, DeviceUnavailableException, SshConnectionFailureException
    {
        ensureConnectionReady();  //abstract
        ensureSessionReady();     //abstract
    }

    public void ensureConnectionReady() //throws AuthenticationException, DeviceUnavailableException
    {
        String exceptionMessage = "Authentication failed for: ";
        // Check is SSH client already connected to server, connect if not connected
        if(!isConnected)
        {
            // Try to create new connection. Throw exception if failed
            try
            {
                connection.close();
                connection.connect(null, (int) CONNECTION_TIMEOUT, (int) KEY_EXCHANGE_TIMEOUT);
                try
                {
                    Field tmField = Connection.class.getDeclaredField("tm");
                    tmField.setAccessible(true);
                    ClientTransportManager tm = (ClientTransportManager) tmField.get(connection);

                    Field socketField = ClientTransportManager.class.getDeclaredField("sock");
                    socketField.setAccessible(true);
                    Socket sock = (Socket) socketField.get(tm);

                    sock.setKeepAlive(true);
                }
                catch(Exception e)
                {
                    log("Couldn't set keepalive property: " + this.toString(), e.toString());
                    //LOG.error("Couldn't set keepalive property: " + this.toString(), e);
                }
                boolean isAuthenticated;
                try
                {
                    // Try to pass authentication
                    isAuthenticated = connection.authenticateWithPassword(userName, password);
                }
                catch(IOException e)
                {
                    isAuthenticated = false;
                }

                if(isAuthenticated)
                {
                    // Create condition for new session creation
                    if(session != null)
                    {
                        session.close();
                    }
                    session = null;
                }
                else
                {
                    log(exceptionMessage + this.toString());
//                    LOG.error(exceptionMessage + this.toString());
//                    throw new AuthenticationException(exceptionMessage + this.toString(),hostIP);
                }
                isConnected = true;
            }
            catch(IOException e)
            {
                log("Connection is unavailable for: " + this.toString());
//                LOG.error("Connection is unavailable for: " + this.toString());
//                throw new DeviceUnavailableException("Device " + hostIP + " isn't available", e, hostIP, Protocol.SSH);
            }
        }
    }


    public void ensureSessionReady() //throws SshConnectionFailureException
    {
        try
        {
            if(session == null)
            {
                session = connection.openSession();
                session.requestPTY("vt100", 0, 0, 0, 0, null);
                session.startShell();

                // Initialize reader and writer streams
                reader = new BufferedReader(new InputStreamReader(new StreamGobbler(session.getStdout())));
                writer = new BufferedWriter(new OutputStreamWriter(session.getStdin()));

                initShellWelcomeMessage();
                log("New connection created for: ProbeIP = [" + hostIP + "]; ");
//                LOG.debug("New connection created for: ProbeIP = [" + hostIP + "]; ");
                try
                {
                    directCommandExecution("session writeunlock");
                }
                catch (Exception e)
                {
                    log("Unable to release writelock");
//                    LOG.warn("Unable to release writelock");
                }
            }
        }
        catch(Exception ioe)
        {
            disconnect();
//            throw new SshConnectionFailureException("Error creating session with " + this.toString(), ioe);
        }
    }

    private String shellWelcomeMessage;

    protected void initShellWelcomeMessage() throws IOException//, SshConnectionFailureException
    {
        String reply = HelperSSH.readUntil(":", reader, INPUT_STREAM_READING_TIMEOUT);
        String[] welcomeMsgs = reply.split("\\r\\n");
        if (welcomeMsgs.length == 0)
        {
            log("Error determining shell welcome message");
//            throw new SshConnectionFailureException("Error determining shell welcome message");
        }
        this.shellWelcomeMessage = welcomeMsgs[welcomeMsgs.length - 1];
    }

    protected String directCommandExecution(final String command)// throws CommandExecutionException
    {
        try
        {
            writer.write(command + "\n");
            writer.flush();
            final String rawResult = HelperSSH.readUntil(shellWelcomeMessage, reader, INPUT_STREAM_READING_TIMEOUT);

            // Probably command was not executed correctly on remote device
            if(!"\n".equals(command) && rawResult.length() == 0)
            {
                System.out.println("Command execution result is empty. Command: \"" + command + "\""+ hostIP);
                System.exit(1);
//                throw new CommandExecutionException("Command execution result is empty. Command: \"" + command + "\"", hostIP, Protocol.SSH);
            }

            final String result = trimAnswerAuxiliaryData(rawResult, command, shellWelcomeMessage);

            if(HelperSSH.isSessionExpiredMessage(result))
            {
                System.out.println("Unable to execute command. Command: \"" + command + "\""+ hostIP);
                System.exit(1);
//                throw new SessionFailureException("Unable to execute command. Command: \"" + command + "\"", hostIP);
            }
            if(HelperSSH.isWriteLockLockMessage(result))
            {
                System.out.println("Device is locked for command execution. Command: \"" + command + "\""+ hostIP);
                System.exit(1);
//                throw new WriteLockFailureException("Device is locked for command execution. Command: \"" + command + "\"", hostIP);
            }

            return result;
        }
        catch (IOException ioe)
        {
            System.out.println("Error executing command \"" + command + "\" with " + this+ ioe+ hostIP);
            System.exit(1);
            return null;
//            throw new CommandExecutionException("Error executing command \"" + command + "\" with " + this, ioe, hostIP, Protocol.SSH);
        }
    }

    /**
     * Remove auxiliary data from message (usually it is sent command and console welcome message)
     * @param message message to trim
     * @param command command, produced message output
     * @param endOfAnswerPattern end of message pattern (usually it's shell welcome message)
     * @return trimmed message
     */
    private String trimAnswerAuxiliaryData(final String message, final String command, final String endOfAnswerPattern)
    {
        int indexOfCommand = message.lastIndexOf(command);
        if (indexOfCommand != -1)
        {
            indexOfCommand += command.length();
        }

        int indexOfAnswerEnd = message.indexOf(endOfAnswerPattern);

        if (indexOfAnswerEnd == -1)
        {
            return message.substring(indexOfCommand + 1).trim();
        }
        else if (indexOfAnswerEnd >= indexOfCommand)
        {
            return message.substring(indexOfCommand + 1, indexOfAnswerEnd).trim();
        }
        return "";
    }

    public void disconnect()
    {
        try
        {
            reader.close();
        }
        catch(Exception e)
        {
            // Probably was already closed or not opened/initialized
//            LOG.debug("Exception closing reader. Probably reader was not initialized: ", e);
            log("Exception closing reader. Probably reader was not initialized: "+ e);
        }

        try
        {
            writer.close();
        }
        catch(Exception e)
        {
            // Probably was already closed or not opened/initialized
//            LOG.debug("Exception closing writer. Probably writer was not initialized: ", e);
            log("Exception closing writer. Probably writer was not initialized: "+ e.toString());
        }

        if(session != null)
        {
            session.close();
        }
        session = null;

        if(connection != null)
        {
            connection.close();
        }
        isConnected = false;
    }

    /**
     * Helpful class which provides SSH connection state monitoring
     * Is used to get notified when the underlying socket of a connection is closed.
     */
    private class ConnectionMonitor implements ch.ethz.ssh2.ConnectionMonitor
    {
        public void connectionLost(final Throwable reason)
        {
            isConnected = false;
            log("No connection for: " + this.toString(), reason.toString());
        }
    }

    private void log(String ...msg)
    {
        for(int part=0; part<msg.length; part++)
        {
            System.out.println(msg[part]);
        }
    }






    //************************************* abstract



    public synchronized void reconnect()
            //throws AuthenticationException, DeviceUnavailableException, SshConnectionFailureException
    {
        disconnect();
        connectIfNotConnected();
    }

    @Override
    protected void finalize() throws Throwable {
        try
        {
//            LOG.warn("SSH connection is being garbage collected but it was never disconnect.");
            System.out.println("SSH connection is being garbage collected but it was never disconnect.");
            disconnect();
        }
        finally
        {
            super.finalize();
        }
    }
}
