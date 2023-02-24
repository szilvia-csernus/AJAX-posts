const postList = document.querySelector('.posts');
const postTemplate = document.getElementById('post-template');
const form = document.querySelector('#new-post form');
const fetchButton = document.querySelector('#available-posts button');


const fetchPosts = async () => {
	try {
		const response = await axios.get(
			'https://jsonplaceholder.typicode.com/posts'
		);
		const listOfPosts = response.data;
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

	axios.post('https://jsonplaceholder.typicode.com/posts', post);
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
		axios.delete(
			`https://jsonplaceholder.typicode.com/posts/${postId}`
		);
	}
});
