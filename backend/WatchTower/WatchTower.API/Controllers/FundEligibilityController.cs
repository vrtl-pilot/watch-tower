using Microsoft.AspNetCore.Mvc;
using WatchTower.API.Services;
using WatchTower.Shared.Models;
using System.Threading.Tasks;

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

        /// <summary>
        /// Checks the eligibility of a fund against various criteria for a specific environment.
        /// </summary>
        [HttpPost("check")]
        [ProducesResponseType(typeof(FundEligibilityResult), 200)]
        public async Task<IActionResult> CheckEligibility([FromBody] FundEligibilityRequest request)
        {
            if (string.IsNullOrEmpty(request.FundName))
            {
                return BadRequest(new { message = "FundName is required." });
            }

            var result = await _fundEligibilityService.CheckEligibilityAsync(request);
            return Ok(result);
        }
    }
}