#!/usr/bin/env python3
"""Smoke test for TravelAgency backend + frontend."""
import json
import subprocess
import sys
import urllib.error
import urllib.request

API = "http://localhost:3002/api"
WEB = "http://localhost:3000"

passed = 0
failed = 0
warnings = 0


def curl(url, method="GET", data=None, headers=None):
    req = urllib.request.Request(url, method=method, headers=headers or {})
    if data is not None:
        req.data = json.dumps(data).encode()
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            body = resp.read().decode()
            return resp.status, body
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode() if e.fp else ""


def ok(name, cond, detail=""):
    global passed, failed
    if cond:
        print(f"✅ {name}")
        passed += 1
    else:
        print(f"❌ {name}" + (f" — {detail}" if detail else ""))
        failed += 1


def warn(name, detail=""):
    global warnings
    print(f"⚠️  {name}" + (f" — {detail}" if detail else ""))
    warnings += 1


print("=== BACKEND API ===")
code, body = curl(f"{API}/tours?limit=5")
data = json.loads(body) if code == 200 else {}
ok("GET /tours", code == 200 and "tours" in data.get("data", {}))

code, body = curl(f"{API}/tours/santorini-getaway")
data = json.loads(body) if code == 200 else {}
ok("GET /tours/:slug (santorini)", code == 200 and data.get("data", {}).get("tour"))

code, body = curl(f"{API}/tours/switzerland-getaway")
data = json.loads(body) if code == 200 else {}
tour = data.get("data", {}).get("tour", {})
ok("GET /tours/:slug (switzerland)", code == 200 and tour)
if tour:
    imgs = tour.get("images", [])
    cover = next((i for i in imgs if i.get("is_cover")), None)
    ok("Switzerland has cover image in DB", cover is not None, cover["url"] if cover else "none")

code, _ = curl(f"{API}/tours/nonexistent-slug-xyz")
ok("GET /tours/:slug 404", code == 404)

code, body = curl(f"{API}/reviews/tour/1")
data = json.loads(body) if code == 200 else {}
ok("GET /reviews/tour/:id", code == 200)

code, _ = curl(f"{API}/auth/me")
ok("GET /auth/me requires auth (401)", code == 401)

code, _ = curl(f"{API}/tours/admin/all")
ok("GET /tours/admin requires auth (401)", code == 401)

code, _ = curl(f"{API}/bookings")
ok("GET /bookings requires auth (401)", code == 401)

code, _ = curl(f"{API}/auth/sign-in", method="POST", data={"email": "bad@test.com", "password": "wrongpass123"})
ok("POST /auth/sign-in rejects bad creds", code in (400, 401))

code, body = curl(f"{API}/tours?limit=100")
if code == 200:
    tours = json.loads(body)["data"]["tours"]
    print(f"ℹ️  Active tours: {len(tours)}")
    no_cover = [t["slug"] for t in tours if not t.get("cover_image")]
    if no_cover:
        warn(f"Tours missing cover_image: {', '.join(no_cover)}")
    else:
        ok("All tours have cover_image", True)

print("\n=== FRONTEND PAGES ===")
pages = [
    "/", "/tours", "/about", "/contact", "/login", "/register",
    "/tours/santorini-getaway", "/tours/switzerland-getaway",
    "/robots.txt", "/sitemap.xml", "/manifest.webmanifest",
    "/admin", "/profile", "/my-bookings",
]
for path in pages:
    code, _ = curl(f"{WEB}{path}")
    ok(f"GET {path}", code == 200, f"HTTP {code}")

print("\n=== SEO META ===")
code, html = curl(f"{WEB}/tours/santorini-getaway")
ok("Tour page og:title", "og:title" in html)
ok("Tour page og:image", "og:image" in html)
ok("Tour page og:description", "og:description" in html)
ok("Tour page twitter:card", "twitter:card" in html or "summary_large_image" in html)

print("\n=== PROXY & STATIC ===")
code, _ = curl(f"{WEB}/api/tours?limit=1")
ok("Next.js /api proxy", code == 200, f"HTTP {code}")

for icon in ["/icons/icon-192.png", "/icons/icon-512.png", "/icons/apple-icon.png"]:
    code, _ = curl(f"{WEB}{icon}")
    ok(f"GET {icon}", code == 200, f"HTTP {code}")

print("\n=== BUILD & TYPESCRIPT ===")
try:
    r = subprocess.run(
        ["npm", "run", "build"],
        cwd="/Users/lasha/Desktop/TravelAgency/client",
        capture_output=True,
        text=True,
        timeout=120,
    )
    ok("Client production build", r.returncode == 0, r.stderr[-200:] if r.returncode else "")
except Exception as e:
    ok("Client production build", False, str(e))

try:
    r = subprocess.run(
        ["npx", "tsc", "--noEmit"],
        cwd="/Users/lasha/Desktop/TravelAgency/client",
        capture_output=True,
        text=True,
        timeout=60,
    )
    ok("TypeScript check", r.returncode == 0, r.stdout[-200:] if r.returncode else "")
except Exception as e:
    ok("TypeScript check", False, str(e))

print(f"\n{'='*40}")
print(f"PASSED: {passed} | FAILED: {failed} | WARNINGS: {warnings}")
sys.exit(0 if failed == 0 else 1)
