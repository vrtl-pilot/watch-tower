using Microsoft.AspNetCore.SignalR;
using WatchTower.API.Models;
using WatchTower.API.Services;

namespace WatchTower.API.Hubs
{
    public class WatchTowerHub : Hub
    {
        private readonly IRedisService _redisService;

        public WatchTowerHub(IRedisService redisService)
        {
            _redisService = redisService;
        }

        public async Task SendLogMessage(string message)
        {
            await Clients.All.SendAsync("ReceiveLogMessage", message);
        }

        public async Task SendServerStatusUpdate(Server server)
        {
            await Clients.All.SendAsync("ReceiveServerStatusUpdate", server);
        }
        
        // New method to simulate sending a failure message
        public async Task SendServerActionFailure(string serverId, string errorMessage)
        {
            await Clients.All.SendAsync("ReceiveServerActionFailure", serverId, errorMessage);
        }
    }
}