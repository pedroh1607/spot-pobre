const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(cors());

let token = null;
let tokenExpires = 0;

// 🔐 Função para pegar o token de acesso
async function getAccessToken() {
  if (token && Date.now() < tokenExpires) return token;

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");

  const response = await axios.post("https://accounts.spotify.com/api/token", params, {
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  token = response.data.access_token;
  tokenExpires = Date.now() + response.data.expires_in * 1000;
  return token;
}

// 🎯 Endpoint de busca
app.get("/search", async (req, res) => {
  const query = req.query.q;

  if (!query) return res.status(400).send({ error: "Missing query." });

  try {
    const accessToken = await getAccessToken();

    const spotifyRes = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        q: query,
        type: "track,artist",
        limit: 10,
      },
    });

    res.send(spotifyRes.data);
  } catch (err) {
    res.status(500).send({ error: "Spotify API error", details: err.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
