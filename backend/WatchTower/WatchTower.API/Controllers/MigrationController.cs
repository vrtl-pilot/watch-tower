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
    public class MigrationController : ControllerBase
    {
        private readonly IHubContext<MigrationHub> _hubContext;

        public MigrationController(IHubContext<MigrationHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpPost("enqueue")]
        public async Task<IActionResult> EnqueueMigrations([FromBody] List<MigrationItem> items)
        {
            if (items == null || !items.Any())
            {
                return BadRequest("No migration items provided.");
            }

            await _hubContext.Clients.All.SendAsync("ReceiveLogMessage", $"[INFO] Received request to enqueue {items.Count} migration(s).");
            
            foreach (var item in items)
            {
                // Simulate processing delay for each item
                await Task.Delay(1000); 
                await _hubContext.Clients.All.SendAsync("ReceiveLogMessage", $"[INFO] Enqueuing migration for Fund: {item.FundName}...");
            }

            await Task.Delay(500); // Simulate final processing delay
            await _hubContext.Clients.All.SendAsync("ReceiveLogMessage", $"[SUCCESS] All {items.Count} migration(s) have been successfully added to the queue.");

            return Ok(new { message = $"{items.Count} migration(s) successfully enqueued." });
        }
    }
}