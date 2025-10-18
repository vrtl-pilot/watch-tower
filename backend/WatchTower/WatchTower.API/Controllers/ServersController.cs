using Microsoft.AspNetCore.Mvc;
using WatchTower.API.Models;
using WatchTower.API.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace WatchTower.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServersController : ControllerBase
    {
        private readonly IHubContext<WatchTowerHub> _hubContext;
        private static readonly List<Server> _servers = new List<Server>
        {
            new Server { Id = "webapi-01", ServerName = "API-01", Service = "Web API", ServerStatus = "Running", ServiceStatus = "Running" },
            new Server { Id = "webapi-02", ServerName = "API-02", Service = "Web API", ServerStatus = "Running", ServiceStatus = "Degraded" },
            new Server { Id = "worker-01", ServerName = "WRK-01", Service = "Worker Service", ServerStatus = "Running", ServiceStatus = "Running" },
            new Server { Id = "worker-02", ServerName = "WRK-02", Service = "Worker Service", ServerStatus = "Stopped", ServiceStatus = "Stopped" },
            new Server { Id = "lighthouse-01", ServerName = "LHT-01", Service = "Lighthouse", ServerStatus = "Running", ServiceStatus = "Running" },
            new Server { Id = "lighthouse-02", ServerName = "LHT-02", Service = "Lighthouse", ServerStatus = "Degraded", ServiceStatus = "Down" },
        };

        public ServersController(IHubContext<WatchTowerHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpGet("all")]
        public async Task<IEnumerable<Server>> GetAllServers()
        {
            // Simulate network latency/processing time
            await Task.Delay(1000); 
            
            return _servers;
        }

        [HttpGet("webapi")]
        public IEnumerable<Server> GetWebApiServers()
        {
            return _servers.Where(s => s.Service == "Web API");
        }

        [HttpGet("worker")]
        public IEnumerable<Server> GetWorkerServers()
        {
            return _servers.Where(s => s.Service == "Worker Service");
        }

        [HttpGet("lighthouse")]
        public IEnumerable<Server> GetLighthouseServers()
        {
            return _servers.Where(s => s.Service == "Lighthouse");
        }

        [HttpPost("action")]
        public async Task<IActionResult> PerformServerAction([FromBody] ServerActionRequest request)
        {
            var server = _servers.FirstOrDefault(s => s.Id == request.Id);

            if (server == null)
            {
                return NotFound(new { message = $"Server with ID {request.Id} not found." });
            }

            // Simulate asynchronous action processing
            _ = Task.Run(async () =>
            {
                await Task.Delay(3000); // Simulate action execution time

                try
                {
                    // Logic to update server status based on actionType
                    switch (request.ActionType)
                    {
                        case "startServer":
                            server.ServerStatus = "Running";
                            server.ServiceStatus = "Running";
                            break;
                        case "stopServer":
                            server.ServerStatus = "Stopped";
                            server.ServiceStatus = "Stopped";
                            break;
                        case "restartServer":
                            server.ServerStatus = "Running";
                            server.ServiceStatus = "Running";
                            break;
                        case "startService":
                            server.ServiceStatus = "Running";
                            break;
                        case "stopService":
                            server.ServiceStatus = "Stopped";
                            break;
                        case "restartService":
                            server.ServiceStatus = "Running";
                            break;
                        case "resumeService":
                            // Assuming 'Degraded' or 'Down' is the state before resume
                            server.ServiceStatus = "Running";
                            break;
                        default:
                            throw new ArgumentException($"Unknown action type: {request.ActionType}");
                    }

                    // Notify clients of the successful status update
                    await _hubContext.Clients.All.SendAsync("ReceiveServerStatusUpdate", server);
                }
                catch (Exception ex)
                {
                    // Notify clients of the failure
                    await _hubContext.Clients.All.SendAsync("ReceiveServerActionFailure", server.Id, $"Failed to perform action '{request.ActionType}' on {server.ServerName}/{server.Service}: {ex.Message}");
                }
            });

            // Return 202 Accepted immediately
            return Accepted(new { message = $"Action '{request.ActionType}' initiated for {server.ServerName}/{server.Service}. Status update will follow." });
        }
    }
}