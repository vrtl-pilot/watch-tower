using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace WatchTower.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FundsController : ControllerBase
    {
        private static readonly List<string> FundNames = new List<string>
        {
            "Global Tech Leaders Fund",
            "Sustainable Energy Fund",
            "Healthcare Innovation Fund",
            "Emerging Markets Growth Fund",
            "Real Estate Investment Trust",
            "Blue Chip Equity Fund",
            "Corporate Bond Fund",
            "Index 500 Tracker",
        };

        [HttpGet]
        public ActionResult<IEnumerable<string>> GetFunds()
        {
            // In a real application, this would fetch data from a database.
            return Ok(FundNames);
        }
    }
}