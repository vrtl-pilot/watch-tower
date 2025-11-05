using EasyNetQ;

namespace WatchTower.API.Services
{
    public interface IRabbitMqConnectionProvider
    {
        IBus GetBus(string environment);
    }
}