# Cloudflare Security Configuration Guide

## 1. WAF (Web Application Firewall) Rules

### A. IP Allowlist Rule (Optional - High Security)
```
Rule Name: API Access Control
Field: IP Source Address
Operator: is in
Value: [Your Office/Server IPs]
Action: Allow
```

### B. Rate Limiting Rule  
```
Rule Name: API Rate Limit
Field: URI Path
Operator: starts with
Value: /api/
Rate: 100 requests per minute
Period: 1 minute
Action: Block for 1 hour
Mitigation timeout: 3600 seconds
```

### C. Geographic Restrictions (Optional)
```
Rule Name: Geographic Block
Field: Country
Operator: is in  
Value: [Countries to block - e.g., high-risk regions]
Action: Block
```

## 2. Security Level Settings

### Navigate to: Security > Settings

```
Security Level: High
Browser Integrity Check: ON
Challenge Passage: 30 minutes
Privacy Pass Support: ON
Hotlink Protection: ON
```

## 3. Bot Management Configuration

### Navigate to: Security > Bots

```
Fight Malicious Bots: ON
Static Resource Protection: ON
Bot Score Threshold: 30
Challenge Bad Bots: ON
```

### Bot Fight Mode Rules:
```
Rule 1: Known Bot Protection
- Challenge requests with bot scores < 30
- Apply to all paths except /api/webhooks/*

Rule 2: Definitely Automated Traffic  
- Block requests with bot scores < 1
- Apply to sensitive paths: /api/admin/*, /api/payments/*
```

## 4. DDoS Protection

### Navigate to: Security > DDoS

```
HTTP DDoS Attack Protection: ON
L3/L4 DDoS Protection: ON (automatic)
Advanced TCP Protection: ON
Sensitivity Level: High
```

### Custom DDoS Rules:
```
Rule Name: API Endpoint Protection
Expression: http.request.uri.path matches "^/api/"
Action: DDoS Mitigation
Sensitivity: High
```

## 5. Page Rules for Enhanced Security

### Navigate to: Rules > Page Rules

```
Rule 1: API Security Headers
URL: yourdomain.com/api/*
Settings:
- Security Level: High  
- Browser Cache TTL: Respect Existing Headers
- Edge Cache TTL: Bypass Cache
- Always Use HTTPS: ON

Rule 2: Admin Protection
URL: yourdomain.com/admin/*
Settings:
- Security Level: I'm Under Attack
- Browser Integrity Check: ON
- Challenge Passage: 5 minutes
```

## 6. Transform Rules (Security Headers)

### Navigate to: Rules > Transform Rules > Modify Response Header

```
Rule Name: Security Headers
Expression: http.request.uri.path matches "^/(api|admin)/"

Headers to Add:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY  
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security: max-age=31536000; includeSubDomains
- Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
- Referrer-Policy: strict-origin-when-cross-origin
```

## 7. Access Policies (Cloudflare Access - Paid Feature)

### If using Cloudflare Access:

```
Application Name: Ghost Automation Admin
Domain: admin.yourdomain.com
Policy:
- Rule: Admin Access
- Action: Allow  
- Include: Email ends with @yourdomain.com
- Require: One-time PIN

Application Name: API Access  
Domain: api.yourdomain.com
Policy:
- Rule: Service Access
- Action: Service Auth
- Include: Service Token
```

## 8. SSL/TLS Configuration

### Navigate to: SSL/TLS > Overview

```
SSL/TLS Encryption Mode: Full (Strict)
Always Use HTTPS: ON
HTTP Strict Transport Security (HSTS): ON
- Max Age Header: 12 months
- Include Subdomains: ON
- Preload: ON
```

### Edge Certificates:
```
Universal SSL: ON
Always Use HTTPS: ON
Minimum TLS Version: 1.2
TLS 1.3: ON
Automatic HTTPS Rewrites: ON
```

## 9. Firewall Rules

### Navigate to: Security > WAF > Custom Rules

```
Rule 1: Block Malicious Patterns
Expression: 
(http.request.uri contains "wp-admin") or
(http.request.uri contains ".php") or  
(http.request.uri contains "sql") or
(http.request.uri contains "script")
Action: Block

Rule 2: API Authentication
Expression: 
(http.request.uri.path matches "^/api/") and
(not http.request.headers["authorization"] exists) and
(not http.request.uri.path matches "^/api/public/")
Action: Challenge (Managed Challenge)

Rule 3: Rate Limit API Keys
Expression:
http.request.uri.path eq "/api/content/generate"
Action: Rate Limit
- Rate: 10 requests per minute per IP
- Mitigation: Block for 1 hour
```

## 10. Caching Rules for Security

### Navigate to: Caching > Cache Rules

```
Rule Name: Secure API Caching
Expression: http.request.uri.path matches "^/api/"
Settings:
- Cache Status: Bypass Cache
- Edge Cache TTL: Respect Origin
- Browser Cache TTL: Respect Origin
```

## 11. Analytics and Monitoring

### Security Events Dashboard:
```
Navigate to: Analytics > Security

Monitor:
- Blocked requests by rule
- Challenge solve rates  
- Bot traffic patterns
- DDoS attack attempts
- Geographic traffic distribution
```

### Custom Analytics:
```
GraphQL Query for API Security:
{
  viewer {
    zones(filter: {zoneTag: "your_zone_id"}) {
      httpRequests1dGroups(filter: {
        date_gt: "2024-01-01"
        clientRequestPath_contains: "/api/"
      }) {
        sum {
          requests
          threats
          pageViews
        }
        dimensions {
          clientRequestHTTPHost
          clientRequestPath
          clientCountryName
          edgeResponseStatus
        }
      }
    }
  }
}
```

## 12. Emergency Response Plan

### If Under Attack:
```
1. Enable "I'm Under Attack" Mode:
   Security > Settings > Security Level > I'm Under Attack

2. Block Traffic by Country:
   Security > WAF > Custom Rules > Geographic Block

3. Enable Additional DDoS Protection:
   Security > DDoS > Sensitivity Level > Maximum

4. Monitor Real-time Traffic:
   Analytics > Traffic > Real-time visitors
```

### Recovery Checklist:
- [ ] Security level returned to High
- [ ] Geographic blocks removed (if temporary)
- [ ] Rate limits adjusted if needed
- [ ] Attack patterns documented
- [ ] Security rules updated based on attack vectors

## 13. Regular Maintenance

### Weekly Tasks:
- Review security analytics
- Check for new threat patterns
- Update IP allowlists if needed
- Review rate limit effectiveness

### Monthly Tasks:  
- Audit WAF rules performance
- Update bot management thresholds
- Review geographic traffic patterns
- Test emergency response procedures

## 14. Cost Optimization

### Free Plan Limits:
- 5 Page Rules
- 3 Custom WAF Rules  
- Basic DDoS Protection
- Universal SSL

### Pro Plan ($20/month) Adds:
- 20 Page Rules
- 10 Custom WAF Rules
- Advanced DDoS Protection
- Image Optimization

### Business Plan ($200/month) Adds:
- 50 Page Rules
- 100 Custom WAF Rules
- Advanced Rate Limiting
- Custom SSL certificates