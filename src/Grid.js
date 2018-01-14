import _ from 'lodash';
import React, { Component } from 'react';
import Cell from './Cell';

class Grid extends Component {

    static defaultProps = {
        cellWidth: 10,
        cellHeight: 10
    }

    constructor(props) {
        super(props);

        this._cells = {};
    }

    render() {
        const n = this.props.matrix.length;
        const { cellWidth, cellHeight } = this.props;

        return (
            <div>
                <div className="Grid" style={{
                    width: ((n * cellWidth) + n) + 'px',
                    height: ((n * cellHeight) + n) + 'px',
                }}>
                {
                    _.map(this.props.matrix, (row, x) => _.map(row, (state, y) =>
                        <Cell
                            ref={ cell => { this._cells[this._buildCellKey(cell.getCoordinates())] = cell; } }
                            key={ this._buildCellKey({ x, y }) }
                            width={cellWidth}
                            height={cellHeight}
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