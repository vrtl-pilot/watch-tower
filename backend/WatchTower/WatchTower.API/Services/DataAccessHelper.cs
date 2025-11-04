using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;

namespace WatchTower.API.Services
{
    public class DataAccessHelper : IDataAccessHelper
    {
        private readonly IDbConnectionFactory _connectionFactory;

        public DataAccessHelper(IDbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<IEnumerable<T>> QueryAsync<T>(string sql, object param = null, string environment = "production")
        {
            using IDbConnection connection = _connectionFactory.GetConnection(environment);
            return await connection.QueryAsync<T>(sql, param);
        }

        public async Task<T> QuerySingleOrDefaultAsync<T>(string sql, object param = null, string environment = "production")
        {
            using IDbConnection connection = _connectionFactory.GetConnection(environment);
            return await connection.QuerySingleOrDefaultAsync<T>(sql, param);
        }

        public async Task<int> ExecuteAsync(string sql, object param = null, string environment = "production")
        {
            using IDbConnection connection = _connectionFactory.GetConnection(environment);
            return await connection.ExecuteAsync(sql, param);
        }
    }
}