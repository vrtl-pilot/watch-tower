using Microsoft.AspNetCore.Mvc;
using WatchTower.API.Models;
using System.Collections.Generic;
using System.Linq;

namespace WatchTower.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServersController : ControllerBase
    {
        private static readonly List<Server> MockServers = new List<Server>
        {
            // Web API Servers
            new Server { Id = "webapi-01", ServerName = "API-Prod-01", Service = "Web API", ServerStatus = ServerStatus.Running, ServiceStatus = ServiceStatus.Running },
            new Server { Id = "webapi-02", ServerName = "API-Prod-02", Service = "Web API", ServerStatus = ServerStatus.Running, ServiceStatus = ServiceStatus.Degraded }, // Degraded Service
            new Server { Id = "webapi-03", ServerName = "API-QA-01", Service = "Web API", ServerStatus = ServerStatus.Running, ServiceStatus = ServiceStatus.Stopped },
            new Server { Id = "webapi-04", ServerName = "API-Dev-01", Service = "Web API", ServerStatus = ServerStatus.Stopped, ServiceStatus = ServiceStatus.Stopped },

            // Worker Servers
            new Server { Id = "worker-01", ServerName = "Worker-Prod-01", Service = "Worker Service", ServerStatus = ServerStatus.Running, ServiceStatus = ServiceStatus.Running },
            new Server { Id = "worker-02", ServerName = "Worker-Prod-02", Service = "Worker Service", ServerStatus = ServerStatus.Degraded, ServiceStatus = ServiceStatus.Running }, // Degraded Server
            new Server { Id = "worker-03", ServerName = "Worker-QA-01", Service = "Worker Service", ServerStatus = ServerStatus.Running, ServiceStatus = ServiceStatus.Down },
            new Server { Id = "worker-04", ServerName = "Worker-Dev-01", Service = "Worker Service", ServerStatus = ServerStatus.Running, ServiceStatus = ServiceStatus.Stopped },

            // Lighthouse Servers
            new Server { Id = "lh-01", ServerName = "LH-Prod-01", Service = "Lighthouse", ServerStatus = ServerStatus.Running, ServiceStatus = ServiceStatus.Running },
            new Server { Id = "lh-02", ServerName = "LH-QA-01", Service = "Lighthouse", ServerStatus = ServerStatus.Running, ServiceStatus = ServiceStatus.Degraded }, // Degraded Service
            new Server { Id = "lh-03", ServerName = "LH-Dev-01", Service = "Lighthouse", ServerStatus = ServerStatus.Stopped, ServiceStatus = ServiceStatus.Stopped },
        };

        [HttpGet("all")]
        public IEnumerable<Server> GetAllServers()
        {
            return MockServers;
        }

        [HttpGet("webapi")]
        public IEnumerable<Server> GetWebApiServers()
        {
            return MockServers.Where(s => s.Service == "Web API");
        }

        [HttpGet("worker")]
        public IEnumerable<Server> GetWorkerServers()
        {
            return MockServers.Where(s => s.Service == "Worker Service");
        }

        [HttpGet("lighthouse")]
        public IEnumerable<Server> GetLighthouseServers()
        {
            return MockServers.Where(s => s.Service == "Lighthouse");
        }

        [HttpPost("action")]
        public IActionResult PerformServerAction([FromBody] ServerActionRequest request)
        {
            // Mock implementation: In a real app, this would trigger an async operation.
            // For now, we just log and return 202 Accepted.
            System.Console.WriteLine($"Received action request: {request.ActionType} for server ID {request.Id}");
            
            // Simulate immediate acceptance
            return Accepted(new { message = $"Action '{request.ActionType}' initiated for server {request.Id}." });
        }
    }
}