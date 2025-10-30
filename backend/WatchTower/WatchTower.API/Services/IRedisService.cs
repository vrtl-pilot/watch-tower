using WatchTower.Shared.Models;

namespace WatchTower.API.Services
{
    public interface IRedisService
    {
        Task<RedisInfo> GetRedisInfoAsync(string environment);
        Task<IEnumerable<RedisLatencyData>> GetLatencyDataAsync(string environment);
        Task<IEnumerable<RedisKeyEntry>> GetKeysAsync(string environment, string pattern, int limit);
        Task<string> GetKeyValueAsync(string environment, string key);
        Task<bool> DeleteKeyAsync(string environment, string key);
    }
}