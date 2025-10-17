using Microsoft.Data.SqlClient;
using WatchTower.Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WatchTower.API.Services
{
    public class FundEligibilityService : IFundEligibilityService
    {
        private readonly IDataAccessHelper _dataAccessHelper;

        public FundEligibilityService(IDataAccessHelper dataAccessHelper)
        {
            _dataAccessHelper = dataAccessHelper;
        }

        public async Task<FundEligibilityResult> CheckEligibilityAsync(FundEligibilityRequest request)
        {
            // IMPORTANT: This is a placeholder query. You should replace it with your actual query.
            const string query = @"
                SELECT 
                    c.Name AS CriterionName,
                    ISNULL(fc.Met, c.DefaultMetValue) AS IsMet,
                    fc.Reason
                FROM Criteria c
                LEFT JOIN Funds f ON f.Name = @FundName
                LEFT JOIN FundCriteria fc ON c.Id = fc.CriterionId AND f.Id = fc.FundId
                WHERE f.Name = @FundName;
            ";

            var parameters = new[]
            {
                new SqlParameter("@FundName", request.FundName ?? (object)DBNull.Value)
            };

            var criteria = await _dataAccessHelper.QueryAsync(request.Environment, query, reader => new Criterion
            {
                Name = reader["CriterionName"].ToString(),
                Met = Convert.ToBoolean(reader["IsMet"]),
                Reason = reader["Reason"] != DBNull.Value ? reader["Reason"].ToString() : null
            }, parameters);

            if (criteria.Count == 0)
            {
                return new FundEligibilityResult
                {
                    FundName = request.FundName,
                    Status = "Pending",
                    Criteria = new List<Criterion> { new() { Name = "Fund Found", Met = false, Reason = "The specified fund could not be found in the database." } }
                };
            }

            var isEligible = criteria.All(c => c.Met);

            return new FundEligibilityResult
            {
                FundName = request.FundName,
                Status = isEligible ? "Eligible" : "Ineligible",
                Criteria = criteria
            };
        }
    }
}