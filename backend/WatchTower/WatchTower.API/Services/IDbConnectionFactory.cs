using System.Data;

namespace WatchTower.API.Services
{
    public interface IDbConnectionFactory
    {
        IDbConnection GetConnection(string environment);
    }
}