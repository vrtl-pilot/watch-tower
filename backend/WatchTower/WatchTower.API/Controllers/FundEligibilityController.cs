using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WatchTower.API.Services;
using WatchTower.Shared.Models;

namespace WatchTower.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FundEligibilityController : ControllerBase
    {
        private readonly IFundEligibilityService _fundEligibilityService;

        public FundEligibilityController(IFundEligibilityService fundEligibilityService)
        {
            _fundEligibilityService = fundEligibilityService;
        }

        [HttpPost("check")]
        public async Task<IActionResult> CheckEligibility([FromBody] FundEligibilityRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.FundName))
            {
                return BadRequest("Fund name is required.");
            }

            var result = await _fundEligibilityService.CheckEligibilityAsync(request);
            return Ok(result);
        }
    }
}