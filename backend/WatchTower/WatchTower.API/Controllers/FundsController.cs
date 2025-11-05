using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WatchTower.API.Services;

namespace WatchTower.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FundsController : ControllerBase
    {
        private readonly IFundService _fundService;

        public FundsController(IFundService fundService)
        {
            _fundService = fundService;
        }

        [HttpGet]
        public async Task<IActionResult> GetFundNames([FromQuery] string? searchPattern, string environment)
        {
            try
            {
                var funds = await _fundService.GetFundNamesAsync(environment, searchPattern);
                return Ok(funds);
            }
            catch (System.Exception)
            {
                return StatusCode(500, "An error occurred while fetching fund names.");
            }
        }
    }
}