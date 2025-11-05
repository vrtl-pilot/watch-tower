namespace WatchTower.API.Models
{
    public class EligibiliyItem
    {
        public bool FundEligible { get; set; }
        public bool ClientFundEligible { get; set; }
        public bool MappingEligible { get; set; }
        public bool IsMTDSupport { get; set; }
        public bool IsMigrationEligible { get; set; }
        public string Company { get; set; }
        public string ClientFundname { get; set; }
    }
}
