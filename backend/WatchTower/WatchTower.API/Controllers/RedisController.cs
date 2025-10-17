using Microsoft.AspNetCore.Mvc;
using WatchTower.Shared.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WatchTower.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RedisController : ControllerBase
    {
        private static readonly List<RedisKeyEntry> MockKeys = new List<RedisKeyEntry>
        {
            new RedisKeyEntry { Key = "user:session:12345", Type = "string", TtlSeconds = 3600, Size = 128 },
            new RedisKeyEntry { Key = "cache:fund:global_tech", Type = "hash", TtlSeconds = 600, Size = 4096 },
            new RedisKeyEntry { Key = "queue:migrations", Type = "list", TtlSeconds = -1, Size = 50 },
            new RedisKeyEntry { Key = "leaderboard:daily", Type = "zset", TtlSeconds = 86400, Size = 1000 },
            new RedisKeyEntry { Key = "config:feature_flags", Type = "string", TtlSeconds = -1, Size = 500 },
            new RedisKeyEntry { Key = "user:profile:9876", Type = "hash", TtlSeconds = 7200, Size = 2048 },
        };

        [HttpGet("info")]
        public ActionResult<RedisInfo> GetRedisInfo()
        {
            // Mock data for Redis instance status and memory
            var info = new RedisInfo
            {
                Status = "Running",
                Uptime = "12 days, 4 hours",
                ConnectedClients = 5,
                TotalKeys = MockKeys.Count + 100000, // Simulate more keys than shown
                PersistenceStatus = "OK",
                HitRatio = 0.95,
                UsedMemoryBytes = 1073741824, // 1 GB
                MaxMemoryBytes = 4294967296, // 4 GB
            };
            return Ok(info);
        }

        [HttpGet("latency-data")]
        public ActionResult<IEnumerable<RedisLatencyData>> GetLatencyData()
        {
            // Mock data for latency over time
            var data = new List<RedisLatencyData>
            {
                new RedisLatencyData { Time = "10:00", LatencyMs = 1 },
                new RedisLatencyData { Time = "10:05", LatencyMs = 2 },
                new RedisLatencyData { Time = "10:10", LatencyMs = 1 },
                new RedisLatencyData { Time = "10:15", LatencyMs = 3 },
                new RedisLatencyData { Time = "10:20", LatencyMs = 1 },
                new RedisLatencyData { Time = "10:25", LatencyMs = 5 },
                new RedisLatencyData { Time = "10:30", LatencyMs = 2 },
            };
            return Ok(data);
        }

        [HttpGet("keys")]
        public ActionResult<IEnumerable<RedisKeyEntry>> GetKeys([FromQuery] string pattern = "*", [FromQuery] int limit = 10)
        {
            // Mock implementation for key search/pagination
            var filteredKeys = MockKeys
                .Where(k => k.Key.Contains(pattern, System.StringComparison.OrdinalIgnoreCase) || pattern == "*")
                .Take(limit)
                .ToList();
            
            return Ok(filteredKeys);
        }

        [HttpGet("key/{key}/value")]
        public ActionResult<string> GetKeyValue(string key)
        {
            var keyToDecode = System.Uri.UnescapeDataString(key);

            if (keyToDecode.Contains("session"))
            {
                return Ok("{\"token\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c\",\"expiry\":\"2024-12-31T23:59:59Z\"}");
            }
            if (keyToDecode.Contains("fund"))
            {
                return Ok("[\"AAPL\", \"MSFT\", \"GOOGL\", \"TSLA\", \"AMZN\"]");
            }
            if (keyToDecode.Contains("queue"))
            {
                return Ok("[\"migration_job_1\", \"migration_job_2\", \"migration_job_3\"]");
            }
            
            return Ok($"Mock value for key: {keyToDecode}. Type: {MockKeys.FirstOrDefault(k => k.Key == keyToDecode)?.Type ?? "string"}");
        }

        [HttpDelete("key/{key}")]
        public async Task<IActionResult> DeleteKey(string key)
        {
            // Simulate asynchronous deletion process
            await Task.Delay(500); 
            
            var keyToDecode = System.Uri.UnescapeDataString(key);

            var index = MockKeys.FindIndex(k => k.Key == keyToDecode);
            if (index != -1)
            {
                MockKeys.RemoveAt(index);
                return Accepted(new { message = $"Deletion of key '{keyToDecode}' initiated." });
            }

            return NotFound(new { message = $"Key '{keyToDecode}' not found." });
        }
    }
}