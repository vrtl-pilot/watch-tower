using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WatchTower.API.Services;

namespace WatchTower.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FundsController : ControllerBase
    {
        private readonly IDataAccessHelper _dataAccessHelper;

        public FundsController(IDataAccessHelper dataAccessHelper)
        {
            _dataAccessHelper = dataAccessHelper;
        }

        [HttpGet]
        public async Task<IActionResult> GetFundNames()
        {
            // Fetching fund names directly from the database.
            // This assumes a 'Funds' table with a 'FundName' column.
            var sql = "SELECT FundName FROM Funds ORDER BY FundName;";

            try
            {
                var funds = await _dataAccessHelper.QueryAsync<string>(sql, new { });
                return Ok(funds);
            }
            catch (System.Exception)
            {
                // In a real application, you would log this exception.
                return StatusCode(500, "An error occurred while fetching fund names.");
            }
        }
    }
}