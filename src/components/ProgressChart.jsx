import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const ProgressChart = () => {
  const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8']
  
  const data = {
    labels,
    datasets: [
      {
        label: 'User Growth',
        data: [120, 190, 300, 500, 750, 1100, 1650, 2350],
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.5,
        pointBackgroundColor: 'rgb(139, 92, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Conversion Rate',
        data: [1.2, 1.8, 2.5, 3.2, 4.1, 5.0, 6.2, 7.5],
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.5,
        pointBackgroundColor: 'rgb(14, 165, 233)',
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
        pointRadius: 6,
        yAxisID: 'y1',
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Users'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Conversion Rate %'
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value) {
            return value + '%'
          }
        }
      }
    },
    animation: {
      duration: 3000,
      easing: 'easeInOutQuart'
    }
  }

  return (
    <div className="h-80">
      <Line data={data} options={options} />
    </div>
  )
}

export default ProgressChart