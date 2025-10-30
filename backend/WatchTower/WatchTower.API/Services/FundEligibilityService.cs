using WatchTower.Shared.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
            // Simulate fetching data from multiple tables/sources using IDataAccessHelper
            
            var criteria = new List<Criterion>();
            
            // 1. Check Fund Status (Simulated DB Query 1)
            // We simulate a query that checks if the fund is active in the specified environment.
            bool isActive = await SimulateDbQuery<bool>(
                "SELECT IsActive FROM Funds WHERE Name = @FundName", 
                new { request.FundName }, 
                request.Environment,
                request.FundName.Contains("Active") || request.FundName.Contains("Global")
            );
            
            criteria.Add(new Criterion
            {
                Name = "Fund is Active in Environment",
                Met = isActive,
                Reason = isActive ? null : $"Fund is marked inactive in {request.Environment}."
            });

            // 2. Check Regulatory Compliance (Simulated DB Query 2)
            // We simulate a query that checks compliance flags.
            bool isCompliant = await SimulateDbQuery<bool>(
                "SELECT IsCompliant FROM RegulatoryChecks WHERE FundName = @FundName", 
                new { request.FundName }, 
                request.Environment,
                !request.FundName.Contains("Emerging")
            );

            criteria.Add(new Criterion
            {
                Name = "Regulatory Compliance Check",
                Met = isCompliant,
                Reason = isCompliant ? null : "Failed recent regulatory audit."
            });

            // 3. Check Minimum Investment Threshold (Simulated External Service Call/DB Query 3)
            // We simulate a check that might sometimes be pending.
            bool hasMinThreshold = await SimulateDbQuery<bool>(
                "SELECT HasMinThreshold FROM InvestmentRules WHERE FundName = @FundName", 
                new { request.FundName }, 
                request.Environment,
                !request.FundName.Contains("Small Cap")
            );
            
            // Introduce a pending state simulation
            bool isPending = request.FundName.Contains("Pending");

            criteria.Add(new Criterion
            {
                Name = "Minimum Investment Threshold Met",
                Met = hasMinThreshold,
                Reason = hasMinThreshold ? null : "Minimum investment threshold not met."
            });
            
            // Determine overall status
            string overallStatus;
            if (isPending)
            {
                overallStatus = "Pending";
            }
            else if (criteria.Any(c => !c.Met))
            {
                overallStatus = "Ineligible";
            }
            else
            {
                overallStatus = "Eligible";
            }

            return new FundEligibilityResult
            {
                FundName = request.FundName,
                Status = overallStatus,
                Criteria = criteria
            };
        }
        
        // Helper method to simulate IDataAccessHelper usage and return mock data
        private async Task<T> SimulateDbQuery<T>(string sql, object param, string environment, T mockResult)
        {
            // Simulate network latency
            await Task.Delay(100); 
            
            return mockResult;
        }
    }
}