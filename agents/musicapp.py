import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

print("Starting Music Suggestion Agent...")

app = Flask(__name__)
CORS(app)

# iTunes API Configuration
ITUNES_BASE_URL = 'https://itunes.apple.com/search'

# Mood to Genre Mapping
MOOD_GENRES = {
    "happy": "Pop",
    "energetic": "Dance",
    "calm": "Alternative",
    "romantic": "R&B/Soul",
    "upbeat": "Pop",
    "relaxing": "Alternative",
    "motivational": "Rock",
    "sad": "Alternative",
    "party": "Dance",
    "workout": "Electronic",
    "chill": "Indie",
    "inspiring": "Classical"
}

# Mood Keywords for Detection
MOOD_KEYWORDS = {
    "happy": ["happy", "joy", "fun", "cheerful", "excited", "amazing", "wonderful"],
    "energetic": ["energy", "dance", "party", "pump", "active", "dynamic", "vibrant"],
    "calm": ["calm", "peace", "relax", "tranquil", "serene", "quiet", "gentle"],
    "romantic": ["love", "romantic", "heart", "valentine", "couple", "together"],
    "motivational": ["motivate", "inspire", "achieve", "success", "goal", "hustle"],
    "sad": ["sad", "melancholy", "miss", "lonely", "heartbreak", "tears"],
    "party": ["party", "celebration", "club", "night out", "drinks"],
    "workout": ["workout", "fitness", "gym", "exercise", "training", "run"],
    "chill": ["chill", "vibe", "cozy", "lazy", "weekend"],
    "upbeat": ["upbeat", "positive", "optimistic", "bright", "sunny"]
}

def analyze_mood(description, caption=""):
    """
    Analyze text to detect mood
    
    Args:
        description: Image description or user input
        caption: Caption text
    
    Returns:
        Detected mood string
    """
    text = (description + " " + caption).lower()
    
    # Count keyword matches for each mood
    mood_scores = {}
    for mood, keywords in MOOD_KEYWORDS.items():
        score = sum(1 for keyword in keywords if keyword in text)
        if score > 0:
            mood_scores[mood] = score
    
    # Return mood with highest score, or default to upbeat
    if mood_scores:
        return max(mood_scores, key=mood_scores.get)
    
    return "upbeat"

def search_itunes(mood, limit=5):
    """
    Search music using iTunes API
    
    Args:
        mood: Detected mood
        limit: Number of results to return
    
    Returns:
        List of music suggestions
    """
    try:
        genre = MOOD_GENRES.get(mood, "Pop")
        
        # Search parameters
        params = {
            'term': f'{mood} music {genre}',
            'media': 'music',
            'entity': 'song',
            'limit': limit * 2,  # Get more to filter explicit content
            'explicit': 'No',
            'country': 'US'
        }
        
        response = requests.get(ITUNES_BASE_URL, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        suggestions = []
        
        if 'results' in data and data['results']:
            for track in data['results']:
                # Skip explicit content
                if track.get('trackExplicitness') == 'explicit':
                    continue
                
                suggestions.append({
                    "title": track.get('trackName', 'Unknown'),
                    "artist": track.get('artistName', 'Unknown'),
                    "album": track.get('collectionName', 'Unknown'),
                    "mood": mood,
                    "genre": track.get('primaryGenreName', genre),
                    "previewUrl": track.get('previewUrl'),
                    "artwork": track.get('artworkUrl100', '').replace('100x100', '300x300'),
                    "releaseDate": track.get('releaseDate', '').split('T')[0] if track.get('releaseDate') else None,
                    "trackTime": track.get('trackTimeMillis', 0) // 1000,  # Convert to seconds
                    "iTunesUrl": track.get('trackViewUrl'),
                    "instagramAudioId": None  # For future integration
                })
                
                if len(suggestions) >= limit:
                    break
        
        return suggestions
    
    except requests.exceptions.RequestException as e:
        print(f"iTunes API error: {e}")
        return []
    except Exception as e:
        print(f"Search error: {e}")
        return []

def get_fallback_suggestions(mood, limit=5):
    """
    Provide fallback suggestions when API fails
    
    Args:
        mood: Detected mood
        limit: Number of suggestions
    
    Returns:
        List of fallback suggestions
    """
    fallback_tracks = {
        "happy": [
            {"title": "Happy", "artist": "Pharrell Williams", "mood": mood},
            {"title": "Good Vibes", "artist": "Feel Good Playlist", "mood": mood},
            {"title": "Sunshine Day", "artist": "Summer Mix", "mood": mood}
        ],
        "energetic": [
            {"title": "Can't Stop", "artist": "Energy Mix", "mood": mood},
            {"title": "Pumped Up", "artist": "Workout Beats", "mood": mood},
            {"title": "High Energy", "artist": "Dance Mix", "mood": mood}
        ],
        "calm": [
            {"title": "Peaceful Mind", "artist": "Relaxation", "mood": mood},
            {"title": "Serenity", "artist": "Calm Sounds", "mood": mood},
            {"title": "Tranquil Moments", "artist": "Peaceful Mix", "mood": mood}
        ]
    }
    
    suggestions = fallback_tracks.get(mood, [
        {"title": "Feel Good Music", "artist": "Playlist", "mood": mood},
        {"title": "Mood Vibes", "artist": "Music Mix", "mood": mood},
        {"title": "Perfect Sound", "artist": "Tracks", "mood": mood}
    ])
    
    return suggestions[:limit]

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "music-suggestion-agent"
    }), 200

@app.route('/suggest-music', methods=['POST'])
def suggest_music():
    """
    Main endpoint for music suggestions
    
    Request Body:
        - description: Text description of the post
        - caption: Post caption (optional)
        - mood: Override detected mood (optional)
        - limit: Number of suggestions (default: 5)
    
    Returns:
        JSON with music suggestions
    """
    try:
        data = request.json or {}
        
        description = data.get('description', '')
        caption = data.get('caption', '')
        mood_override = data.get('mood')
        limit = data.get('limit', 5)
        
        # Validate input
        if not description and not caption:
            return jsonify({
                "success": False,
                "error": "Description or caption is required"
            }), 400
        
        # Detect mood
        if mood_override and mood_override.lower() in MOOD_GENRES:
            mood = mood_override.lower()
        else:
            mood = analyze_mood(description, caption)
        
        print(f"Detected mood: {mood}")
        
        # Search for music
        suggestions = search_itunes(mood, limit=limit)
        
        # Use fallback if no results
        if not suggestions:
            print("Using fallback suggestions")
            suggestions = get_fallback_suggestions(mood, limit=limit)
        
        return jsonify({
            "success": True,
            "detectedMood": mood,
            "genre": MOOD_GENRES.get(mood, "Pop"),
            "suggestions": suggestions,
            "count": len(suggestions)
        }), 200
    
    except Exception as e:
        print(f"Music suggestion error: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Failed to generate music suggestions: {str(e)}"
        }), 500

@app.route('/moods', methods=['GET'])
def get_available_moods():
    """Get list of available moods"""
    return jsonify({
        "success": True,
        "moods": list(MOOD_GENRES.keys())
    }), 200

if __name__ == '__main__':
    print("Music Suggestion Agent running on http://0.0.0.0:5004")
    app.run(host='0.0.0.0', port=5004, debug=True)
