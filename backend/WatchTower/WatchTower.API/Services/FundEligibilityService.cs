using WatchTower.API.Services;
using WatchTower.Shared.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WatchTower.API.Services
{
    public class FundEligibilityService : IFundEligibilityService
    {
        public async Task<FundEligibilityResponse> CheckEligibilityAsync(FundEligibilityRequest request)
        {
            await Task.Delay(500); // Simulate API latency

            var response = new FundEligibilityResponse();

            // Mock data generation based on the request fund name
            if (request.FundName.Contains("Global"))
            {
                response.CompanyResults.Add("Company A", new FundCriteriaResult
                {
                    FundName = request.FundName,
                    Status = "Eligible",
                    Criteria = new List<Criterion>
                    {
                        new Criterion { Name = "Minimum Investment Met", Met = true },
                        new Criterion { Name = "Jurisdiction Approved", Met = true },
                        new Criterion { Name = "KYC Completed", Met = true }
                    }
                });

                response.CompanyResults.Add("Company B", new FundCriteriaResult
                {
                    FundName = request.FundName,
                    Status = "Ineligible",
                    Criteria = new List<Criterion>
                    {
                        new Criterion { Name = "Minimum Investment Met", Met = true },
                        new Criterion { Name = "Jurisdiction Approved", Met = false, Reason = "Restricted region." },
                        new Criterion { Name = "KYC Completed", Met = true }
                    }
                });
            }
            else if (request.FundName.Contains("Sustainable"))
            {
                response.CompanyResults.Add("Company C", new FundCriteriaResult
                {
                    FundName = request.FundName,
                    Status = "Pending",
                    Criteria = new List<Criterion>
                    {
                        new Criterion { Name = "Minimum Investment Met", Met = true },
                        new Criterion { Name = "Jurisdiction Approved", Met = true },
                        new Criterion { Name = "KYC Completed", Met = false, Reason = "Awaiting document verification." }
                    }
                });
            }
            else
            {
                response.CompanyResults.Add("Default Company", new FundCriteriaResult
                {
                    FundName = request.FundName,
                    Status = "Eligible",
                    Criteria = new List<Criterion>
                    {
                        new Criterion { Name = "All checks passed", Met = true }
                    }
                });
            }

            return response;
        }
    }
}