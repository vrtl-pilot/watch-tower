namespace WatchTower.API.Models
{
    public class Server
    {
        public string Id { get; set; }
        public string ServerName { get; set; }
        public string Service { get; set; }
        public ServerStatus ServerStatus { get; set; }
        public ServiceStatus ServiceStatus { get; set; }
    }

    public enum ServerStatus
    {
        Running,
        Stopped,
        Degraded // New status
    }

    public enum ServiceStatus
    {
        Running,
        Stopped,
        Down,
        Degraded // New status
    }
}