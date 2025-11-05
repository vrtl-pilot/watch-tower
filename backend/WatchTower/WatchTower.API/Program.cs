using WatchTower.API.Hubs;
using WatchTower.API.Services;
using WatchTower.Shared.Models;

var builder = WebApplication.CreateBuilder(args);

// Add configuration for queries.json
builder.Configuration.AddJsonFile("queries.json", optional: false, reloadOnChange: true);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();

// Register custom services
builder.Services.AddSingleton<IDbConnectionFactory, DbConnectionFactory>();
builder.Services.AddScoped<IDataAccessHelper, DataAccessHelper>();
builder.Services.AddSingleton<IRedisConnectionProvider, RedisConnectionProvider>();
builder.Services.AddScoped<IRedisService, RedisService>();
builder.Services.AddScoped<IFundService, FundService>();
builder.Services.AddScoped<IFundEligibilityService, FundEligibilityService>();
builder.Services.AddSingleton<IQueryService, QueryService>(); // Register QueryService

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.MapHub<WatchTowerHub>("/watchtowerhub");

app.Run();