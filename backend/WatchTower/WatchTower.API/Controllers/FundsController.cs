using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WatchTower.API.Services;

namespace WatchTower.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FundsController : ControllerBase
    {
        private readonly IFundService _fundService;

        public FundsController(IFundService fundService)
        {
            _fundService = fundService;
        }

        [HttpGet]
        public async Task<IActionResult> GetFundNames()
        {
            try
            {
                var funds = await _fundService.GetFundNamesAsync();
                return Ok(funds);
            }
            catch (System.Exception)
            {
                // The service layer handles logging, we return a generic error here.
                return StatusCode(500, "An error occurred while fetching fund names.");
            }
        }
    }
}