using System.Collections.Generic;

namespace WatchTower.Shared.Models
{
    public class FundEligibilityResult
    {
        public string FundName { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending"; // "Eligible", "Ineligible", "Pending"
        public List<Criterion> Criteria { get; set; } = new List<Criterion>();
    }

    public class Criterion
    {
        public string Name { get; set; } = string.Empty;
        public bool Met { get; set; }
        public string? Reason { get; set; }
    }
}