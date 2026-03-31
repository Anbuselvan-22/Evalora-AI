import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import studentService from '../../services/studentService.js'
import { formatDate, getGradeColor } from '../../utils/helpers.js'

const StudentResultDetailPage = () => {
  const { id } = useParams()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await studentService.getResultDetail(id)
        setResult(data)
      } catch (error) {
        console.error('Failed to fetch result details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResult()
  }, [id])

  if (loading) {
    return <div className="p-6">Loading result details...</div>
  }

  if (!result) {
    return <div className="p-6">Result not found</div>
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{result.exam?.title}</h1>
        <p className="text-gray-600">{result.exam?.subject} - {result.exam?.class}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Score</h3>
          <p className="text-2xl font-bold text-gray-900">
            {result.obtainedMarks}/{result.totalMarks}
          </p>
          <p className="text-lg text-gray-600">{result.percentage}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Grade</h3>
          <span className={`px-3 py-1 inline-flex text-lg leading-5 font-semibold rounded-full ${getGradeColor(result.grade)}`}>
            {result.grade}
          </span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Evaluated On</h3>
          <p className="text-lg text-gray-900">{formatDate(result.evaluatedAt)}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Answer Breakdown</h2>
        <div className="space-y-4">
          {result.answers.map((answer, index) => (
            <div key={index} className="border-l-4 border-gray-200 pl-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">Question {answer.questionIndex + 1}</h4>
                <span className="text-sm text-gray-500">
                  {answer.marksObtained}/{answer.maxMarks}
                </span>
              </div>
              <p className="text-gray-700 mb-2">{answer.answer}</p>
              {answer.feedback && (
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <p className="text-sm text-blue-800">{answer.feedback}</p>
                </div>
              )}
              {answer.mistakes && answer.mistakes.length > 0 && (
                <div className="mt-2">
                  {answer.mistakes.map((mistake, mistakeIndex) => (
                    <div key={mistakeIndex} className="bg-red-50 p-2 rounded mt-1">
                      <p className="text-sm text-red-800">
                        <span className="font-medium">{mistake.type}:</span> {mistake.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {result.overallFeedback && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Overall Feedback</h2>
          <p className="text-gray-700">{result.overallFeedback}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {result.strengths && result.strengths.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-green-600">Strengths</h2>
            <ul className="list-disc list-inside space-y-2">
              {result.strengths.map((strength, index) => (
                <li key={index} className="text-gray-700">{strength}</li>
              ))}
            </ul>
          </div>
        )}
        {result.improvements && result.improvements.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-orange-600">Areas for Improvement</h2>
            <ul className="list-disc list-inside space-y-2">
              {result.improvements.map((improvement, index) => (
                <li key={index} className="text-gray-700">{improvement}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentResultDetailPage
