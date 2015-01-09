Запустить rmiregistry из jdk/bin. В папке с *.class файлами.

###security
1)jre7\lib\security\java.security -> policy.url.3=file:D:/.java.policy

2)Файл java.policy :
grant codeBase "file:C:/myProject/bin/"{
    permission java.security.AllPermission;
}

3)В psvm добавить security:
System.setSecurityManager(new RMISecurityManager());