using System.Collections.Generic;

namespace WatchTower.Shared.Models
{
    public class FundEligibilityResponse
    {
        // Key: Company Name, Value: Eligibility result for that company/fund combination
        public Dictionary<string, FundEligibilityResult> CompanyResults { get; set; } = new Dictionary<string, FundEligibilityResult>();
    }
}