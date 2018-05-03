import React, { Component } from 'react';
import { Chip, Avatar, Autocomplete } from 'react-md';
import axios from '../../utils/axios';
import { connect } from 'react-redux'

import { STREAMS_ACTIONS } from '../../redux/streams/actions';

class LocationAutocomplete extends Component {
  constructor(props){
    super(props);

    this.state = {
      data:[]
    };
  }

  onChangeHandler(value,event){
    //Get places from google api
    const APIKey = "AIzaSyBv4e2Uj5ZFp82G8QXKfYv7Ea3YutD4eTg";

    const autocompleteService = new window.google.maps.places.AutocompleteService();
    if(value){
      autocompleteService.getPlacePredictions({ input: value }, function(predictions, status){
        this.setState({data:predictions});
      }.bind(this));
    }
    else{
      this.setState({data:[]});
    }
  }

  onAutocompleteHandler(suggestion,suggestionIndex,matches){
    const selection = this.state.data[suggestionIndex];

    //Now get coordinates and move map over there
    const geocoderService = new window.google.maps.Geocoder();
    geocoderService.geocode({'address':selection.description},function(results,status){
      if(status === "OK"){
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();

        this.props.updateMap({
          distance: 0,
          lat: lat,
          lng: lng
        });
      }
    }.bind(this));
  }

  render(){
    return(
      <Autocomplete
        id="location"
        label=""
        placeholder=""
        data={this.state.data}
        dataLabel={"description"}
        filter={Autocomplete.caseInsensitiveFilter}
        onChange={this.onChangeHandler.bind(this)}
        onAutocomplete={this.onAutocompleteHandler.bind(this)}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateMap: (map) => dispatch(STREAMS_ACTIONS.updateMap(map))
  }
}

export default connect(null, mapDispatchToProps)(LocationAutocomplete);