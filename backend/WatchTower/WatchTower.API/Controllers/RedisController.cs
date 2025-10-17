using Microsoft.AspNetCore.Mvc;
using WatchTower.Shared.Models;
using System.Collections.Generic;
using System.Linq;

namespace WatchTower.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RedisController : ControllerBase
    {
        [HttpGet("info")]
        public ActionResult<RedisInfo> GetRedisInfo()
        {
            // Mock data for Redis instance status and memory
            var info = new RedisInfo
            {
                Status = "Running",
                Uptime = "12 days, 4 hours",
                ConnectedClients = 5,
                TotalKeys = 150000,
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
    }
}