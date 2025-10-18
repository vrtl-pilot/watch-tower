using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using WatchTower.API.Hubs;
using WatchTower.API.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WatchTower.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServersController : ControllerBase
    {
        private readonly IHubContext<WatchTowerHub> _hubContext;

        public ServersController(IHubContext<WatchTowerHub> hubContext)
        {
            _hubContext = hubContext;
        }

        // Mock data for demonstration purposes
        private static List<Server> _servers = new List<Server>
        {
            new Server { Id = "webapi-01", ServerName = "API-SVR-01", Service = "Web API", ServerStatus = ServerStatus.Running, ServiceStatus = ServiceStatus.Running },
            new Server { Id = "webapi-02", ServerName = "API-SVR-02", Service = "Web API", ServerStatus = ServerStatus.Running, ServiceStatus = ServiceStatus.Running },
            new Server { Id = "worker-01", ServerName = "WRK-SVR-01", Service = "Worker Service", ServerStatus = ServerStatus.Running, ServiceStatus = ServiceStatus.Running },
            new Server { Id = "worker-02", ServerName = "WRK-SVR-02", Service = "Worker Service", ServerStatus = ServerStatus.Degraded, ServiceStatus = ServiceStatus.Degraded },
            new Server { Id = "lighthouse-01", ServerName = "LHT-SVR-01", Service = "Lighthouse", ServerStatus = ServerStatus.Running, ServiceStatus = ServiceStatus.Running },
            new Server { Id = "lighthouse-02", ServerName = "LHT-SVR-02", Service = "Lighthouse", ServerStatus = ServerStatus.Stopped, ServiceStatus = ServiceStatus.Stopped },
        };

        [HttpGet("all")]
        public IEnumerable<Server> GetAllServers()
        {
            return _servers;
        }

        [HttpGet("webapi")]
        public IEnumerable<Server> GetWebApiServers() => _servers.Where(s => s.Service == "Web API");

        [HttpGet("worker")]
        public IEnumerable<Server> GetWorkerServers() => _servers.Where(s => s.Service == "Worker Service");

        [HttpGet("lighthouse")]
        public IEnumerable<Server> GetLighthouseServers() => _servers.Where(s => s.Service == "Lighthouse");

        [HttpPost("action")]
        public async Task<IActionResult> PerformServerAction([FromBody] ServerActionRequest request)
        {
            var server = _servers.FirstOrDefault(s => s.Id == request.Id);
            if (server == null)
            {
                return NotFound(new { message = $"Server with ID {request.Id} not found." });
            }

            // Simulate asynchronous action execution
            _ = Task.Run(async () =>
            {
                // Simulate work being done (e.g., calling external service, waiting)
                await Task.Delay(5000); 

                // Determine new status based on action type (Mocking logic)
                ServerStatus newServerStatus = server.ServerStatus;
                ServiceStatus newServiceStatus = server.ServiceStatus;

                switch (request.ActionType)
                {
                    case "startServer":
                        newServerStatus = ServerStatus.Running;
                        newServiceStatus = ServiceStatus.Running;
                        break;
                    case "stopServer":
                        newServerStatus = ServerStatus.Stopped;
                        newServiceStatus = ServiceStatus.Stopped;
                        break;
                    case "restartServer":
                        newServerStatus = ServerStatus.Running;
                        newServiceStatus = ServiceStatus.Running;
                        break;
                    case "startService":
                    case "resumeService":
                        newServiceStatus = ServiceStatus.Running;
                        break;
                    case "stopService":
                        newServiceStatus = ServiceStatus.Stopped;
                        break;
                    case "restartService":
                        newServiceStatus = ServiceStatus.Running;
                        break;
                }

                // Update the mock state
                server.ServerStatus = newServerStatus;
                server.ServiceStatus = newServiceStatus;

                // Send update via SignalR
                await _hubContext.Clients.All.SendAsync("ReceiveServerStatusUpdate", server);
            });

            // Return 202 Accepted immediately, as the action is processing asynchronously
            return Accepted(new { message = $"Action '{request.ActionType}' initiated for {server.ServerName}." });
        }
    }
}