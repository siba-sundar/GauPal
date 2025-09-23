import { useState } from 'react'
import axios from 'axios'

export default function CowBreedIdentifier() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const breedMap = {
    0: "Alambadi", 1: "Amritmahal", 2: "Ayrshire", 3: "Banni",
    4: "Bargur", 5: "Bhadawari", 6: "Brown_Swiss", 7: "Dangi",
    8: "Deoni", 9: "Gir", 10: "Guernsey", 11: "Hallikar",
    12: "Hariana", 13: "Holstein_Friesian", 14: "Jaffrabadi",
    15: "Jersey", 16: "Kangayam", 17: "Kankrej", 18: "Kasargod",
    19: "Kenkatha", 20: "Kherigarh", 21: "Khillari", 22: "Krishna_Valley",
    23: "Malnad_gidda", 24: "Mehsana", 25: "Murrah", 26: "Nagori",
    27: "Nagpuri", 28: "Nili_Ravi", 29: "Nimari", 30: "Ongole",
    31: "Pulikulam", 32: "Rathi", 33: "Red_Dane", 34: "Red_Sindhi",
    35: "Sahiwal", 36: "Surti", 37: "Tharparkar", 38: "Toda",
    39: "Umblachery", 40: "Vechur"
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setError(null)
    setResults(null)

    if (!selectedFile) {
      setFile(null)
      setPreview(null)
      return
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg']
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase()
    const validExtensions = ['jpg', 'jpeg', 'png']

    if (!validTypes.includes(selectedFile.type) || !validExtensions.includes(fileExtension)) {
      setError('Please select a valid image file (JPG, JPEG, or PNG)')
      setFile(null)
      setPreview(null)
      e.target.value = ''
      return
    }

    const maxSize = 5 * 1024 * 1024
    if (selectedFile.size > maxSize) {
      setError('Image size should be less than 5MB')
      setFile(null)
      setPreview(null)
      e.target.value = ''
      return
    }

    setFile(selectedFile)

    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result)
    reader.readAsDataURL(selectedFile)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Please select an image first')
      return
    }

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const apiUrl = 'https://suggests-documentation-peak-speeds.trycloudflare.com/predict/'

      const response = await axios.post(apiUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const data = response.data

      if (data.predictions) {
        const processedResults = data.predictions
          .map(item => ({
            breed: breedMap[item.class_id] || 'Unknown breed',
            confidence: (item.confidence * 100).toFixed(2),
            class_id: item.class_id
          }))
          .sort((a, b) => b.confidence - a.confidence)

        setResults(processedResults)
      }
    } catch (err) {
      setError(`Failed to identify breed: ${err.response?.data?.message || err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const getBadgeColor = (confidence) => {
    const conf = parseFloat(confidence)
    if (conf >= 70) return 'bg-green-600'
    if (conf >= 40) return 'bg-green-500'
    return 'bg-green-400'
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">Cow Breed Identifier</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="border-2 border-dashed border-green-300 rounded-lg p-6 flex flex-col items-center justify-center bg-green-50">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="mb-4">
                <label className="block text-green-700 font-medium mb-2">Upload Cow Image</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".jpg, .jpeg, .png"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
              </div>

              <button
                type="submit"
                disabled={!file || loading}
                className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Identifying...' : 'Identify Breed'}
              </button>
            </form>
          </div>

          {preview && (
            <div className="mt-4">
              <h2 className="text-lg font-medium text-green-700 mb-2">Image Preview</h2>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow">
                <img src={preview} alt="Preview" className="w-full h-auto object-contain max-h-64" />
              </div>
            </div>
          )}
        </div>

        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <h2 className="text-xl font-medium text-green-700 mb-4">Identification Results</h2>

          {loading && (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>
          )}

          {results && results.length > 0 && (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-md border border-green-100">
                <p className="text-green-800 font-medium">Top prediction:</p>
                <h3 className="text-2xl font-bold text-green-700">{results[0].breed}</h3>
                <div className={`mt-2 inline-block px-2 py-1 rounded-md text-white text-sm ${getBadgeColor(results[0].confidence)}`}>
                  {results[0].confidence}% confidence
                </div>
              </div>

              {results.length > 1 && (
                <div>
                  <h3 className="text-md font-medium text-green-700 mb-2">Other possibilities:</h3>
                  <ul className="space-y-2">
                    {results.slice(1).map((result, index) => (
                      <li key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-100">
                        <span className="font-medium">{result.breed}</span>
                        <span className="text-sm text-gray-600">{result.confidence}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {results.some(r => r.breed === 'Unknown breed') && (
                <div className="text-sm text-gray-600 mt-2">Some breeds could not be identified from our database.</div>
              )}
            </div>
          )}

          {!loading && !error && !results && (
            <div className="text-center py-12 text-gray-500">
              <p>Upload an image and click "Identify Breed" to see results</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-500 text-center">
        This tool identifies cow breeds from 41 different categories with varying levels of confidence
      </div>
    </div>
  )
}