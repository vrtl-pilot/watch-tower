using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

namespace WatchTower.API.Services
{
    public class DataAccessHelper : IDataAccessHelper
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;

        public DataAccessHelper(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        public async Task<List<T>> QueryAsync<T>(string environment, string query, Func<SqlDataReader, T> map, params SqlParameter[] parameters)
        {
            var items = new List<T>();

            await using var connection = _dbConnectionFactory.CreateConnection(environment);
            await connection.OpenAsync();

            await using var command = new SqlCommand(query, connection);
            if (parameters != null)
            {
                command.Parameters.AddRange(parameters);
            }

            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                items.Add(map(reader));
            }

            return items;
        }
    }
}