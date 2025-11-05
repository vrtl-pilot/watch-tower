using WatchTower.API.Hubs;
using WatchTower.API.Services;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add SignalR
builder.Services.AddSignalR();

// Add custom services
builder.Services.AddSingleton<IDbConnectionFactory, DbConnectionFactory>();
builder.Services.AddScoped<IDataAccessHelper, DataAccessHelper>();
builder.Services.AddScoped<IFundService, FundService>();
builder.Services.AddScoped<IFundEligibilityService, FundEligibilityService>();
builder.Services.AddScoped<IQueryService, QueryService>();

// Redis setup
builder.Services.AddSingleton<IRedisConnectionProvider, RedisConnectionProvider>();
builder.Services.AddScoped<IRedisService, RedisService>();

// RabbitMQ setup (EasyNetQ)
builder.Services.AddSingleton<IRabbitMqConnectionProvider, RabbitMqConnectionProvider>();


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