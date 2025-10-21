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

        public async Task<IEnumerable<string>> GetFundNamesAsync()
        {
            // Query execution is now encapsulated in the service layer.
            var sql = "SELECT FundName FROM Funds ORDER BY FundName;";

            try
            {
                var funds = await _dataAccessHelper.QueryAsync<string>(sql, new { });
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