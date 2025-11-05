using EasyNetQ;
using Microsoft.Extensions.Configuration;
using System.Collections.Concurrent;

namespace WatchTower.API.Services
{
    public class RabbitMqConnectionProvider : IRabbitMqConnectionProvider, IDisposable
    {
        private readonly IConfiguration _configuration;
        private readonly ConcurrentDictionary<string, IBus> _buses = new ConcurrentDictionary<string, IBus>();
        private readonly string _connectionStringSection = "RabbitMqConnectionStrings";

        public RabbitMqConnectionProvider(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IBus GetBus(string environment)
        {
            // Normalize environment name (e.g., 'development' -> 'Development')
            var normalizedEnv = environment.Substring(0, 1).ToUpper() + environment.Substring(1);

            if (_buses.TryGetValue(normalizedEnv, out var bus))
            {
                return bus;
            }

            var connectionString = _configuration.GetSection(_connectionStringSection)[normalizedEnv];

            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException($"RabbitMQ connection string not found for environment: {normalizedEnv}");
            }

            // EasyNetQ handles connection management internally.
            var newBus = RabbitHutch.CreateBus(connectionString);
            _buses.TryAdd(normalizedEnv, newBus);
            return newBus;
        }

        public void Dispose()
        {
            foreach (var bus in _buses.Values)
            {
                bus.Dispose();
            }
            _buses.Clear();
            GC.SuppressFinalize(this);
        }
    }
}