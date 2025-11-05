using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;

namespace WatchTower.API.Services
{
    public class RedisConnectionProvider : IRedisConnectionProvider
    {
        private readonly IConfiguration _configuration;
        private const string SectionName = "RedisConnectionStrings";

        public RedisConnectionProvider(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GetConnectionString(string environment)
        {
            if (string.IsNullOrWhiteSpace(environment))
            {
                throw new ArgumentException("Environment cannot be null or whitespace.", nameof(environment));
            }

            // Configuration keys are case-insensitive in many providers (like JSON).
            var connectionStringKey = $"{SectionName}:{environment}";
            var connectionString = _configuration[connectionStringKey];

            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException($"Redis connection string for environment '{environment}' not found at key '{connectionStringKey}'.");
            }

            return connectionString;
        }

        public Dictionary<string, string> GetAllConnectionStrings()
        {
            var section = _configuration.GetSection(SectionName);
            if (section == null || !section.GetChildren().Any())
            {
                return new Dictionary<string, string>();
            }
            
            return section.GetChildren()
                .ToDictionary(x => x.Key, x => x.Value, StringComparer.OrdinalIgnoreCase);
        }
    }
}