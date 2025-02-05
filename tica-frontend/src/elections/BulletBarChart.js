import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation'; // Import the annotation plugin

// Register Chart.js components and annotation plugin
ChartJS.register(CategoryScale, LinearScale, BarElement, annotationPlugin);

const BulletBarChart = ({ republicans, democrats, avgR, avgD }) => {
  // Data for the bar chart
  const data = {
    labels: ['Republicans', 'Democrats'],
    datasets: [
      {
        data: [republicans, democrats],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Options for the chart, including annotation for vertical lines at avgR and avgD
  const options = {
    indexAxis: 'y', // Makes the bars horizontal
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
      },
    },
    plugins: {
    legend: {
      display: true, // Ensure the legend is shown
      position: 'top', // Position of the legend
      labels: {
        color: 'black', // Set label color to black
        font: {
          size: 14, // Adjust font size
        },
        generateLabels: (chart) => {
          // Custom legend generation for "Average"
          return [
            {
              text: 'Average', // Label text for the legend
              fillStyle: 'black', // Color of the legend box
              strokeStyle: 'white', // Border color for the legend box
              lineWidth: 12, // Border width for the legend box
              hidden: false, // Ensure the legend is not hidden
            },
          ];
        },
      },
    },
      annotation: {
        annotations: {
          verticalLineRepublicans: {
            type: 'line',
            xMin: avgR, // Position of the vertical line for Republicans
            xMax: avgR, // Ensure the line is vertical
            yMin: -0.45, // Start at the beginning of the Republicans bar
            yMax: 0.45, // End at the end of the Republicans bar
            borderColor: 'black', // Color of the line
            borderWidth: 2, // Thickness of the line
          },
          verticalLineDemocrats: {
            type: 'line',
            xMin: avgD, // Position of the vertical line for Democrats
            xMax: avgD, // Ensure the line is vertical
            yMin: 0.55, // Start at the beginning of the Democrats bar
            yMax: 1.45, // End at the end of the Democrats bar
            borderColor: 'black', // Color of the line
            borderWidth: 2, // Thickness of the line
          },
        },
      },
    },
  };

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BulletBarChart;
