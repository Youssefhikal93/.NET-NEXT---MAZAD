FROM mcr.microsoft.com/dotnet/sdk:8.0@sha256:35792ea4ad1db051981f62b313f1be3b46b1f45cadbaa3c288cd0d3056eefb83 AS build
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
FROM mcr.microsoft.com/dotnet/aspnet:8.0@sha256:6c4df091e4e531bb93bdbfe7e7f0998e7ced344f54426b7e874116a3dc3233ff
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "IdentityService.dll"]