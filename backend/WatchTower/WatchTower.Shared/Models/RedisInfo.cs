namespace WatchTower.Shared.Models
{
    public class RedisInfo
    {
        public string Status { get; set; } = "Running";
        public string Uptime { get; set; } = "12 days";
        public long ConnectedClients { get; set; } = 5;
        public long TotalKeys { get; set; } = 150000;
        public string PersistenceStatus { get; set; } = "OK";
        public double HitRatio { get; set; } = 0.95;
        public long UsedMemoryBytes { get; set; } = 1073741824; // 1 GB
        public long MaxMemoryBytes { get; set; } = 4294967296; // 4 GB
    }
}