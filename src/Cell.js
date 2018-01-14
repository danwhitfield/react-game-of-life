import React, { Component } from 'react';

const INITIAL_STATE = { alive: false };

class Cell extends Component {

    static defaultProps = {
        width: 10,
        height: 10,
        coords: {
            x: 0,
            y: 0
        }
    }

    constructor(props) {
        super(props);

        this.state = INITIAL_STATE;
    }

    render() {
        return(
            <div
                onClick={this._selectionHandler}
                className={`Cell ${this.isAlive() ? 'Alive' : ''}`}
                style={{
                    width: this.props.width + 'px',
                    height: this.props.height + 'px'
                }}
            ></div>
        );
    }

    getCoordinates() {
        return this.props.coords;
    }

    isAlive() {
        return this.state.alive;
    }

    live() {
        return this._changeAliveState(true);
    }

    die() {
        return this._changeAliveState(false);
    }

    _changeAliveState(alive) {
        if (this.isAlive() !== alive) {
            return new Promise(resolve => this.setState({ alive }, resolve));
        }

        return Promise.resolve();
    }

    _selectionHandler = event => {
        if (this.isAlive()) {
            this.die();
        } else {
            this.live();
        }
    }
}

export default Cell;
