const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    const likes = blogs.reduce((accumulator, current) => accumulator + current.likes, 0);

    return likes;
}

const favoriteBlog = (blogs) => {
    const withMostLikes = blogs.reduce((accumulator, current) => {
        if(current.likes > accumulator.likes) {
            return current;
        } 
        return accumulator;
    }, blogs[0])

    return withMostLikes;
}

const mapUniqueAuthorsWithProp = (blogs, prop, propValue) => {
    return blogs
        .map(blog => blog.author)
        .filter((author, index, array) => array.indexOf(author) === index)
        .map(author => ({ author:author, [prop]: propValue }))
}

const mostBlogs = (blogs) => {
    const uniqueAuthors = mapUniqueAuthorsWithProp(blogs, "blogs", 0);
    
    uniqueAuthors.forEach(author => {
        blogs.forEach(blog => {
            if(blog.author === author.author) {
                author.blogs++;
            }
        })
    })

    const authorWithMostBlogs = uniqueAuthors.reduce((accumulator, current) => {
        if(current.blogs > accumulator.blogs) {
            return current;
        }
        return accumulator;
    }, uniqueAuthors[0])

    return authorWithMostBlogs;
}

const mostLikes = (blogs) => {
    const uniqueAuthors = mapUniqueAuthorsWithProp(blogs, "likes", 0);
    
    uniqueAuthors.forEach(author => {
        blogs.forEach(blog => {
            if(blog.author === author.author) {
                author.likes+= blog.likes;
            }
        })
    })

    const authorWithMostLikes = uniqueAuthors.reduce((accumulator, current) => {
        if(current.likes > accumulator.likes) {
            return current;
        }
        return accumulator;
    }, uniqueAuthors[0])

    return authorWithMostLikes;
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}