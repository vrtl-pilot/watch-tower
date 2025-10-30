using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WatchTower.Shared.Models;
using System.Linq;

namespace WatchTower.API.Services
{
    public class FundEligibilityService : IFundEligibilityService
    {
        private readonly IDataAccessHelper _dataAccessHelper;

        public FundEligibilityService(IDataAccessHelper dataAccessHelper)
        {
            _dataAccessHelper = dataAccessHelper;
        }

        public async Task<FundEligibilityResult> CheckEligibilityAsync(FundEligibilityRequest request)
        {
            // This logic now queries the database for fund details.
            // It assumes a 'Funds' table with 'AUM', 'Region', and 'Sector' columns.
            var fundDetailsSql = "SELECT AUM, Region, Sector FROM Funds WHERE FundName = @FundName;";
            var fund = await _dataAccessHelper.QueryFirstOrDefaultAsync<FundData>(fundDetailsSql, new { FundName = request.FundName });

            if (fund == null)
            {
                return new FundEligibilityResult
                {
                    FundName = request.FundName,
                    Status = "Ineligible",
                    Criteria = new List<Criterion>
                    {
                        new Criterion { Name = "Fund Existence Check", Met = false, Reason = "Fund not found in the database." }
                    }
                };
            }

            var criteria = new List<Criterion>();

            // Criterion 1: AUM Check
            var aumMet = fund.AUM > 100000000; // $100M
            criteria.Add(new Criterion
            {
                Name = "Minimum AUM requirement met (> $100M)",
                Met = aumMet,
                Reason = aumMet ? null : $"Fund AUM is ${fund.AUM:N0}, which is below the threshold."
            });

            // Criterion 2: Region Check
            var allowedRegions = new[] { "Global", "USA", "Europe" };
            var regionMet = allowedRegions.Contains(fund.Region);
            criteria.Add(new Criterion
            {
                Name = "Geographic restrictions satisfied (Global, USA, Europe)",
                Met = regionMet,
                Reason = regionMet ? null : $"Fund region '{fund.Region}' is not an allowed region."
            });

            // Criterion 3: Sector Check
            var restrictedSectors = new[] { "Tobacco", "Gambling" };
            var sectorMet = !restrictedSectors.Contains(fund.Sector);
            criteria.Add(new Criterion
            {
                Name = "Sector exposure limits adhered to (No Tobacco/Gambling)",
                Met = sectorMet,
                Reason = sectorMet ? null : $"Fund is in a restricted sector: '{fund.Sector}'."
            });
            
            // Criterion 4: Environment-specific check (simulated)
            var complianceMet = !(request.Environment.Contains("prod", StringComparison.OrdinalIgnoreCase) && fund.Region == "Emerging Markets");
            criteria.Add(new Criterion
            {
                Name = $"Regulatory compliance check (Env: {request.Environment})",
                Met = complianceMet,
                Reason = complianceMet ? null : "Fund from 'Emerging Markets' region is not compliant in Production."
            });

            var overallStatus = criteria.All(c => c.Met) ? "Eligible" : "Ineligible";

            return new FundEligibilityResult
            {
                FundName = request.FundName,
                Status = overallStatus,
                Criteria = criteria
            };
        }
    }

    // Helper class to map query results
    internal class FundData
    {
        public decimal AUM { get; set; }
        public string Region { get; set; } = string.Empty;
        public string Sector { get; set; } = string.Empty;
    }
}