using Microsoft.AspNetCore.Mvc;
using WatchTower.API.Models;

namespace WatchTower.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServersController : ControllerBase
    {
        private static readonly List<Server> WebApiServers = new List<Server>
        {
            new Server { Id = "webapi-01", ServerName = "WEBAPI-01", Service = "Web API", ServerStatus = "Running", ServiceStatus = "Running" },
            new Server { Id = "webapi-02", ServerName = "WEBAPI-02", Service = "Web API", ServerStatus = "Running", ServiceStatus = "Running" },
            new Server { Id = "webapi-03", ServerName = "WEBAPI-03", Service = "Web API", ServerStatus = "Stopped", ServiceStatus = "Stopped" }
        };

        private static readonly List<Server> WorkerServers = new List<Server>
        {
            new Server { Id = "worker-01", ServerName = "WORKER-01", Service = "Worker Service", ServerStatus = "Running", ServiceStatus = "Running" },
            new Server { Id = "worker-02", ServerName = "WORKER-02", Service = "Worker Service", ServerStatus = "Running", ServiceStatus = "Down" },
            new Server { Id = "worker-03", ServerName = "WORKER-03", Service = "Worker Service", ServerStatus = "Running", ServiceStatus = "Stopped" }
        };

        private static readonly List<Server> LighthouseServers = new List<Server>
        {
            new Server { Id = "lighthouse-01", ServerName = "LIGHTHOUSE-01", Service = "Lighthouse", ServerStatus = "Running", ServiceStatus = "Running" },
            new Server { Id = "lighthouse-02", ServerName = "LIGHTHOUSE-02", Service = "Lighthouse", ServerStatus = "Running", ServiceStatus = "Running" }
        };

        [HttpGet("webapi")]
        public IEnumerable<Server> GetWebApiServers()
        {
            return WebApiServers;
        }

        [HttpGet("worker")]
        public IEnumerable<Server> GetWorkerServers()
        {
            return WorkerServers;
        }

        [HttpGet("lighthouse")]
        public IEnumerable<Server> GetLighthouseServers()
        {
            return LighthouseServers;
        }

        [HttpGet("all")]
        public IEnumerable<Server> GetAllServers()
        {
            return WebApiServers.Concat(WorkerServers).Concat(LighthouseServers);
        }

        [HttpPost("action")]
        public IActionResult PerformServerAction([FromBody] ServerActionRequest request)
        {
            // In a real application, this would trigger an action (e.g., via PowerShell or an orchestration tool)
            // and update the actual server status. For this mock, we simulate a successful action and status update.

            var allServers = GetAllServers().ToList();
            var serverToUpdate = allServers.FirstOrDefault(s => s.Id == request.Id);

            if (serverToUpdate == null)
            {
                return NotFound(new { message = $"Server with ID {request.Id} not found." });
            }

            // Simulate status change based on actionType
            switch (request.ActionType)
            {
                case "startServer":
                    serverToUpdate.ServerStatus = "Running";
                    serverToUpdate.ServiceStatus = "Running";
                    break;
                case "stopServer":
                    serverToUpdate.ServerStatus = "Stopped";
                    serverToUpdate.ServiceStatus = "Stopped";
                    break;
                case "restartServer":
                    serverToUpdate.ServerStatus = "Running";
                    serverToUpdate.ServiceStatus = "Running";
                    break;
                case "startService":
                    serverToUpdate.ServiceStatus = "Running";
                    break;
                case "stopService":
                    serverToUpdate.ServiceStatus = "Stopped";
                    break;
                case "restartService":
                    serverToUpdate.ServiceStatus = "Running";
                    break;
            }

            // Return the updated server object
            return Ok(serverToUpdate);
        }
    }
}