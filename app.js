const postList = document.querySelector('.posts');
const postTemplate = document.getElementById('post-template');
const form = document.querySelector('#new-post form');
const fetchButton = document.querySelector('#available-posts button');

const sendHttpRequest = (method, url, data) => {
	// fetch itself is a promise so we have to return it so that we can chain
	// more promises behind it.
	return fetch(url, {
		method,
		body: JSON.stringify(data),
		headers: {
			'Conent-Type': 'application/json', // for this project this may be omitted
		},
	}).then((response) => {
        if (response.status >= 200 && response.status < 300) {
            return response.json()
        } else {
            return response.json().then(errData => {
                console.log(errData);
                throw new Error('Something went wrong - server side.');
            })
        }
    }
    );
};

const fetchPosts = async () => {
	try {
		const responseData = await sendHttpRequest(
			'GET',
			'https://jsonplaceholder.typicode.com/posts'
		);
		// const listOfPosts = JSON.parse(xhr.response);
		const listOfPosts = responseData;
		postList.innerHTML = '';
		for (const post of listOfPosts) {
			// true makes a deep clone
			const postEl = document.importNode(postTemplate.content, true);
			postEl.querySelector('h2').textContent = post.title;
			postEl.querySelector('p').textContent = post.body;
			postEl.querySelector('li').id = post.id;
			postList.append(postEl);
		}
	} catch (error) {
		alert(error.message);
	}
};

const createPost = async (title, content) => {
	const userId = Math.random();
	const post = {
		title: title,
		body: content,
		userId,
	};

	sendHttpRequest('POST', 'https://jsonplaceholder.typicode.com/posts', post);
};

fetchButton.addEventListener('click', fetchPosts);
form.addEventListener('submit', (event) => {
	event.preventDefault();
	const enteredTitle = event.currentTarget.querySelector('#title').value;
	const enteredContent = event.currentTarget.querySelector('#content').value;

	createPost(enteredTitle, enteredContent);
});

postList.addEventListener('click', (event) => {
	// from the list, we have to find out which post, precisely which post's button was clicked.
	if (event.target.tagName === 'BUTTON') {
		const postId = event.target.closest('li').id;
		sendHttpRequest(
			'DELETE',
			`https://jsonplaceholder.typicode.com/posts/${postId}`
		);
	}
});
