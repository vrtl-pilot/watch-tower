using WatchTower.Shared.Models;
using System.Threading.Tasks;

namespace WatchTower.API.Services
{
    public interface IFundEligibilityService
    {
        Task<FundEligibilityResult> CheckEligibilityAsync(FundEligibilityRequest request);
    }
}