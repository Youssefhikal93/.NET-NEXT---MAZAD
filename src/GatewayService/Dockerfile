FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# copy all .csproj files and restore as distinct layers.   Use of the same COPY command
# for every dockerfile in the project to take advantage of docker caching
COPY Mazad.sln ./
COPY src/GatewayService/GatewayService.csproj ./src/GatewayService/
COPY src/BiddingService/BiddingService.csproj ./src/BiddingService/


# Restore package deps
RUN dotnet restore ./src/GatewayService/GatewayService.csproj

# Copy the app folders over
COPY . .
RUN dotnet publish ./src/GatewayService/GatewayService.csproj -c Release -o /app/publish


# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
EXPOSE 80
COPY --from=build /app/publish .
ENTRYPOINT [ "dotnet", "GatewayService.dll" ]
