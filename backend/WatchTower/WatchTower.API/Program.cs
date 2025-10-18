using WatchTower.API.Hubs;
using WatchTower.API.Services;
using Microsoft.AspNetCore.SignalR;
using System.Text.Json.Serialization; // Required for JsonStringEnumConverter

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Configure MVC/API controllers to serialize enums as strings
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add SignalR and configure its JSON serialization
builder.Services.AddSignalR()
    .AddJsonProtocol(options =>
    {
        // Configure SignalR to serialize enums as strings
        options.PayloadSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// Add custom services
builder.Services.AddSingleton<IDbConnectionFactory, DbConnectionFactory>();
builder.Services.AddScoped<IDataAccessHelper, DataAccessHelper>();
builder.Services.AddScoped<IFundEligibilityService, FundEligibilityService>();
builder.Services.AddScoped<IRedisService, RedisService>();

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

// Map SignalR Hub
app.MapHub<WatchTowerHub>("/watchtowerhub");

app.Run();