using Microsoft.AspNetCore.SignalR;
using WatchTower.API.Models;

namespace WatchTower.API.Hubs
{
    public class MigrationHub : Hub
    {
        public async Task SendLogMessage(string message)
        {
            await Clients.All.SendAsync("ReceiveLogMessage", message);
        }

        public async Task SendServerStatusUpdate(Server server)
        {
            await Clients.All.SendAsync("ReceiveServerStatusUpdate", server);
        }
    }
}