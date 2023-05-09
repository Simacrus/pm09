import { useState } from 'react';

function App() {
  const [admin, setAdmin] = useState({
    login: '',
    pass: '',
  });

  const [user, setUser] = useState({
    login: '',
    pass: '',
  });

  const [post, setPost] = useState({
    title: '',
    text: '',
  });

  const [allPosts, setAllPosts] = useState([]);

  const [newPost, setNewPost] = useState({
    title: '',
    text: '',
  });

  const handleAdmin = (event) => {
    const { name, value } = event.target;
    setAdmin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUser = (event) => {
    const { name, value } = event.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePost = (event) => {
    const { name, value } = event.target;
    setPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewPost = (event) => {
    const { name, value } = event.target;
    setNewPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const login = async () => {
    const requset = await fetch('http://localhost:10001/login', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(admin),
    });
    const response = await requset.json();
    const token = localStorage.getItem('admin_token');
    if (token === null) {
      localStorage.setItem('admin_token', response.token);
    } else {
      localStorage.setItem('user_token', response.token);
    }
  };

  const registryUser = async () => {
    const admin_token = localStorage.getItem('admin_token');
    await fetch(`http://localhost:10001/regin?token=${admin_token}`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
  };

  const getAllPosts = async () => {
    const admin_token = localStorage.getItem('admin_token');
    const request = await fetch(
      `http://localhost:10001/posts?token=${admin_token}`
    );
    const response = await request.json();
    setAllPosts(response.list);
  };

  const sendPost = async () => {
    setAllPosts((prev) => [...prev, post]);
    const admin_token = localStorage.getItem('admin_token');
    await fetch(`http://localhost:10001/msg?token=${admin_token}`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    });
  };

  const updatePost = async (id) => {
    setAllPosts(
      allPosts.map((post) =>
        post.post_id === id
        ? { ...post, title: newPost.title, text: newPost.text }
        : post
    )
  );
  const admin_token = localStorage.getItem('admin_token');
    await fetch(`http://localhost:10001/tabel/${id}?token=${admin_token}`, {
      method: 'PUT',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    });
  };

  const deletePost = async (id) => {
    const admin_token = localStorage.getItem('admin_token');
    await fetch(`http://localhost:10001/tabel/${id}?token=${admin_token}`, {
      method: 'DELETE',
    });
    setAllPosts(allPosts.filter((post) => post.post_id !== id));
  };

  return (
    <div className='App'>
      <div>
        <label htmlFor='login'>Логин</label>
        <input
          type='text'
          name='login'
          value={admin.login}
          onChange={handleAdmin}
        />
        <label htmlFor='pass'>Пароль</label>
        <input
          type='password'
          name='pass'
          value={admin.pass}
          onChange={handleAdmin}
        />
        <button onClick={login}>Войти</button>
        <button onClick={() => localStorage.clear()}>Выход</button>
      </div>

      <div>
        <label htmlFor='login'>Логин пользователя</label>
        <input
          type='text'
          name='login'
          value={user.login}
          onChange={handleUser}
        />
        <label htmlFor='pass'>Пароль пользователя</label>
        <input
          type='password'
          name='pass'
          value={user.pass}
          onChange={handleUser}
        />
        <button onClick={registryUser}>Зарегестрировать</button>
      </div>

      <div>
        <label htmlFor='title'>сообщение</label>
        <input
          type='text'
          name='title'
          value={post.title}
          onChange={handlePost}
        />
        <button onClick={sendPost}>Отправить сообщение</button>
      </div>
      <button onClick={getAllPosts}>Получить сообщение</button>

      {allPosts.length === 0
        ? null
        :allPosts.map((post) => (
          <div key={post.post_id}>
            <span>Id сообщения: {post.post_id}</span>
            <h1>{post.title}</h1>
            <p>{post.text}</p>
            <input
              type='text'
              name='title'
              placeholder='сообщение'
              value={newPost.title}
              onChange={handleNewPost}
            />
            <button onClick={() => updatePost(post.post_id)}>Редактировать сообщение</button>
            <button onClick={() => deletePost(post.post_id)}>Удалить сообщение</button>
          </div>
        ))}
    </div>
  );
}

export default App;