using Microsoft.AspNetCore.Mvc;
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
        [HttpPost("enqueue")]
        public async Task<IActionResult> EnqueueMigrations([FromBody] List<MigrationItem> items)
        {
            if (items == null || !items.Any())
            {
                return BadRequest("No migration items provided.");
            }

            // In a real application, this would add items to a persistent queue
            // for a background worker. For now, we'll simulate the process.
            System.Console.WriteLine($"Received {items.Count} migration items to enqueue.");
            foreach (var item in items)
            {
                System.Console.WriteLine($"- Fund: {item.FundName}, Type: {item.DateType}, Env: {item.Env}");
            }

            await Task.Delay(500); // Simulate network/processing delay

            return Ok(new { message = $"{items.Count} migration(s) successfully enqueued." });
        }
    }
}