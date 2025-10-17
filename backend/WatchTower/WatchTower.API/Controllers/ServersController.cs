using Microsoft.AspNetCore.Mvc;
using WatchTower.API.Models;
using System.Collections.Generic;

namespace WatchTower.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServersController : ControllerBase
    {
        private static readonly List<Server> WebApiServers = new List<Server>
        {
            new Server { Id = "web-1", ServerName = "prod-web-01", Service = "User Service", ServerStatus = "Running", ServiceStatus = "Running" },
            new Server { Id = "web-2", ServerName = "prod-web-02", Service = "Order Service", ServerStatus = "Running", ServiceStatus = "Down" },
            new Server { Id = "web-3", ServerName = "prod-web-03", Service = "Product Service", ServerStatus = "Stopped", ServiceStatus = "Stopped" },
        };

        private static readonly List<Server> WorkerServers = new List<Server>
        {
            new Server { Id = "work-1", ServerName = "prod-worker-01", Service = "Data Processing", ServerStatus = "Running", ServiceStatus = "Running" },
            new Server { Id = "work-2", ServerName = "prod-worker-02", Service = "Email Notifications", ServerStatus = "Running", ServiceStatus = "Running" },
        };

        private static readonly List<Server> LighthouseServers = new List<Server>
        {
            new Server { Id = "lh-1", ServerName = "prod-lh-01", Service = "Metrics & Logging", ServerStatus = "Stopped", ServiceStatus = "Stopped" },
        };

        [HttpGet("webapi")]
        public ActionResult<IEnumerable<Server>> GetWebApiServers()
        {
            return Ok(WebApiServers);
        }

        [HttpGet("worker")]
        public ActionResult<IEnumerable<Server>> GetWorkerServers()
        {
            return Ok(WorkerServers);
        }

        [HttpGet("lighthouse")]
        public ActionResult<IEnumerable<Server>> GetLighthouseServers()
        {
            return Ok(LighthouseServers);
        }
    }
}