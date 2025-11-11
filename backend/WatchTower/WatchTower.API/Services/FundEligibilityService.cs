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
            var eligible = _queryService.GetQuery("EligibilityQueries", "CheckEligibility");
            var fofDates = _queryService.GetQuery("EligibilityQueries", "FoFDates");
            var fofFunds = _queryService.GetQuery("EligibilityQueries", "FoFFunds");

            var parameters = new DynamicParameters();
            parameters.Add("@Name", request.FundName);

            // Execute query to get a flat list of EligibiliyItem rows
            var fundsEligibilityTask = _dataAccessHelper.QueryAsync<EligibiliyItem>(eligible, parameters, request.Environment);
            var mappingTask = _dataAccessHelper.QueryAsync<FoFDates>(fofDates, parameters, request.Environment);
            //parameters.Add("@Name", request.FundName);
            var fofTask = _dataAccessHelper.QueryAsync<FoFFunds>(fofFunds, parameters, request.Environment);

            await Task.WhenAll(fundsEligibilityTask, fofTask, mappingTask);

            var fundsEligibility = fundsEligibilityTask.Result;
            var mapping = mappingTask.Result;
            var fof = fofTask.Result;

            var response = new FundEligibilityResponse();
            //Status => Eligible,Ineligible,Pending

            response.CompanyResults = fundsEligibility.GroupJoin(mapping, a => a.Fundname, b => b.FundName, (a, bGroup) => new { a, bGroup })
                .SelectMany(ab => ab.bGroup.DefaultIfEmpty(),
                (ab, b) => new KeyValuePair<string, FundEligibilityResult>($"{ab.a.Company}({ab.a.ClientFundname})", new FundEligibilityResult
                {
                    FundName = request.FundName,
                    Status = (ab.a.ClientFundEligible || ab.a.FundEligible) && ab.a.MappingEligible ? "Eligible" : "Ineligible",
                    Criteria = new List<Criterion>
                    {
                        new Criterion { Name = "Fund Eligibility", Met = ab.a.FundEligible },
                        new Criterion { Name = "Client Fund Eligibility", Met = ab.a.ClientFundEligible },
                        new Criterion { Name = "Company Eligible", Met = ab.a.MappingEligible },
                        new Criterion { Name = "Migration Eligible", Met = ab.a.IsMigrationEligible },
                        new Criterion { Name = "MTD Support", Met = ab.a.IsMTDSupport }
                    },
                    Frequency = ab.a.Frequency,
                    ClientFundName = ab.a.ClientFundname,
                    Company = ab.a.Company,
                    StartDate = ab.a.AttributionStartDate is null ? new[] { ab.a.ClientFundRiskStartDate, b?.StartDate }.Where(s => s.HasValue).Min() : new[] { ab.a.ClientFundRiskStartDate, ab.a.AttributionStartDate }.Where(s => s.HasValue).Min(),
                    EndDate = ab.a.AttributionEndDate is null && ab.a.ClientFundRiskEndDate is null ? null : (ab.a.AttributionEndDate is null ? new[] { ab.a.ClientFundRiskEndDate, b?.LatestDate }.Where(s => s.HasValue).Max() : new[] { ab.a.ClientFundRiskEndDate, ab.a.AttributionEndDate }.Where(s => s.HasValue).Max()),
                    SubFundIds = string.Join(",", fof.Where(s => s.FundName == ab.a.Fundname).Select(s => s.FOFSubFundID))
                })).ToDictionary(s => s.Key, s => s.Value);

            /*  response.CompanyResults = fundsEligibility.ToDictionary(f => $"{f.Company}({f.ClientFundname})", v =>
              {
                  return new FundEligibilityResult
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
                      Frequency = v.Frequency,
                      ClientFundName = v.ClientFundname,
                      Company = v.Company
                  };
              });*/

            return response;
        }
    }
}