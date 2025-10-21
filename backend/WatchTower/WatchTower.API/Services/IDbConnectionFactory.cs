using Microsoft.Data.SqlClient;

namespace WatchTower.API.Services
{
    public interface IDbConnectionFactory
    {
        SqlConnection CreateConnection(string environment);
    }
}