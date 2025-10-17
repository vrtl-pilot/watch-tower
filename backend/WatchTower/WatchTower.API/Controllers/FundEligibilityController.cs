using Microsoft.AspNetCore.Mvc;
using WatchTower.Shared.Models;
using WatchTower.API.Services;
using System.Threading.Tasks;
using System;

namespace WatchTower.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FundEligibilityController : ControllerBase
    {
        private readonly IFundEligibilityService _eligibilityService;

        public FundEligibilityController(IFundEligibilityService eligibilityService)
        {
            _eligibilityService = eligibilityService;
        }

        [HttpPost("check")]
        public async Task<ActionResult<FundEligibilityResult>> CheckEligibility([FromBody] FundEligibilityRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.FundName))
            {
                return BadRequest("Fund name is required.");
            }

            try
            {
                var result = await _eligibilityService.CheckEligibilityAsync(request);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                // In a real app, you would log the full exception.
                return StatusCode(500, "An internal server error occurred while checking eligibility.");
            }
        }
    }
}