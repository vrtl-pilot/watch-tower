using System.Collections.Generic;

namespace WatchTower.API.Services
{
    public interface IRedisConnectionProvider
    {
        string GetConnectionString(string environment);
        Dictionary<string, string> GetAllConnectionStrings();
    }
}