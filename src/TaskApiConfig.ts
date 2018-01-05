export class TaskApiConfig {
  public WebAddress: string;
  public AppAddress: string;
  public TaskServiceAddress: string;
  public AuthServiceAddress: string;
  public UserServiceAddress: string;
  public NotificationServiceAddress: string;
  public RootDomain: string;
  public AuthToken: string;
  public Env: string;
  public handleHttpError: (error: any) => void;
}
