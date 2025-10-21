using System;

namespace WatchTower.API.Models
{
    public class MigrationItem
    {
        public long Id { get; set; }
        public string FundName { get; set; }
        public string DateType { get; set; }
        public DateTime? Date { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Env { get; set; }
    }
}