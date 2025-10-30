using Microsoft.AspNetCore.Mvc;
using WatchTower.API.Services;
using WatchTower.Shared.Models;

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

        /// <summary>
        /// Gets general information and statistics about the Redis instance.
        /// </summary>
        [HttpGet("info")]
        public async Task<ActionResult<RedisInfo>> GetRedisInfo([FromQuery] string environment)
        {
            if (string.IsNullOrEmpty(environment))
            {
                return BadRequest("Environment parameter is required.");
            }
            
            var info = await _redisService.GetRedisInfoAsync(environment);
            return Ok(info);
        }

        /// <summary>
        /// Gets recent latency data for the Redis instance.
        /// </summary>
        [HttpGet("latency-data")]
        public async Task<ActionResult<IEnumerable<RedisLatencyData>>> GetLatencyData([FromQuery] string environment)
        {
            if (string.IsNullOrEmpty(environment))
            {
                return BadRequest("Environment parameter is required.");
            }
            
            var data = await _redisService.GetLatencyDataAsync(environment);
            return Ok(data);
        }

        /// <summary>
        /// Searches for keys matching a pattern.
        /// </summary>
        [HttpGet("keys")]
        public async Task<ActionResult<IEnumerable<RedisKeyEntry>>> GetKeys(
            [FromQuery] string environment,
            [FromQuery] string pattern = "*", 
            [FromQuery] int limit = 50)
        {
            if (string.IsNullOrEmpty(environment))
            {
                return BadRequest("Environment parameter is required.");
            }
            
            var keys = await _redisService.GetKeysAsync(environment, pattern, limit);
            return Ok(keys);
        }

        /// <summary>
        /// Gets the value of a specific key.
        /// </summary>
        [HttpGet("key/{key}/value")]
        public async Task<ActionResult<string>> GetKeyValue(string key, [FromQuery] string environment)
        {
            if (string.IsNullOrEmpty(environment))
            {
                return BadRequest("Environment parameter is required.");
            }
            
            try
            {
                var value = await _redisService.GetKeyValueAsync(environment, key);
                return Ok(value);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        /// <summary>
        /// Deletes a specific key.
        /// </summary>
        [HttpDelete("key/{key}")]
        public async Task<IActionResult> DeleteKey(string key, [FromQuery] string environment)
        {
            if (string.IsNullOrEmpty(environment))
            {
                return BadRequest("Environment parameter is required.");
            }
            
            var deleted = await _redisService.DeleteKeyAsync(environment, key);
            
            if (deleted)
            {
                return Ok(new { message = $"Key '{key}' deleted successfully from {environment}." });
            }
            
            return NotFound(new { message = $"Key '{key}' not found in {environment}." });
        }
    }
}