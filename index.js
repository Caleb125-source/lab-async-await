// Write your code here!
// Display posts in the DOM
function displayPosts(posts) {
    // Select the ul element
    const postList = document.getElementById('post-list');
    // Clear any existing content
    postList.innerHTML = '';
    // Loop through posts creating list items
    posts.forEach(post => {
        // Create list item for one post
        const listItem = document.createElement('li');
        // Create post title
        const h1 = document.createElement('h1');
        h1.textContent = post.title;
        // Create post body
        const p = document.createElement('p');
        p.textContent = post.body;
        // Append title and body to list item
        listItem.appendChild(h1);
        listItem.appendChild(p);
        // Append list item to ul
        postList.appendChild(listItem);
    });
} 
// Fetch posts using async/await
async function fetchPostsWithAsync() {
    try {
        // Fetch posts from the API
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        // Parse the JSON response
        const posts = await response.json();
        // Display the posts in the DOM
        displayPosts(posts);
    } catch (error) {
        // Log any errors that occur during the fetch
        console.error('Error fetching posts:', error);
    }
}
// Call the function to fetch and display posts
fetchPostsWithAsync();

