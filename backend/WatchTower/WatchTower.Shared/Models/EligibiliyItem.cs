namespace WatchTower.Shared.Models
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
    public string Fundname { get; set; }
    public string Frequency { get; set; } = string.Empty;
    public DateTime? AttributionStartDate { get; set; }
    public DateTime? ClientFundRiskStartDate { get; set; }
    public DateTime? AttributionEndDate { get; set; }
    public DateTime? ClientFundRiskEndDate { get; set; }
}
public class FoFDates
{
    public string FundName { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? LatestDate { get; set; }
}

public class FoFFunds
{
    public string FundName { get; set; }
    public string FOFSubFundName { get; set; }
    public long FOFSubFundID { get; set; }
    
}
}