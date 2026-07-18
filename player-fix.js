// EPISODE NAVIGATION FIX
// This snippet replaces the navigation button handlers

// Function to properly load next episode
async function loadNextEpisode() {
    if (!nextEpisodeData || !currentMovieData) return;
    
    // Pause current video
    vid.pause();
    player.classList.add('loading');
    
    // Update URL params
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('s', nextEpisodeData.season);
    newUrl.searchParams.set('e', nextEpisodeData.episode);
    window.history.pushState({}, '', newUrl);
    
    // Update indices
    sIdx = nextEpisodeData.season;
    eIdx = nextEpisodeData.episode;
    
    // Clear old sources
    videoSources = [];
    audioSources = [];
    hasExtAudio = false;
    
    // Re-fetch episode data and sources
    await loadMovieDataAndSources();
    
    // This triggers loadVideoSource() internally
}

// Function to properly load previous episode
async function loadPrevEpisode() {
    if (!prevEpisodeData || !currentMovieData) return;
    
    // Pause current video
    vid.pause();
    player.classList.add('loading');
    
    // Update URL params
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('s', prevEpisodeData.season);
    newUrl.searchParams.set('e', prevEpisodeData.episode);
    window.history.pushState({}, '', newUrl);
    
    // Update indices
    sIdx = prevEpisodeData.season;
    eIdx = prevEpisodeData.episode;
    
    // Clear old sources
    videoSources = [];
    audioSources = [];
    hasExtAudio = false;
    
    // Re-fetch episode data and sources
    await loadMovieDataAndSources();
}

// Function to show "no link available" indicator
function showNoLinkIndicator() {
    const noLinkOverlay = document.getElementById("no-link-overlay");
    if (noLinkOverlay) {
        noLinkOverlay.classList.add('active');
        setTimeout(() => {
            noLinkOverlay.classList.remove('active');
        }, 3000);
    }
}

// Update button click handlers
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (prevEpisodeData) {
            loadPrevEpisode();
        } else {
            showNoLinkIndicator();
        }
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        if (nextEpisodeData) {
            loadNextEpisode();
        } else {
            showNoLinkIndicator();
        }
    });
}

// MINI TIMELINE CONTROLS AT BOTTOM
// Add this CSS to show mini buttons on the timeline
const style = document.createElement('style');
style.textContent = `
    /* Mini Timeline Navigation Buttons */
    .mini-timeline-controls {
        position: absolute;
        bottom: -45px;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 15px;
        height: 40px;
        z-index: 30;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
    }
    
    .video-container:not(.show-controls) .mini-timeline-controls {
        opacity: 1;
        visibility: visible;
    }
    
    @media (min-width: 769px) {
        .mini-timeline-controls { display: none !important; }
    }
    
    .mini-nav-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #fff;
        font-size: 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        opacity: 0.8;
    }
    
    .mini-nav-btn:hover {
        background: var(--accent);
        border-color: var(--accent);
        opacity: 1;
        transform: scale(1.1);
    }
    
    .mini-nav-btn:active {
        transform: scale(0.95);
    }
    
    .mini-nav-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);

// Insert mini timeline controls into HTML
function initMiniTimelineControls() {
    const miniTimeline = document.getElementById('mini-timeline');
    
    if (miniTimeline && !document.getElementById('mini-timeline-controls')) {
        const controlsDiv = document.createElement('div');
        controlsDiv.id = 'mini-timeline-controls';
        controlsDiv.className = 'mini-timeline-controls';
        controlsDiv.innerHTML = `
            <button class="mini-nav-btn" id="mini-prev-btn" title="Previous Episode" style="display: none;">
                <i class="fa-solid fa-step-backward"></i>
            </button>
            <span id="mini-episode-info" style="color: #fff; font-size: 12px; min-width: 80px; text-align: center;">
                <!-- Episode number will be inserted here -->
            </span>
            <button class="mini-nav-btn" id="mini-next-btn" title="Next Episode" style="display: none;">
                <i class="fa-solid fa-step-forward"></i>
            </button>
        `;
        
        miniTimeline.parentNode.appendChild(controlsDiv);
        
        // Wire up mini buttons
        const miniPrevBtn = document.getElementById('mini-prev-btn');
        const miniNextBtn = document.getElementById('mini-next-btn');
        const miniEpisodeInfo = document.getElementById('mini-episode-info');
        
        if (miniPrevBtn) {
            miniPrevBtn.addEventListener('click', loadPrevEpisode);
            miniPrevBtn.style.display = prevEpisodeData ? 'flex' : 'none';
        }
        
        if (miniNextBtn) {
            miniNextBtn.addEventListener('click', loadNextEpisode);
            miniNextBtn.style.display = nextEpisodeData ? 'flex' : 'none';
        }
        
        // Update episode info display
        if (miniEpisodeInfo && sIdx !== null && eIdx !== null) {
            miniEpisodeInfo.textContent = `S${sIdx + 1}E${eIdx + 1}`;
        }
    }
}

// Call this after your data is loaded
setTimeout(initMiniTimelineControls, 500);
