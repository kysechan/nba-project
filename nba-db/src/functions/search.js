function SearchPlayer(event) {
  fetch("http://164.90.149.249:8080/api/player/basic?player=" + this.state.value)
    .then((response) => response.json())
    .then((response) => {
      console.log(response)
      this.json = response
      return JSON.stringify(response)
    })
    .catch((error) => {
      console.error("Error: ", error)
      return ("Could not find player: " + this.state.value)
    })
  event.preventDefault()
}

// Get request API player endpoint
function SearchTeam(event) {
  fetch("http://164.90.149.249:8080/api/teams/basic?team=" + this.state.value)
    .then((response) => response.json())
    .then((response) => {
      console.log(response)
      return JSON.stringify(response)
    })
    .catch((error) => {
      console.error("Error: ", error)
      return "Could not find team: " + this.state.value
    })
  event.preventDefault()
}


export {
  SearchPlayer,
  SearchTeam,
}