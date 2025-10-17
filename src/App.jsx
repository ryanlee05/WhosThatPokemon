import { useState} from 'react'
import './App.css'

function App() {
  const [pokemon, setPokemon] = useState (null);

  const [pokemonType, setPokemonType] = useState(null);

  const [pokemonMove, setPokemonMove] = useState(null);

  const [pokemonWeight, setPokemonWeight] = useState(null);

  const [allBanned, setAllBanned] = useState(true);

  const [banList, setBanList] = useState([]);

  const [emojiState, setEmojiState] = useState(0);

  const emoji = [
    "🥱", "😍", "😈", "🫣", "💪", "🔥"
  ]

  const getPokemon = async () => {
    try {

      let bannedFound = true;
      const MAX_TRIES = 1000;
      let tries = 0;

      while (bannedFound && tries < MAX_TRIES) {
        tries += 1;
          //calculate the pokemon getting grabbed
        const randomId = Math.floor((Math.random() * 1025) + 1);
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        const data = await response.json();

        //grab the type(s) of the pokemon
        let types = "";
        for(let i = 0; i < data.types.length; i++) {
          types += data.types[i].type.name;
          if(i + 1 < data.types.length) {
            types += "/";
          }
        }

        let move = data.moves[data.moves.length -1].move.name;
        let weight = data.weight;

        if(!banList.includes(types) && !banList.includes(move) && !banList.includes(weight)) {
          setPokemonType(types);
          //set pokemon move
          setPokemonMove(move);
          setPokemon(data);
          setPokemonWeight(weight);
          setAllBanned(true);
          setEmojiState(Math.floor(Math.random() * 6));
          bannedFound = false;
        }
      }
      if(bannedFound) {
        throw new Error("not possible");
      }
    } 
    catch {
      // if not able to run, then setPokemon to null, change what is displayed
      setPokemon(null);
      setAllBanned(false);
    }
  }

  const handleBan = (prop) => {
    if(!banList.includes(prop)) {
      setBanList([...banList, prop]);
    }
  }

  const handleUnban = (prop) => {
    setBanList(banList.filter((a) => a !== prop));
  }

  return (
    <>
      <div className = "large-container">
        <div className = "container">
          <div className = "header">
            <h1>Who's That Pokemon?</h1>
            <h3>Discover any Pokemon from the game!</h3>
            {pokemon && (<h1 id = "poke_name">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) + " " + emoji[emojiState]}</h1>)}
            {pokemon && (<img src = {pokemon.sprites.front_default}></img>)}

            <div className = "attributes">
              {pokemon && (<h2 className = "attribute" onClick = {() => handleBan(pokemonType)}>{pokemonType} {pokemon.types.length > 1 ? "types" : "type"}</h2>)}
              {pokemon && (<h2 className = "attribute" onClick = {() => handleBan(pokemonMove)}>{pokemonMove} attack</h2>)}
              {pokemon && (<h2 className = "attribute" onClick = {() => handleBan(pokemonWeight)}>{pokemonWeight} lbs</h2>)}
              {!allBanned && (<h1>No pokemon without banned attributes!</h1>)}
            </div>

            <button onClick = {getPokemon} >New Pokemon</button>
          </div>
        </div>

        <div className = "banList">
          <div className = "header">
            <h1>Ban List</h1>
            <h3>Click an attribute to ban from viewing!</h3>
            {banList.map((ban) => (
              <h2 onClick = {() => handleUnban(ban)} className = "attribute">{ban}</h2>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
