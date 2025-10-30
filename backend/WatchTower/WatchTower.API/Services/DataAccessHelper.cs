using Dapper;
using System.Threading.Tasks;

namespace WatchTower.API.Services
{
    public class DataAccessHelper : IDataAccessHelper
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;

        public DataAccessHelper(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        public async Task<T> QueryFirstOrDefaultAsync<T>(string environment, string sql, object? parameters = null)
        {
            using (var connection = _dbConnectionFactory.GetConnection(environment))
            {
                return await connection.QueryFirstOrDefaultAsync<T>(sql, parameters);
            }
        }
    }
}