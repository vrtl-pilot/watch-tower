using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using WatchTower.API.Services;

namespace WatchTower.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RedisController : ControllerBase
    {
        private readonly IRedisService _redisService;

        public RedisController(IRedisService redisService)
        {
            _redisService = redisService;
        }

        [HttpGet("info")]
        public async Task<IActionResult> GetInfo([FromQuery] string environment)
        {
            if (string.IsNullOrEmpty(environment)) return BadRequest("Environment parameter is required.");
            try
            {
                var info = await _redisService.GetRedisInfoAsync(environment);
                return Ok(info);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to get Redis info: {ex.Message}");
            }
        }

        [HttpGet("latency-data")]
        public async Task<IActionResult> GetLatencyData([FromQuery] string environment)
        {
            if (string.IsNullOrEmpty(environment)) return BadRequest("Environment parameter is required.");
            var data = await _redisService.GetLatencyDataAsync(environment);
            return Ok(data);
        }

        [HttpGet("keys")]
        public async Task<IActionResult> GetKeys([FromQuery] string environment, [FromQuery] string pattern = "*", [FromQuery] int limit = 100)
        {
            if (string.IsNullOrEmpty(environment)) return BadRequest("Environment parameter is required.");
            try
            {
                var keys = await _redisService.GetKeysAsync(environment, pattern, limit);
                return Ok(keys);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to get keys: {ex.Message}");
            }
        }

        [HttpGet("key/{key}/value")]
        public async Task<IActionResult> GetKeyValue(string key, [FromQuery] string environment)
        {
            if (string.IsNullOrEmpty(environment)) return BadRequest("Environment parameter is required.");
            var value = await _redisService.GetKeyValueAsync(environment, key);
            return Content(value, "text/plain");
        }

        [HttpDelete("key/{key}")]
        public async Task<IActionResult> DeleteKey(string key, [FromQuery] string environment)
        {
            if (string.IsNullOrEmpty(environment)) return BadRequest("Environment parameter is required.");
            var deleted = await _redisService.DeleteKeyAsync(environment, key);
            if (deleted)
            {
                return Accepted(new { message = $"Key '{key}' deleted successfully." });
            }
            return NotFound($"Key '{key}' not found or could not be deleted.");
        }
    }
}