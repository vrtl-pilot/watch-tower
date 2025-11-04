using Microsoft.AspNetCore.Mvc;
using WatchTower.API.Models;
using WatchTower.Shared.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using WatchTower.API.Hubs;

namespace WatchTower.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServersController : ControllerBase
    {
        private static readonly List<Server> _servers = new List<Server>
        {
            // Web API
            new Server { Id = "webapi-01", ServerName = "API-01", Service = "Web API", ServerStatus = ServerStatus.Running, ServiceStatus = ServiceStatus.Running },
            new Server { Id = "webapi-02", ServerName = "API-02", Service = "Web API", ServerStatus = ServerStatus.Running, ServiceStatus = ServiceStatus.Degraded },
            new Server { Id = "webapi-03", ServerName = "API-03", Service = "Web API", ServerStatus = ServerStatus.Stopped, ServiceStatus = ServiceStatus.Stopped },
            
            // Worker Service
            new Server { Id = "worker-01", ServerName = "Worker-A", Service = "Worker Service", ServerStatus = ServerStatus.Running, ServiceStatus = ServiceStatus.Running },
            new Server { Id = "worker-02", ServerName = "Worker-B", Service = "Worker Service", ServerStatus = ServerStatus.Running, ServiceStatus = ServiceStatus.Down },
            new Server { Id = "worker-03", ServerName = "Worker-C", Service = "Worker Service", ServerStatus = ServerStatus.Degraded, ServiceStatus = ServiceStatus.Running },
            
            // Lighthouse
            new Server { Id = "lighthouse-01", ServerName = "LH-01", Service = "Lighthouse", ServerStatus = ServerStatus.Running, ServiceStatus = ServiceStatus.Running },
            new Server { Id = "lighthouse-02", ServerName = "LH-02", Service = "Lighthouse", ServerStatus = ServerStatus.Stopped, ServiceStatus = ServiceStatus.Stopped },
        };

        private readonly IHubContext<WatchTowerHub> _hubContext;

        public ServersController(IHubContext<WatchTowerHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpGet("all")]
        public IEnumerable<Server> GetAllServers()
        {
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
                await Task.Delay(2000); // Simulate processing time

                // Simulate status change based on action
                switch (request.ActionType)
                {
                    case "startServer":
                        server.ServerStatus = ServerStatus.Running;
                        server.ServiceStatus = ServiceStatus.Running;
                        break;
                    case "stopServer":
                        server.ServerStatus = ServerStatus.Stopped;
                        server.ServiceStatus = ServiceStatus.Stopped;
                        break;
                    case "restartServer":
                        server.ServerStatus = ServerStatus.Running;
                        server.ServiceStatus = ServiceStatus.Running;
                        break;
                    case "startService":
                        server.ServiceStatus = ServiceStatus.Running;
                        break;
                    case "stopService":
                        server.ServiceStatus = ServiceStatus.Stopped;
                        break;
                    case "restartService":
                        server.ServiceStatus = ServiceStatus.Running;
                        break;
                    case "resumeService":
                        server.ServiceStatus = ServiceStatus.Running;
                        break;
                    default:
                        await _hubContext.Clients.All.SendAsync("ReceiveServerActionFailure", server.Id, $"Unknown action type: {request.ActionType}");
                        return;
                }

                // Notify clients of the update
                await _hubContext.Clients.All.SendAsync("ReceiveServerStatusUpdate", server);
            });

            // Return 202 Accepted immediately
            return Accepted(new { message = $"Action '{request.ActionType}' initiated for server {server.ServerName}." });
        }
    }
}