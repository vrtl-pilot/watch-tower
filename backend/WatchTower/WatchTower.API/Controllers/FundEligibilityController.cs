using Microsoft.AspNetCore.Mvc;
using WatchTower.Shared.Models;
using System.Collections.Generic;
using System.Linq;

namespace WatchTower.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FundEligibilityController : ControllerBase
{
    [HttpPost("check")]
    public ActionResult<FundEligibilityResult> CheckEligibility([FromBody] FundEligibilityRequest request)
    {
        // Simulate eligibility check
        var criteria = new List<Criterion>
        {
            new() { Name = "Minimum Investment", Met = true },
            new() { Name = "Accredited Investor", Met = !(request.FundName?.Contains("Retail") ?? false), Reason = (request.FundName?.Contains("Retail") ?? false) ? "Retail fund selected, accredited status required" : null },
            new() { Name = "Geographic Region", Met = true },
            new() { Name = "Fund is Open", Met = !(request.FundName?.Contains("Closed") ?? false), Reason = (request.FundName?.Contains("Closed") ?? false) ? "This fund is closed to new investors." : null }
        };

        var isEligible = criteria.All(c => c.Met);

        var result = new FundEligibilityResult
        {
            FundName = request.FundName,
            Status = isEligible ? "Eligible" : "Ineligible",
            Criteria = criteria
        };

        return Ok(result);
    }
}