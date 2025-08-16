using AuctionService.Data;
using AuctionService.RequestHelpers;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.



builder.Services.AddControllers();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{

    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});
//Auto mapping the services
// builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
var app = builder.Build();

// Configure the HTTP request pipeline.



app.UseAuthorization();

app.MapControllers();

try
{
    
DbInitializer.InitDb(app);
}
catch (Exception e)
{
    
 Console.WriteLine($"Error seeding the data {e}");
}


app.Run();
