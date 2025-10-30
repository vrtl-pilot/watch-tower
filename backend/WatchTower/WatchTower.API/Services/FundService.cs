using System.Collections.Generic;
using System.Threading.Tasks;

namespace WatchTower.API.Services
{
    public class FundService : IFundService
    {
        private readonly IDataAccessHelper _dataAccessHelper;

        public FundService(IDataAccessHelper dataAccessHelper)
        {
            _dataAccessHelper = dataAccessHelper;
        }

        public async Task<IEnumerable<string>> GetFundNamesAsync(string? searchPattern = null)
        {
            // Use LIKE for pattern matching if a search pattern is provided.
            var sql = "SELECT FundName FROM Funds";
            var parameters = new Dictionary<string, object>();

            if (!string.IsNullOrWhiteSpace(searchPattern))
            {
                // Assuming SQL Server syntax for LIKE matching
                sql += " WHERE FundName LIKE @Pattern";
                parameters.Add("@Pattern", $"%{searchPattern}%");
            }
            
            sql += " ORDER BY FundName;";

            try
            {
                var funds = await _dataAccessHelper.QueryAsync<string>(sql, parameters);
                return funds;
            }
            catch (System.Exception ex)
            {
                // Log exception here
                System.Console.WriteLine($"Error fetching fund names: {ex.Message}");
                throw;
            }
        }
    }
}