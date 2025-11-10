namespace WatchTower.Shared.Models
{
    public class FundEligibilityRequest
    {
        public string FundName { get; set; } = string.Empty;
        public string Environment { get; set; } = string.Empty;
        public DateTime? Date { get; set; }
        public bool PrimaryFunds { get; set; }
        public bool IncludeFof { get; set; }
    }
}