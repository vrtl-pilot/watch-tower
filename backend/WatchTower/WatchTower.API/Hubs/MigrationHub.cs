using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace WatchTower.API.Hubs
{
    public class MigrationHub : Hub
    {
        // Method used by the controller to send status updates
        public async Task SendServerStatusUpdate(object server)
        {
            await Clients.All.SendAsync("ReceiveServerStatusUpdate", server);
        }
    }
}