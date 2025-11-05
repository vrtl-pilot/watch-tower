using WatchTower.API.Services;
using WatchTower.Shared.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using WatchTower.API.Models;

namespace WatchTower.API.Services
{
    public class FundEligibilityService : IFundEligibilityService
    {
        private readonly IDataAccessHelper _dataAccessHelper;

        public FundEligibilityService(IDataAccessHelper dataAccessHelper)
        {
            _dataAccessHelper = dataAccessHelper;
        }
        public async Task<FundEligibilityResponse> CheckEligibilityAsync(FundEligibilityRequest request)
        {
            var parameters = new Dictionary<string, object>();
            var sql = @"SELECT Query";
            parameters.Add("@Name", request.FundName);

            var fundsEligibility = await _dataAccessHelper.QueryAsync<EligibiliyItem>(sql, parameters, request.Environment);

            var response = new FundEligibilityResponse();
            //Status => Eligible,Ineligible,Pending

            response.CompanyResults = fundsEligibility.ToDictionary(f => $"{f.Company}({f.ClientFundname})", v => 
            {
                return new FundCriteriaResult
                {
                    FundName = request.FundName,
                    Status = (v.ClientFundEligible || v.FundEligible) && v.MappingEligible ? "Eligible" : "Ineligible",
                    Criteria = new List<Criterion>
                    {
                        new Criterion { Name = "Fund Eligibility", Met = v.FundEligible },
                        new Criterion { Name = "Client Fund Eligibility", Met = v.ClientFundEligible },
                        new Criterion { Name = "Company Eligible", Met = v.MappingEligible },
                        new Criterion { Name = "Migration Eligible", Met = v.IsMigrationEligible },
                        new Criterion { Name = "MTD Support", Met = v.IsMTDSupport }
                    }
                };
            });
            
            return response;
        }
    }
}