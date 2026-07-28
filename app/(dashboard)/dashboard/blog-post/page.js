'use client'

import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { addBlog } from "@/app/lib/data/actions"
import { supabase } from "@/app/lib/supabase/client"

function Page() {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [seoTitle, setSeoTitle] = useState("")
  const [seoDescription, setSeoDescription] = useState("")
  const [cta, setCta] = useState("")
  const [type, setType] = useState('')
  const [preview, setPreview] = useState(false)
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)

  const blogsType = [
    {
    id: crypto.randomUUID(),
    type: 'Car'
  },
    {
    id: crypto.randomUUID(),
    type: 'Housing'
  },
    {
    id: crypto.randomUUID(),
    type: 'Phone'
  },
    {
    id: crypto.randomUUID(),
    type: 'Gym'
  },
  ,
    {
    id: crypto.randomUUID(),
    type: 'Personal Loan'
  },
]

  useEffect(() => {
    const draft = localStorage.getItem("blogDraft")
    if (draft) {
      const data = JSON.parse(draft)
      setTitle(data.title || "")
      setBody(data.body || "")
      setCta(data.cta || "")
      setSeoTitle(data.seoTitle || "")
      setSeoDescription(data.seoDescription || "")
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("blogDraft", JSON.stringify({
      title, body, seoTitle, seoDescription, cta
    }))
  }, [title, body, seoTitle, seoDescription, cta])

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setUploading(true)

    try {
      let imageUrl = null

      if (image) {
        const fileExt = image.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('blog-pics')
          .upload(fileName, image)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('blog-pics')
          .getPublicUrl(fileName)

        imageUrl = publicUrl
      }
 console.log('imageUrl:', imageUrl)
      await addBlog({
        title,
        body,
        cta,
        type,
        seo_title: seoTitle,
        seo_description: seoDescription,
        image_url: imageUrl
      })

      // clear draft
      localStorage.removeItem("blogDraft")

    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-[90%] mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Create Blog Post</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* TITLE */}
        <div>
          <label className="text-sm">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Your blog title"
            required
            className="w-full h-12 px-4 bg-white rounded-lg mt-2"
          />

          <label className="text-sm">Call To Action</label>
          <input
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            placeholder="Your blog CTA"
            required
            className="w-full h-12 px-4 bg-white rounded-lg mt-2"
          />

          <label className="text-sm">Contract type</label>

<select
  className="w-30 gap-2 border rounded-md p-2"
  value={type}
  onChange={(e) => setType(e.target.value)}
  required

>
  {blogsType.map((item) => (
    <option
  key={item.id} value={item.name}>
      {item.type}
    </option>
  ))}
</select>
        </div>

        {/* IMAGE UPLOAD */}
        <div>
          <label className="text-sm">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="w-[10%]
            bg-(--accent-primary) rounded-2xl
            p-2 m-2 mt-2 text-sm"
          />
          {imagePreview && (
            <div className="mt-3 relative w-fit">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-48 rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => { setImage(null); setImagePreview(null) }}
                className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* BODY */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm">Body (Markdown Supported)</label>
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              
              className="text-sm text-blue-500"
            >
              {preview ? "Edit" : "Preview"}
            </button>
          </div>

          {!preview ? (
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              placeholder="Write your article..."
              className="w-full h-[50vh] p-4 bg-white rounded-lg"
            />
          ) : (
            <div className="bg-white p-6 rounded-lg h-[50vh] overflow-y-auto prose max-w-none">
              <ReactMarkdown>{body}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* SEO */}
        <div className="bg-gray-50 p-4 rounded-lg flex flex-col gap-4">
          <h2 className="font-semibold">SEO Settings</h2>
          <input
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder="SEO Title"
            required
            className="w-full h-10 px-3 rounded-md bg-white"
          />
          <textarea
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            placeholder="SEO Description"
            required
            className="w-full h-20 p-3 rounded-md bg-white"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="bg-(--accent-primary) text-white h-12 rounded-lg hover:bg-(--accent-secondary) disabled:opacity-50"
        >
          {uploading ? "Publishing..." : "Publish Blog"}
        </button>

      </form>
    </div>
  )
}

export default Page