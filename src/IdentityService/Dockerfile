FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy each project to get advange from the caching
COPY Mazad.sln ./
COPY src/IdentityService/IdentityService.csproj ./src/IdentityService/
COPY src/BiddingService/BiddingService.csproj ./src/BiddingService/

# Restore as distinct layers
RUN dotnet restore ./src/IdentityService/IdentityService.csproj

# Step 3: Copy the rest of the source code
COPY . .

# Build and publish a release
RUN dotnet publish ./src/IdentityService/IdentityService.csproj -c Release -o publish

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "IdentityService.dll"]