namespace WatchTower.API.Models
{
    public enum ServerStatus
    {
        Running = 0,
        Stopped = 1,
        Degraded = 2
    }

    public enum ServiceStatus
    {
        Running = 0,
        Stopped = 1,
        Down = 2,
        Degraded = 3
    }

    public class Server
    {
        public string Id { get; set; }
        public string ServerName { get; set; }
        public string Service { get; set; }
        public ServerStatus ServerStatus { get; set; }
        public ServiceStatus ServiceStatus { get; set; }
    }
}