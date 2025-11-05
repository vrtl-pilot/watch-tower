namespace WatchTower.Shared.Models
{
    public class EligibiliyItem
    {
        public string FundName { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty; // Overall status for this company/fund ('Eligible', 'Ineligible', 'Pending')
        public string CriterionName { get; set; } = string.Empty;
        public bool Met { get; set; }
        public string? Reason { get; set; }
    }
}