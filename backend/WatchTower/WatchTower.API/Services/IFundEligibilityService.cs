using WatchTower.Shared.Models;

namespace WatchTower.API.Services
{
    public interface IFundEligibilityService
    {
        Task<FundEligibilityResponse> CheckEligibilityAsync(FundEligibilityRequest request);
    }
}