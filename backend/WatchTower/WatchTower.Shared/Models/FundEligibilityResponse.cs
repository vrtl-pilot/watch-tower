using System.Collections.Generic;

namespace WatchTower.Shared.Models
{
    public class FundEligibilityResponse
    {
        // Key: Company Name, Value: Eligibility result for that company/fund combination
        public Dictionary<string, FundCriteriaResult> CompanyResults { get; set; } = new Dictionary<string, FundCriteriaResult>();
    }
}