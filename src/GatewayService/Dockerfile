FROM mcr.microsoft.com/dotnet/sdk:9.0@sha256:3fcf6f1e809c0553f9feb222369f58749af314af6f063f389cbd2f913b4ad556 AS build
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
FROM mcr.microsoft.com/dotnet/aspnet:9.0@sha256:b4bea3a52a0a77317fa93c5bbdb076623f81e3e2f201078d89914da71318b5d8
WORKDIR /app
EXPOSE 80
COPY --from=build /app/publish .
ENTRYPOINT [ "dotnet", "GatewayService.dll" ]
