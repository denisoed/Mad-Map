import React, { Component } from 'react'
import { Map, Marker } from 'react-mad-map'

const lng2tile = (lon, zoom) => (lon + 180) / 360 * Math.pow(2, zoom)
const lat2tile = (lat, zoom) => (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)

export default class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      center: [40.682004, 74.692748],
      zoom: 7,
      metaWheelZoom: false,
      twoFingerDrag: false,
      animate: true,
      animating: false,
      zoomSnap: true,
      mouseEvents: true,
      touchEvents: true,
      minZoom: 1,
      maxZoom: 18,
      // dragAnchor: [48.8565, 2.3475] for drag element
    }
  }

  handleBoundsChange = ({ center, zoom, bounds, initial }) => {
    if (initial) {
      console.log('Got initial bounds: ', bounds)
    }
    this.setState({ center, zoom })
  }

  handleClick = ({ event, latLng, pixel }) => {
    console.log('Map clicked!', latLng, pixel)
  }

  handleMarkerClick = ({ event, payload, anchor }) => {
    console.log(`Marker #${payload} clicked at: `, anchor)
  }

  handleAnimationStart = () => {
    this.setState({ animating: true })
  }

  handleAnimationStop = () => {
    this.setState({ animating: false })
  }

  zoomIn = () => {
    if (this.state.zoom < this.state.maxZoom) {
      this.setState({
        zoom: Math.min(this.state.zoom + 1, 18)
      })
    } else {
      this.setState({
        zoom: this.state.maxZoom
      })
    }
  }

  zoomOut = () => {
    if (this.state.zoom > this.state.minZoom && this.state.zoom < this.state.maxZoom) {
      this.setState({
        zoom: Math.min(this.state.zoom - 1, 18)
      })
    } else {
      this.setState({
        zoom: this.state.minZoom
      })
    }
  }

  zoomInMin = () => {
    var value = this.state.minZoom;
    value++;
    if (value >= 1 && value <= 18 && value <= this.state.maxZoom) {
      this.setState({ minZoom: value })
    }
  }

  zoomOutMin = () => {
    var value = this.state.minZoom;
    value--;
    if (value >= 1 && value <= 18 && value <= this.state.maxZoom) {
      this.setState({ minZoom: value })
    }
  }

  zoomInMax = () => {
    var value = this.state.maxZoom;
    value++;
    if (value >= 1 && value <= 18 && value >= this.state.minZoom) {
      this.setState({ maxZoom: value })
    }
  }

  zoomOutMax = () => {
    var value = this.state.maxZoom;
    value--;
    if (value >= 1 && value <= 18 && value >= this.state.minZoom) {
      this.setState({ maxZoom: value })
    }
  }

  render () {
    const { center, zoom, animate, metaWheelZoom, twoFingerDrag, zoomSnap, mouseEvents, touchEvents, animating, minZoom, maxZoom } = this.state

    const markers = {
      Bishkek: [[42.883004, 74.582748], zoom],
      Issyk_Kul: [[42.499998, 77.499998], zoom],
      Naryn: [[41.42866, 75.99111], zoom],
      Batken: [[40.06259, 70.81939], zoom],
      Osh: [[40.52828, 72.7985], zoom],
      Talas: [[42.52277, 72.24274], zoom]
    }

    return (
      <div style={{textAlign: 'center', height: '100vh'}}>
        <Map
          limitBounds='edge'
          center={center}
          zoom={zoom}
          // provider={(x, y, z) => {
          //   const s = String.fromCharCode(97 + (x + y + z) % 3)
          //   return `https://maps.basemaps.cartocdn.com/light_all/${z}/${x}/${y}.png` // List providers https://leaflet-extras.github.io/leaflet-providers/preview
          // }}
          // backgroundColor={'#fff'}
          dprs={[1, 2]}
          onBoundsChanged={this.handleBoundsChange}
          onClick={this.handleClick}
          onAnimationStart={this.handleAnimationStart}
          onAnimationStop={this.handleAnimationStop}
          animate={animate}
          metaWheelZoom={metaWheelZoom}
          twoFingerDrag={twoFingerDrag}
          zoomSnap={zoomSnap}
          mouseEvents={mouseEvents}
          touchEvents={touchEvents}
          minZoom={minZoom}
          maxZoom={maxZoom}
          boxClassname="mad-map">
          {Object.keys(markers).map(key => (
            <Marker key={key} anchor={markers[key][0]} payload={key} onClick={this.handleMarkerClick} />
          ))}
        </Map>
        <div className="zoom">
          <button onClick={this.zoomIn} className="button-zoom">Zoom In</button>
          <button onClick={this.zoomOut} className="button-zoom">Zoom Out</button>
        </div>
        <div className="info">
          <span>
            [y] - {Math.round(center[0] * 10000) / 10000} ({lat2tile(center[0], zoom)})
          </span>
          <span>
            &nbsp;[x] - {Math.round(center[1] * 10000) / 10000} ({lng2tile(center[1], zoom)})
          </span>
          <span>
            &nbsp;(zoom - {Math.round(zoom * 100) / 100})
          </span>
          <span>
            &nbsp;(animate - {animating ? 'animating' : 'stopped'})
          </span>
        </div>
        <section className={'controls'}>
          <div style={{marginTop: 20}}>
            {Object.keys(markers).map(key => (
              <button key={key} onClick={() => this.setState({ center: markers[key][0], zoom: markers[key][1] })} className="button-pin">{key}</button>
            ))}
          </div>
          <div className="wrap-zoomMinMax" style={{marginTop: 20}}>
            <div className="zoomMinMax">
              <h6>Min zoom</h6>
              <span className="input-number-decrement" onClick={() => this.zoomOutMin()}>–</span>
              <input onChange = {
                  (e) => this.setState({
                    minZoom: parseInt(e.target.value) || 1
                  })
                }
                className="input-number"
                type="text"
                value={minZoom}
                min="0"
                max="10"
              />
              <span className="input-number-increment" onClick={() => this.zoomInMin()}>+</span>
            </div>
            
            <div className="zoomMinMax">
              <h6>Max zoom</h6>
              <span className="input-number-decrement" onClick={() => this.zoomOutMax()}>–</span>
              <input
                className="input-number"
                type="text"
                value={maxZoom}
                min="0"
                max="10"
              />
              <span className="input-number-increment" onClick={() => this.zoomInMax()}>+</span>
            </div>
          </div>
          <div style={{marginTop: 20}}>
            <button onClick={() => this.setState({ animate: !animate })} className={[animate ? 'active' : '', 'button-funcs'].join(' ')}>animation</button>
            <button onClick={() => this.setState({ twoFingerDrag: !twoFingerDrag })} className={[twoFingerDrag ? 'active' : '', 'button-funcs'].join(' ')}>two finger drag</button>
            <button onClick={() => this.setState({ metaWheelZoom: !metaWheelZoom })} className={[metaWheelZoom ? 'active' : '', 'button-funcs'].join(' ')}>meta wheel zoom</button>
            <button onClick={() => this.setState({ zoomSnap: !zoomSnap })} className={[zoomSnap ? 'active' : '', 'button-funcs'].join(' ')}>zoom snap</button>
            <button onClick={() => this.setState({ mouseEvents: !mouseEvents })} className={[mouseEvents ? 'active' : '', 'button-funcs'].join(' ')}>mouse events</button>
            <button onClick={() => this.setState({ touchEvents: !touchEvents })} className={[touchEvents ? 'active' : '', 'button-funcs'].join(' ')}>touch events</button>
          </div>
        </section>
      </div>
    )
  }
}
