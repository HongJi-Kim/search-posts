import React, { useEffect, useState } from 'react'
import Header from './home_page/header/header'
import PostList from './home_page/post_list/post_list'
import PostTab from './home_page/post_tab/post_tab'
import SearchHeader from './home_page/search_header/search_header'

function HomePage({ postLoader }) {
  const [isFetch, setIsFetch] = useState(false)
  const [isLoad, setIsLoad] = useState(true)
  const [posts, setPosts] = useState([])
  const [requestPageNumber, setRequestPageNumber] = useState(0)

  const onScroll = () => {
    const scrollHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    )

    const scrollTop = Math.max(
      document.documentElement.scrollTop,
      document.body.scrollTop
    )
    const clientHeight = document.documentElement.clientHeight

    if (scrollTop + clientHeight >= scrollHeight) {
      setIsFetch(true)
    }
  }

  const search = query => {
    if (query === '') {
      setIsLoad(true)
      setRequestPageNumber(0)
      setIsFetch(true)
    } else {
      postLoader
        .search(query) //
        .then(data => setPosts(data))
      setIsLoad(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    postLoader.getNewItems(requestPageNumber).then(data => {
      setPosts(...posts, data)
    })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    setIsFetch(false)
    if (isLoad === true) {
      postLoader.getNewItems(requestPageNumber).then(data => {
        if (data.length === 0) {
          return
        }
        setPosts(posts.concat(data))
        setRequestPageNumber(requestPageNumber + 1)
      })
    }
  }, [isFetch])

  return (
    <div>
      <Header />
      <main>
        <SearchHeader onSearch={search} />
        <article className="my-10">
          <PostTab />
          <PostList posts={posts}></PostList>
        </article>
      </main>
    </div>
  )
}

export default HomePage