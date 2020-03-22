import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import { Form, SubmitButton, List } from './styles';
import Container from '../../components/Container';

export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
    error: false,
  };

  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { repositories } = this.state;

    if (repositories !== prevState.repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = (e) => {
    this.setState({ newRepo: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    try {
      this.setState({ loading: true, error: false });

      const { newRepo, repositories } = this.state;

      if (!newRepo) throw new Error('Informe um repositório');

      if (repositories.filter((repo) => repo.name === newRepo).length)
        throw new Error('Já existe um repositório com o mesmo nome');

      const response = await api.get(`/repos/${newRepo}`);
      const data = { name: response.data.full_name };

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
      });
    } catch (ex) {
      this.setState({ error: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleClickRemove = (repoName) => {
    const { repositories } = this.state;
    this.setState({
      repositories: repositories.filter((repo) => repo.name !== repoName),
    });
  };

  render() {
    const { newRepo, loading, repositories, error } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositorios
        </h1>
        <Form onSubmit={this.handleSubmit} error={error}>
          <input
            type="text"
            placeholder="Adicionar repositorio"
            onChange={this.handleInputChange}
            value={newRepo}
          />
          <SubmitButton loading={loading ? 1 : 0}>
            {loading ? (
              <FaSpinner color="#fff" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map((repo) => (
            <li key={repo.name}>
              <span>{repo.name}</span>
              <div>
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    this.handleClickRemove(repo.name);
                  }}
                >
                  Remover
                </a>
                <Link to={`/repository/${encodeURIComponent(repo.name)}`}>
                  Detalhes
                </Link>
              </div>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
