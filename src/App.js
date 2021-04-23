import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import { Star, StarFill, Stars } from 'react-bootstrap-icons';


//Here is all we need to get access to spotify's API
export const authEndpoint = 'https://accounts.spotify.com/authorize';
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
    this.state = {
      token: null,
      isOnFavoritesPage: false
    };
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
        searchValue: "",
        albums_duration: []
      });
      this.getUser(`Bearer ${_token}`);
    };

    //Bind functions to use them after.
    this.handleSearch = this.handleSearch.bind(this);
    this.handleAddFavorites = this.handleAddFavorites.bind(this);
    this.handleRemoveFavorites = this.handleRemoveFavorites.bind(this);
    // this.getAnAlbum = this.getTotalDuration.bind(this);
    // this.getDurationOfAlbum = this.getDurationOfAlbum.bind(this);
    // this.getTotalDuration = this.getTotalDuration.bind(this);


  }

  getUser(token) {
    // Make a call using the token to get the name and profile picture of the user.
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

  getAnAlbum(id) {

  }

  //Function that'll be called everytime you hit enter while searching through albums.
  handleSearch(event) {
    if (event.target.value !== undefined && event.target.value !== "") {
      if (event.key === 'Enter') {
        this.setState({ searchValue: event.target.value });
        fetch(`https://api.spotify.com/v1/search?q=${event.target.value}&limit=20&type=album`, {
          type: "GET",
          headers: { "Authorization": this.state.access_token }
        }).then((res) => res.json())
          .then(data => {
            this.setState({
              isOnFavoritesPage: false,
              albums: data.albums.items
            });
          });
      }
    }

  }

  // getDurationOfAlbum(id) {
  //   console.log(this.state.albums_duration);
  //   console.log("longueur du tableau:", this.state.albums_duration.length);
  //   for (var i = 0; i < this.state.albums_duration.length; i++) {
  //     // console.log(this.state.albums_duration[i].id);
  //     if (this.state.albums_duration[i].id === id) {
  //       // console.log("we found a match with id : "+id);
  //       // console.log("the duration of this album is : "+this.state.albums_duration[i]);
  //       return this.state.albums_duration[i].duration;
  //     }
  //   }
  // 
  // }

  //Function to get an Album to return his duration by looping through all tracks duration.
  // getTotalDuration(id) {
  //   fetch(`https://api.spotify.com/v1/albums/${id}`, {
  //     type: "GET",
  //     headers: { "Authorization": this.state.access_token }
  //   }).then((res) => res.json())
  //     .then(data => {
  //       this.setState({ albumDurations: [] });
  //       var totalDuration = 0;
  //       const items = data.tracks["items"];
  //       //Ne fonctionnait pas avec un foreach 
  //       for (var i = 0; i < items.length; i++) {
  //         totalDuration = totalDuration + items[i].duration_ms;
  //       }
  //       console.log("total duration : " + totalDuration);
  //       var albumDurations = this.state.albumDurations;
  //       albumDurations.push({ id: id, duration: totalDuration });
  //       this.setState({ albums_duration: albumDurations });
  //     });
  // }

  //Function that'll be called when you click on the star icon. This will add the album to your favorites
  handleAddFavorites(album) {
    var favorites = this.state.favorites;
    favorites.push(album);
    this.setState({
      favorites: favorites
    });
    console.log(favorites);
  }

  //Function that'll be called when you click on the star icon. This will remove the album to your favorites
  handleRemoveFavorites(album) {
    var favorites = this.state.favorites;
    const index = favorites.indexOf(album);
    // for (var i = 0; favorites.length; i++) {
    //   if (favorites[i].id == id) {

    //   }
    if (index > -1) {
      favorites.splice(index, 1);
    }
    this.setState({
      favorites: favorites
    });
    console.log(favorites);
  }

  changeSelectedAlbum(id) {
    const album = this.getAnAlbum(id);
    // album.push({isSelected:!isSelected});
  }


  render() {
    //a map of the albums var in the state that allow to see image, name, duration and release date.
    //You also have a star to add or remove an album from your favorites.
    var albums = this.state.albums && (this.state.albums.map((album) =>
      <div id={album.id} className="card" >
        <img className="card-img-top" src={album.images[0].url} alt="Card image cap" />
        <div className="card-body">
          <h5 className="card-title">{album.name}</h5>
          {/* <p>Duration:{this.getDurationOfAlbum(album.id)}</p> */}
          <p>{album.release_date}</p>
          {/* Here we are checking if the album is in favorites or not to show a different icon 
          if the album is in favorites, this will remove it by clicking on the icon
          If the album is not in your favorites, this will remove it by clicking on the icon */}
          {this.state.favorites.includes(album) ?
            <a onClick={() => { this.handleRemoveFavorites(album) }}><StarFill></StarFill></a>
            :
            <a onClick={() => { this.handleAddFavorites(album) }}><Star></Star></a>
          }
        </div>
      </div >

    ));
    var favorites = this.state.albums && (this.state.favorites.map((album) =>

      <div id={album.id} className="card" >
        <img className="card-img-top" src={album.images[0].url} alt="Card image cap" />
        <div className="card-body">
          <h5 className="card-title">{album.name}</h5>
          {/* <p>Duration:{this.getDurationOfAlbum(album.id)}</p> */}
          <p>{album.release_date}</p>
          {/* Here we are checking if the album is in favorites or not to show a different icon 
        if the album is in favorites, this will remove it by clicking on the icon
        If the album is not in your favorites, this will remove it by clicking on the icon */}
          {this.state.favorites.includes(album) ?
            <a onClick={() => { this.handleRemoveFavorites(album) }}><StarFill></StarFill></a>
            :
            <a onClick={() => { this.handleAddFavorites(album) }}><Star></Star></a>
          }
        </div>
      </div >

    ));
    return (
      <div className="App">
        <div className="header">
          {/* If the user is not connected we can't use Spotify's API so we have to log in to get a token */}
          {this.state.token === null ?
            <a className="btn btn-success" href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}>

              Login to Spotify
            </a>
            // Else we remove the login button
            : null
          }
          {/* If the user is not loaded, we show a spinner (loading indicator) */}
          {this.state.isLoadedMe === false ?
            <div className="spinner-border text-success">
            </div> :
            // Else we show an avatar and the name of the user.
            this.state.me && (
              <div className="container">
                <div className="row">

                  <div className="col-4" style={{ textAlign: "left" }}>

                    <img alt="Image placeholder" className="avatar" src={this.state.me.image} />
                    <a style={{ padding: "10px 10px 10px 10px" }}> {this.state.me.name}</a>
                  </div>
                  <div className="col-6" >
                    <div className="d-flex flex-row-reverse">
                      {/* Here is the search bar, a search will be fired when we hit enter */}
                      <div className="input-group rounded">
                        <input style={{ margin: "10px" }} value={this.state.value} onKeyDown={this.handleSearch} type="search" className="form-control rounded" placeholder="Search" aria-label="Search"
                          aria-describedby="search-addon" />
                      </div>

                    </div>
                  </div>
                  <div className="col-2" >
                    <div className="d-flex flex-row-reverse">

                      <a onClick={() => {
                        this.setState({
                          isOnFavoritesPage: true
                        });
                      }}><Stars style={{ margin: "10px", cursor: "pointer", width: "30px", height: "30px" }} /></a>
                    </div>
                  </div>
                </div>
              </div>
            )

          }
        </div>
        <div className="content">
          <div className="container">
            <div className="col-1">
            </div>
            <div className="col-10">

              <div className="row">

                {/* Here is the content of the page */}
                {this.state.isOnFavoritesPage === true ?
                  <div >
                    <h1>Favorites</h1>

                    {this.state.favorites != null ?
                      <div className="row">
                        {favorites}
                      </div>
                      : null}
                  </div>
                  :
                  albums}
              </div>
            </div>


          </div>
        </div>
        <div className="col-1"></div>
      </div>
    );
  }
}
export default App;