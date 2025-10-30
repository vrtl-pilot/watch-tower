using WatchTower.API.Hubs;
using WatchTower.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();

// Add CORS policy to allow communication with the Vite frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowViteDev",
        builder => builder
            .WithOrigins("http://localhost:8080") // Vite dev server URL
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

// Register custom application services
builder.Services.AddSingleton<IDbConnectionFactory, DbConnectionFactory>();
builder.Services.AddScoped<IDataAccessHelper, DataAccessHelper>();
builder.Services.AddScoped<IFundService, FundService>();
builder.Services.AddScoped<IFundEligibilityService, FundEligibilityService>();
builder.Services.AddSingleton<IRedisService, RedisService>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable CORS
app.UseCors("AllowViteDev");

app.UseAuthorization();

app.MapControllers();
app.MapHub<WatchTowerHub>("/watchtowerhub");

app.Run();