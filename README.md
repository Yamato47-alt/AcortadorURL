# URL Shortener API

A REST API built with ASP.NET Core and SQL Server that shortens URLs, tracks visits, and generates QR codes.

## Tech Stack

- **Backend:** ASP.NET Core Web API (.NET 10)
- **Database:** SQL Server
- **ORM:** Entity Framework Core (Code First)
- **Frontend:** React
- **QR Generation:** QRCoder

## Features

- Shorten any valid http/https URL
- Redirect to original URL and track each visit (IP, User Agent)
- View click stats and last 5 visits per short URL
- Generate a QR code for any short URL

## Project Structure

```
AcortadorURL/
├── Controllers/
│   ├── UrlController.cs           # POST /api/urls, GET stats, GET qr
│   └── RedirectToUrlController.cs # GET /{shortCode} — redirect
├── Data/
│   └── AppDbContext.cs            # EF DbContext
├── DTOs/
│   ├── CreateShortUrlDto.cs       # Request body for POST
│   ├── CreateShortUrlResponseDto.cs
│   ├── StatsResponseDto.cs
│   └── VisitDto.cs
├── Models/
│   ├── ShortUrl.cs
│   └── Visit.cs
├── Services/
│   └── QrCodeService.cs
└── Migrations/
```

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- SQL Server Express
- EF Tools:

```bash
dotnet tool install --global dotnet-ef
```

### Setup

1. Clone the repository:
```bash
git clone https://github.com/Yamato47-alt/AcortadorURL.git
cd AcortadorURL/AcortadorURL
```

2. Configure your connection string in `appsettings.json`:
```json
"ConnectionStrings": {
  "Default": "Server=localhost\\SQLEXPRESS;Database=AcortadorURL;Trusted_Connection=True;TrustServerCertificate=True"
}
```

3. Apply migrations:
```bash
dotnet ef database update
```

4. Run the API:
```bash
dotnet run
```

API available at `http://localhost:5062` — Swagger at `http://localhost:5062/swagger`

## API Endpoints

### POST /api/urls
Shorten a URL.

**Request:**
```json
{ "originalUrl": "https://www.google.com" }
```

**Response 200:**
```json
{
  "shortCode": "ceb7035",
  "originalUrl": "https://www.google.com"
}
```

**Validations:**
- Must be a valid URL format
- Must use http or https scheme

---

### GET /{shortCode}
Redirects to the original URL (HTTP 302) and logs the visit.

---

### GET /api/urls/{shortCode}/stats
Returns click stats for a short URL.

**Response 200:**
```json
{
  "shortCode": "ceb7035",
  "originalUrl": "https://www.google.com",
  "createdAt": "2026-05-30T22:00:00Z",
  "totalClicks": 5,
  "lastVisits": [
    {
      "visitedAt": "2026-05-30T22:07:45Z",
      "ipAddress": "::1",
      "userAgent": "Mozilla/5.0..."
    }
  ]
}
```

---

### GET /api/urls/{shortCode}/qr
Returns a QR code image (PNG) pointing to the short URL.
