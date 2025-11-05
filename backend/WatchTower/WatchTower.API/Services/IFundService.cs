using System.Collections.Generic;
using System.Threading.Tasks;

namespace WatchTower.API.Services
{
    public interface IFundService
    {
        Task<IEnumerable<string>> GetFundNamesAsync(string environment, string? searchPattern = null);
    }
}