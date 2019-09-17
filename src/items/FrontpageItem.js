import React from 'react'


class FrontpageItem extends React.Component {
  render () {
    let posts = this.props.posts

    let postLoop = posts.map((post, index)=> {
      return (
        <article key={index} className='xiong-block'>
          <a href={post.link}>
                  <h3>{post.title.rendered}</h3>
          </a>
        </article>
      )
    })

    return (
      <div>
        {postLoop}
      </div>
    )
  }

}

export default FrontpageItem;
