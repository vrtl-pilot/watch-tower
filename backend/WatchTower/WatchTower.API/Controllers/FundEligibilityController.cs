using Microsoft.AspNetCore.Mvc;
using WatchTower.Shared.Models;
using WatchTower.API.Services;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;

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
                // Returning dummy data for demonstration purposes on error.
                var dummyResult = new FundEligibilityResult
                {
                    FundName = request.FundName,
                    Status = "Ineligible",
                    Criteria = new List<Criterion>
                    {
                        new() { Name = "System Status", Met = false, Reason = "An error occurred while checking eligibility. Displaying dummy data." },
                        new() { Name = "Minimum Investment", Met = true },
                        new() { Name = "Accredited Investor", Met = false, Reason = "Could not verify status due to a system error." },
                        new() { Name = "Geographic Region", Met = true }
                    }
                };
                return Ok(dummyResult);
            }
        }
    }
}