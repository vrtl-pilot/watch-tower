using System.Collections.Generic;
using System.Threading.Tasks;
using WatchTower.Shared.Models;

namespace WatchTower.API.Services
{
    public interface IRedisService
    {
        Task<RedisInfo> GetRedisInfoAsync(string environment);
        Task<List<RedisLatencyData>> GetLatencyDataAsync(string environment);
        Task<List<RedisKeyEntry>> GetKeysAsync(string environment, string pattern, int limit);
        Task<string> GetKeyValueAsync(string environment, string key);
        Task<bool> DeleteKeyAsync(string environment, string key);
    }
}