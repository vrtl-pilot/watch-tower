using System.Threading.Tasks;

namespace WatchTower.API.Services
{
    public interface IDataAccessHelper
    {
        Task<T> QueryFirstOrDefaultAsync<T>(string environment, string sql, object? parameters = null);
    }
}