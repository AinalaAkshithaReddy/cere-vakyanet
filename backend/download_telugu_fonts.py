#!/usr/bin/env python3
"""
Manual script to download Noto Sans Telugu fonts
Run this script to download the fonts if automatic download fails
"""
import requests
from pathlib import Path

FONT_DIR = Path(__file__).parent / "fonts"
FONT_DIR.mkdir(exist_ok=True)

# Alternative download URLs - try multiple sources
TELUGU_REGULAR_URLS = [
    # Direct download from Google Fonts (may require parsing)
    "https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@400&display=swap",
    # Try different GitHub paths
    "https://github.com/google/fonts/raw/main/ofl/notosanstelugu/NotoSansTelugu-Regular.ttf",
    "https://raw.githubusercontent.com/google/fonts/main/ofl/notosanstelugu/NotoSansTelugu-Regular.ttf",
]

TELUGU_BOLD_URLS = [
    "https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@700&display=swap",
    "https://github.com/google/fonts/raw/main/ofl/notosanstelugu/NotoSansTelugu-Bold.ttf",
    "https://raw.githubusercontent.com/google/fonts/main/ofl/notosanstelugu/NotoSansTelugu-Bold.ttf",
]

def parse_google_fonts_css(css_url):
    """Parse Google Fonts CSS to extract font URL"""
    try:
        response = requests.get(css_url, timeout=30)
        if response.status_code == 200:
            # Parse CSS to find font URL
            import re
            urls = re.findall(r'url\((https://[^)]+)\)', response.text)
            if urls:
                return urls[0]
    except:
        pass
    return None

def download_font(url, output_path):
    """Download a font file"""
    try:
        print(f"Downloading from {url}...")
        
        # If it's a Google Fonts CSS URL, parse it first
        if 'fonts.googleapis.com' in url:
            font_url = parse_google_fonts_css(url)
            if font_url:
                url = font_url
                print(f"  Found font URL: {url}")
            else:
                print(f"  Could not extract font URL from CSS")
                return False
        
        response = requests.get(url, timeout=60, allow_redirects=True, headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        if response.status_code == 200 and len(response.content) > 10000:
            with open(output_path, 'wb') as f:
                f.write(response.content)
            print(f"✅ Downloaded {output_path.name} ({len(response.content)} bytes)")
            return True
        else:
            print(f"❌ Failed: HTTP {response.status_code} or file too small ({len(response.content) if response.status_code == 200 else 0} bytes)")
    except Exception as e:
        print(f"❌ Error: {e}")
    return False

if __name__ == "__main__":
    print("Downloading Noto Sans Telugu fonts...")
    print(f"Font directory: {FONT_DIR}")
    print()
    
    # Download regular
    regular_path = FONT_DIR / "NotoSansTelugu-Regular.ttf"
    if not regular_path.exists():
        for url in TELUGU_REGULAR_URLS:
            if download_font(url, regular_path):
                break
    else:
        print(f"✅ {regular_path.name} already exists")
    
    print()
    
    # Download bold
    bold_path = FONT_DIR / "NotoSansTelugu-Bold.ttf"
    if not bold_path.exists():
        for url in TELUGU_BOLD_URLS:
            if download_font(url, bold_path):
                break
    else:
        print(f"✅ {bold_path.name} already exists")
    
    print()
    print("Done! Restart the backend server to use the fonts.")

