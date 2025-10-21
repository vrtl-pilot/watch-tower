using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
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
            // This simulates fetching a list of funds from the database.
            await Task.Delay(300); 

            var sampleFunds = new List<string>
            {
                "Global Tech Leaders Fund",
                "Sustainable Energy Fund",
                "Emerging Markets Growth",
                "US Blue Chip Equity Fund",
                "European Dividend Aristocrats",
                "Healthcare Innovation Fund",
                "Real Estate Investment Trust (REIT)",
                "Asia Pacific Tigers Fund",
                "Corporate Bond Index Fund",
                "Small Cap Value Fund"
            };

            return Ok(sampleFunds);
        }
    }
}