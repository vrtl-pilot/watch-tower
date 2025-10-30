using System.Threading.Tasks;
using WatchTower.Shared.Models;

namespace WatchTower.API.Services
{
    public interface IFundEligibilityService
    {
        Task<FundEligibilityResult> CheckEligibilityAsync(FundEligibilityRequest request);
    }
}