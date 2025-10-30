using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

namespace WatchTower.API.Services
{
    public interface IDataAccessHelper
    {
        Task<List<T>> QueryAsync<T>(string environment, string query, Func<SqlDataReader, T> map, params SqlParameter[] parameters);
    }
}