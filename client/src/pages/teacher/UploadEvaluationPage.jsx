import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import teacherService from '../../services/teacherService.js'
import UploadBox from '../../components/upload/UploadBox.jsx'

const UploadEvaluationPage = () => {
  const [uploadData, setUploadData] = useState({
    title: '',
    subject: '',
    class: '',
    description: '',
    files: []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleFileUpload = (files) => {
    setUploadData({
      ...uploadData,
      files: [...uploadData.files, ...files]
    })
  }

  const handleChange = (e) => {
    setUploadData({
      ...uploadData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('title', uploadData.title)
      formData.append('subject', uploadData.subject)
      formData.append('class', uploadData.class)
      formData.append('description', uploadData.description)
      
      uploadData.files.forEach((file, index) => {
        formData.append(`file${index}`, file)
      })

      const response = await teacherService.uploadEvaluation(formData)
      navigate('/results')
    } catch (error) {
      setError(error.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const removeFile = (index) => {
    setUploadData({
      ...uploadData,
      files: uploadData.files.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Upload Evaluation</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evaluation Title
              </label>
              <input
                type="text"
                name="title"
                required
                value={uploadData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                required
                value={uploadData.subject}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class
              </label>
              <input
                type="text"
                name="class"
                required
                value={uploadData.class}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              value={uploadData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Files
            </label>
            <UploadBox onUpload={handleFileUpload} />
            
            {uploadData.files.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
                {uploadData.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-600">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || uploadData.files.length === 0}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload Evaluation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UploadEvaluationPage
