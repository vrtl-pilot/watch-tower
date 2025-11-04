using System.Collections.Generic;

namespace WatchTower.Shared.Models
{
    public class FundEligibilityResult
    {
        public string FundName { get; set; }
        public string Status { get; set; } // Eligible, Ineligible, Pending
        public List<Criterion> Criteria { get; set; } = new List<Criterion>();
    }
}