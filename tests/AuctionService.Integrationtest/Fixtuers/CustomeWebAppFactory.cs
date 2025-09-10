using System;
using AuctionService.Data;
using AuctionService.Integrationtest.Utils;
using MassTransit;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Testcontainers.PostgreSql;
using WebMotions.Fake.Authentication.JwtBearer;

namespace AuctionService.Integrationtest.Fixtuers;

public class CustomeWebAppFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private PostgreSqlContainer _postgreSqlContainer = new PostgreSqlBuilder().Build();
    public async Task InitializeAsync()
    {
        await _postgreSqlContainer.StartAsync();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureTestServices(services =>
        {
            //remove dbontext
            var descriptor = services.SingleOrDefault(d =>
             d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));
            if (descriptor != null) services.Remove(descriptor);

            services.AddDbContext<ApplicationDbContext>(o =>
            o.UseNpgsql(_postgreSqlContainer.GetConnectionString()));

            services.AddMassTransitTestHarness();

            //create new dbCOntext and migrating and seeding
            var sp = services.BuildServiceProvider();
            using var scope = sp.CreateScope();
            var scopedServices = scope.ServiceProvider;
            var db = scopedServices.GetRequiredService<ApplicationDbContext>();
            db.Database.Migrate();
            DbHelper.InitDbForTests(db);

            //fake auth 
            services.AddAuthentication(FakeJwtBearerDefaults.AuthenticationScheme)
            .AddFakeJwtBearer(opt =>
            {
                opt.BearerValueType = FakeJwtBearerBearerValueType.Jwt;
            });
        });
        

    }
    async Task IAsyncLifetime.DisposeAsync()
    {
        await _postgreSqlContainer.DisposeAsync();
    }
}
