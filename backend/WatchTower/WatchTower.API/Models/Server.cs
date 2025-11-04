using WatchTower.Shared.Models;

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
}