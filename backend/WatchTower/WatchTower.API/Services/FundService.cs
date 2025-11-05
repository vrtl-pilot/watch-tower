using WatchTower.API.Services;
using Dapper;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WatchTower.API.Services
{
    public class FundService : IFundService
    {
        private readonly IDataAccessHelper _dataAccessHelper;
        private readonly IQueryService _queryService;

        public FundService(IDataAccessHelper dataAccessHelper, IQueryService queryService)
        {
            _dataAccessHelper = dataAccessHelper;
            _queryService = queryService;
        }

        public async Task<IEnumerable<string>> GetFundNamesAsync(string environment, string? searchPattern = null)
        {
            // Retrieve query from QueryService
            var sql = _queryService.GetQuery("FundQueries", "SearchFunds");
            
            var parameters = new DynamicParameters();
            parameters.Add("@SearchPattern", $"%{searchPattern}%");

            // Execute query using the appropriate connection string based on environment
            var funds = await _dataAccessHelper.QueryAsync<string>(sql, parameters, environment);
            return funds;
        }
    }
}