using WatchTower.API.Hubs;
using WatchTower.API.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Configure JSON serialization to use string converters for enums (for REST API)
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "WatchTower API", Version = "v1" });
});

// Add SignalR and configure its JSON serialization to use string converters for enums
builder.Services.AddSignalR()
    .AddJsonProtocol(options =>
    {
        options.PayloadSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// Register application services
builder.Services.AddSingleton<IDbConnectionFactory, DbConnectionFactory>();
builder.Services.AddScoped<IDataAccessHelper, DataAccessHelper>();
builder.Services.AddScoped<IFundService, FundService>();
builder.Services.AddScoped<IFundEligibilityService, FundEligibilityService>();
builder.Services.AddScoped<IRedisService, RedisService>();

// Configure CORS for development/proxy setup
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder => builder
            .WithOrigins("http://localhost:8080", "https://localhost:7179") // Allow frontend URL and self
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "WatchTower API V1");
    });
}

app.UseHttpsRedirection();

app.UseCors("CorsPolicy"); // Use CORS policy

app.UseAuthorization();

app.MapControllers();

// Map SignalR Hub
app.MapHub<WatchTowerHub>("/watchtowerhub");

app.Run();