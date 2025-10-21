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
                "development" => _configuration.GetConnectionString("DevelopmentDb"),
                "test01" => _configuration.GetConnectionString("Test01Db"),
                "test02" => _configuration.GetConnectionString("Test02Db"),
                "qa01" => _configuration.GetConnectionString("QA01Db"),
                "qa02" => _configuration.GetConnectionString("QA02Db"),
                "production" => _configuration.GetConnectionString("ProductionDb"),
                _ => _configuration.GetConnectionString("DevelopmentDb") // Default to Development
            };
        }
    }
}