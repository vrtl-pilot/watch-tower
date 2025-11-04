using System.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WatchTower.API.Services
{
    public interface IDataAccessHelper
    {
        Task<IEnumerable<T>> QueryAsync<T>(string sql, object param = null, string environment = "production");
        Task<T> QuerySingleOrDefaultAsync<T>(string sql, object param = null, string environment = "production");
        Task<int> ExecuteAsync(string sql, object param = null, string environment = "production");
    }
}