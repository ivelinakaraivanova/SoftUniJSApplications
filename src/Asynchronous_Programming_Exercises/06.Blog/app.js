async function attachEvents() {

    const btnLoad = document.getElementById('btnLoadPosts');
    const selectPosts = document.getElementById('posts');
    const posts = await getPosts();
    const btnView = document.getElementById('btnViewPost');
    const postTitle = document.getElementById('post-title');
    const ulPostBody = document.getElementById('post-body');
    const ulPostComments = document.getElementById('post-comments');
        
    btnLoad.addEventListener('click', () => {
        Object.values(posts).forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = p.title;
            selectPosts.appendChild(option);
        });
    })

    btnView.addEventListener('click', async () => {

        if (ulPostComments.children.length > 0) {
            ulPostComments.innerHTML = '';
        }
        
        if (!selectPosts.options[selectPosts.selectedIndex]) {
            return;
        }

        const selectedValueId = selectPosts.options[selectPosts.selectedIndex].value;
        const selectedPostComments = await getComments(selectedValueId);
        const selectedPost = Object.values(posts).filter(p => p.id == selectedValueId)[0];
        postTitle.textContent = selectedPost.title;
        ulPostBody.textContent = selectedPost.body;

        selectedPostComments.forEach(c => {
            const liComment = document.createElement('li');
            liComment.id = c.id;
            liComment.textContent = c.text;
            ulPostComments.appendChild(liComment);
        })
    })
}

attachEvents();

async function getPosts() {
    const url = 'http://localhost:3030/jsonstore/blog/posts';

    const response = await fetch(url);
    const posts = await response.json();
    return posts;
}

async function getComments(postId) {
    const url = 'http://localhost:3030/jsonstore/blog/comments/';

    const response = await fetch(url);
    const comments = await response.json();
    const commentsById = Object.values(comments).filter(c => c.postId == postId);
    return commentsById;
}