using WatchTower.API.Hubs;
using WatchTower.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddSignalR();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// This is a new service to read Redis connection strings from appsettings.json
// It can be injected into other services like RedisService.
builder.Services.AddSingleton<IRedisConnectionProvider, RedisConnectionProvider>();

// --- Other service registrations would go here ---
builder.Services.AddSingleton<IRedisService, RedisService>();
builder.Services.AddSingleton<IDbConnectionFactory, DbConnectionFactory>();
builder.Services.AddScoped<IDataAccessHelper, DataAccessHelper>();
builder.Services.AddScoped<IFundService, FundService>();
builder.Services.AddScoped<IFundEligibilityService, FundEligibilityService>();
// -------------------------------------------------

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();

app.MapControllers();
app.MapHub<WatchTowerHub>("/watchtowerhub");

app.Run();