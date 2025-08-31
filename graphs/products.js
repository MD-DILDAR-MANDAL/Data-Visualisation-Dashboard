document.addEventListener('DOMContentLoaded', () => {
    const salesLink = document.querySelector('.sidebar nav ul li:nth-child(3) a');
    const fileInput = document.getElementById('add-dataset-upload');
    const dashboard = document.querySelector('main.dashboard');
    const fileNameSpan = document.getElementById('file-name');

    let selectedFile = null;
    fileInput.addEventListener('change', (e) => {
        selectedFile = e.target.files[0];
        fileNameSpan.textContent = selectedFile ? selectedFile.name : '';
    });

    salesLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (!selectedFile) {
            alert("Please add dataset file first ");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
            let data;
            if (selectedFile.name.endsWith('.json')) {
                try {
                    data = JSON.parse(event.target.result);
                    dashboard.innerHTML = `
                    <div style="display:flex; gap:24px; align-items: flex-start;width:100%">
                    <canvas id ="productScatterChart" style="width:50%; max-width:500px; height:50%;" ></canvas>
                    <canvas id ="productRadarChart" style="width:50%; max-width:500px; height:50%;" ></canvas>
                    </div > `;

                    const labels = ['unitsSold', 'revenue', 'returns', 'rating'];
                    const radarDatasets = data.map(product => ({
                        label: `${product.productName} (${product.productId})`,
                        data: [product.unitsSold, product.revenue, product.returns, product.rating],
                        fill: true,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        pointBackgroundColor: 'rgba(54, 162, 235, 1)'
                    }));

                    const scatterData = {
                        datasets: data.map(product => ({
                            label: `${product.productName} (${product.productId})`,
                            data: [{ x: product.revenue, y: product.returns }],
                            backgroundColor: 'rgba(238,73,92,0.7'
                        }))
                    };
                    const radarCtx = document.getElementById('productRadarChart').getContext('2d');
                    const scatterCtx = document.getElementById('productScatterChart').getContext('2d');

                    new Chart(radarCtx, {
                        type: 'radar',
                        data: {
                            labels: labels,
                            datasets: radarDatasets
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,

                            plugins: {
                                title: {
                                    display: true, text: 'Product Comparison: Units Sold, Revenue, Returns, Rating'
                                }
                            },
                            animation: {
                                duration: 1000,
                                easing: 'easeInBounce'
                            }
                        }
                    });

                    new Chart(scatterCtx, {
                        type: 'scatter',
                        data: scatterData,
                        options: {
                            responsive: true,

                            plugins: {
                                title: {
                                    display: true, text: 'Scatter Plot Revenue vs Return'
                                }
                            },
                            animation: {
                                duration: 1000,
                                easing: 'easeInBounce'
                            }
                        }
                    });
                } catch (err) {
                    dashboard.innerHTML = '<p style="color:red;">Invalid JSON file.</p>';
                }
            } else {
                dashboard.innerHTML = '<p style="color:red;">Unsupported file type.</p>';
            }
        };

        reader.readAsText(selectedFile);

    });
});