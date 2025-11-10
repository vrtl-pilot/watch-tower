using WatchTower.API.Services;
using WatchTower.Shared.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Dapper;

namespace WatchTower.API.Services
{
    public class FundEligibilityService : IFundEligibilityService
    {
        private readonly IQueryService _queryService;
        private readonly IDataAccessHelper _dataAccessHelper;

        public FundEligibilityService(IQueryService queryService, IDataAccessHelper dataAccessHelper)
        {
            _queryService = queryService;
            _dataAccessHelper = dataAccessHelper;
        }

        public async Task<FundEligibilityResponse> CheckEligibilityAsync(FundEligibilityRequest request)
        {
            var sql = _queryService.GetQuery("EligibilityQueries", "CheckEligibility");
            
            var parameters = new DynamicParameters();
            parameters.Add("@Name", request.FundName);

            // Execute query to get a flat list of EligibiliyItem rows
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
                    },
                    Frequency = "Daily", // Default value as specified
                    ClientFundName = v.ClientFundname,
                    Company = v.Company
                };
            });

            return response;
        }
    }
}