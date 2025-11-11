namespace WatchTower.Shared.Models
{
    public class FundEligibilityResult
    {
        public string FundName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty; // 'Eligible', 'Ineligible', 'Pending'
        public List<Criterion> Criteria { get; set; } = new List<Criterion>();
        public string Frequency { get; set; } = string.Empty;
        public string ClientFundName { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string SubFundIds { get; set; }
    }
}