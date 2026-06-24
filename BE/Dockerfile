# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY BE.csproj .
RUN dotnet restore BE.csproj

COPY . .
RUN dotnet publish BE.csproj -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Create wwwroot directories for image uploads
RUN mkdir -p /app/wwwroot/images/products

COPY --from=build /app/publish .

EXPOSE 10000

ENV ASPNETCORE_URLS=http://+:10000
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "BE.dll"]
