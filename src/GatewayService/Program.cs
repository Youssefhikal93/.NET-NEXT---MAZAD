using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing.Internal;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddReverseProxy()
.LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(jwtOptions =>
{
	jwtOptions.Authority = builder.Configuration["IdentityServiceUrl"];
    jwtOptions.RequireHttpsMetadata = false;
    jwtOptions.TokenValidationParameters.ValidateAudience = false;
    jwtOptions.TokenValidationParameters.NameClaimType = "username";
});
var app = builder.Build();


app.UseAuthentication();
app.UseAuthorization();
app.MapReverseProxy();
app.Run();
