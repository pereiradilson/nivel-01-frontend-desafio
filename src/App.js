import React, { useState, useEffect } from "react";
import { FiThumbsUp, FiTrash2, FiFilePlus } from 'react-icons/fi';

import api from './services/api';

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    });
  }, []);

  async function handleAddRepository() {
    const response = await api.post('repositories', {
      title: `Desafio ReactJS - ${Date.now()}`, 
	    url: "https://github.com/pereiradilson?tab=repositories", 
	    techs: ["Node.js", "React.js", "React Native"]
    });

    const repository = response.data;

    setRepositories([...repositories, repository]);
  }

  async function handleLikeRepository(id) {
    const response = await api.post(`repositories/${id}/like`);

    if (response.status === 200) {
      const repositoryIndex = repositories.findIndex(repository => repository.id === id);

      const listRepositories = [...repositories];

      listRepositories[repositoryIndex].likes = response.data.likes;

      setRepositories(listRepositories);
    }
  }

  async function handleRemoveRepository(id) { 
    const repositoryIndex = repositories.findIndex(repository => repository.id === id);
    
    if (repositoryIndex >= 0) {
      repositories.splice(repositoryIndex, 1);

      setRepositories([...repositories]);

      await api.delete(`repositories/${id}`);
    }
  }

  return (
    <>
      <div className="board">
        <div className="boardTitle">
          <p>Lista de Repositórios</p>
          <button onClick={handleAddRepository}>Adicionar</button>
        </div>
        <div className="cards" data-testid="repository-list">
        {repositories.map(repository => (
          <div className="card" key={repository.id}>
            <div className="title">
              <p>{repository.title}</p>
              <div>
                <FiThumbsUp />
                <p>{repository.likes}</p>
              </div>
            </div>
            <p className="link">
              <span>GitHub: </span> 
              <a href={repository.url} target="_blank">{repository.url}</a>
            </p>
            <div className="techs">
              {repository.techs.map(tech => <div key={tech}>{tech}</div>)}
            </div>
            <div className="buttons">
              <button className="buttonLike" onClick={() => handleLikeRepository(repository.id)}>Gostei</button>
              <button className="buttonTrash" onClick={() => handleRemoveRepository(repository.id)}>Remover</button>
            </div>
          </div>
        ))}
        </div>
      </div>
    </>
    /*
    <div>
      <ul data-testid="repository-list">
        {repositories.map(repository => (
          <li key={repository.id}>
            {repository.title}
            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>
          </li>
        ))}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
    */
  );
}

export default App;
