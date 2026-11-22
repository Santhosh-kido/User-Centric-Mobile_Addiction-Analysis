const API_URL = 'http://localhost:5000/predict';

function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#ef4444;color:white;padding:12px 20px;border-radius:8px;z-index:1000;font-weight:500';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

document.getElementById('addictionForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Check if all radio groups are answered
    const radioGroups = ['usePhoneForClassNotes', 'buyBooksFromPhone', 'batteryLastsDay', 'runForCharger', 'worryAboutLosingPhone', 'takePhoneToBathroom', 'usePhoneInSocialGatherings', 'checkPhoneBeforeSleepAfterWaking', 'keepPhoneNextToWhileSleeping', 'checkEmailsCallsTextsDuringClass', 'relyOnPhoneInAwkwardSituations', 'onPhoneWhileWatchingTvEating', 'panicAttackIfPhoneLeftElsewhere', 'checkPhoneWithSomeone', 'liveADayWithoutPhone', 'addictedToPhone'];
    
    for (let group of radioGroups) {
        if (!document.querySelector(`input[name="${group}"]:checked`)) {
            showToast('Please answer all questions');
            return;
        }
    }
    
    const submitBtn = document.getElementById('submitBtn');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');
    
    // Prevent double submission
    if (submitBtn.disabled) return;
    
    // Show loading
    submitBtn.disabled = true;
    submitBtn.textContent = '🔄 Analyzing...';
    loading.classList.remove('hidden');
    results.classList.add('hidden');
    
    try {
        // Collect form data
        const formData = new FormData(this);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            if (key === 'age' || key === 'phoneUseForPlayingGames') {
                data[key] = parseInt(value);
            } else {
                data[key] = value;
            }
        }
        
        console.log('Sending data:', data);
        
        // Make API call
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Received result:', result);
        
        // Display results
        displayResults(result, data.name);
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error analyzing data. Please check if the backend service is running on port 5001.');
    } finally {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = '🧠 Analyze My Addiction Level';
        loading.classList.add('hidden');
    }
});

function displayResults(result, userName) {
    const resultsDiv = document.getElementById('results');
    const resultsContent = document.getElementById('resultsContent');
    
    const ensemble = result.ensembleResult;
    const algorithms = result.results;
    
    const riskClass = getRiskClass(ensemble.prediction);
    
    resultsContent.innerHTML = `
        <button class="back-btn" onclick="showForm()">← Back to Assessment</button>
        
        <div class="result-card ensemble-result">
            <h3>Overall Assessment for ${userName}</h3>
            <h2>${ensemble.prediction}</h2>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${ensemble.addictionPercentage}%"></div>
            </div>
            <p><strong>Addiction Level:</strong> ${ensemble.addictionPercentage}%</p>
            <p><strong>Average Accuracy:</strong> ${(Number(ensemble.accuracy) * 100).toFixed(0)}%</p>
        </div>
        

        
        <div class="result-card">
            <h3>Personalized Recommendations</h3>
            <div id="recommendations">
                ${getRecommendations(ensemble.prediction, ensemble.addictionPercentage)}
            </div>
        </div>
    `;
    
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

function getRiskClass(prediction) {
    switch(prediction) {
        case 'Low Risk': return 'risk-low';
        case 'Moderate Risk': return 'risk-moderate';
        case 'High Risk': return 'risk-high';
        default: return '';
    }
}

function getRecommendations(prediction, percentage) {
    if (prediction === 'Low Risk') {
        return `
            <ul>
                <li>🎉 Great job! Your phone usage appears healthy and balanced.</li>
                <li>📱 Continue maintaining conscious phone usage habits.</li>
                <li>⏰ Consider setting specific times for phone-free activities.</li>
                <li>🧘 Use mindfulness apps to stay aware of your digital habits.</li>
                <li>👥 Keep prioritizing face-to-face social interactions.</li>
            </ul>
        `;
    } else if (prediction === 'Moderate Risk') {
        return `
            <ul>
                <li>⚠️ Your phone usage shows some concerning patterns that need attention.</li>
                <li>📵 Try implementing 'phone-free' zones in your home (bedroom, dining table).</li>
                <li>⏰ Set specific times to check messages rather than constantly monitoring.</li>
                <li>🔔 Turn off non-essential notifications to reduce checking impulses.</li>
                <li>🚶 Replace some phone activities with physical activities or hobbies.</li>
                <li>😴 Keep your phone out of the bedroom to improve sleep quality.</li>
                <li>👨⚕️ Consider using apps that track and limit your screen time.</li>
            </ul>
        `;
    } else {
        return `
            <ul>
                <li>🚨 Your results indicate high mobile addiction risk requiring immediate action.</li>
                <li>📵 Implement immediate digital detox periods (start with 1-2 hours daily).</li>
                <li>🔒 Use app blockers and screen time controls to limit access.</li>
                <li>😴 Establish a strict no-phone policy 1 hour before bedtime.</li>
                <li>🏃♂️ Replace phone activities with physical exercise and outdoor activities.</li>
                <li>👥 Seek support from family and friends for accountability.</li>
                <li>📚 Engage in offline hobbies like reading, cooking, or crafts.</li>
                <li>🧠 Practice mindfulness and meditation to reduce dependency.</li>
                <li>👨⚕️ Consider professional help if you can't control usage on your own.</li>
                <li>📞 Contact a mental health professional if addiction impacts daily life.</li>
            </ul>
        `;
    }
}

function showForm() {
    document.getElementById('results').classList.add('hidden');
    document.getElementById('addictionForm').scrollIntoView({ behavior: 'smooth' });
}

// Form validation
document.querySelectorAll('input[required], select[required]').forEach(field => {
    field.addEventListener('invalid', function() {
        this.style.borderColor = '#dc3545';
    });
    
    field.addEventListener('input', function() {
        if (this.checkValidity()) {
            this.style.borderColor = '#28a745';
        }
    });
});