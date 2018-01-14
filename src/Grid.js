import _ from 'lodash';
import React, { Component } from 'react';
import Cell from './Cell';
import { GRID_WIDTH, GRID_HEIGHT, CELL_WIDTH, CELL_HEIGHT } from './constants';

class Grid extends Component {

    constructor(props) {
        super(props);

        this._cells = {};
    }

    render() {
        return (
            <div>
                <div className="Grid" style={{
                    width: ((GRID_WIDTH * CELL_WIDTH) + GRID_WIDTH) + 'px',
                    height: ((GRID_HEIGHT * CELL_HEIGHT) + GRID_HEIGHT) + 'px',
                }}>
                {
                    _.times(GRID_HEIGHT, y => _.times(GRID_WIDTH, x =>
                        <Cell
                            ref={ cell => { this._cells[this._buildCellKey(cell.getCoordinates())] = cell; } }
                            key={ this._buildCellKey({ x, y }) }
                            coords={{ x, y }}
                        />))
                }
                </div>
                <button onClick={this._start}>Start</button>
                <button ref={nextBtn => { this._nextBtn = nextBtn;}} onClick={this._next}>Next</button>
                <button onClick={this._stop}>Stop</button>
                <button onClick={this._clear}>Clear</button>
            </div>
        );
    }

    _start = () => {
        this._nextBtn.click();
        this._delayId = _.delay(this._start, 100);
    }

    _next = () => {
        var promises = _.map(this._cells, cell => new Promise(resolve => {
            this._evaluateCell(cell).then(resolve);
        }));

        Promise.all(promises);
    }

    _stop = () => {
        clearTimeout(this._delayId);
    }

    _clear = () => {
        _.each(this._cells, cell => cell.die());
    }

    _evaluateCell = (cell) => {
        const neighboringCells = this._getNeighboringCells(cell);
        const neighborStates = _.countBy(neighboringCells, c => c.isAlive());

        if (this._isUnderPopulated(cell, neighborStates) || this._isOverPopulated(cell, neighborStates)) {
            return cell.die();
        } else if (this._shouldReproduce(cell, neighborStates)) {
            return cell.live();
        }

        return Promise.resolve();
    }

    _shouldReproduce(cell, neighborStates) {
        return !cell.isAlive() && neighborStates['true'] && neighborStates['true'] === 3;
    }

    _isUnderPopulated(cell, neighborStates) {
        return cell.isAlive() && (!neighborStates['true'] || neighborStates['true'] < 2);
    }

    _isOverPopulated(cell, neighborStates) {
        return cell.isAlive() && neighborStates['true'] && neighborStates['true'] > 3;
    }


    _getNeighboringCells(cell) {
        const neighborKeys = this._getNeighboringCellKeys(cell);

        return _(neighborKeys)
            .map(key => this._cells[key])
            .compact()
            .value();
    }

    _getNeighboringCellKeys(cell) {
        const subjectCellCoords = cell.getCoordinates();
        const subjectCellKey = this._buildCellKey(subjectCellCoords);
        const neighborKeys = [];

        _.each(_.range(subjectCellCoords.x - 1, subjectCellCoords.x + 2), x => {
            _.each(_.range(subjectCellCoords.y - 1, subjectCellCoords.y + 2), y => {
                const neighborKey = this._buildCellKey({ x, y });

                if (neighborKey !== subjectCellKey) {
                    neighborKeys.push(neighborKey);
                }
            });
        });

        return neighborKeys;
    }

    _buildCellKey({ x, y }) {
        return `${x}_${y}`;
    }
}

export default Grid;
