package subMatters.testSshGanymed;

public class RunnerSSH {


    public static void testSSH()
    {
        String command = "help";
        final ImplSSH freeConnection = new ImplSSH();//getConnection();
            final String result;
//            try
//            {
                result = freeConnection.executeCommand(command);
//            }
//            catch(SshConnectionFailureException e)
//            {
//                throw new DeviceUnavailableException("Probe exists, but SSH connection signal about error", e, ipAddress, Protocol.SSH);
//            }
            System.out.println("get string from probe : ");
            System.out.println(result);
    }


    public static void main(String[] args)
    {
        testSSH();
    }
}
