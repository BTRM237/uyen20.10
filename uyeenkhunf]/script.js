// Audio management
let backgroundAudio = null;
let audioStarted = false;

function initAudio() {
    try {
        // Create audio element
        backgroundAudio = new Audio('./assets/audio/memory-audio-woman-day.mp3');
        backgroundAudio.volume = 0.5; // 50% volume
        backgroundAudio.loop = true; // Loop the audio
        backgroundAudio.preload = 'auto'; // Preload audio for better performance

        // Add error handling
        backgroundAudio.addEventListener('error', function(e) {
            console.warn('Audio failed to load:', e);
        });

        backgroundAudio.addEventListener('canplaythrough', function() {
            console.log('Audio loaded successfully');
        });

        console.log('Audio initialized - will start when envelope is clicked');

    } catch (error) {
        console.error('Error initializing audio:', error);
    }
}

function startAudio() {
    if (audioStarted) return Promise.resolve();

    return backgroundAudio.play().then(() => {
        audioStarted = true;
        console.log('Background music started successfully');
    }).catch(error => {
        console.error('Failed to start audio:', error);
        throw error;
    });
}

const envelope = document.getElementById('envelope');
const letter = document.getElementById('letter');
const overlay = document.getElementById('overlay');
const flowers = document.querySelectorAll('.flowers');
const teaserMessage = document.getElementById('teaserMessage');
let envelopeState = 'closed'; // closed, flap-opened, fully-opened

// Initialize audio when page loads
document.addEventListener('DOMContentLoaded', function() {
    initAudio();
});

envelope.addEventListener('click', function() {
    if (envelopeState === 'closed') {
        // First click: Open flap and show teaser, and start audio
        envelope.classList.add('opened');
        envelopeState = 'flap-opened';

        // Start background music when envelope is first clicked
        startAudio().catch(error => {
            console.log('Audio start failed, but continuing with animation:', error);
        });

        setTimeout(() => {
            teaserMessage.classList.add('show');
        }, 600);
    }
});

teaserMessage.addEventListener('click', function(e) {
    e.stopPropagation();

    if (envelopeState === 'flap-opened') {
        // Second click: Hide teaser and show full letter
        teaserMessage.classList.remove('show');
        envelopeState = 'fully-opened';

        setTimeout(() => {
            overlay.classList.add('show');
            letter.classList.add('show');
            flowers.forEach(flower => flower.classList.add('show'));
        }, 300);
    }
});

overlay.addEventListener('click', function() {
    letter.classList.remove('show');
    flowers.forEach(flower => flower.classList.remove('show'));
    overlay.classList.remove('show');

    setTimeout(() => {
        envelope.classList.remove('opened');
        envelopeState = 'closed';
    }, 300);
});

letter.addEventListener('click', function(e) {
    e.stopPropagation();
});
