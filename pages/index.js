import React, { useState, useEffect } from "react";
import Head from "next/head";
import styled from "@emotion/styled";
import { keyframes, css, Global } from "@emotion/core";
import { Pokedex } from "pokeapi-js-wrapper";
import { titleCase } from "change-case";

const browserDex = new Pokedex({
  protocol: "https",
  cache: true,
  timeout: 5 * 1000
});

const basicStyles = css`
  background-color: white;
  color: cornflowerblue;
  border: 1px solid lightgreen;
  border-right: none;
  border-bottom: none;
  box-shadow: 5px 5px 0 0 lightgreen, 10px 10px 0 0 lightyellow;
  transition: all 0.1s linear;
  margin: 3rem 0;
  padding: 1rem 0.5rem;
`;

const Header = styled.h1`
  font-size: 80px;
  font-family: cursive;
  color: #fcd02f;
  text-align: center;
  text-shadow: 2px 2px 0px #b3962e;
`;

const Container = styled.div`
  margin: 5%;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.01);
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
`;
const PokemonBox = styled.div`
  border-radius: 10px;
  height: 200px;
  background: ${({ colors }) =>
    colors.length === 1 ? colors[0] : `linear-gradient(${colors.join(", ")})`};
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;
const Button = styled.button``;
async function getPokemon(dex, offset = 0, limit = 11) {
  const list = await dex.getPokemonsList({
    limit,
    offset
  });
  const pokemon = await Promise.all(
    list.results.map(r => dex.getPokemonByName(r.name))
  );
  return pokemon;
}

const colors = {
  normal: "#DCDCDC",
  fighting: "#F0E68C",
  flying: "#B0E0E6",
  poison: "#C71585",
  ground: "#CD853F",
  rock: "#A9A9A9",
  bug: "#9ACD32",
  ghost: "#FFF0F5",
  steel: "#708090",
  fire: "#B22222",
  water: "#1E90FF",
  grass: "#7CFC00",
  electric: "#FFFF00",
  psychic: "#9370DB",
  ice: "#00BFFF",
  dragon: "#FF4500",
  dark: "#2F4F4F",
  fairy: "#DDA0DD"
};

const Pokemon = ({ order, name, sprites, types }) => {
  const pokeColors = types.map(t => colors[t.type.name]);
  return (
    <PokemonBox colors={pokeColors}>
      <img src={sprites.front_default} />
      {titleCase(name)}
    </PokemonBox>
  );
};
const Index = ({ pokemon }) => {
  const [morePokemon, setMorePokemon] = useState([]);
  const [offset, setOffset] = useState(1);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (offset <= 1) return;
    setLoading(true);
    getPokemon(browserDex, offset, 12).then(res => {
      setMorePokemon(morePokemon.concat(res));
      setLoading(false);
    });
  }, [offset]);
  return (
    <React.Fragment>
      <Global
        styles={css`
          html {
            padding: 3rem 1rem;
            margin: 0;
            background: linear-gradient(
              to bottom,
              rgba(255, 255, 255, 1) 0%,
              rgba(224, 55, 31, 1) 100%
            );
            min-height: 100%;
            font-family: Helvetica, Arial, sans-serif;
            font-size: 24px;
          }
        `}
      />
      <Head>
        <title>Next PokéDex</title>
      </Head>
      <Container>
        <Header>PokéDex</Header>
        <Grid>
          {pokemon.concat(morePokemon).map(p => (
            <Pokemon key={`pokemon-id-${p.id}`} {...p} />
          ))}
        </Grid>
        {loading ? (
          "Loading..."
        ) : (
          <Button onClick={() => setOffset(offset + 11)}>Load More</Button>
        )}
      </Container>
    </React.Fragment>
  );
};

Index.getInitialProps = async props => {
  // Use eval to keep it from being bundled by Webpack
  const NodePokedex = eval("require('pokedex-promise-v2')");
  const nodeDex = new NodePokedex();

  const pokemon = await getPokemon(nodeDex);

  return { pokemon };
};
export default Index;
