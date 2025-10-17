using System.Collections.Generic;

namespace WatchTower.API.Models
{
    public class Criterion
    {
        public string Name { get; set; }
        public bool Met { get; set; }
        public string Reason { get; set; }
    }

    public class FundEligibilityResult
    {
        public string FundName { get; set; }
        public string Status { get; set; }
        public List<Criterion> Criteria { get; set; }
    }
}