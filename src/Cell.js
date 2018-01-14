import React, { Component } from 'react';
import { CELL_WIDTH, CELL_HEIGHT } from './constants';

class Cell extends Component {

    static defaultProps = {
        coords: {
            x: 0,
            y: 0
        }
    }

    constructor(props) {
        super(props);

        this.state = { alive: false };
    }

    render() {
        return(
            <div
                onClick={this._selectionHandler}
                className={`Cell ${this.isAlive() ? 'Alive' : ''}`}
                style={{
                    width: CELL_WIDTH + 'px',
                    height: CELL_HEIGHT + 'px'
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
