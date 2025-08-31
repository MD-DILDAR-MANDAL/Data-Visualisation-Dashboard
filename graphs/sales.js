document.addEventListener('DOMContentLoaded', () => {
    const salesLink = document.querySelector('.sidebar nav ul li:first-child a');
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
                    <div style="display:flex; gap:24px; align-items: flex-start;">
                    <canvas id ="salesLineChart" style="width:50%; max-width:500px; height:50%;" ></canvas>
                    <canvas id ="salesBarChart" style="width:50%; max-width:500px; height:50%;"></canvas>
                    </div > `;

                    const labels = data.map(item => item.date);
                    const sales = data.map(item => item.sales);
                    const orders = data.map(item => item.orders);
                    const returns = data.map(item => item.returns);
                    const lineCtx = document.getElementById('salesLineChart').getContext('2d');
                    const barCtx = document.getElementById('salesBarChart').getContext('2d');
                    new Chart(lineCtx, {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [
                                { label: 'Sales', data: sales, borderColor: 'blue', fill: false },
                                { label: 'Orders', data: orders, borderColor: 'green', fill: false },
                                { label: 'Returns', data: returns, borderColor: 'red', fill: false }
                            ]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                title: { display: true, text: 'Sales/Orders/Returns Over Time' }
                            },
                            animation: {
                                duration: 1000,
                                easing: 'easeInBounce'
                            }


                        }
                    });

                    new Chart(barCtx, {
                        type: 'bar',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: 'Sales', data: sales,
                                backgroundColor: '#c71af284',
                            }, {
                                label: 'Orders',
                                data: orders,
                                backgroundColor: 'rgba(38,220,105,0.7)'
                            }, {
                                label: 'Returns',
                                data: returns,
                                backgroundColor: 'rgba(238,73,92,0.7)'
                            }
                            ]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Grouped Bar: Daily Sales, Orders, Returns'
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