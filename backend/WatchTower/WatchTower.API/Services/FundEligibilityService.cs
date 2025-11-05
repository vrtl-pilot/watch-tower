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
            parameters.Add("@FundName", request.FundName);
            parameters.Add("@Environment", request.Environment);

            // Execute query to get a flat list of EligibiliyItem rows
            var rawResults = await _dataAccessHelper.QueryAsync<EligibiliyItem>(sql, parameters, request.Environment);

            var response = new FundEligibilityResponse();

            if (rawResults == null || !rawResults.Any())
            {
                // Return empty response if no data is found
                return response;
            }

            // Group results by CompanyName
            var groupedResults = rawResults.GroupBy(r => r.CompanyName);

            foreach (var group in groupedResults)
            {
                var companyName = group.Key;
                var fundName = group.First().FundName;
                
                // We rely on the Status field provided by the query result for the overall status.
                var overallStatus = group.First().Status; 

                var criteriaResults = group.Select(r => new Criterion
                {
                    Name = r.CriterionName,
                    Met = r.Met,
                    Reason = r.Reason
                }).ToList();

                response.CompanyResults.Add(companyName, new FundCriteriaResult
                {
                    FundName = fundName,
                    Status = overallStatus,
                    Criteria = criteriaResults
                });
            }

            return response;
        }
    }
}