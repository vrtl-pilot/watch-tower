using Microsoft.AspNetCore.Mvc;
using WatchTower.API.Models;
using System.Collections.Generic;

namespace WatchTower.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FundEligibilityController : ControllerBase
    {
        [HttpPost("check")]
        public ActionResult<FundEligibilityResult> CheckEligibility([FromBody] FundEligibilityRequest request)
        {
            if (string.IsNullOrEmpty(request.FundName))
            {
                return BadRequest("FundName is required.");
            }

            bool isEligible = request.FundName.Contains("Tech") || request.FundName.Contains("Blue");
            string status = isEligible ? "Eligible" : "Ineligible";

            var result = new FundEligibilityResult
            {
                FundName = request.FundName,
                Status = status,
                Criteria = new List<Criterion>
                {
                    new Criterion { Name = "Minimum AUM requirement met", Met = true },
                    new Criterion { Name = "Geographic restrictions satisfied", Met = isEligible },
                    new Criterion { Name = "Sector exposure limits adhered to", Met = true },
                    new Criterion { Name = $"Regulatory compliance check (Env: {request.Environment})", Met = isEligible, Reason = isEligible ? null : $"Failed compliance check in {request.Environment} environment." },
                    new Criterion { Name = "Historical performance benchmark (5Y)", Met = !isEligible, Reason = !isEligible ? "Benchmark not met over 5 years." : null },
                }
            };

            return Ok(result);
        }
    }
}