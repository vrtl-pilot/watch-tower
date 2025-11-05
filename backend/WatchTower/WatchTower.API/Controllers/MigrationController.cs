using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using WatchTower.API.Hubs;
using WatchTower.Shared.Models;
using WatchTower.API.Services;
using EasyNetQ;

namespace WatchTower.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MigrationController : ControllerBase
    {
        private readonly IHubContext<WatchTowerHub> _hubContext;
        private readonly IRabbitMqConnectionProvider _mqProvider;

        public MigrationController(IHubContext<WatchTowerHub> hubContext, IRabbitMqConnectionProvider mqProvider)
        {
            _hubContext = hubContext;
            _mqProvider = mqProvider;
        }

        [HttpPost("enqueue")]
        public async Task<IActionResult> EnqueueMigrations([FromBody] List<MigrationItem> items)
        {
            if (items == null || !items.Any())
            {
                return BadRequest(new { message = "No migration items provided." });
            }

            // Group items by environment
            var itemsByEnv = items.GroupBy(i => i.Env);
            int totalEnqueued = 0;
            bool connectionFailed = false;

            foreach (var group in itemsByEnv)
            {
                var environment = group.Key;
                IBus bus;
                try
                {
                    bus = _mqProvider.GetBus(environment);
                }
                catch (InvalidOperationException ex)
                {
                    await _hubContext.Clients.All.SendAsync("ReceiveLogMessage", $"[ERROR] Failed to get RabbitMQ connection string for environment {environment}: {ex.Message}");
                    connectionFailed = true;
                    continue;
                }
                catch (EasyNetQ.EasyNetQException ex)
                {
                    await _hubContext.Clients.All.SendAsync("ReceiveLogMessage", $"[ERROR] RabbitMQ connection failed for environment {environment}. Check RabbitMQ server status: {ex.Message}");
                    connectionFailed = true;
                    continue;
                }

                foreach (var item in group)
                {
                    try
                    {
                        // Publish the message. EasyNetQ uses Publish/Subscribe pattern by default for IBus.PubSub.PublishAsync
                        await bus.PubSub.PublishAsync(item);
                        await _hubContext.Clients.All.SendAsync("ReceiveLogMessage", $"[INFO] Published migration for Fund: {item.FundName} to RabbitMQ ({environment}).");
                        totalEnqueued++;
                    }
                    catch (Exception ex)
                    {
                        await _hubContext.Clients.All.SendAsync("ReceiveLogMessage", $"[ERROR] Failed to publish migration for Fund: {item.FundName} to RabbitMQ ({environment}): {ex.Message}");
                        // Continue to the next item/group if one fails
                    }
                }
            }

            if (totalEnqueued > 0)
            {
                await _hubContext.Clients.All.SendAsync("ReceiveLogMessage", $"[SUCCESS] Successfully enqueued {totalEnqueued} migration(s) via RabbitMQ.");
                return Ok(new { message = $"Successfully enqueued {totalEnqueued} migration(s)." });
            }
            else if (connectionFailed)
            {
                return StatusCode(500, new { message = "Failed to enqueue any migrations due to RabbitMQ connection errors. Check logs." });
            }
            else
            {
                return StatusCode(500, new { message = "Failed to enqueue any migrations." });
            }
        }
    }
}