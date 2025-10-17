using Microsoft.Data.SqlClient;
using WatchTower.Shared.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;

namespace WatchTower.API.Services
{
    public class FundEligibilityService : IFundEligibilityService
    {
        private readonly IConfiguration _configuration;

        public FundEligibilityService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<FundEligibilityResult> CheckEligibilityAsync(FundEligibilityRequest request)
        {
            var connectionString = GetConnectionString(request.Environment);
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new ArgumentException("Invalid environment specified or connection string not found.");
            }

            var criteria = new List<Criterion>();

            // IMPORTANT: This is a placeholder query. You should replace it with your actual query.
            // This example assumes you have tables named 'Criteria', 'Funds', and a linking table 'FundCriteria'.
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

            try
            {
                await using var connection = new SqlConnection(connectionString);
                await connection.OpenAsync();

                await using var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@FundName", request.FundName ?? (object)DBNull.Value);

                await using var reader = await command.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    criteria.Add(new Criterion
                    {
                        Name = reader["CriterionName"].ToString(),
                        Met = Convert.ToBoolean(reader["IsMet"]),
                        Reason = reader["Reason"] != DBNull.Value ? reader["Reason"].ToString() : null
                    });
                }
            }
            catch (SqlException ex)
            {
                // In a real application, use a proper logging framework.
                Console.WriteLine($"SQL Error: {ex.Message}");
                throw new Exception("An error occurred while querying the database.", ex);
            }
            
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

        private string GetConnectionString(string? environment)
        {
            return environment?.ToLower() switch
            {
                "prod" => _configuration.GetConnectionString("ProdDb"),
                "staging" => _configuration.GetConnectionString("StagingDb"),
                "dev" => _configuration.GetConnectionString("DevDb"),
                _ => _configuration.GetConnectionString("DevDb") // Default to Dev
            };
        }
    }
}