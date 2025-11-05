using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Linq;

namespace WatchTower.API.Services
{
    public class QueryService : IQueryService
    {
        private readonly IConfiguration _configuration;
        private readonly Dictionary<string, Dictionary<string, string>> _queries = new Dictionary<string, Dictionary<string, string>>();

        public QueryService(IConfiguration configuration)
        {
            _configuration = configuration;
            LoadQueries();
        }

        private void LoadQueries()
        {
            // Load all top-level sections ending with 'Queries' (e.g., FundQueries)
            var querySections = _configuration.GetChildren().Where(c => c.Key.EndsWith("Queries"));

            foreach (var section in querySections)
            {
                var sectionName = section.Key;
                var queriesInSection = new Dictionary<string, string>();
                
                foreach (var query in section.GetChildren())
                {
                    queriesInSection.Add(query.Key, query.Value);
                }
                _queries.Add(sectionName, queriesInSection);
            }
        }

        public string GetQuery(string section, string name)
        {
            if (_queries.TryGetValue(section, out var queries) && queries.TryGetValue(name, out var query))
            {
                return query;
            }
            throw new KeyNotFoundException($"SQL query not found: Section '{section}', Name '{name}'.");
        }
    }
}