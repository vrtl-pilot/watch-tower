namespace WatchTower.Shared.Models
{
    public class RedisKeyEntry
    {
        public string Key { get; set; }
        public string Type { get; set; }
        public long TtlSeconds { get; set; }
        public long Size { get; set; }
    }
}