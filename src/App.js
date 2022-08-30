import React, { useState, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import Photo from './Photo'
const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
// const clientID = `?client_id=ilSoBVS3zg7IgYZT05qv-MRJdeHN0H4msZBJqyfYb9o`;
const mainUrl = `https://api.unsplash.com/photos/`
const searchUrl = `https://api.unsplash.com/search/photos/`

function App() {
const [loading, setLoading] = useState(false)
const [photos, setPhotos] = useState([])
const [page, setPage] = useState(0)
const [query, setQuery] = useState('')

const fetchImages = async ()=>{
  setLoading(true)
  let url 
  const urlPage = `&page=${page}`
  const urlQuery = `&query=${query}`

  if(query) {
    url = `${searchUrl}${clientID}${urlPage}${urlQuery}`
  } else{
  url = `${mainUrl}${clientID}${urlPage}`
  }
  try {
    const response = await fetch(url)
    const data = await response.json()
    setPhotos((oldPhotos)=>{
      if (query && page === 1){
        return data.results
      }
      else if(query){
        return [...oldPhotos, ...data.results]
      }else {
        return [...oldPhotos, ...data]
      } 
    })
    setLoading(false)
   }
   catch (error) {
    setLoading(false)
    console.log(error);
  }
}
const handleSubmit = (e)=>{
  e.preventDefault()
  setPage(1)
  // fetchImages()
}

useEffect(()=>{
  fetchImages()
  // eslint-disable-next-line
}, [page])

useEffect(()=>{
  const event = window.addEventListener('scroll', ()=>{
   if(!loading && window.innerHeight + window.scrollY >= document.body.scrollHeight - 2){
    setPage((oldPage)=>{
      return oldPage + 1
    })
   }
  }) 
  // eslint-disable-next-line
  return ()=> window.removeEventListener('scroll', event)
}, [])

  return (
  <main>
    <section className="search">
      <form className="search-form">
        <input type="text" className="form-input" placeholder='search' value={query} onChange={(e)=> setQuery(e.target.value)}/>
        <button type='submit' className='submit-btn' onClick={handleSubmit}>
          <FaSearch/>
        </button>
      </form>
    </section>
    <section className='photos'>
      <div className="photos-center">
    {photos.map((image, index)=>{
      return <Photo key={image.id} {...image}/>
    })}
    </div>
    {loading && <h2 className='loading'>loading...</h2>}
    </section>
  </main>
  )
}

export default App

//note thaat we're setting body height because we want to fetch the images once we get to the end of our body height
//if i get a 403 error it means that i have run out of requests. For this API, I have 50 requests
//I added -2 becaue i want to fetch the images 2 pixels before we ger to the end of our body scroll height
//the reason wjy we have !loading is because i dont want to send out too many requests at once. i want to wait for the previous one to come back and loading to be set to false before i fetch again 