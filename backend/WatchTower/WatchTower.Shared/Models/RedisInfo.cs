namespace WatchTower.Shared.Models
{
    public class RedisInfo
    {
        public string Status { get; set; }
        public string Uptime { get; set; }
        public int ConnectedClients { get; set; }
        public long TotalKeys { get; set; }
        public string PersistenceStatus { get; set; }
        public double HitRatio { get; set; }
        public long UsedMemoryBytes { get; set; }
        public long MaxMemoryBytes { get; set; }
    }
}