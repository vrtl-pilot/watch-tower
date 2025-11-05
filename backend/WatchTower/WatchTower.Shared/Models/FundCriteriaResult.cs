namespace WatchTower.Shared.Models
{
    public class FundCriteriaResult
    {
        public string FundName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty; // 'Eligible', 'Ineligible', 'Pending'
        public List<Criterion> Criteria { get; set; } = new List<Criterion>();
    }
}