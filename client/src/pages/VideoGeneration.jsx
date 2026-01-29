import React, { useState } from 'react'
import { Video, Sparkles , Image } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const GenerateVideo = () => {

  const videoDurations = [
    { duration: 30, text: 'Short (30s)' },
    { duration: 60, text: 'Medium (1 min)' },
    { duration: 120, text: 'Long (2 min)' },
  ]

  const [selectedDuration, setSelectedDuration] = useState(videoDurations[0])
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [videoUrl, setVideoUrl] = useState(null)

  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { data } = await axios.post(
        '/api/ai/generate-video',
        { prompt, duration: selectedDuration.duration },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      )

      if (data.success) {
        setVideoUrl(data.videoUrl)
        toast.success('Video generated successfully!')
      } else {
        toast.error(data.message || 'Video generation failed.')
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      
      {/* Left Column: Configuration */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Image className='w-6 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Video Generation</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Video Description</p>
        <textarea
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 min-h-[100px]'
          placeholder='Describe the video you want to generate...'
          required
        />

        <p className='mt-4 text-sm font-medium'>Video Duration</p>
        <div className='mt-3 flex gap-3 flex-wrap'>
          {videoDurations.map((item, index) => (
            <span
              onClick={() => setSelectedDuration(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedDuration.text === item.text
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 border-gray-300'
              }`}
              key={index}
            >
              {item.text}
            </span>
          ))}
        </div>

        <button
          disabled={loading}
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 my-6 text-sm rounded-lg cursor-pointer'
        >
          {loading ? (
            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
          ) : (
            <Video className='w-5' />
          )}
          Generate Video
        </button>
      </form>

      {/* Right Column: Output */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]'>
        <div className='flex items-center gap-3'>
          <Video className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Generated Video</h1>
        </div>

        {!videoUrl ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Video className='w-9 h-9' />
              <p>Enter a prompt and click "Generate Video" to get started.</p>
            </div>
          </div>
        ) : (
          <div className='mt-4 flex justify-center items-center flex-1'>
            <video
              src={videoUrl}
              controls
              className='w-full max-h-[400px] rounded-lg border border-gray-300'
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default GenerateVideo
