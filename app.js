const listElement = document.querySelector('.posts');
const postTemplate = document.getElementById('new-post');

const sendHttpRequest = (method, url, data) => {
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open(method, url);

        xhr.responseType = 'json';

        xhr.onload = () => {
            resolve(xhr.response)
        };

        xhr.send(JSON.stringify(data));
    })
	return promise
}

const fetchPosts = async () => {
	const responseData = await sendHttpRequest(
		'GET',
		'https://jsonplaceholder.typicode.com/posts'
	);
	// const listOfPosts = JSON.parse(xhr.response);
	const listOfPosts = responseData;
	for (const post of listOfPosts) {
		// true makes a deep clone
		const postEl = document.importNode(postTemplate.content, true);
		postEl.querySelector('h2').textContent = post.title.toUpperCase();
		postEl.querySelector('p').textContent = post.body;
		listElement.append(postEl);
	}
}

const createPost = async (title, content) => {
    const userId = Math.random();
    const post = {
        title: title,
        body: content,
        userId
    }

    sendHttpRequest('POST', 'https://jsonplaceholder.typicode.com/posts', post);
}

fetchPosts();
createPost('DUMMY', 'A dummy post!');
