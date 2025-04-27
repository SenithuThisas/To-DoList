// DOM Elements
const timeRangeSelect = document.getElementById('time-range');
const completionRateEl = document.getElementById('completion-rate');
const avgTimeEl = document.getElementById('avg-time');
const totalTasksEl = document.getElementById('total-tasks');
const productivityScoreEl = document.getElementById('productivity-score');

// Chart instances
let completionChart, categoryChart, trendChart, distributionChart;

// Load data when page loads
window.addEventListener('load', () => {
    loadAnalytics();
});

// Event Listeners
timeRangeSelect.addEventListener('change', () => {
    loadAnalytics();
});

// Functions
function loadAnalytics() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const timeRange = timeRangeSelect.value;
    
    // Filter tasks based on time range
    const filteredTasks = filterTasksByTimeRange(tasks, timeRange);
    
    // Update statistics
    updateStatistics(filteredTasks);
    
    // Update charts
    updateCharts(filteredTasks, categories);
}

function filterTasksByTimeRange(tasks, timeRange) {
    const now = new Date();
    const startDate = new Date();
    
    switch(timeRange) {
        case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
        case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
        case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
    }
    
    return tasks.filter(task => new Date(task.createdAt) >= startDate);
}

function updateStatistics(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const completionRate = total > 0 ? (completed / total * 100).toFixed(1) : 0;
    
    // Calculate average completion time (mock data for now)
    const avgTime = total > 0 ? Math.floor(Math.random() * 60) + 30 : 0;
    
    // Calculate productivity score (mock data for now)
    const productivityScore = Math.floor(Math.random() * 100);
    
    completionRateEl.textContent = `${completionRate}%`;
    avgTimeEl.textContent = `${avgTime} min`;
    totalTasksEl.textContent = total;
    productivityScoreEl.textContent = productivityScore;
}

function updateCharts(tasks, categories) {
    // Completion Rate Chart
    const completionCtx = document.getElementById('completion-chart').getContext('2d');
    if (completionChart) completionChart.destroy();
    
    const completed = tasks.filter(task => task.completed).length;
    const pending = tasks.length - completed;
    
    completionChart = new Chart(completionCtx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Pending'],
            datasets: [{
                data: [completed, pending],
                backgroundColor: ['#4CAF50', '#FFC107'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    
    // Category Chart
    const categoryCtx = document.getElementById('category-chart').getContext('2d');
    if (categoryChart) categoryChart.destroy();
    
    const categoryData = categories.map(category => {
        const count = tasks.filter(task => task.categoryId === category.id).length;
        return {
            name: category.name,
            count: count,
            color: category.color
        };
    });
    
    categoryChart = new Chart(categoryCtx, {
        type: 'bar',
        data: {
            labels: categoryData.map(c => c.name),
            datasets: [{
                data: categoryData.map(c => c.count),
                backgroundColor: categoryData.map(c => c.color),
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
    
    // Trend Chart
    const trendCtx = document.getElementById('trend-chart').getContext('2d');
    if (trendChart) trendChart.destroy();
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const trendData = days.map(day => Math.floor(Math.random() * 10));
    
    trendChart = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: days,
            datasets: [{
                label: 'Tasks Completed',
                data: trendData,
                borderColor: '#2E3192',
                backgroundColor: 'rgba(46, 49, 146, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
    
    // Distribution Chart
    const distributionCtx = document.getElementById('distribution-chart').getContext('2d');
    if (distributionChart) distributionChart.destroy();
    
    const distributionData = {
        morning: Math.floor(Math.random() * 30),
        afternoon: Math.floor(Math.random() * 30),
        evening: Math.floor(Math.random() * 30),
        night: Math.floor(Math.random() * 30)
    };
    
    distributionChart = new Chart(distributionCtx, {
        type: 'polarArea',
        data: {
            labels: ['Morning', 'Afternoon', 'Evening', 'Night'],
            datasets: [{
                data: [
                    distributionData.morning,
                    distributionData.afternoon,
                    distributionData.evening,
                    distributionData.night
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Add styles
const style = document.createElement('style');
style.textContent = `
    .analytics-app {
        background: var(--bg-color);
        border-radius: var(--border-radius);
        padding: 2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .analytics-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
        margin-top: 2rem;
    }

    .analytics-card {
        background: var(--bg-color);
        border-radius: var(--border-radius);
        padding: 1.5rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }

    .analytics-card h3 {
        margin: 0 0 1rem;
        color: var(--text-color);
        font-size: 1.1rem;
    }

    .chart-container {
        height: 250px;
    }

    .analytics-stats {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
        margin-top: 2rem;
    }

    .stat-card {
        background: var(--bg-color);
        border-radius: var(--border-radius);
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }

    .stat-icon {
        width: 40px;
        height: 40px;
        background: var(--button-color);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
    }

    .stat-info h4 {
        margin: 0;
        font-size: 0.9rem;
        color: var(--text-color);
        opacity: 0.7;
    }

    .stat-info p {
        margin: 0.5rem 0 0;
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--text-color);
    }

    .date-filter select {
        padding: 0.5rem 1rem;
        border: 1px solid #ddd;
        border-radius: var(--border-radius);
        background: var(--input-bg);
        color: var(--text-color);
        cursor: pointer;
    }

    @media (max-width: 768px) {
        .analytics-grid {
            grid-template-columns: 1fr;
        }

        .analytics-stats {
            grid-template-columns: repeat(2, 1fr);
        }
    }
`;
document.head.appendChild(style); 