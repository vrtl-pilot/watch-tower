using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace WatchTower.API.Services
{
    public class DbConnectionFactory : IDbConnectionFactory
    {
        private readonly IConfiguration _configuration;

        public DbConnectionFactory(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IDbConnection GetConnection(string environment)
        {
            // Map environment string (e.g., "development") to ConnectionStrings key (e.g., "DevelopmentDb")
            // Ensure the first letter is capitalized to match the appsettings.json keys (e.g., DevelopmentDb)
            string connectionStringKey = $"{char.ToUpper(environment[0])}{environment.Substring(1)}Db";
            
            var connectionString = _configuration.GetConnectionString(connectionStringKey);

            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException($"Connection string for environment '{environment}' (key: {connectionStringKey}) not found.");
            }

            return new SqlConnection(connectionString);
        }
    }
}