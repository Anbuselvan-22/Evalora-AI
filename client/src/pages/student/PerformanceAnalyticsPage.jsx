import React, { useState, useEffect } from 'react'
import studentService from '../../services/studentService.js'
import LineChart from '../../components/charts/LineChart.jsx'

const PerformanceAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState({
    performanceData: [],
    subjectWisePerformance: {},
    improvementAreas: [],
    strengths: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await studentService.getAnalytics()
        setAnalytics(data)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return <div className="p-6">Loading analytics...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Performance Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Performance Trend</h2>
          <LineChart data={analytics.performanceData} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Subject-wise Performance</h2>
          <div className="space-y-3">
            {Object.entries(analytics.subjectWisePerformance).map(([subject, score]) => (
              <div key={subject} className="flex justify-between items-center">
                <span className="text-gray-700">{subject}</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-green-600">Strengths</h2>
          <ul className="list-disc list-inside space-y-2">
            {analytics.strengths.map((strength, index) => (
              <li key={index} className="text-gray-700">{strength}</li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-orange-600">Areas for Improvement</h2>
          <ul className="list-disc list-inside space-y-2">
            {analytics.improvementAreas.map((area, index) => (
              <li key={index} className="text-gray-700">{area}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default PerformanceAnalyticsPage
