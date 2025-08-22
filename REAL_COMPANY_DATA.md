# Real Company Data Integration

Your project now supports importing verified company data from external sources like Companies House (UK) and OpenCorporates (Global).

## Features

### 🔍 **Company Search & Import**
- Search for real companies by name across multiple jurisdictions
- Import verified company information automatically
- Support for both Companies House (UK) and OpenCorporates (Global) databases
- All imported companies go through the same approval process

### ✅ **Verification Badges**
- **Verified Badge**: Shows when company data comes from official sources
- **External Source Badge**: Indicates which API the data came from (Companies House, OpenCorporates)
- **Status Badge**: Shows approval status (Pending, Approved, Rejected)

### 🌍 **Supported Jurisdictions**
- United Kingdom (GB) - via Companies House API
- United States (US) - via OpenCorporates API
- Canada, Australia, Germany, France, and 15+ other countries
- Global coverage via OpenCorporates database

## How to Use

### For Business Owners:
1. Go to "Add New Company" page
2. Click "Import Real Company" button
3. Search for your company by name
4. Select the correct company from results
5. Add any additional information (website, phone, description)
6. Import the company (it will be pending approval)

### For Administrators:
- Imported companies appear in the moderation queue with "External Data" badges
- Review and approve/reject as normal
- Verified companies show additional trust indicators to users

## API Configuration (Optional)

To enable external data APIs, add these to your Laravel `.env` file:

```env
# OpenCorporates API (Free tier available)
OPENCORPORATES_API_KEY=your_api_key_here

# Companies House API (Free)
COMPANIES_HOUSE_API_KEY=your_api_key_here
```

### Getting API Keys:

**OpenCorporates (Global)**
- Sign up at: https://opencorporates.com/api/
- Free tier: 500 requests/month
- Paid tiers available for higher usage

**Companies House (UK)**
- Register at: https://developer.company-information.service.gov.uk/
- Completely free with rate limits
- Best for UK companies

## Benefits

### For Users:
- ✅ Trust indicators for verified companies
- ✅ Rich company information (incorporation date, jurisdiction, etc.)
- ✅ External verification links
- ✅ Reduced fake/spam companies

### For Platform:
- ✅ Higher quality company data
- ✅ Reduced manual data entry errors
- ✅ Built-in fraud prevention
- ✅ Professional appearance

## Technical Details

### Database Changes:
- Added external company reference fields
- Company verification status tracking
- JSON storage for raw external API data
- Indexed fields for efficient lookups

### API Endpoints:
- `GET /api/external-companies/search` - Search companies
- `GET /api/external-companies/jurisdictions` - Get supported countries
- `GET /api/external-companies/{id}` - Get company details
- `POST /api/external-companies/import` - Import company

### Error Handling:
- Graceful fallback when APIs are unavailable
- Rate limiting protection
- Detailed error messages for debugging

## Notes

- External APIs work without API keys but with limited features
- Free tiers have rate limits - monitor usage in production
- All imported companies still require admin approval
- Data is cached to reduce API calls
- Works alongside manual company creation

This feature significantly enhances the credibility and data quality of your business directory platform! 🚀
