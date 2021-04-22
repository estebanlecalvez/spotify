import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'reactstrap';
import "./App.css";
import { Star, StarFill } from 'react-bootstrap-icons';



export const authEndpoint = 'https://accounts.spotify.com/authorize';
// Replace with your app's client ID, redirect URI and desired scopes
const clientId = "3e27eb94a5ef4ac08a3272955aac5503";
const redirectUri = "http://localhost:3000";
const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
];
// Get the hash of the url
const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function (initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});
window.location.hash = "";
class App extends Component {

  constructor(props) {
    super(props);
    this.state = { token: null };
  }
  componentDidMount() {
    // Set token
    let _token = hash.access_token;
    if (_token) {
      // Set token
      this.setState({
        token: _token,
        isConnected: false,
        isLoadedMe: false,
        albums: [],
        favorites: [],
        access_token: `Bearer ${_token}`,
        me: {
          name: "",
          profile_picture: ""
        },
        searchValue: ""
      });
      this.getUser(`Bearer ${_token}`);
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleAddFavorites = this.handleAddFavorites.bind(this);
    this.handleRemoveFavorites = this.handleRemoveFavorites.bind(this);


  }

  getUser(token) {
    // Make a call using the token
    fetch("https://api.spotify.com/v1/me", {
      type: "GET",
      headers: { "Authorization": token }
    }).then((res) => res.json())
      .then(data => {
        this.setState({
          me: {
            name: data.display_name,
            image: data.images[0].url
          },
          isLoadedMe: true,
        });
      });

  }

  handleSearch(event) {
    if (event.key === 'Enter') {
      this.setState({ searchValue: event.target.value });
      fetch(`https://api.spotify.com/v1/search?q=${event.target.value}&limit=20&type=album`, {
        type: "GET",
        headers: { "Authorization": this.state.access_token }
      }).then((res) => res.json())
        .then(data => {
          console.log(data.albums.items);
          this.setState({
            albums: data.albums.items
          });
        });
    }
  }

  handleAddFavorites(id) {
    var favorites = this.state.favorites;
    favorites.push(id);
    this.setState({
      favorites: favorites
    });
    console.log(favorites);
  }

  handleRemoveFavorites(id) {
    var favorites = this.state.favorites;
    const index = favorites.indexOf(id);
    if (index > -1) {
      favorites.splice(index, 1);
    }
    this.setState({
      favorites: favorites
    });
    console.log(favorites);
  }

  render() {
    var albums = this.state.albums && (this.state.albums.map((album) =>
      <div className="card" >
        <img className="card-img-top" src={album.images[0].url} alt="Card image cap" />
        <div className="card-body">
          <h5 className="card-title">{album.name}</h5>
          {this.state.favorites.includes(album.id) ?
            <a onClick={() => { this.handleRemoveFavorites(album.id) }}><StarFill></StarFill></a>
            :
            <a onClick={() => { this.handleAddFavorites(album.id) }}><Star></Star></a>
          }
        </div>
      </div >
    ));
    return (
      <div className="App">
        <div className="header">
          {this.state.token === null ?
            <Button color="success"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}>
              Login to Spotify</Button>
            : null
          }
          {this.state.isLoadedMe === false ?
            <div className="spinner-border text-success">
            </div> :
            this.state.me && (
              <div className="container">
                <div className="row">

                  <div className="col" style={{ textAlign: "left" }}>

                    <img alt="Image placeholder" className="avatar" src={this.state.me.image} />
                    <a style={{ padding: "10px 10px 10px 10px" }}> {this.state.me.name}</a>
                  </div>
                  <div className="col" >
                    <div className="d-flex flex-row-reverse">

                      <div className="input-group rounded">
                        <input value={this.state.value} onKeyDown={this.handleSearch} type="search" className="form-control rounded" style={{ maxWidth: "200px" }} placeholder="Search" aria-label="Search"
                          aria-describedby="search-addon" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )

          }
        </div>
        <div className="content">
          <div className="container">
            <div className="row">
              {albums}

            </div>
          </div>
        </div>
      </div >
    );
  }
}
export default App;