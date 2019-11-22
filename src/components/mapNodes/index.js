import React, { Component } from "react"
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Markers,
  Marker,
} from "react-simple-maps"
import worldData from './world-50m.json'


class BasicMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ready: false,
      markers: []
    }
  }

  componentDidMount() {
    this.setState({
      ready: true
    })
  }

  componentWillReceiveProps(props) {
    if(!this.state.ready) return;
    let markers = []
    for(let i=0; i<props.data.length; i++) {
      markers.push({
        coordinates: [props.data[i].ll[1], props.data[i].ll[0]]
      })
    }
    this.setState({
      markers
    })
  }
  render() {
    const {markers} = this.state
    return (
      <div>
        <ComposableMap
          projectionConfig={{
            scale: 75,
            rotation: [-11,0,0],
          }}
          width={400}
          height={200}
          style={{
            width: "100%",
            height: "auto",
          }}
          >
          <ZoomableGroup center={[0,30]} disablePanning>
            <Geographies geography={worldData}>
              {(geographies, projection) => geographies.map((geography, i) => geography.id !== "ATA" && (
                <Geography
                  key={i}
                  geography={geography}
                  projection={projection}
                  style={{
                    default: {
                      fill: "#ECEFF1",
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    hover: {
                      fill: "#607D8B",
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    pressed: {
                      fill: "#FF5722",
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                  }}
                />
              ))}

            </Geographies>
            <Markers>
            {markers.map((marker, i) => (
              <Marker
                key={i}
                marker={marker}
                style={{
                  default: { fill: "#145388" },
                  hover: { fill: "#FFFFFF" },
                  pressed: { fill: "#FFFFFF" },
                }}
                >
                <circle
                  cx={0}
                  cy={0}
                  r={3}
                  style={{
                    stroke: "#145388",
                    strokeWidth: 6,
                    opacity: 0.9,
                  }}
                />
                <text
                  textAnchor="middle"
                  y={marker.markerOffset}
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    fill: "#607D8B",
                  }}
                  >
                  {marker.name}
                </text>
              </Marker>
            ))}
            </Markers>

          </ZoomableGroup>
        </ComposableMap>
      </div>
    )
  }
}

export default BasicMap
