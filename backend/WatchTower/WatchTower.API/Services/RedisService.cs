using WatchTower.Shared.Models;

namespace WatchTower.API.Services
{
    public class RedisService : IRedisService
    {
        private readonly ILogger<RedisService> _logger;

        public RedisService(ILogger<RedisService> logger)
        {
            _logger = logger;
        }

        // Mock data definitions (static for persistence across mock calls)
        private static readonly RedisInfo MockInfo = new RedisInfo
        {
            Status = "Running",
            Uptime = "12d 5h 30m",
            ConnectedClients = 45,
            TotalKeys = 15000,
            PersistenceStatus = "OK",
            HitRatio = 0.92,
            UsedMemoryBytes = 150 * 1024 * 1024, // 150 MB
            MaxMemoryBytes = 512 * 1024 * 1024 // 512 MB
        };

        private static readonly List<RedisLatencyData> MockLatencyData = new List<RedisLatencyData>
        {
            new RedisLatencyData { Time = "10:00", LatencyMs = 1 },
            new RedisLatencyData { Time = "10:05", LatencyMs = 2 },
            new RedisLatencyData { Time = "10:10", LatencyMs = 1 },
            new RedisLatencyData { Time = "10:15", LatencyMs = 3 },
            new RedisLatencyData { Time = "10:20", LatencyMs = 1 },
        };

        private static readonly List<RedisKeyEntry> MockKeys = new List<RedisKeyEntry>
        {
            new RedisKeyEntry { Key = "user:123:session", Type = "string", TtlSeconds = 3600, Size = 120 },
            new RedisKeyEntry { Key = "cache:fund:A", Type = "hash", TtlSeconds = -1, Size = 5120 },
            new RedisKeyEntry { Key = "queue:tasks", Type = "list", TtlSeconds = -1, Size = 800 },
            new RedisKeyEntry { Key = "leaderboard:scores", Type = "zset", TtlSeconds = 86400, Size = 2048 },
            new RedisKeyEntry { Key = "user:456:profile", Type = "string", TtlSeconds = 1800, Size = 150 },
            new RedisKeyEntry { Key = "cache:fund:B", Type = "hash", TtlSeconds = -1, Size = 4096 },
            new RedisKeyEntry { Key = "temp:data:789", Type = "string", TtlSeconds = 60, Size = 50 },
        };

        public Task<RedisInfo> GetRedisInfoAsync(string environment)
        {
            _logger.LogInformation("Fetching Redis info for environment: {Environment}", environment);
            // In a real implementation, logic would select connection string based on environment
            return Task.FromResult(MockInfo);
        }

        public Task<IEnumerable<RedisLatencyData>> GetLatencyDataAsync(string environment)
        {
            _logger.LogInformation("Fetching Redis latency data for environment: {Environment}", environment);
            return Task.FromResult<IEnumerable<RedisLatencyData>>(MockLatencyData);
        }

        public Task<IEnumerable<RedisKeyEntry>> GetKeysAsync(string environment, string pattern, int limit)
        {
            _logger.LogInformation("Fetching Redis keys for environment: {Environment} with pattern: {Pattern}", environment, pattern);
            
            // Mock filtering by pattern (simple contains check for demonstration)
            var filteredKeys = MockKeys
                .Where(k => pattern == "*" || k.Key.Contains(pattern.Replace("*", "")))
                .Take(limit);

            return Task.FromResult<IEnumerable<RedisKeyEntry>>(filteredKeys);
        }

        public Task<string> GetKeyValueAsync(string environment, string key)
        {
            _logger.LogInformation("Fetching Redis key value for environment: {Environment}, key: {Key}", environment, key);
            
            if (MockKeys.Any(k => k.Key == key))
            {
                // Mock JSON value, including environment in the mock response for verification
                return Task.FromResult(
                    $"{{\"key\":\"{key}\",\"environment\":\"{environment}\",\"data\":\"This is mock data for {key} in {environment}.\"}}"
                );
            }
            
            throw new KeyNotFoundException($"Key {key} not found in Redis ({environment}).");
        }

        public Task<bool> DeleteKeyAsync(string environment, string key)
        {
            _logger.LogInformation("Deleting Redis key for environment: {Environment}, key: {Key}", environment, key);
            
            // Mock deletion logic
            var keyToRemove = MockKeys.FirstOrDefault(k => k.Key == key);
            if (keyToRemove != null)
            {
                // In a real app, this would call the Redis client to delete the key
                // For mock, we simulate success
                return Task.FromResult(true);
            }
            
            return Task.FromResult(false);
        }
    }
}