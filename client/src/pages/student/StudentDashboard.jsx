import React, { useState, useEffect } from 'react'
import studentService from '../../services/studentService.js'

const StudentDashboard = () => {
  const [stats, setStats] = useState({
    totalEvaluations: 0,
    completedEvaluations: 0,
    averageScore: 0,
    pendingEvaluations: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await studentService.getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Evaluations</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.totalEvaluations}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Completed</h3>
          <p className="text-2xl font-bold text-green-600">{stats.completedEvaluations}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Pending</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.pendingEvaluations}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Average Score</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.averageScore}%</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Evaluations</h2>
        <div className="space-y-3">
          <p className="text-gray-500">No recent evaluations</p>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
