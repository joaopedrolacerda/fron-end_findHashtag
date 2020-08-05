import React, { useState, FormEvent, useEffect } from "react";
import { FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import logoImg from "../../assets/logo.svg";

import { Title, Form, Tweets, Error } from "./styles";

import api from "../../services/api";

interface tweet {
  full_name: string;
  description: string;
  user: {
    profile_image_url: string;
    name: string;
    screen_name: string;
  };
  text: string;
}

const Dashboard: React.FC = () => {
  const [hashtag, sethashtag] = useState("");
  const [inputError, setInputError] = useState("");
  const [tweets, settweets] = useState<tweet[]>(() => {
    const storagetweets = localStorage.getItem("@GithubExplorer:tweets");

    if (storagetweets) {
      return JSON.parse(storagetweets);
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem("@GithubExplorer:tweets", JSON.stringify(tweets));
  }, [tweets]);

  async function handleFindTweet(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    if (!hashtag) {
      setInputError("Digite o autor/nome do repositório");
      return;
    }
    if (hashtag.substring(0, 1) !== "#") {
      setInputError("A busca tem que começar ocm uma hashtag");
      return;
    }
    try {
      const response = await api.post("tweets/", { hashtag });

      console.log(response.data.statuses);

      const tweets = response.data.statuses;

      settweets(tweets);
      sethashtag("");
      setInputError("");
    } catch (err) {
      setInputError("Erro na busca por hashtag");
    }
  }
  return (
    <>
      <img src={logoImg} alt="Github Explorer" />
      <Title>Busque as hashtags do seu interesse</Title>

      <Form hasError={!!inputError} onSubmit={handleFindTweet}>
        <input
          value={hashtag}
          onChange={(e) => sethashtag(e.target.value)}
          placeholder="Digite uma hashtag do seu interesse"
        />
        <button type="submit">Pesquisar </button>
      </Form>

      {inputError && <Error>{inputError}</Error>}
      <Tweets>
        {tweets.map((tweet) => (
          <a key={tweet.full_name}>
            <img src={tweet.user.profile_image_url} alt={tweet.user.name} />
            <div>
              <strong>{tweet.user.name}</strong>
              <p>{`@${tweet.user.screen_name}`}</p>
            </div>
            <p>{tweet.text}</p>
          </a>
        ))}
      </Tweets>
    </>
  );
};
export default Dashboard;
