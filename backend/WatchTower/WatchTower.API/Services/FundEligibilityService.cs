using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WatchTower.Shared.Models;

namespace WatchTower.API.Services
{
    public class FundEligibilityService : IFundEligibilityService
    {
        private readonly IDataAccessHelper _dataAccessHelper;

        public FundEligibilityService(IDataAccessHelper dataAccessHelper)
        {
            _dataAccessHelper = dataAccessHelper;
        }

        public async Task<FundEligibilityResult> CheckEligibilityAsync(FundEligibilityRequest request)
        {
            // This simulates a database call and business logic.
            await Task.Delay(500); // Simulate latency

            var isEligible = request.FundName.Contains("Tech", StringComparison.OrdinalIgnoreCase) ||
                             request.FundName.Contains("Blue", StringComparison.OrdinalIgnoreCase);

            var status = isEligible ? "Eligible" : "Ineligible";

            var result = new FundEligibilityResult
            {
                FundName = request.FundName,
                Status = status,
                Criteria = new List<Criterion>
                {
                    new Criterion { Name = "Minimum AUM requirement met", Met = true },
                    new Criterion { Name = "Geographic restrictions satisfied", Met = isEligible },
                    new Criterion { Name = "Sector exposure limits adhered to", Met = true },
                    new Criterion
                    {
                        Name = $"Regulatory compliance check (Env: {request.Environment})",
                        Met = isEligible,
                        Reason = isEligible ? null : $"Failed compliance check in {request.Environment} environment."
                    },
                    new Criterion
                    {
                        Name = "Historical performance benchmark (5Y)",
                        Met = !isEligible,
                        Reason = !isEligible ? "Benchmark not met over 5 years." : null
                    }
                }
            };

            return result;
        }
    }
}