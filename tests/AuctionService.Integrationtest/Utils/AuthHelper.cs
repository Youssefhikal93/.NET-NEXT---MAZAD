using System;
using System.Security.Claims;

namespace AuctionService.Integrationtest.Utils;

public static class AuthHelper
{
    public static Dictionary<String, Object> GetBearerForUser(string userName)
    {
        return new Dictionary<string, object> { { ClaimTypes.Name, userName } };
}
}
