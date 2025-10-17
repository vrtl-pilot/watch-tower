using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;

namespace WatchTower.API.Services
{
    public class DbConnectionFactory : IDbConnectionFactory
    {
        private readonly IConfiguration _configuration;

        public DbConnectionFactory(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public SqlConnection CreateConnection(string environment)
        {
            var connectionString = GetConnectionString(environment);
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new ArgumentException("Invalid environment specified or connection string not found.");
            }
            return new SqlConnection(connectionString);
        }

        private string GetConnectionString(string? environment)
        {
            return environment?.ToLower() switch
            {
                "prod" => _configuration.GetConnectionString("ProdDb"),
                "staging" => _configuration.GetConnectionString("StagingDb"),
                "dev" => _configuration.GetConnectionString("DevDb"),
                _ => _configuration.GetConnectionString("DevDb") // Default to Dev
            };
        }
    }
}