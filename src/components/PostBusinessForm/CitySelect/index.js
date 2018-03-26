import React from "react";

import { fetchCities } from "src/api";

class CitySelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cities: []
    };

    fetchCities(props.state).then(cities => {
      this.setState({
        cities
      });
    });
  }

  onChange(event) {
    const cityId = event.target.value;

    const city = this.state.cities.filter(city => city.id == cityId)[0];

    this.props.onChange(city);
  }

  render() {
    return (
      <select defaultValue={null} onChange={this.onChange.bind(this)}>
        <option value={null}>-- Select city --</option>
        {this.state.cities.map(city => {
          return <option value={city.id}>{city.name}</option>;
        })}
      </select>
    );
  }
}

export default CitySelect;
