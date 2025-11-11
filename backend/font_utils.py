"""
Utility functions for font handling in PDF generation
Supports Indian scripts (Devanagari, Tamil, Telugu, etc.)
"""
import os
import logging
import requests
from pathlib import Path
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

logger = logging.getLogger(__name__)

FONT_DIR = Path(__file__).parent / "fonts"
FONT_DIR.mkdir(exist_ok=True)

# Language to script mapping
LANGUAGE_TO_SCRIPT = {
    'telugu': 'telugu',
    'malayalam': 'malayalam',
    'tamil': 'tamil',
    'hindi': 'devanagari',
    'devanagari': 'devanagari',
    'marathi': 'devanagari',
    'nepali': 'devanagari',
    'sanskrit': 'devanagari',
}

# Script Unicode ranges
SCRIPT_RANGES = {
    'telugu': range(0x0C00, 0x0C7F + 1),
    'malayalam': range(0x0D00, 0x0D7F + 1),
    'tamil': range(0x0B80, 0x0BFF + 1),
    'devanagari': range(0x0900, 0x097F + 1),
}

# Noto Sans font URLs (using GitHub raw content for reliability)
NOTO_FONT_BASE_URL = "https://raw.githubusercontent.com/google/fonts/main/ofl/noto"

def download_noto_font():
    """Download Noto Sans font if not already present"""
    font_path = FONT_DIR / "NotoSans-Regular.ttf"
    
    if font_path.exists():
        return font_path
    
    # Try multiple sources for Noto Sans
    urls = [
        # Try Google Fonts API
        "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap",
        # Try direct CDN
        "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosans/NotoSans-Regular.ttf",
    ]
    
    # Actually, let's use a simpler approach - check system fonts first
    # If system fonts don't work, we'll provide instructions
    return None

def register_system_unicode_font():
    """Try to register a system font that supports Unicode"""
    # macOS system fonts (Arial Unicode MS is perfect for Indian scripts)
    font_paths_mac = [
        ('/System/Library/Fonts/Supplemental/Arial Unicode.ttf', 'ArialUnicode'),
        ('/Library/Fonts/Arial Unicode.ttf', 'ArialUnicode'),
    ]
    
    # Linux system fonts  
    font_paths_linux = [
        ('/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf', 'UnicodeFont'),
        ('/usr/share/fonts/truetype/dejavu/DejaVuSans-Regular.ttf', 'UnicodeFont'),
        ('/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf', 'NotoSans'),
    ]
    
    # Windows system fonts
    font_paths_win = [
        ('C:/Windows/Fonts/arialuni.ttf', 'ArialUnicode'),
        ('C:/Windows/Fonts/mangal.ttf', 'Mangal'),
        ('C:/Windows/Fonts/nirmala.ttf', 'Nirmala'),
    ]
    
    all_paths = font_paths_mac + font_paths_linux + font_paths_win
    
    for font_path, font_name in all_paths:
        if os.path.exists(font_path):
            try:
                if font_path.endswith('.ttc'):
                    # TrueType Collection - skip for now
                    continue
                
                # Register the font with the specified name
                pdfmetrics.registerFont(TTFont(font_name, font_path))
                logger.info(f"✅ Registered Unicode font: {font_path} as '{font_name}'")
                return font_name
            except Exception as e:
                logger.warning(f"Failed to register {font_path}: {str(e)}")
                continue
    
    return None

def download_noto_font(script_name: str) -> tuple:
    """
    Download Noto Sans font for a specific script
    Returns: (regular_path, bold_path) or (None, None) if download fails
    """
    # URL mapping: script -> (font_dir, font_base_name)
    url_mapping = {
        'telugu': ('notosanstelugu', 'NotoSansTelugu'),
        'malayalam': ('notosansmalayalam', 'NotoSansMalayalam'),
        'tamil': ('notosanstamil', 'NotoSansTamil'),
        'devanagari': ('notosansdevanagari', 'NotoSansDevanagari'),
    }
    
    if script_name not in url_mapping:
        return (None, None)
    
    font_dir, font_base = url_mapping[script_name]
    regular_path = FONT_DIR / f"{font_base}-Regular.ttf"
    bold_path = FONT_DIR / f"{font_base}-Bold.ttf"
    
    # Build URLs - try multiple sources
    base_urls = [
        f"https://raw.githubusercontent.com/google/fonts/main/ofl/{font_dir}/{font_base}-Regular.ttf",
        f"https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/{font_dir}/{font_base}-Regular.ttf",
    ]
    
    bold_urls = [
        f"https://raw.githubusercontent.com/google/fonts/main/ofl/{font_dir}/{font_base}-Bold.ttf",
        f"https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/{font_dir}/{font_base}-Bold.ttf",
    ]
    
    # Download regular if not exists
    if not regular_path.exists():
        for url in base_urls:
            try:
                logger.info(f"Downloading {font_base} Regular from {url}...")
                response = requests.get(url, timeout=60, allow_redirects=True, 
                                      headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'})
                if response.status_code == 200 and len(response.content) > 10000:
                    with open(regular_path, 'wb') as f:
                        f.write(response.content)
                    logger.info(f"✅ Downloaded {font_base} Regular ({len(response.content)} bytes)")
                    break
            except Exception as e:
                logger.warning(f"Failed to download from {url}: {str(e)}")
                continue
    
    # Download bold if not exists
    if not bold_path.exists():
        for url in bold_urls:
            try:
                logger.info(f"Downloading {font_base} Bold from {url}...")
                response = requests.get(url, timeout=60, allow_redirects=True,
                                      headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'})
                if response.status_code == 200 and len(response.content) > 10000:
                    with open(bold_path, 'wb') as f:
                        f.write(response.content)
                    logger.info(f"✅ Downloaded {font_base} Bold ({len(response.content)} bytes)")
                    break
            except Exception as e:
                logger.warning(f"Failed to download from {url}: {str(e)}")
                continue
    
    return (regular_path if regular_path.exists() else None, 
            bold_path if bold_path.exists() else None)

def register_script_fonts(script_name: str) -> bool:
    """Register fonts for a specific script (telugu, malayalam, tamil, devanagari)"""
    font_name_map = {
        'telugu': 'NotoSansTelugu',
        'malayalam': 'NotoSansMalayalam',
        'tamil': 'NotoSansTamil',
        'devanagari': 'NotoSansDevanagari',
    }
    
    if script_name not in font_name_map:
        return False
    
    font_base_name = font_name_map[script_name]
    regular_path, bold_path = download_noto_font(script_name)
    
    registered = False
    
    # Register regular font
    if regular_path and regular_path.exists():
        try:
            pdfmetrics.registerFont(TTFont(font_base_name, str(regular_path)))
            logger.info(f"✅ Registered {font_base_name} Regular")
            registered = True
        except Exception as e:
            logger.warning(f"Failed to register {font_base_name} Regular: {str(e)}")
    
    # Register bold font
    if bold_path and bold_path.exists():
        try:
            pdfmetrics.registerFont(TTFont(f'{font_base_name}-Bold', str(bold_path)))
            logger.info(f"✅ Registered {font_base_name} Bold")
        except Exception as e:
            logger.warning(f"Failed to register {font_base_name} Bold: {str(e)}")
    
    return registered

def register_all_indian_fonts():
    """Register fonts for all Indian scripts"""
    scripts = ['telugu', 'malayalam', 'tamil', 'devanagari']
    for script in scripts:
        register_script_fonts(script)

def register_unicode_font():
    """Register a Unicode font that supports Indian scripts"""
    # Register all Indian script fonts
    register_all_indian_fonts()
    
    # First, try system fonts (fastest and most reliable)
    font_name = register_system_unicode_font()
    if font_name:
        return font_name
    
    # Ultimate fallback: use Helvetica (will show dots for Indian scripts)
    logger.error("⚠️  No Unicode font found! Indian scripts may display as dots.")
    logger.error("   Please install a Unicode font like Arial Unicode MS or Noto Sans")
    return 'Helvetica'

def detect_script(text: str) -> str:
    """Detect which script is used in the text"""
    script_counts = {script: 0 for script in SCRIPT_RANGES.keys()}
    
    for char in text:
        char_code = ord(char)
        for script, char_range in SCRIPT_RANGES.items():
            if char_code in char_range:
                script_counts[script] += 1
    
    # Return the script with the most characters
    if any(script_counts.values()):
        return max(script_counts, key=script_counts.get)
    return None

def detect_telugu_text(text: str) -> bool:
    """Detect if text contains Telugu characters"""
    return detect_script(text) == 'telugu'

def get_script_from_language(language: str) -> str:
    """Convert language name to script name"""
    lang_lower = language.lower().strip()
    return LANGUAGE_TO_SCRIPT.get(lang_lower, None)

def get_font_for_text(text: str, target_language: str = "") -> tuple:
    """
    Get the appropriate font name and whether to use bold for the given text
    Returns: (font_name, use_bold)
    """
    # Determine script from target language or text detection
    script = None
    if target_language:
        script = get_script_from_language(target_language)
    
    # If no script from language, detect from text
    if not script:
        script = detect_script(text)
    
    # Font mapping
    font_map = {
        'telugu': ('NotoSansTelugu', 'NotoSansTelugu-Bold'),
        'malayalam': ('NotoSansMalayalam', 'NotoSansMalayalam-Bold'),
        'tamil': ('NotoSansTamil', 'NotoSansTamil-Bold'),
        'devanagari': ('NotoSansDevanagari', 'NotoSansDevanagari-Bold'),
    }
    
    if script and script in font_map:
        regular_font, bold_font = font_map[script]
        
        # Priority 1: Try bold font (best for readability)
        try:
            pdfmetrics.getFont(bold_font)
            logger.info(f"Using {bold_font} for {script} text")
            return (bold_font, True)
        except:
            pass
        
        # Priority 2: Try regular font
        try:
            pdfmetrics.getFont(regular_font)
            logger.info(f"Using {regular_font} for {script} text (with enhanced styling)")
            return (regular_font, True)  # Use enhanced styling (larger size)
        except:
            pass
        
        # Priority 3: Use Arial Unicode MS (comprehensive Unicode support)
        try:
            pdfmetrics.getFont('ArialUnicode')
            logger.info(f"Using Arial Unicode MS for {script} text (excellent Unicode support)")
            return ('ArialUnicode', True)
        except:
            pass
    
    # Fallback: Use default Unicode font
    if UNICODE_FONT_NAME and UNICODE_FONT_NAME != 'Helvetica':
        return (UNICODE_FONT_NAME, False)
    
    return ('Helvetica', False)

def setup_indian_fonts():
    """
    Setup fonts for Indian script support
    Returns the font name to use
    """
    try:
        font_name = register_unicode_font()
        return font_name
    except Exception as e:
        logger.error(f"Error setting up fonts: {str(e)}")
        return 'Helvetica'

# Initialize font on module import
UNICODE_FONT_NAME = setup_indian_fonts()

# Determine bold font name
if UNICODE_FONT_NAME == 'ArialUnicode':
    # Arial Unicode MS doesn't have separate bold variant
    # We'll use the same font for both regular and bold
    # ReportLab can't easily simulate bold for TTF fonts, so we'll use regular
    UNICODE_FONT_BOLD = 'ArialUnicode'
elif UNICODE_FONT_NAME == 'NotoSans':
    try:
        pdfmetrics.getFont('NotoSans-Bold')
        UNICODE_FONT_BOLD = 'NotoSans-Bold'
    except:
        UNICODE_FONT_BOLD = 'NotoSans'
elif UNICODE_FONT_NAME == 'UnicodeFont':
    UNICODE_FONT_BOLD = 'UnicodeFont'
elif UNICODE_FONT_NAME == 'Mangal' or UNICODE_FONT_NAME == 'Nirmala':
    UNICODE_FONT_BOLD = UNICODE_FONT_NAME
else:
    UNICODE_FONT_BOLD = 'Helvetica-Bold'

logger.info(f"📝 Using font: {UNICODE_FONT_NAME} (Bold: {UNICODE_FONT_BOLD})")

# Export functions
__all__ = [
    'UNICODE_FONT_NAME', 
    'UNICODE_FONT_BOLD', 
    'get_font_for_text', 
    'detect_telugu_text',
    'detect_script',
    'get_script_from_language',
    'register_script_fonts',
    'register_all_indian_fonts',
]
