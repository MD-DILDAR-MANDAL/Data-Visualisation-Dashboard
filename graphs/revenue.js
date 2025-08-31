document.addEventListener('DOMContentLoaded', () => {
    const revenueLink = document.querySelector('.sidebar nav ul li:nth-child(2) a');
    const fileInput = document.getElementById('add-dataset-upload');
    const dashboard = document.querySelector('main.dashboard');
    const fileNameSpan = document.getElementById('file-name');

    let selectedFile = null;
    fileInput.addEventListener('change', (e) => {
        selectedFile = e.target.files[0];
        fileNameSpan.textContent = selectedFile ? selectedFile.name : '';
    });

    revenueLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (!selectedFile) {
            alert('Please add dataset file first');
            return;

        }

        const reader = new FileReader();
        reader.onload = function (event) {
            let data;
            if (selectedFile.name.endsWith('.json')) {
                try {
                    data = JSON.parse(event.target.result);
                    dashboard.innerHTML = `
                    <div style="display: flex; gap: 24px; align-items: flex-start; width: 100%;">
                        <canvas id="revenueBarChart" style=" width:60%; height:50%;max-width:50%; flex: 1;"></canvas>
                        <canvas id="revenuePieChart" style="width:50%; height:50%;max-width:50%; flex: 1;"></canvas>
                    </div>`;


                    const region = data.map(item => item.region);
                    const revenue = data.map(item => item.revenue);
                    const transaction = data.map(item => item.transactions);
                    const avgOrderValue = data.map(item => item.avgOrderValue);

                    const barCtx = document.getElementById('revenueBarChart').getContext('2d');

                    const pieCtx = document.getElementById('revenuePieChart').getContext('2d');

                    new Chart(barCtx, {
                        type: 'bar',
                        data: {
                            labels: region,
                            datasets: [{
                                label: 'Revenue',
                                data: revenue,
                                backgroundColor: 'rgba(38,220,105,0.7)'
                            }, {
                                label: 'Transaction',
                                data: transaction,
                                backgroundColor: 'rgba(69, 85, 227, 0.7)'
                            },
                            {
                                label: 'AvgOrderValue',
                                data: avgOrderValue,
                                backgroundColor: 'rgba(238,73,92,0.7)'
                            }
                            ]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Grouped Bar: Revenue, Transaction, Avg Order Value'
                                }
                            },
                            animation: {
                                duration: 1000,
                                easing: 'easeInBounce'
                            }
                        }
                    });

                    new Chart(pieCtx, {
                        type: 'pie',
                        data: {
                            labels: region,
                            datasets: [{
                                label: 'Revenue',
                                data: revenue,
                                backgroundColor: ['rgb(255, 99, 132)',
                                    'rgb(54, 162, 235)',
                                    'rgb(255, 205, 86)',
                                    'rgb(0,255,0)'
                                ],
                                hoverOffset: 4
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Revenue Distribution by Region'
                                }
                            },
                            animation: {
                                duration: 1000,
                                easing: 'easeInBounce'
                            }
                        }
                    });
                }
                catch (e) {
                    dashboard.innerHTML = '<p style="color:red;">Invalid JSON file.</p>';
                }
            } else {
                dashboard.innerHTML = '<p style="color:red;">Unsupported file type.</p>';
            }
        };
        reader.readAsText(selectedFile);
    });
});